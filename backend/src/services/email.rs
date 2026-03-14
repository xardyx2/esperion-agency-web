/**
 * Email Service Implementation
 * 
 * Provides multi-provider email functionality with:
 * - Abstract email provider trait
 * - 6 different providers implementation
 * - SMTP provider using lettre
 * - Cloud providers: SendGrid, Mailgun, Amazon SES, Postmark, SMTP2GO
 */

use async_trait::async_trait;
use lettre::AsyncTransport;
use serde::{Deserialize, Serialize};
use crate::models::email::{EmailMessage, EmailError, EmailSettings};

#[async_trait]
pub trait EmailProvider: Send + Sync {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError>;
}

pub struct EmailConfig {
    pub provider: String,
    pub smtp_host: Option<String>,
    pub smtp_port: Option<u16>,
    pub smtp_username: Option<String>,
    pub smtp_password: Option<String>,
    pub smtp_encryption: Option<String>,
    pub api_key: Option<String>,
    pub domain: Option<String>,
    pub region: Option<String>,
    pub access_key_id: Option<String>,
    pub secret_access_key: Option<String>,
    pub from_address: String,
}

// ========================= SMTP Provider =========================
pub struct SmtpProvider {
    smtp_config: SmtpConfig,
    from_address: String,
}

#[derive(Clone)]
pub struct SmtpConfig {
    host: String,
    port: u16,
    username: Option<String>,
    password: Option<String>,
    encryption: String, // ssl, tls, starttls
}

impl SmtpProvider {
    pub fn new(config: &EmailConfig) -> Result<Self, EmailError> {
        if config.smtp_host.is_none() || config.smtp_port.is_none() {
            return Err(EmailError::ConfigError("Missing SMTP host or port".to_string()));
        }

        let smtp_config = SmtpConfig {
            host: config.smtp_host.clone().unwrap_or_default(),
            port: config.smtp_port.unwrap_or(587),
            username: config.smtp_username.clone(),
            password: config.smtp_password.clone(),
            encryption: config.smtp_encryption.clone().unwrap_or_else(|| "starttls".to_string()),
        };

        Ok(SmtpProvider {
            smtp_config,
            from_address: config.from_address.clone(),
        })
    }
}

#[async_trait]
impl EmailProvider for SmtpProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        use lettre::message::{header::ContentType, Message, MultiPart, SinglePart};
        use lettre::transport::smtp::authentication::Credentials;
        // Build the email message
        let mut email_builder = Message::builder()
            .to(message.to.parse().map_err(|_| EmailError::InvalidAddress(message.to.clone()))?)
            .subject(&message.subject);

        let from_addr = match &message.from {
            Some(from) => from,
            None => &self.from_address,
        };

        email_builder = email_builder.from(
            from_addr.parse().map_err(|_| EmailError::InvalidAddress(from_addr.to_string()))?
        );

        if let Some(cc) = &message.cc {
            for addr in cc {
                email_builder = email_builder.cc(addr.parse().map_err(|_| EmailError::InvalidAddress(addr.to_string()))?);
            }
        }

        if let Some(bcc) = &message.bcc {
            for addr in bcc {
                email_builder = email_builder.bcc(addr.parse().map_err(|_| EmailError::InvalidAddress(addr.to_string()))?);
            }
        }

        // Prepare email body as multipart message if there's HTML content
        let email = if let Some(html_body) = &message.html_body {
            email_builder.multipart(
                MultiPart::alternative()
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(message.body.clone())
                    )
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body.clone())
                    )
            ).map_err(|e| EmailError::SendFailure(format!("Failed to build multipart email: {}", e)))?
        } else {
            email_builder
                .singlepart(
                    SinglePart::builder()
                        .header(ContentType::TEXT_PLAIN)
                        .body(message.body.clone())
                ).map_err(|e| EmailError::SendFailure(format!("Failed to build plain email: {}", e)))?
        };

        // Create a new transport for each email sending - it may be inefficient but avoids connection issues
        let mailer = match self.smtp_config.encryption.as_str() {
            "ssl" => {
                lettre::AsyncSmtpTransport::<lettre::Tokio1Executor>::relay(&self.smtp_config.host)
                    .map_err(|e| EmailError::ConfigError(format!("SSL relay creation failed: {}", e)))?
                    .port(self.smtp_config.port)
            },
            "starttls" | _ => {
                lettre::AsyncSmtpTransport::<lettre::Tokio1Executor>::starttls_relay(&self.smtp_config.host)
                    .map_err(|e| EmailError::ConfigError(format!("STARTTLS relay creation failed: {}", e)))?
                    .port(self.smtp_config.port)
            }
        };

        let mailer = mailer.timeout(Some(std::time::Duration::from_secs(30)));

        // Add credentials if provided
        let mailer = if let (Some(username), Some(password)) = (&self.smtp_config.username, &self.smtp_config.password) {
            mailer.credentials(Credentials::new(username.clone(), password.clone()))
        } else {
            mailer
        };

        let mailer = mailer.build();

        mailer.send(email).await.map_err(|e| {
            EmailError::SendFailure(format!("SMTP delivery failed: {}", e))
        })?;

        Ok(())
    }
}

