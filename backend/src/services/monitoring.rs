use std::time::Instant;

use chrono::Utc;
use serde::de::DeserializeOwned;
use serde_json::json;
use surrealdb::types::RecordId;
use uuid::Uuid;

use crate::models::email::EmailMessage;
use crate::models::monitoring::{
    AlertDestination, AlertInstanceItem, AlertListResponse, MonitoringServiceStatus, MonitoringSettings,
    MonitoringStatusResponse, MonitoringThreshold, MonitoredService, MonitoringIntegration,
    MonitoringIntegrations, SendTestAlertResponse,
};
use crate::services::email::EmailService;

const KEY_INTEGRATIONS: &str = "monitoring.integrations";
const KEY_ENABLED_SERVICES: &str = "monitoring.enabled_services";
const KEY_THRESHOLDS: &str = "monitoring.thresholds";
const KEY_DESTINATIONS: &str = "monitoring.destinations";

pub struct MonitoringService {
    http_client: reqwest::Client,
}

impl MonitoringService {
    pub fn new() -> Self {
        Self {
            http_client: reqwest::Client::new(),
        }
    }

    pub async fn get_settings(&self, db: &crate::db::DbState) -> Result<MonitoringSettings, String> {
        load_settings(db).await
    }

    pub async fn update_settings(
        &self,
        db: &crate::db::DbState,
        settings: MonitoringSettings,
    ) -> Result<MonitoringSettings, String> {
        validate_settings(&settings)?;

        write_setting(db, KEY_INTEGRATIONS, &settings.integrations).await?;
        write_setting(db, KEY_ENABLED_SERVICES, &settings.enabled_services).await?;
        write_setting(db, KEY_THRESHOLDS, &settings.thresholds).await?;
        write_setting(db, KEY_DESTINATIONS, &settings.destinations).await?;

        Ok(settings)
    }

    pub async fn get_status(
        &self,
        db: &crate::db::DbState,
        email_service: &EmailService,
    ) -> Result<MonitoringStatusResponse, String> {
        let settings = load_settings(db).await?;

        let mut statuses = Vec::new();
        for service in settings.enabled_services.iter().filter(|service| service.enabled) {
            let status = self.capture_service_status(service, &settings.integrations).await;
            self.evaluate_and_route_alerts(db, email_service, &settings, &status)
                .await?;
            statuses.push(status);
        }

        let overall_status = if statuses.iter().any(|service| service.health == "down") {
            "down".to_string()
        } else if statuses.iter().any(|service| service.health == "degraded") {
            "degraded".to_string()
        } else {
            "healthy".to_string()
        };

        Ok(MonitoringStatusResponse {
            overall_status,
            services: statuses,
        })
    }

    pub async fn list_alerts(
        &self,
        db: &crate::db::DbState,
        limit: u32,
        offset: u32,
    ) -> Result<AlertListResponse, String> {
        let mut query_result = db
            .query(
                "SELECT * FROM alert_instances ORDER BY fired_at DESC LIMIT $limit START $offset",
            )
            .bind(("limit", limit))
            .bind(("offset", offset))
            .await
            .map_err(|error| format!("Failed to load alerts: {error}"))?;

        let rows: Vec<serde_json::Value> = query_result
            .take(0)
            .map_err(|error| format!("Failed to parse alerts: {error}"))?;

        let data = rows
            .iter()
            .map(map_alert_item)
            .collect::<Vec<AlertInstanceItem>>();

        let mut count_result = db
            .query("SELECT count() as count FROM alert_instances")
            .await
            .map_err(|error| format!("Failed to count alerts: {error}"))?;

        let count_rows: Vec<serde_json::Value> = count_result
            .take(0)
            .map_err(|error| format!("Failed to parse alert count: {error}"))?;

        let total = count_rows
            .first()
            .and_then(|row| row.get("count"))
            .and_then(|value| value.as_u64())
            .unwrap_or(0) as u32;

        Ok(AlertListResponse { data, total })
    }

