/**
 * Email Models
 *
 * Contains data models for email functionality:
 * - ContactSubmission (re-used for email content)
 * - EmailSettings for configuring providers
 * - EmailError for email-related errors
 */
use serde::{Deserialize, Serialize};

/// Contact submission model - same as in contact.rs but reused for email purposes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactSubmission {
    pub full_name: String,
    pub company_name: Option<String>,
    pub service: String,
    pub description: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub recaptcha_score: Option<f32>,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: Option<String>,
}

/// Email message structure for sending emails
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailMessage {
    pub to: String,
    pub subject: String,
    pub body: String,
    pub html_body: Option<String>,
    pub from: Option<String>,
    pub cc: Option<Vec<String>>,
    pub bcc: Option<Vec<String>>,
}

impl EmailMessage {
    pub fn new(to: String, subject: String, body: String) -> Self {
        Self {
            to,
            subject,
            body,
            html_body: None,
            from: None,
            cc: None,
            bcc: None,
        }
    }

    pub fn with_html_body(mut self, html_body: Option<String>) -> Self {
        self.html_body = html_body;
        self
    }

    pub fn with_from(mut self, from: Option<String>) -> Self {
        self.from = from;
        self
    }

    pub fn with_cc(mut self, cc: Option<Vec<String>>) -> Self {
        self.cc = cc;
        self
    }

    pub fn with_bcc(mut self, bcc: Option<Vec<String>>) -> Self {
        self.bcc = bcc;
        self
    }
}

/// Email configuration settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailSettings {
    pub provider: String,
    pub smtp_host: Option<String>,
    pub smtp_port: Option<u16>,
    pub smtp_username: Option<String>,
    pub smtp_password: Option<String>,
    pub smtp_encryption: Option<String>, // "ssl", "tls", "starttls"
    pub api_key: Option<String>,
    pub from_address: String,
    pub domain: Option<String>, // For providers that require domain
    pub region: Option<String>, // For AWS SES region
    pub access_key_id: Option<String>,
    pub secret_access_key: Option<String>,
}

/// Email-specific error handling
#[derive(Debug, Clone)]
pub enum EmailError {
    /// Invalid provider configuration
    InvalidProvider,
    /// Configuration error (missing or invalid settings)
    ConfigError(String),
    /// Authentication error
    AuthError(String),
    /// Network error during sending
    NetworkError(String),
    /// Invalid recipient address
    InvalidAddress(String),
    /// Provider-specific error
    ProviderError(String),
    /// General send failure
    SendFailure(String),
}

impl std::fmt::Display for EmailError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            EmailError::InvalidProvider => write!(f, "Invalid email provider"),
            EmailError::ConfigError(msg) => write!(f, "Email configuration error: {}", msg),
            EmailError::AuthError(msg) => write!(f, "Email authentication error: {}", msg),
            EmailError::NetworkError(msg) => write!(f, "Email network error: {}", msg),
            EmailError::InvalidAddress(msg) => write!(f, "Invalid email address: {}", msg),
            EmailError::ProviderError(msg) => write!(f, "Email provider error: {}", msg),
            EmailError::SendFailure(msg) => write!(f, "Email sending failed: {}", msg),
        }
    }
}

impl std::error::Error for EmailError {}

impl From<EmailError> for crate::api::ApiError {
    fn from(err: EmailError) -> Self {
        crate::api::ApiError {
            status: axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            message: Some(format!("Email error: {}", err)),
        }
    }
}