// ========================= SendGrid Provider =========================
pub struct SendGridProvider {
    api_key: String,
    from_address: String,
}

impl SendGridProvider {
    pub fn new(api_key: &str, from_address: &str) -> Result<Self, EmailError> {
        if api_key.is_empty() {
            return Err(EmailError::ConfigError("SendGrid API key is required".to_string()));
        }
        Ok(SendGridProvider {
            api_key: api_key.to_string(),
            from_address: from_address.to_string(),
        })
    }
}

#[derive(Serialize)]
struct SendGridEmail {
    personalizations: Vec<SendGridPersonalization>,
    from: SendGridEmailAddr,
    subject: String,
    content: Vec<SendGridContent>,
}

#[derive(Serialize)]
struct SendGridPersonalization {
    to: Vec<SendGridEmailAddr>,
    cc: Option<Vec<SendGridEmailAddr>>,
    bcc: Option<Vec<SendGridEmailAddr>>,
}

#[derive(Serialize)]
struct SendGridEmailAddr {
    email: String,
}

#[derive(Serialize)]
struct SendGridContent {
    r#type: String,
    value: String,
}

#[async_trait]
impl EmailProvider for SendGridProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        let req_client = reqwest::Client::new();

        let from_addr = match &message.from {
            Some(from) => from,
            None => &self.from_address,
        };

        let personalizations = vec![SendGridPersonalization {
            to: vec![SendGridEmailAddr {
                email: message.to.clone(),
            }],
            cc: message.cc.as_ref().map(|cc_vec| {
                cc_vec
                    .iter()
                    .map(|addr| SendGridEmailAddr { email: addr.clone() })
                    .collect()
            }),
            bcc: message.bcc.as_ref().map(|bcc_vec| {
                bcc_vec
                    .iter()
                    .map(|addr| SendGridEmailAddr { email: addr.clone() })
                    .collect()
            }),
        }];

        let content = if let Some(html_body) = &message.html_body {
            vec![
                SendGridContent {
                    r#type: "text/plain".to_string(),
                    value: message.body.clone(),
                },
                SendGridContent {
                    r#type: "text/html".to_string(),
                    value: html_body.clone(),
                },
            ]
        } else {
            vec![SendGridContent {
                r#type: "text/plain".to_string(),
                value: message.body.clone(),
            }]
        };

        let email = SendGridEmail {
            personalizations,
            from: SendGridEmailAddr {
                email: from_addr.to_string(),
            },
            subject: message.subject.clone(),
            content,
        };

        let resp = req_client
            .post("https://api.sendgrid.com/v3/mail/send")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&email)
            .send()
            .await
            .map_err(|e| EmailError::NetworkError(format!("SendGrid API request failed: {}", e)))?;

        if resp.status().is_success() {
            Ok(())
        } else {
            let error_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            Err(EmailError::ProviderError(format!("SendGrid API error: {}", error_text)))
        }
    }
}