    pub async fn send_test_alert(
        &self,
        db: &crate::db::DbState,
        email_service: &EmailService,
        message: Option<String>,
    ) -> Result<SendTestAlertResponse, String> {
        let settings = load_settings(db).await?;

        let alert_id = create_alert_instance(
            db,
            "test-alert".to_string(),
            None,
            "dashboard".to_string(),
            "manual".to_string(),
            1.0,
            1.0,
            "info".to_string(),
            "firing".to_string(),
            message.unwrap_or_else(|| "Monitoring test alert from dashboard".to_string()),
            Some(json!({ "source": "dashboard" })),
        )
        .await?
        .unwrap_or_else(|| format!("alert_instances:{}", Uuid::new_v4()));

        let (delivered, failed) = route_alert_to_destinations(
            &self.http_client,
            db,
            email_service,
            &alert_id,
            "info",
            "dashboard",
            "manual",
            1.0,
            1.0,
            settings.destinations.as_slice(),
            "Monitoring test alert from dashboard",
        )
        .await;

        Ok(SendTestAlertResponse {
            alert_id,
            delivered,
            failed,
        })
    }

    async fn capture_service_status(
        &self,
        service: &MonitoredService,
        integrations: &MonitoringIntegrations,
    ) -> MonitoringServiceStatus {
        let started = Instant::now();
        let checked_at = Utc::now().to_rfc3339();

        let request = self
            .http_client
            .get(&service.url)
            .timeout(std::time::Duration::from_secs(5));

        match request.send().await {
            Ok(response) => {
                let status_code = response.status().as_u16();
                let latency_ms = started.elapsed().as_secs_f64() * 1000.0;
                let error_signal = if integrations.errors.enabled && response.status().is_server_error() {
                    Some(1.0)
                } else if integrations.errors.enabled {
                    Some(0.0)
                } else {
                    None
                };

                let health = if integrations.uptime.enabled && !response.status().is_success() {
                    "down"
                } else if integrations.performance.enabled && latency_ms > 2000.0 {
                    "degraded"
                } else {
                    "healthy"
                };

                MonitoringServiceStatus {
                    service_id: service.id.clone(),
                    name: service.name.clone(),
                    url: service.url.clone(),
                    health: health.to_string(),
                    status_code: Some(status_code),
                    latency_ms: if integrations.performance.enabled {
                        Some(latency_ms)
                    } else {
                        None
                    },
                    error_signal,
                    checked_at,
                }
            }
            Err(_) => MonitoringServiceStatus {
                service_id: service.id.clone(),
                name: service.name.clone(),
                url: service.url.clone(),
                health: "down".to_string(),
                status_code: None,
                latency_ms: if integrations.performance.enabled {
                    Some(started.elapsed().as_secs_f64() * 1000.0)
                } else {
                    None
                },
                error_signal: if integrations.errors.enabled {
                    Some(1.0)
                } else {
                    None
                },
                checked_at,
            },
        }
    }

    async fn evaluate_and_route_alerts(
        &self,
        db: &crate::db::DbState,
        email_service: &EmailService,
        settings: &MonitoringSettings,
        status: &MonitoringServiceStatus,
    ) -> Result<(), String> {
        let active_thresholds = settings
            .thresholds
            .iter()
            .filter(|threshold| threshold.enabled && threshold.service_id == status.service_id);

        for threshold in active_thresholds {
            let observed_value = observed_value_for_threshold(status, threshold);
            let should_fire = evaluate_threshold(
                observed_value,
                threshold.operator.as_str(),
                threshold.threshold_value,
            );

            if !should_fire {
                continue;
            }

            let alert_key = make_alert_key(threshold, status);
            let message = format!(
                "{} {} {} {} (observed: {})",
                status.name,
                threshold.signal_type,
                threshold.operator,
                threshold.threshold_value,
                observed_value
            );

            let maybe_alert_id = create_alert_instance(
                db,
                alert_key,
                Some(threshold.id.clone()),
                status.name.clone(),
                threshold.signal_type.clone(),
                observed_value,
                threshold.threshold_value,
                threshold.severity.clone(),
                "firing".to_string(),
                message.clone(),
                Some(json!({
                    "service_id": status.service_id,
                    "status_code": status.status_code,
                    "latency_ms": status.latency_ms,
                    "error_signal": status.error_signal,
                    "checked_at": status.checked_at,
                })),
            )
            .await?;

            if let Some(alert_id) = maybe_alert_id {
                let _ = route_alert_to_destinations(
                    &self.http_client,
                    db,
                    email_service,
                    &alert_id,
                    threshold.severity.as_str(),
                    status.name.as_str(),
                    threshold.signal_type.as_str(),
                    observed_value,
                    threshold.threshold_value,
                    settings.destinations.as_slice(),
                    message.as_str(),
                )
                .await;
            }
        }

        Ok(())
    }
}

