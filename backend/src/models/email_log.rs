/**
 * Email Log Model - Delivery Tracking
 * 
 * Tracks email delivery status for monitoring and debugging
 */

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use surrealdb::types::RecordId;

/// Email delivery status
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EmailDeliveryStatus {
    Pending,
    Sent,
    Delivered,
    Failed,
    Bounced,
    Complained,
}

impl EmailDeliveryStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            EmailDeliveryStatus::Pending => "pending",
            EmailDeliveryStatus::Sent => "sent",
            EmailDeliveryStatus::Delivered => "delivered",
            EmailDeliveryStatus::Failed => "failed",
            EmailDeliveryStatus::Bounced => "bounced",
            EmailDeliveryStatus::Complained => "complained",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "pending" => EmailDeliveryStatus::Pending,
            "sent" => EmailDeliveryStatus::Sent,
            "delivered" => EmailDeliveryStatus::Delivered,
            "failed" => EmailDeliveryStatus::Failed,
            "bounced" => EmailDeliveryStatus::Bounced,
            "complained" => EmailDeliveryStatus::Complained,
            _ => EmailDeliveryStatus::Pending,
        }
    }
}

/// Email log record for tracking delivery
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailLogRecord {
    pub id: Option<RecordId>,
    pub message_id: Option<String>,
    pub template_id: Option<RecordId>,
    pub template_name: Option<String>,
    pub to_address: String,
    pub from_address: String,
    pub subject: String,
    pub status: String,
    pub provider: String,
    pub provider_response: Option<String>,
    pub error_message: Option<String>,
    pub sent_at: Option<DateTime<Utc>>,
    pub delivered_at: Option<DateTime<Utc>>,
    pub opened_at: Option<DateTime<Utc>>,
    pub clicked_at: Option<DateTime<Utc>>,
    pub metadata: Option<serde_json::Value>,
    pub created_at: Option<DateTime<Utc>>,
}

impl EmailLogRecord {
    /// Create a new email log record
    pub fn new(
        to_address: String,
        from_address: String,
        subject: String,
        provider: String,
    ) -> Self {
        Self {
            id: None,
            message_id: None,
            template_id: None,
            template_name: None,
            to_address,
            from_address,
            subject,
            status: EmailDeliveryStatus::Pending.as_str().to_string(),
            provider,
            provider_response: None,
            error_message: None,
            sent_at: None,
            delivered_at: None,
            opened_at: None,
            clicked_at: None,
            metadata: None,
            created_at: None,
        }
    }

    /// Create from template
    pub fn with_template(
        to_address: String,
        from_address: String,
        subject: String,
        provider: String,
        template_id: RecordId,
        template_name: String,
    ) -> Self {
        let mut log = Self::new(to_address, from_address, subject, provider);
        log.template_id = Some(template_id);
        log.template_name = Some(template_name);
        log
    }

    /// Mark as sent
    pub fn mark_sent(&mut self, message_id: Option<String>) {
        self.status = EmailDeliveryStatus::Sent.as_str().to_string();
        self.message_id = message_id;
        self.sent_at = Some(Utc::now());
    }

    /// Mark as delivered
    pub fn mark_delivered(&mut self) {
        self.status = EmailDeliveryStatus::Delivered.as_str().to_string();
        self.delivered_at = Some(Utc::now());
    }

    /// Mark as failed
    pub fn mark_failed(&mut self, error: String, provider_response: Option<String>) {
        self.status = EmailDeliveryStatus::Failed.as_str().to_string();
        self.error_message = Some(error);
        self.provider_response = provider_response;
    }

    /// Mark as bounced
    pub fn mark_bounced(&mut self) {
        self.status = EmailDeliveryStatus::Bounced.as_str().to_string();
    }