// ========================= Mailgun Provider =========================
pub struct MailgunProvider {
    api_key: String,
    domain: String,
    from_address: String,
}

impl MailgunProvider {
    pub fn new(api_key: &str, domain: &str, from_address: &str) -> Result<Self, EmailError> {
        if api_key.is_empty() || domain.is_empty() {
            return Err(EmailError::ConfigError("Mailgun API key and domain are required".to_string()));
        }
        Ok(MailgunProvider {
            api_key: api_key.to_string(),
            domain: domain.to_string(),
            from_address: from_address.to_string(),
        })
    }
}

#[async_trait]
impl EmailProvider for MailgunProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        let req_client = reqwest::Client::new();

        let from_addr = match &message.from {
            Some(from) => from.clone(),
            None => self.from_address.clone(),
        };

        // Convert the message data to owned strings to avoid lifetime issues
        let to_addr = message.to.clone();
        let subject = message.subject.clone();
        let text_body = message.body.clone();
        let cc_str = message.cc.as_ref().map(|cc_list| cc_list.join(", "));
        let bcc_str = message.bcc.as_ref().map(|bcc_list| bcc_list.join(", "));

        let mut form = reqwest::multipart::Form::new()
            .text("from", from_addr)
            .text("to", to_addr)
            .text("subject", subject)
            .text("text", text_body);

        if let Some(html) = &message.html_body {
            form = form.text("html", html.clone());
        }

        if let Some(cc_list) = cc_str {
            form = form.text("cc", cc_list);
        }

        if let Some(bcc_list) = bcc_str {
            form = form.text("bcc", bcc_list);
        }

        let resp = req_client
            .post(&format!("https://api.mailgun.net/v3/{}/messages", self.domain))
            .basic_auth("api", Some(self.api_key.clone()))
            .multipart(form)
            .send()
            .await
            .map_err(|e| EmailError::NetworkError(format!("Mailgun API request failed: {}", e)))?;

        if resp.status().is_success() {
            Ok(())
        } else {
            let error_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            Err(EmailError::ProviderError(format!("Mailgun API error: {}", error_text)))
        }
    }
}


// ========================= Amazon SES Provider =========================
pub struct AmazonSESProvider {
    access_key_id: String,
    secret_access_key: String,
    region: String,
    from_address: String,
}

impl AmazonSESProvider {
    pub fn new(access_key_id: &str, secret_access_key: &str, region: &str, from_address: &str) -> Result<Self, EmailError> {
        if access_key_id.is_empty() || secret_access_key.is_empty() || region.is_empty() {
            return Err(EmailError::ConfigError("AWS Access Key ID, Secret Access Key, and Region are required".to_string()));
        }
        Ok(AmazonSESProvider {
            access_key_id: access_key_id.to_string(),
            secret_access_key: secret_access_key.to_string(),
            region: region.to_string(),
            from_address: from_address.to_string(),
        })
    }
}

