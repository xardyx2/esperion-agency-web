//! Alerting service module for Esperion monitoring
//! 
//! This module provides multi-channel alert delivery:
//! - Email alerts
//! - Push notifications
//! - Google Chat webhooks
//! - Discord webhooks
//! - Telegram bot

pub mod email;
pub mod push;
pub mod google_chat;
pub mod discord;
pub mod telegram;

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Alert severity levels
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum AlertSeverity {
    Info,
    Warning,
    Critical,
}

impl AlertSeverity {
    pub fn as_str(&self) -> &'static str {
        match self {
            AlertSeverity::Info => "info",
            AlertSeverity::Warning => "warning",
            AlertSeverity::Critical => "critical",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "critical" => AlertSeverity::Critical,
            "warning" => AlertSeverity::Warning,
            _ => AlertSeverity::Info,
        }
    }
}

/// Alert delivery channel types
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum AlertChannel {
    Email,
    Push,
    GoogleChat,
    Discord,
    Telegram,
}

impl AlertChannel {
    pub fn as_str(&self) -> &'static str {
        match self {
            AlertChannel::Email => "email",
            AlertChannel::Push => "push",
            AlertChannel::GoogleChat => "google_chat",
            AlertChannel::Discord => "discord",
            AlertChannel::Telegram => "telegram",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "email" => Some(AlertChannel::Email),
            "push" => Some(AlertChannel::Push),
            "google_chat" | "googlechat" | "google" => Some(AlertChannel::GoogleChat),
            "discord" => Some(AlertChannel::Discord),
            "telegram" => Some(AlertChannel::Telegram),
            _ => None,
        }
    }
}

/// Alert payload structure
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertPayload {
    pub alert_id: String,
    pub severity: AlertSeverity,
    pub service: String,
    pub signal_type: String,
    pub observed_value: f64,
    pub threshold_value: f64,
    pub message: String,
    pub metadata: Option<serde_json::Value>,
    pub fired_at: String,
}

impl AlertPayload {
    pub fn new(
        alert_id: String,
        severity: AlertSeverity,
        service: String,
        signal_type: String,
        observed_value: f64,
        threshold_value: f64,
        message: String,
        metadata: Option<serde_json::Value>,
    ) -> Self {
        Self {
            alert_id,
            severity,
            service,
            signal_type,
            observed_value,
            threshold_value,
            message,
            metadata,
            fired_at: chrono::Utc::now().to_rfc3339(),
        }
    }

    pub fn title(&self) -> String {
        format!("[{:?}] {} - {}", self.severity, self.service, self.signal_type)
    }

    pub fn emoji(&self) -> &'static str {
        match self.severity {
            AlertSeverity::Info => "ℹ️",
            AlertSeverity::Warning => "⚠️",
            AlertSeverity::Critical => "🚨",
        }
    }
}

/// Alert delivery result
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertDeliveryResult {
    pub channel: String,
    pub destination: String,
    pub success: bool,
    pub error: Option<String>,
    pub delivered_at: Option<String>,
}

/// Alert configuration for a destination
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AlertDestinationConfig {
    pub id: String,
    pub name: String,
    pub channel: AlertChannel,
    pub enabled: bool,
    pub config: AlertChannelConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(tag = "type", content = "config")]
pub enum AlertChannelConfig {
    Email { address: String },
    Push { endpoint: String, keys: PushSubscriptionKeys },
    GoogleChat { webhook_url: String },
    Discord { webhook_url: String },
    Telegram { bot_token: String, chat_id: String },
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PushSubscriptionKeys {
    pub p256dh: String,
    pub auth: String,
}

/// Alerting service trait
#[async_trait::async_trait]
pub trait AlertSender: Send + Sync {
    async fn send(&self, payload: &AlertPayload, config: &AlertChannelConfig) -> AlertDeliveryResult;
    fn channel_type(&self) -> AlertChannel;
}
