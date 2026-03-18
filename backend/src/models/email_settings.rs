/**
 * Email Settings Model - Database Integration
 * 
 * Provides database operations for email_settings table
 */

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use surrealdb::types::RecordId;

/// Email settings stored in database
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailSettingsRecord {
    pub id: Option<RecordId>,
    pub provider: String,
    pub smtp_host: Option<String>,
    pub smtp_port: Option<u16>,
    pub smtp_username: Option<String>,
    pub smtp_password: Option<String>,
    pub smtp_encryption: Option<String>,
    pub api_key: Option<String>,
    pub from_address: String,
    pub domain: Option<String>,
    pub region: Option<String>,
    pub access_key_id: Option<String>,
    pub secret_access_key: Option<String>,
    pub is_active: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl EmailSettingsRecord {
    /// Create a new email settings record
    pub fn new(provider: String, from_address: String) -> Self {
        Self {
            id: None,
            provider,
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: None,
            from_address,
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
            is_active: true,
            created_at: None,
            updated_at: None,
        }
    }

    /// Save settings to database
    pub async fn save(&self, db: &Surreal<Client>) -> Result<Self, surrealdb::Error> {
        let mut result = db.query(
            r#"UPSERT email_settings CONTENT {
                provider: $provider,
                smtp_host: $smtp_host,
                smtp_port: $smtp_port,
                smtp_username: $smtp_username,
                smtp_encryption: $smtp_encryption,
                api_key: $api_key,
                from_address: $from_address,
                domain: $domain,
                region: $region,
                access_key_id: $access_key_id,
                secret_access_key: $secret_access_key,
                is_active: $is_active,
                updated_at: time::now()
            }"#
        )
        .bind(("provider", self.provider.clone()))
        .bind(("smtp_host", self.smtp_host.clone()))
        .bind(("smtp_port", self.smtp_port))
        .bind(("smtp_username", self.smtp_username.clone()))
        .bind(("smtp_encryption", self.smtp_encryption.clone()))
        .bind(("api_key", self.api_key.clone()))
        .bind(("from_address", self.from_address.clone()))
        .bind(("domain", self.domain.clone()))
        .bind(("region", self.region.clone()))
        .bind(("access_key_id", self.access_key_id.clone()))
        .bind(("secret_access_key", self.secret_access_key.clone()))
        .bind(("is_active", self.is_active))
        .await?;

        let result: Option<Self> = result.take(0)?;
        result.ok_or_else(|| surrealdb::Error::thrown("Failed to save email settings"))
    }

    /// Get active email settings from database
    pub async fn get_active(db: &Surreal<Client>) -> Result<Option<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_settings WHERE is_active = true LIMIT 1")
            .await?;
        
        let settings: Option<Self> = result.take(0)?;
        Ok(settings)
    }

    /// Get settings by provider
    pub async fn get_by_provider(
        db: &Surreal<Client>,
        provider: &str,
    ) -> Result<Option<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_settings WHERE provider = $provider LIMIT 1")
            .bind(("provider", provider.to_string()))
            .await?;
        
        let settings: Option<Self> = result.take(0)?;
        Ok(settings)
    }

    /// Update settings
    pub async fn update(&self, db: &Surreal<Client>) -> Result<Self, surrealdb::Error> {
        if let Some(id) = &self.id {
            let mut result = db
                .query(
                    r#"UPDATE email_settings SET
                        provider = $provider,
                        smtp_host = $smtp_host,
                        smtp_port = $smtp_port,
                        smtp_username = $smtp_username,
                        smtp_encryption = $smtp_encryption,
                        api_key = $api_key,
                        from_address = $from_address,
                        domain = $domain,
                        region = $region,
                        access_key_id = $access_key_id,
                        is_active = $is_active,
                        updated_at = time::now()
                    WHERE id = $id"#,
                )
                .bind(("id", id.clone()))
                .bind(("provider", self.provider.clone()))
                .bind(("smtp_host", self.smtp_host.clone()))
                .bind(("smtp_port", self.smtp_port))
                .bind(("smtp_username", self.smtp_username.clone()))
                .bind(("smtp_encryption", self.smtp_encryption.clone()))
                .bind(("api_key", self.api_key.clone()))
                .bind(("from_address", self.from_address.clone()))
                .bind(("domain", self.domain.clone()))
                .bind(("region", self.region.clone()))
                .bind(("access_key_id", self.access_key_id.clone()))
                .bind(("is_active", self.is_active))
                .await?;

            let result: Option<Self> = result.take(0)?;
            result.ok_or_else(|| surrealdb::Error::thrown("Failed to update email settings"))
        } else {
            self.save(db).await
        }
    }

    /// Delete settings by ID
    pub async fn delete(db: &Surreal<Client>, id: &RecordId) -> Result<(), surrealdb::Error> {
        db.query("DELETE email_settings WHERE id = $id")
            .bind(("id", id.clone()))
            .await?;
        Ok(())
    }
}