    /// Save log to database
    pub async fn save(&self, db: &Surreal<Client>) -> Result<Self, surrealdb::Error> {
        let mut result = db
            .query(
                r#"CREATE email_logs CONTENT {
                    message_id: $message_id,
                    template_id: $template_id,
                    template_name: $template_name,
                    to_address: $to_address,
                    from_address: $from_address,
                    subject: $subject,
                    status: $status,
                    provider: $provider,
                    provider_response: $provider_response,
                    error_message: $error_message,
                    sent_at: $sent_at,
                    delivered_at: $delivered_at,
                    opened_at: $opened_at,
                    clicked_at: $clicked_at,
                    metadata: $metadata
                }"#,
            )
            .bind(("message_id", self.message_id.clone()))
            .bind(("template_id", self.template_id.clone()))
            .bind(("template_name", self.template_name.clone()))
            .bind(("to_address", self.to_address.clone()))
            .bind(("from_address", self.from_address.clone()))
            .bind(("subject", self.subject.clone()))
            .bind(("status", self.status.clone()))
            .bind(("provider", self.provider.clone()))
            .bind(("provider_response", self.provider_response.clone()))
            .bind(("error_message", self.error_message.clone()))
            .bind(("sent_at", self.sent_at))
            .bind(("delivered_at", self.delivered_at))
            .bind(("opened_at", self.opened_at))
            .bind(("clicked_at", self.clicked_at))
            .bind(("metadata", self.metadata.clone()))
            .await?;

        let result: Option<Self> = result.take(0)?;
        result.ok_or_else(|| surrealdb::Error::thrown("Failed to create email log"))
    }

    /// Update log status
    pub async fn update_status(
        &self,
        db: &Surreal<Client>,
        status: &str,
        error_message: Option<String>,
    ) -> Result<Self, surrealdb::Error> {
        if let Some(id) = &self.id {
            let mut result = db
                .query(
                    r#"UPDATE email_logs SET 
                        status = $status,
                        error_message = $error_message,
                        delivered_at = IF status == 'delivered' THEN time::now() ELSE delivered_at END,
                        opened_at = IF status == 'opened' THEN time::now() ELSE opened_at END,
                        clicked_at = IF status == 'clicked' THEN time::now() ELSE clicked_at END
                    WHERE id = $id"#,
                )
                .bind(("id", id.clone()))
                .bind(("status", status.to_string()))
                .bind(("error_message", error_message))
                .await?;

            let result: Option<Self> = result.take(0)?;
            result.ok_or_else(|| surrealdb::Error::thrown("Failed to update email log"))
        } else {
            self.save(db).await
        }
    }

    /// Get logs by status
    pub async fn get_by_status(
        db: &Surreal<Client>,
        status: &str,
        limit: u32,
    ) -> Result<Vec<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_logs WHERE status = $status ORDER BY created_at DESC LIMIT $limit")
            .bind(("status", status.to_string()))
            .bind(("limit", limit))
            .await?;

        let logs: Vec<Self> = result.take(0)?;
        Ok(logs)
    }

    /// Get recent logs
    pub async fn get_recent(
        db: &Surreal<Client>,
        limit: u32,
    ) -> Result<Vec<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_logs ORDER BY created_at DESC LIMIT $limit")
            .bind(("limit", limit))
            .await?;

        let logs: Vec<Self> = result.take(0)?;
        Ok(logs)
    }

    /// Get log by message ID
    pub async fn get_by_message_id(
        db: &Surreal<Client>,
        message_id: &str,
    ) -> Result<Option<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_logs WHERE message_id = $message_id LIMIT 1")
            .bind(("message_id", message_id.to_string()))
            .await?;

        let log: Option<Self> = result.take(0)?;
        Ok(log)
    }

    /// Get delivery statistics
    pub async fn get_stats(
        db: &Surreal<Client>,
    ) -> Result<EmailDeliveryStats, surrealdb::Error> {
        let mut result = db
            .query(
                r#"SELECT 
                    COUNT() as total,
                    COUNT(IF status == 'sent' THEN true END) as sent,
                    COUNT(IF status == 'delivered' THEN true END) as delivered,
                    COUNT(IF status == 'failed' THEN true END) as failed,
                    COUNT(IF status == 'bounced' THEN true END) as bounced
                FROM email_logs"#,
            )
            .await?;

        let stats: Vec<EmailDeliveryStats> = result.take(0)?;
        stats
            .into_iter()
            .next()
            .ok_or_else(|| surrealdb::Error::thrown("Failed to get email statistics"))
    }
}

/// Email delivery statistics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailDeliveryStats {
    pub total: u64,
    pub sent: u64,
    pub delivered: u64,
    pub failed: u64,
    pub bounced: u64,
}
