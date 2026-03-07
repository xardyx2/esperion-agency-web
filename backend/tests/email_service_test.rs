/**
 * Email Service Tests
 * 
 * Unit and integration tests for email functionality
 */

#[cfg(test)]
mod tests {
    use esperion_backend::services::email::{EmailService};
    use esperion_backend::models::email::{EmailMessage, EmailSettings};
    use tokio;

    #[tokio::test]
    async fn test_smtp_provider_creation_success() {
        let config = EmailSettings {
            provider: "smtp".to_string(),
            smtp_host: Some("smtp.test.com".to_string()),
            smtp_port: Some(587),
            smtp_username: Some("test_user".to_string()),
            smtp_password: Some("test_pass".to_string()),
            smtp_encryption: Some("starttls".to_string()),
            api_key: None,
            from_address: "test@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };

        // Only test creation, not actual sending
        let result = EmailService::new(&config);
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_sendgrid_provider_creation_success() {
        let config = EmailSettings {
            provider: "sendgrid".to_string(),
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: Some("test_api_key".to_string()),
            from_address: "test@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };

        let result = EmailService::new(&config);
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_email_message_creation() {
        let message = EmailMessage::new(
            "recipient@example.com".to_string(),
            "Test Subject".to_string(),
            "Test Body".to_string(),
        ).with_html_body(Some("<p>HTML Body</p>".to_string()));

        assert_eq!(message.to, "recipient@example.com");
        assert_eq!(message.subject, "Test Subject");
        assert_eq!(message.body, "Test Body");
        assert_eq!(message.html_body, Some("<p>HTML Body</p>".to_string()));
    }

    #[tokio::test]
    async fn test_invalid_provider_error() {
        let config = EmailSettings {
            provider: "invalid_provider".to_string(),
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: None,
            from_address: "test@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };

        // Test that invalid provider returns error
        let result = EmailService::new(&config);
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_multiple_provider_configurations() {
        // Test various provider configurations
        let config_smtp = EmailSettings {
            provider: "smtp".to_string(),
            smtp_host: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            smtp_username: Some("user".to_string()),
            smtp_password: Some("password".to_string()),
            smtp_encryption: Some("starttls".to_string()),
            api_key: None,
            from_address: "from@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };
        
        let config_sendgrid = EmailSettings {
            provider: "sendgrid".to_string(),
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: Some("fake-api-key".to_string()),
            from_address: "from@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };
        
        let config_mailgun = EmailSettings {
            provider: "mailgun".to_string(),
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: Some("fake-api-key".to_string()),
            from_address: "from@example.com".to_string(),
            domain: Some("domain.example.com".to_string()),
            region: None,
            access_key_id: None,
            secret_access_key: None,
        };
        
        let config_ses = EmailSettings {
            provider: "ses".to_string(),
            smtp_host: None,
            smtp_port: None,
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: None,
            api_key: None,
            from_address: "from@example.com".to_string(),
            domain: None,
            region: Some("us-west-2".to_string()),
            access_key_id: Some("access-key".to_string()),
            secret_access_key: Some("secret-key".to_string()),
        };
        
        assert!(EmailService::new(&config_smtp).is_ok());
        assert!(EmailService::new(&config_sendgrid).is_ok());
        assert!(EmailService::new(&config_mailgun).is_ok());
        assert!(EmailService::new(&config_ses).is_ok());
    }
}