//! Telegram bot alert delivery

use crate::services::alerting::{
    AlertChannel, AlertChannelConfig, AlertDeliveryResult, AlertPayload, AlertSender, AlertSeverity,
};
use reqwest::Client;
use serde_json::json;

pub struct TelegramAlertSender {
    http_client: Client,
}

impl TelegramAlertSender {
    pub fn new() -> Self {
        Self {
            http_client: Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl AlertSender for TelegramAlertSender {
    async fn send(&self, payload: &AlertPayload, config: &AlertChannelConfig) -> AlertDeliveryResult {
        let (bot_token, chat_id) = match config {
            AlertChannelConfig::Telegram { bot_token, chat_id } => {
                (bot_token.clone(), chat_id.clone())
            }
            _ => {
                return AlertDeliveryResult {
                    channel: "telegram".to_string(),
                    destination: "unknown".to_string(),
                    success: false,
                    error: Some("Invalid Telegram configuration".to_string()),
                    delivered_at: None,
                }
            }
        };

        let emoji = payload.emoji();
        let severity_icon = match payload.severity {
            AlertSeverity::Info => "ℹ️",
            AlertSeverity::Warning => "⚠️",
            AlertSeverity::Critical => "🚨",
        };

        let message = format!(
            r#"
{} *{}*

{}

*Service:* `{}`
*Signal:* `{}`
*Severity:* {} {:?}
*Observed:* `{}`
*Threshold:* `{}`
*Alert ID:* `{}`

[View Dashboard](http://localhost:3000/dashboard/monitoring)
"#,
            emoji,
            payload.title(),
            payload.message,
            payload.service,
            payload.signal_type,
            severity_icon,
            payload.severity,
            payload.observed_value,
            payload.threshold_value,
            payload.alert_id,
        );

        let telegram_url = format!(
            "https://api.telegram.org/bot{}/sendMessage",
            bot_token
        );

        let telegram_payload = json!({
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": true
        });

        match self.http_client
            .post(&telegram_url)
            .timeout(std::time::Duration::from_secs(5))
            .json(&telegram_payload)
            .send()
            .await
        {
            Ok(response) => {
                if response.status().is_success() {
                    // Check if Telegram reported success in JSON
                    match response.json::<serde_json::Value>().await {
                        Ok(json) => {
                            if json.get("ok").and_then(|v| v.as_bool()).unwrap_or(false) {
                                AlertDeliveryResult {
                                    channel: "telegram".to_string(),
                                    destination: chat_id,
                                    success: true,
                                    error: None,
                                    delivered_at: Some(chrono::Utc::now().to_rfc3339()),
                                }
                            } else {
                                let error_desc = json
                                    .get("description")
                                    .and_then(|v| v.as_str())
                                    .unwrap_or("Unknown error")
                                    .to_string();
                                AlertDeliveryResult {
                                    channel: "telegram".to_string(),
                                    destination: chat_id,
                                    success: false,
                                    error: Some(format!("Telegram error: {}", error_desc)),
                                    delivered_at: None,
                                }
                            }
                        }
                        Err(_) => AlertDeliveryResult {
                            channel: "telegram".to_string(),
                            destination: chat_id,
                            success: true,
                            error: None,
                            delivered_at: Some(chrono::Utc::now().to_rfc3339()),
                        },
                    }
                } else {
                    AlertDeliveryResult {
                        channel: "telegram".to_string(),
                        destination: chat_id,
                        success: false,
                        error: Some(format!("Telegram delivery failed with status: {}", response.status())),
                        delivered_at: None,
                    }
                }
            }
            Err(e) => AlertDeliveryResult {
                channel: "telegram".to_string(),
                destination: chat_id,
                success: false,
                error: Some(format!("Telegram delivery failed: {}", e)),
                delivered_at: None,
            },
        }
    }

    fn channel_type(&self) -> AlertChannel {
        AlertChannel::Telegram
    }
}

impl Default for TelegramAlertSender {
    fn default() -> Self {
        Self::new()
    }
}
