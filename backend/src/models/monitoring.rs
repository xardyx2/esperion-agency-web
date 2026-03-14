use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringIntegration {
    pub provider: String,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringIntegrations {
    pub uptime: MonitoringIntegration,
    pub errors: MonitoringIntegration,
    pub performance: MonitoringIntegration,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoredService {
    pub id: String,
    pub name: String,
    pub url: String,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringThreshold {
    pub id: String,
    pub service_id: String,
    pub signal_type: String,
    pub operator: String,
    pub threshold_value: f64,
    pub severity: String,
    pub cooldown_minutes: u32,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertDestination {
    pub id: String,
    pub name: String,
    pub channel: String,
    pub target: String,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringSettings {
    pub integrations: MonitoringIntegrations,
    pub enabled_services: Vec<MonitoredService>,
    pub thresholds: Vec<MonitoringThreshold>,
    pub destinations: Vec<AlertDestination>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringServiceStatus {
    pub service_id: String,
    pub name: String,
    pub url: String,
    pub health: String,
    pub status_code: Option<u16>,
    pub latency_ms: Option<f64>,
    pub error_signal: Option<f64>,
    pub checked_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MonitoringStatusResponse {
    pub overall_status: String,
    pub services: Vec<MonitoringServiceStatus>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertInstanceItem {
    pub id: String,
    pub alert_key: String,
    pub rule_id: Option<String>,
    pub service: String,
    pub signal_type: String,
    pub observed_value: f64,
    pub threshold_value: f64,
    pub severity: String,
    pub state: String,
    pub message: String,
    pub fired_at: Option<String>,
    pub resolved_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertListResponse {
    pub data: Vec<AlertInstanceItem>,
    pub total: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct SendTestAlertRequest {
    pub message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct SendTestAlertResponse {
    pub alert_id: String,
    pub delivered: u32,
    pub failed: u32,
}