pub fn default_monitoring_settings() -> MonitoringSettings {
    let frontend_url = std::env::var("MONITOR_FRONTEND_URL")
        .or_else(|_| std::env::var("PUBLIC_SITE_URL"))
        .unwrap_or_else(|_| "http://localhost:3000".to_string());

    let backend_url = std::env::var("MONITOR_BACKEND_URL")
        .or_else(|_| std::env::var("BACKEND_HEALTH_URL"))
        .unwrap_or_else(|_| "http://localhost:8080/health".to_string());

    let default_alert_email = std::env::var("ALERT_EMAIL")
        .or_else(|_| std::env::var("EMAIL_FROM"))
        .unwrap_or_else(|_| "ops@esperion.agency".to_string());

    MonitoringSettings {
        integrations: MonitoringIntegrations {
            uptime: MonitoringIntegration {
                provider: "uptime-kuma".to_string(),
                enabled: true,
            },
            errors: MonitoringIntegration {
                provider: "sentry".to_string(),
                enabled: true,
            },
            performance: MonitoringIntegration {
                provider: "synthetic-http".to_string(),
                enabled: true,
            },
        },
        enabled_services: vec![
            MonitoredService {
                id: "frontend".to_string(),
                name: "Frontend".to_string(),
                url: frontend_url,
                enabled: true,
            },
            MonitoredService {
                id: "backend".to_string(),
                name: "Backend API".to_string(),
                url: backend_url,
                enabled: true,
            },
        ],
        thresholds: vec![
            MonitoringThreshold {
                id: "uptime-http-status-critical".to_string(),
                service_id: "backend".to_string(),
                signal_type: "uptime".to_string(),
                operator: "ne".to_string(),
                threshold_value: 200.0,
                severity: "critical".to_string(),
                cooldown_minutes: 5,
                enabled: true,
            },
            MonitoringThreshold {
                id: "backend-latency-warning".to_string(),
                service_id: "backend".to_string(),
                signal_type: "latency_ms".to_string(),
                operator: "gt".to_string(),
                threshold_value: 1500.0,
                severity: "warning".to_string(),
                cooldown_minutes: 10,
                enabled: true,
            },
            MonitoringThreshold {
                id: "backend-error-rate-warning".to_string(),
                service_id: "backend".to_string(),
                signal_type: "error_rate".to_string(),
                operator: "gt".to_string(),
                threshold_value: 0.0,
                severity: "warning".to_string(),
                cooldown_minutes: 5,
                enabled: true,
            },
        ],
        destinations: vec![AlertDestination {
            id: "ops-email".to_string(),
            name: "Operations Email".to_string(),
            channel: "email".to_string(),
            target: default_alert_email,
            enabled: true,
        }],
    }
}

async fn load_settings(db: &crate::db::DbState) -> Result<MonitoringSettings, String> {
    let defaults = default_monitoring_settings();

    let integrations = read_setting::<MonitoringIntegrations>(db, KEY_INTEGRATIONS)
        .await?
        .unwrap_or(defaults.integrations);
    let enabled_services = read_setting::<Vec<MonitoredService>>(db, KEY_ENABLED_SERVICES)
        .await?
        .unwrap_or(defaults.enabled_services);
    let thresholds = read_setting::<Vec<MonitoringThreshold>>(db, KEY_THRESHOLDS)
        .await?
        .unwrap_or(defaults.thresholds);
    let destinations = read_setting::<Vec<AlertDestination>>(db, KEY_DESTINATIONS)
        .await?
        .unwrap_or(defaults.destinations);

    Ok(MonitoringSettings {
        integrations,
        enabled_services,
        thresholds,
        destinations,
    })
}

