//! Google Chat webhook alert delivery

use crate::services::alerting::{
    AlertChannel, AlertChannelConfig, AlertDeliveryResult, AlertPayload, AlertSender,
};
use reqwest::Client;
use serde_json::json;

pub struct GoogleChatAlertSender {
    http_client: Client,
}

impl GoogleChatAlertSender {
    pub fn new() -> Self {
        Self {
            http_client: Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl AlertSender for GoogleChatAlertSender {
    async fn send(&self, payload: &AlertPayload, config: &AlertChannelConfig) -> AlertDeliveryResult {
        let webhook_url = match config {
            AlertChannelConfig::GoogleChat { webhook_url } => webhook_url.clone(),
            _ => {
                return AlertDeliveryResult {
                    channel: "google_chat".to_string(),
                    destination: "unknown".to_string(),
                    success: false,
                    error: Some("Invalid Google Chat configuration".to_string()),
                    delivered_at: None,
                }
            }
        };

        let color = match payload.severity {
            crate::services::alerting::AlertSeverity::Info => "#4285F4",
            crate::services::alerting::AlertSeverity::Warning => "#F9AB00",
            crate::services::alerting::AlertSeverity::Critical => "#D93025",
        };

        let card = json!({
            "cards": [{
                "header": {
                    "title": format!("{} {}", payload.emoji(), payload.title()),
                    "subtitle": "Esperion Monitoring Alert",
                    "image": {
                        "imageUrl": "https://www.gstatic.com/images/branding/product/1x/chat_2020q4_48dp.png"
                    }
                },
                "sections": [{
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": format!("<b>Alert Message:</b><br/>{}", payload.message)
                            }
                        },
                        {
                            "decoratedText": {
                                "text": format!("Service: {}", payload.service),
                                "startIcon": {
                                    "knownIcon": "SETTINGS"
                                }
                            }
                        },
                        {
                            "decoratedText": {
                                "text": format!("Signal Type: {}", payload.signal_type),
                                "startIcon": {
                                    "knownIcon": "BOOKMARK"
                                }
                            }
                        },
                        {
                            "decoratedText": {
                                "text": format!("Observed: {} | Threshold: {}", payload.observed_value, payload.threshold_value)
                            }
                        },
                        {
                            "decoratedText": {
                                "text": format!("Alert ID: {}", payload.alert_id),
                                "endIcon": {
                                    "knownIcon": "INFO"
                                }
                            }
                        }
                    ]
                }, {
                    "widgets": [{
                        "buttons": [{
                            "textButton": {
                                "text": "VIEW DASHBOARD",
                                "onClick": {
                                    "openLink": {
                                        "url": "http://localhost:3000/dashboard/monitoring"
                                    }
                                }
                            }
                        }]
                    }]
                }]
            }]
        });

        match self.http_client
            .post(&webhook_url)
            .timeout(std::time::Duration::from_secs(5))
            .json(&card)
            .send()
            .await
        {
            Ok(response) => {
                if response.status().is_success() {
                    AlertDeliveryResult {
                        channel: "google_chat".to_string(),
                        destination: webhook_url.clone(),
                        success: true,
                        error: None,
                        delivered_at: Some(chrono::Utc::now().to_rfc3339()),
                    }
                } else {
                    AlertDeliveryResult {
                        channel: "google_chat".to_string(),
                        destination: webhook_url.clone(),
                        success: false,
                        error: Some(format!("Google Chat delivery failed with status: {}", response.status())),
                        delivered_at: None,
                    }
                }
            }
            Err(e) => AlertDeliveryResult {
                channel: "google_chat".to_string(),
                destination: webhook_url.clone(),
                success: false,
                error: Some(format!("Google Chat delivery failed: {}", e)),
                delivered_at: None,
            },
        }
    }

    fn channel_type(&self) -> AlertChannel {
        AlertChannel::GoogleChat
    }
}

impl Default for GoogleChatAlertSender {
    fn default() -> Self {
        Self::new()
    }
}