#[async_trait]
impl EmailProvider for AmazonSESProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        use lettre::{AsyncSmtpTransport, Message, Tokio1Executor};
        use lettre::{
            message::header::ContentType,
            transport::smtp::{
                authentication::Credentials,
                client::{Tls, TlsParameters},
            },
        };

        let from_addr = match &message.from {
            Some(from) => from.to_string(),
            None => self.from_address.to_string(),
        };

        // Build the email message
        let mut email_builder = Message::builder()
            .to(message.to.parse().map_err(|_| EmailError::InvalidAddress(message.to.clone()))?)
            .subject(&message.subject);

        email_builder = email_builder.from(
            from_addr.parse().map_err(|_| EmailError::InvalidAddress(from_addr.to_string()))?
        );

        if let Some(cc) = &message.cc {
            for addr in cc {
                email_builder = email_builder.cc(addr.parse().map_err(|_| EmailError::InvalidAddress(addr.to_string()))?);
            }
        }

        if let Some(bcc) = &message.bcc {
            for addr in bcc {
                email_builder = email_builder.bcc(addr.parse().map_err(|_| EmailError::InvalidAddress(addr.to_string()))?);
            }
        }

        // Prepare email body as multipart message if there's HTML content
        let email = if let Some(html_body) = &message.html_body {
            email_builder.multipart(
                lettre::message::MultiPart::alternative()
                    .singlepart(
                        lettre::message::SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(message.body.clone())
                    )
                    .singlepart(
                        lettre::message::SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body.clone())
                    )
            ).map_err(|e| EmailError::SendFailure(format!("Failed to build multipart email: {}", e)))?
        } else {
            email_builder
                .singlepart(
                    lettre::message::SinglePart::builder()
                        .header(ContentType::TEXT_PLAIN)
                        .body(message.body.clone())
                ).map_err(|e| EmailError::SendFailure(format!("Failed to build plain email: {}", e)))?
        };

        // Use AWS SES SMTP settings
        let smtp_host = format!("email.{}.amazonaws.com", self.region);
        let creds = Credentials::new(
            self.access_key_id.to_string(),
            self.secret_access_key.clone(),
        );

        let tls_params = TlsParameters::new(smtp_host.clone()).map_err(|e| {
            EmailError::ConfigError(format!("SES TLS parameter creation failed: {}", e))
        })?;

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(&smtp_host)
            .map_err(|e| EmailError::ConfigError(format!("SES SMTP relay creation failed: {}", e)))?
            .port(587)
            .credentials(creds)
            .tls(Tls::Required(tls_params))
            .build();

        mailer.send(email).await.map_err(|e| {
            EmailError::ProviderError(format!("AWS SES SMTP transport error: {}", e))
        })?;

        Ok(())
    }
}


// ========================= Postmark Provider =========================
pub struct PostmarkProvider {
    api_key: String,
    from_address: String,
}

impl PostmarkProvider {
    pub fn new(api_key: &str, from_address: &str) -> Result<Self, EmailError> {
        if api_key.is_empty() {
            return Err(EmailError::ConfigError("Postmark API key is required".to_string()));
        }
        Ok(PostmarkProvider {
            api_key: api_key.to_string(),
            from_address: from_address.to_string(),
        })
    }
}

#[derive(Serialize)]
struct PostmarkEmail {
    from: String,
    to: String,
    subject: String,
    text_body: String,
    html_body: Option<String>,
    cc: Option<Vec<PostmarkAddress>>,
    bcc: Option<Vec<PostmarkAddress>>,
}

#[derive(Serialize)]
struct PostmarkAddress {
    email: String,
}

#[async_trait]
impl EmailProvider for PostmarkProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        let req_client = reqwest::Client::new();

        let from_addr = match &message.from {
            Some(from) => from,
            None => &self.from_address,
        };

        let postmark_email = PostmarkEmail {
            from: from_addr.to_string(),
            to: message.to.clone(),
            subject: message.subject.clone(),
            text_body: message.body.clone(),
            html_body: message.html_body.clone(),
            cc: message.cc.as_ref().map(|cc_list| {
                cc_list
                    .iter()
                    .map(|addr| PostmarkAddress { email: addr.clone() })
                    .collect()
            }),
            bcc: message.bcc.as_ref().map(|bcc_list| {
                bcc_list
                    .iter()
                    .map(|addr| PostmarkAddress { email: addr.clone() })
                    .collect()
            }),
        };

        let resp = req_client
            .post("https://api.postmarkapp.com/email")
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .header("X-Postmark-Server-Token", &self.api_key)
            .json(&postmark_email)
            .send()
            .await
            .map_err(|e| EmailError::NetworkError(format!("Postmark API request failed: {}", e)))?;

        if resp.status().is_success() {
            Ok(())
        } else {
            let error_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            Err(EmailError::ProviderError(format!("Postmark API error: {}", error_text)))
        }
    }
}


// ========================= SMTP2GO Provider =========================
pub struct SMTP2GOProvider {
    api_key: String,
    from_address: String,
}

impl SMTP2GOProvider {
    pub fn new(api_key: &str, from_address: &str) -> Result<Self, EmailError> {
        if api_key.is_empty() {
            return Err(EmailError::ConfigError("SMTP2GO API key is required".to_string()));
        }
        Ok(SMTP2GOProvider {
            api_key: api_key.to_string(),
            from_address: from_address.to_string(),
        })
    }
}