fn validate_settings(settings: &MonitoringSettings) -> Result<(), String> {
    if settings.enabled_services.is_empty() {
        return Err("At least one monitored service is required".to_string());
    }

    for service in &settings.enabled_services {
        if service.id.trim().is_empty() || service.name.trim().is_empty() || service.url.trim().is_empty() {
            return Err("Monitored service must include id, name, and url".to_string());
        }
    }

    for threshold in &settings.thresholds {
        if threshold.id.trim().is_empty() || threshold.service_id.trim().is_empty() {
            return Err("Threshold must include id and service_id".to_string());
        }

        if !matches!(
            threshold.signal_type.as_str(),
            "uptime" | "error_rate" | "latency_ms"
        ) {
            return Err(format!(
                "Unsupported threshold signal_type: {}",
                threshold.signal_type
            ));
        }

        if !matches!(
            threshold.operator.as_str(),
            "gt" | "gte" | "lt" | "lte" | "eq" | "ne"
        ) {
            return Err(format!("Unsupported threshold operator: {}", threshold.operator));
        }

        if !matches!(threshold.severity.as_str(), "info" | "warning" | "critical") {
            return Err(format!("Unsupported threshold severity: {}", threshold.severity));
        }
    }

    for destination in &settings.destinations {
        if destination.id.trim().is_empty() || destination.target.trim().is_empty() {
            return Err("Alert destination must include id and target".to_string());
        }

        match destination.channel.as_str() {
            "email" => {
                if !destination.target.contains('@') {
                    return Err(format!(
                        "Email destination target is invalid: {}",
                        destination.target
                    ));
                }
            }
            "webhook" => {
                if !destination.target.starts_with("http://")
                    && !destination.target.starts_with("https://")
                {
                    return Err(format!(
                        "Webhook destination target must be http(s): {}",
                        destination.target
                    ));
                }
            }
            other => {
                return Err(format!("Unsupported destination channel: {other}"));
            }
        }
    }

    Ok(())
}

fn map_alert_item(row: &serde_json::Value) -> AlertInstanceItem {
    AlertInstanceItem {
        id: row
            .get("id")
            .and_then(|value| value.as_str())
            .unwrap_or_default()
            .to_string(),
        alert_key: row
            .get("alert_key")
            .and_then(|value| value.as_str())
            .unwrap_or_default()
            .to_string(),
        rule_id: row
            .get("rule_id")
            .and_then(|value| value.as_str())
            .map(|value| value.to_string()),
        service: row
            .get("service")
            .and_then(|value| value.as_str())
            .unwrap_or_default()
            .to_string(),
        signal_type: row
            .get("signal_type")
            .and_then(|value| value.as_str())
            .unwrap_or_default()
            .to_string(),
        observed_value: row
            .get("observed_value")
            .and_then(|value| value.as_f64())
            .unwrap_or(0.0),
        threshold_value: row
            .get("threshold_value")
            .and_then(|value| value.as_f64())
            .unwrap_or(0.0),
        severity: row
            .get("severity")
            .and_then(|value| value.as_str())
            .unwrap_or("info")
            .to_string(),
        state: row
            .get("state")
            .and_then(|value| value.as_str())
            .unwrap_or("pending")
            .to_string(),
        message: row
            .get("message")
            .and_then(|value| value.as_str())
            .unwrap_or_default()
            .to_string(),
        fired_at: row
            .get("fired_at")
            .and_then(|value| value.as_str())
            .map(|value| value.to_string()),
        resolved_at: row
            .get("resolved_at")
            .and_then(|value| value.as_str())
            .map(|value| value.to_string()),
    }
}

async fn read_setting<T>(db: &crate::db::DbState, key: &str) -> Result<Option<T>, String>
where
    T: DeserializeOwned,
{
    let mut result = db
        .query("SELECT value FROM site_settings WHERE key = $key LIMIT 1")
        .bind(("key", key.to_owned()))
        .await
        .map_err(|error| format!("Failed to read setting {key}: {error}"))?;

    let row: Option<serde_json::Value> = result
        .take(0)
        .map_err(|error| format!("Failed to parse setting {key}: {error}"))?;

    let Some(row_value) = row else {
        return Ok(None);
    };

    let Some(setting_value) = row_value.get("value") else {
        return Ok(None);
    };

    serde_json::from_value(setting_value.clone())
        .map(Some)
        .map_err(|error| format!("Failed to decode setting {key}: {error}"))
}

async fn write_setting<T>(db: &crate::db::DbState, key: &str, value: &T) -> Result<(), String>
where
    T: serde::Serialize,
{
    let json_value = serde_json::to_value(value)
        .map_err(|error| format!("Failed to serialize setting {key}: {error}"))?;

    db.query("DELETE site_settings WHERE key = $key")
        .bind(("key", key.to_owned()))
        .await
        .map_err(|error| format!("Failed to replace setting {key}: {error}"))?;

    db.query(
        "CREATE site_settings CONTENT { key: $key, value: $value, type: 'json', updated_at: time::now() }",
    )
    .bind(("key", key.to_owned()))
    .bind(("value", json_value))
    .await
    .map_err(|error| format!("Failed to write setting {key}: {error}"))?;

    Ok(())
}

