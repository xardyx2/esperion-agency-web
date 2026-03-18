//! Discord webhook alert delivery

use crate::services::alerting::{
    AlertChannel, AlertChannelConfig, AlertDeliveryResult, AlertPayload, AlertSender, AlertSeverity,
};
use reqwest::Client;
use serde_json::json;

pub struct DiscordAlertSender {
    http_client: Client,
}

impl DiscordAlertSender {
    pub fn new() -> Self {
        Self {
            http_client: Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl AlertSender for DiscordAlertSender {
    async fn send(&self, payload: &AlertPayload, config: &AlertChannelConfig) -> AlertDeliveryResult {
        let webhook_url = match config {
            AlertChannelConfig::Discord { webhook_url } => webhook_url.clone(),
            _ => {
                return AlertDeliveryResult {
                    channel: "discord".to_string(),
                    destination: "unknown".to_string(),
                    success: false,
                    error: Some("Invalid Discord configuration".to_string()),
                    delivered_at: None,
                }
            }
        };

        let color = match payload.severity {
            AlertSeverity::Info => 4301898,    // #4285F4
            AlertSeverity::Warning => 16361728, // #F9AB00
            AlertSeverity::Critical => 14235653, // #D93025
        };

        let embed = json!({
            "title": format!("{} {}", payload.emoji(), payload.title()),
            "description": payload.message,
            "color": color,
            "fields": [
                {
                    "name": "Service",
                    "value": payload.service,
                    "inline": true
                },
                {
                    "name": "Signal Type",
                    "value": payload.signal_type,
                    "inline": true
                },
                {
                    "name": "Severity",
                    "value": payload.severity.as_str(),
                    "inline": true
                },
                {
                    "name": "Observed Value",
                    "value": payload.observed_value.to_string(),
                    "inline": true
                },
                {
                    "name": "Threshold Value",
                    "value": payload.threshold_value.to_string(),
                    "inline": true
                },
                {
                    "name": "Alert ID",
                    "value": payload.alert_id,
                    "inline": false
                }
            ],
            "footer": {
                "text": "Esperion Monitoring System",
                "icon_url": "https://cdn-icons-png.flaticon.com/512/5968/5968863.png"
            },
            "timestamp": payload.fired_at
        });

        let webhook_payload = json!({
            "embeds": [embed],
            "username": "Esperion Monitor",
            "avatar_url": "https://cdn-icons-png.flaticon.com/512/5968/5968863.png"
        });

        match self.http_client
            .post(&webhook_url)
            .timeout(std::time::Duration::from_secs(5))
            .json(&webhook_payload)
            .send()
            .await
        {
            Ok(response) => {
                if response.status().is_success() {
                    AlertDeliveryResult {
                        channel: "discord".to_string(),
                        destination: webhook_url.clone(),
                        success: true,
                        error: None,
                        delivered_at: Some(chrono::Utc::now().to_rfc3339()),
                    }
                } else {
                    AlertDeliveryResult {
                        channel: "discord".to_string(),
                        destination: webhook_url.clone(),
                        success: false,
                        error: Some(format!("Discord delivery failed with status: {}", response.status())),
                        delivered_at: None,
                    }
                }
            }
            Err(e) => AlertDeliveryResult {
                channel: "discord".to_string(),
                destination: webhook_url.clone(),
                success: false,
                error: Some(format!("Discord delivery failed: {}", e)),
                delivered_at: None,
            },
        }
    }

    fn channel_type(&self) -> AlertChannel {
        AlertChannel::Discord
    }
}

impl Default for DiscordAlertSender {
    fn default() -> Self {
        Self::new()
    }
}