#[derive(Serialize)]
struct SMTP2GoEmail {
    api_key: String,
    to: Vec<String>,
    sender: String,
    subject: String,
    text: String,
    html: Option<String>,
    cc: Option<Vec<String>>,
    bcc: Option<Vec<String>>,
}

#[async_trait]
impl EmailProvider for SMTP2GOProvider {
    async fn send(&self, message: &EmailMessage) -> Result<(), EmailError> {
        let req_client = reqwest::Client::new();

        let from_addr = match &message.from {
            Some(from) => from,
            None => &self.from_address,
        };

        let smtp2go_email = SMTP2GoEmail {
            api_key: self.api_key.clone(),
            to: vec![message.to.clone()],
            sender: from_addr.to_string(),
            subject: message.subject.clone(),
            text: message.body.clone(),
            html: message.html_body.clone(),
            cc: message.cc.clone(),
            bcc: message.bcc.clone(),
        };

        let resp = req_client
            .post("https://api.smtp2go.com/v1/email/send")
            .header("Content-Type", "application/json")
            .json(&smtp2go_email)
            .send()
            .await
            .map_err(|e| EmailError::NetworkError(format!("SMTP2GO API request failed: {}", e)))?;

        if resp.status().is_success() {
            let response_json: serde_json::Value = resp.json().await
                .map_err(|_| EmailError::ProviderError("Failed to parse SMTP2GO response".to_string()))?;
            
            if response_json.get("data").and_then(|d| d.get("success")).unwrap_or(&serde_json::Value::Bool(false)).is_boolean() {
                Ok(())
            } else {
                Err(EmailError::ProviderError("SMTP2GO API responded with unsuccessful result".to_string()))
            }
        } else {
            let error_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            Err(EmailError::ProviderError(format!("SMTP2GO API error: {}", error_text)))
        }
    }
}


use std::sync::Arc;

// ========================= Email Service Dispatcher =========================
#[derive(Clone)]
pub struct EmailService {
    provider_type: String,
    config: Arc<EmailConfig>,
    from_address: String,
}

impl EmailService {
    pub fn new(config: &EmailSettings) -> Result<Self, EmailError> {
        let email_config = EmailConfig {
            provider: config.provider.clone(),
            smtp_host: config.smtp_host.clone(),
            smtp_port: config.smtp_port,
            smtp_username: config.smtp_username.clone(),
            smtp_password: config.smtp_password.clone(),
            smtp_encryption: config.smtp_encryption.clone(),
            api_key: config.api_key.clone(),
            domain: config.domain.clone(),
            region: config.region.clone(),
            access_key_id: config.access_key_id.clone(),
            secret_access_key: config.secret_access_key.clone(),
            from_address: config.from_address.clone(),
        };

        // Verify provider configuration at creation time
        match config.provider.as_str() {
            "smtp" => {
                SmtpProvider::new(&email_config)?;
            }
            "sendgrid" => {
                SendGridProvider::new(
                    config.api_key.as_deref().unwrap_or(""),
                    &config.from_address,
                )?;
            }
            "mailgun" => {
                MailgunProvider::new(
                    config.api_key.as_deref().unwrap_or(""),
                    config.domain.as_deref().unwrap_or(""),
                    &config.from_address,
                )?;
            }
            "ses" | "amazon_ses" => {
                AmazonSESProvider::new(
                    config.access_key_id.as_deref().unwrap_or(""),
                    config.secret_access_key.as_deref().unwrap_or(""),
                    config.region.as_deref().unwrap_or("us-east-1"),
                    &config.from_address,
                )?;
            }
            "postmark" => {
                PostmarkProvider::new(
                    config.api_key.as_deref().unwrap_or(""),
                    &config.from_address,
                )?;
            }
            "smtp2go" => {
                SMTP2GOProvider::new(
                    config.api_key.as_deref().unwrap_or(""),
                    &config.from_address,
                )?;
            }
            _ => return Err(EmailError::InvalidProvider),
        };

        Ok(Self {
            provider_type: config.provider.clone(),
            config: Arc::new(email_config),
            from_address: config.from_address.clone(),
        })
    }