fn observed_value_for_threshold(
    status: &MonitoringServiceStatus,
    threshold: &MonitoringThreshold,
) -> f64 {
    match threshold.signal_type.as_str() {
        "uptime" => status.status_code.map(f64::from).unwrap_or(0.0),
        "error_rate" => status.error_signal.unwrap_or(0.0),
        "latency_ms" => status.latency_ms.unwrap_or(0.0),
        _ => 0.0,
    }
}

fn evaluate_threshold(observed: f64, operator: &str, threshold: f64) -> bool {
    match operator {
        "gt" => observed > threshold,
        "gte" => observed >= threshold,
        "lt" => observed < threshold,
        "lte" => observed <= threshold,
        "eq" => (observed - threshold).abs() < f64::EPSILON,
        "ne" => (observed - threshold).abs() >= f64::EPSILON,
        _ => false,
    }
}

fn make_alert_key(threshold: &MonitoringThreshold, status: &MonitoringServiceStatus) -> String {
    let window_seconds = i64::from(threshold.cooldown_minutes.max(1)) * 60;
    let bucket = Utc::now().timestamp() / window_seconds;
    format!("{}:{}:{}", threshold.id, status.service_id, bucket)
}

async fn create_alert_instance(
    db: &crate::db::DbState,
    alert_key: String,
    rule_id: Option<String>,
    service: String,
    signal_type: String,
    observed_value: f64,
    threshold_value: f64,
    severity: String,
    state: String,
    message: String,
    metadata: Option<serde_json::Value>,
) -> Result<Option<String>, String> {
    let content = json!({
        "alert_key": alert_key,
        "rule_id": rule_id,
        "service": service,
        "signal_type": signal_type,
        "observed_value": observed_value,
        "threshold_value": threshold_value,
        "severity": severity,
        "state": state,
        "message": message,
        "fired_at": Utc::now().to_rfc3339(),
        "metadata": metadata,
    });

    let create_result = db
        .query("CREATE alert_instances CONTENT $content")
        .bind(("content", content))
        .await;

    match create_result {
        Ok(mut query_result) => {
            let created: Option<serde_json::Value> = query_result
                .take(0)
                .map_err(|error| format!("Failed to parse alert instance: {error}"))?;

            Ok(created
                .as_ref()
                .and_then(|value| value.get("id"))
                .and_then(|value| value.as_str())
                .map(|value| value.to_string()))
        }
        Err(error) => {
            let error_text = error.to_string().to_lowercase();
            if error_text.contains("duplicate")
                || error_text.contains("already")
                || error_text.contains("index")
            {
                return Ok(None);
            }

            Err(format!("Failed to create alert instance: {error}"))
        }
    }
}

#[allow(clippy::too_many_arguments)]
async fn route_alert_to_destinations(
    http_client: &reqwest::Client,
    db: &crate::db::DbState,
    email_service: &EmailService,
    alert_id: &str,
    severity: &str,
    service: &str,
    signal_type: &str,
    observed_value: f64,
    threshold_value: f64,
    destinations: &[AlertDestination],
    message: &str,
) -> (u32, u32) {
    let mut delivered = 0_u32;
    let mut failed = 0_u32;

    for destination in destinations.iter().filter(|destination| destination.enabled) {
        let outcome = deliver_to_destination(
            http_client,
            email_service,
            alert_id,
            severity,
            service,
            signal_type,
            observed_value,
            threshold_value,
            message,
            destination,
        )
        .await;

        let (status, error_message) = match outcome {
            Ok(()) => {
                delivered += 1;
                ("delivered".to_string(), None)
            }
            Err(error) => {
                failed += 1;
                ("failed".to_string(), Some(error))
            }
        };

        let _ = record_delivery_attempt(
            db,
            alert_id,
            destination.channel.as_str(),
            destination.target.as_str(),
            1,
            status.as_str(),
            error_message,
        )
        .await;
    }

    (delivered, failed)
}

