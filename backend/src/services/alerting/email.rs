//! Email alert delivery

use crate::services::alerting::{
    AlertChannel, AlertChannelConfig, AlertDeliveryResult, AlertPayload, AlertSender,
};
use crate::services::email::EmailService;
use crate::models::email::EmailMessage;

pub struct EmailAlertSender {
    email_service: EmailService,
}

impl EmailAlertSender {
    pub fn new(email_service: EmailService) -> Self {
        Self { email_service }
    }
}

#[async_trait::async_trait]
impl AlertSender for EmailAlertSender {
    async fn send(&self, payload: &AlertPayload, config: &AlertChannelConfig) -> AlertDeliveryResult {
        let address = match config {
            AlertChannelConfig::Email { address } => address.clone(),
            _ => {
                return AlertDeliveryResult {
                    channel: "email".to_string(),
                    destination: "unknown".to_string(),
                    success: false,
                    error: Some("Invalid email configuration".to_string()),
                    delivered_at: None,
                }
            }
        };

        let subject = format!("{} {}", payload.emoji(), payload.title());
        let body = format!(
            r#"
<h2>Monitoring Alert</h2>
<p><strong>Alert ID:</strong> {}</p>
<p><strong>Severity:</strong> {:?}</p>
<p><strong>Service:</strong> {}</p>
<p><strong>Signal:</strong> {}</p>
<p><strong>Message:</strong></p>
<blockquote>{}</blockquote>
<hr/>
<h3>Details</h3>
<ul>
    <li><strong>Observed Value:</strong> {}</li>
    <li><strong>Threshold Value:</strong> {}</li>
    <li><strong>Fired At:</strong> {}</li>
</ul>
"#,
            payload.alert_id,
            payload.severity,
            payload.service,
            payload.signal_type,
            payload.message,
            payload.observed_value,
            payload.threshold_value,
            payload.fired_at,
        );

        let email = EmailMessage::new(address.clone(), subject, body);
        
        match self.email_service.send(email).await {
            Ok(()) => AlertDeliveryResult {
                channel: "email".to_string(),
                destination: address,
                success: true,
                error: None,
                delivered_at: Some(chrono::Utc::now().to_rfc3339()),
            },
            Err(e) => AlertDeliveryResult {
                channel: "email".to_string(),
                destination: address,
                success: false,
                error: Some(format!("Email send failed: {}", e)),
                delivered_at: None,
            },
        }
    }

    fn channel_type(&self) -> AlertChannel {
        AlertChannel::Email
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::alerting::AlertSeverity;

    #[test]
    fn test_email_alert_format() {
        let payload = AlertPayload::new(
            "test-123".to_string(),
            AlertSeverity::Warning,
            "Backend API".to_string(),
            "latency_ms".to_string(),
            1500.0,
            1000.0,
            "High latency detected".to_string(),
            None,
        );

        assert!(payload.title().contains("Backend API"));
        assert!(payload.title().contains("latency_ms"));
        assert_eq!(payload.emoji(), "⚠️");
    }
}