    pub async fn send(&self, mut message: EmailMessage) -> Result<(), EmailError> {
        // Ensure from_address is set
        if message.from.is_none() {
            message.from = Some(self.from_address.clone());
        }

        // Create provider instance based on type - in a real system this may not be efficient  
        // You may want different architecture for production
        match self.provider_type.as_str() {
            "smtp" => {
                let provider = SmtpProvider::new(&*self.config)?;
                provider.send(&message).await
            }
            "sendgrid" => {
                let provider = SendGridProvider::new(
                    self.config.api_key.as_deref().unwrap_or(""),
                    &self.config.from_address,
                )?;
                provider.send(&message).await
            }
            "mailgun" => {
                let provider = MailgunProvider::new(
                    self.config.api_key.as_deref().unwrap_or(""),
                    self.config.domain.as_deref().unwrap_or(""),
                    &self.config.from_address,
                )?;
                provider.send(&message).await
            }
            "ses" | "amazon_ses" => {
                let provider = AmazonSESProvider::new(
                    self.config.access_key_id.as_deref().unwrap_or(""),
                    self.config.secret_access_key.as_deref().unwrap_or(""),
                    self.config.region.as_deref().unwrap_or("us-east-1"),
                    &self.config.from_address,
                )?;
                provider.send(&message).await
            }
            "postmark" => {
                let provider = PostmarkProvider::new(
                    self.config.api_key.as_deref().unwrap_or(""),
                    &self.config.from_address,
                )?;
                provider.send(&message).await
            }
            "smtp2go" => {
                let provider = SMTP2GOProvider::new(
                    self.config.api_key.as_deref().unwrap_or(""),
                    &self.config.from_address,
                )?;
                provider.send(&message).await
            }
            _ => Err(EmailError::InvalidProvider),
        }
    }

    pub async fn send_contact_notification(&self, contact_submission: &crate::models::contact::ContactSubmission) -> Result<(), EmailError> {
        let email_body = match &contact_submission.email {
            Some(submission_email) => {
                format!(
                    "New Contact Form Submission\n\n\
                    Full Name: {}\n\
                    Company: {}\n\
                    Email: {}\n\
                    Phone: {}\n\
                    Service: {}\n\
                    Description:\n{}\n\n\
                    Recaptcha Score: {:?}\n\
                    Status: {}\n\
                    Notes: {:?}\n\
                    Submitted At: {:?}", 
                    contact_submission.full_name,
                    contact_submission.company_name.as_deref().unwrap_or("Not provided"),
                    submission_email,
                    contact_submission.phone.as_deref().unwrap_or("Not provided"),
                    contact_submission.service,
                    contact_submission.description,
                    contact_submission.recaptcha_score,
                    contact_submission.status.as_str(),
                    contact_submission.notes,
                    contact_submission.created_at
                )
            },
            None => {
                format!(
                    "New Contact Form Submission\n\n\
                    Full Name: {}\n\
                    Company: {}\n\
                    Email: Not provided\n\
                    Phone: {}\n\
                    Service: {}\n\
                    Description:\n{}\n\n\
                    Recaptcha Score: {:?}\n\
                    Status: {}\n\
                    Notes: {:?}\n\
                    Submitted At: {:?}", 
                    contact_submission.full_name,
                    contact_submission.company_name.as_deref().unwrap_or("Not provided"),
                    contact_submission.phone.as_deref().unwrap_or("Not provided"),
                    contact_submission.service,
                    contact_submission.description,
                    contact_submission.recaptcha_score,
                    contact_submission.status.as_str(),
                    contact_submission.notes,
                    contact_submission.created_at
                )
            }
        };

        let message = EmailMessage::new(
            "admin@esperion.agency".to_string(), // Should come from config in production
            format!("New Contact Form Submission: {}", contact_submission.service),
            email_body,
        );

        self.send(message).await
    }
}