#[allow(clippy::too_many_arguments)]
async fn deliver_to_destination(
    http_client: &reqwest::Client,
    email_service: &EmailService,
    alert_id: &str,
    severity: &str,
    service: &str,
    signal_type: &str,
    observed_value: f64,
    threshold_value: f64,
    message: &str,
    destination: &AlertDestination,
) -> Result<(), String> {
    match destination.channel.as_str() {
        "email" => {
            let subject = format!("[Monitoring:{severity}] {service} {signal_type}");
            let body = format!(
                "{message}\n\nAlert ID: {alert_id}\nService: {service}\nSignal: {signal_type}\nObserved: {observed_value}\nThreshold: {threshold_value}\nSeverity: {severity}\n",
            );
            let email = EmailMessage::new(destination.target.clone(), subject, body);
            email_service
                .send(email)
                .await
                .map_err(|error| format!("Email delivery failed: {error}"))
        }
        "webhook" => {
            let payload = json!({
                "alert_id": alert_id,
                "severity": severity,
                "service": service,
                "signal_type": signal_type,
                "observed_value": observed_value,
                "threshold_value": threshold_value,
                "message": message,
                "sent_at": Utc::now().to_rfc3339(),
            });

            let response = http_client
                .post(destination.target.as_str())
                .timeout(std::time::Duration::from_secs(5))
                .json(&payload)
                .send()
                .await
                .map_err(|error| format!("Webhook delivery failed: {error}"))?;

            if response.status().is_success() {
                Ok(())
            } else {
                Err(format!(
                    "Webhook delivery failed with status {}",
                    response.status()
                ))
            }
        }
        other => Err(format!("Unsupported destination channel: {other}")),
    }
}

async fn record_delivery_attempt(
    db: &crate::db::DbState,
    alert_id: &str,
    channel: &str,
    destination: &str,
    attempt_count: u32,
    delivery_status: &str,
    last_error: Option<String>,
) -> Result<(), String> {
    let instance_id = record_thing("alert_instances", alert_id);

    db.query(
        "CREATE alert_deliveries SET instance_id = $instance_id, channel = $channel, destination = $destination, attempt_count = $attempt_count, delivery_status = $delivery_status, last_error = $last_error, updated_at = time::now()",
    )
    .bind(("instance_id", instance_id.to_owned()))
    .bind(("channel", channel.to_owned()))
    .bind(("destination", destination.to_owned()))
    .bind(("attempt_count", attempt_count))
    .bind(("delivery_status", delivery_status.to_owned()))
    .bind(("last_error", last_error))
    .await
    .map_err(|error| format!("Failed to write delivery attempt: {error}"))?;

    Ok(())
}

fn record_thing(table: &str, record_id: &str) -> RecordId {
    let id_segment = record_id
        .split_once(':')
        .and_then(|(prefix, id)| if prefix == table { Some(id) } else { None })
        .unwrap_or(record_id);
    RecordId::new(table.to_owned(), id_segment.to_owned())
}

#[cfg(test)]
mod tests {
    use super::{evaluate_threshold, make_alert_key};
    use crate::models::monitoring::{MonitoringServiceStatus, MonitoringThreshold};

    #[test]
    fn evaluate_threshold_operators_work() {
        assert!(evaluate_threshold(10.0, "gt", 5.0));
        assert!(evaluate_threshold(10.0, "gte", 10.0));
        assert!(evaluate_threshold(4.0, "lt", 5.0));
        assert!(evaluate_threshold(4.0, "lte", 4.0));
        assert!(evaluate_threshold(7.0, "eq", 7.0));
        assert!(evaluate_threshold(7.0, "ne", 8.0));
        assert!(!evaluate_threshold(7.0, "unknown", 8.0));
    }

    #[test]
    fn alert_key_uses_threshold_service_and_window() {
        let threshold = MonitoringThreshold {
            id: "latency-warning".to_string(),
            service_id: "backend".to_string(),
            signal_type: "latency_ms".to_string(),
            operator: "gt".to_string(),
            threshold_value: 1200.0,
            severity: "warning".to_string(),
            cooldown_minutes: 10,
            enabled: true,
        };

        let status = MonitoringServiceStatus {
            service_id: "backend".to_string(),
            name: "Backend API".to_string(),
            url: "http://localhost:8080/health".to_string(),
            health: "healthy".to_string(),
            status_code: Some(200),
            latency_ms: Some(500.0),
            error_signal: Some(0.0),
            checked_at: "2026-03-09T10:00:00Z".to_string(),
        };

        let key = make_alert_key(&threshold, &status);
        assert!(key.starts_with("latency-warning:backend:"));
    }
}
