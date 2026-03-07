use axum::{
    extract::{Query, State},
    response::Json,
    Extension,
};
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::models::contact::ContactSubmission;  // Use the actual ContactSubmission from contact model
use crate::services::email::EmailService;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailApi;

// ============== Request/Response Types ==============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactNotificationRequest {
    pub full_name: String,
    pub email: Option<String>,
    pub service: String,
    pub description: String,
    pub company_name: Option<String>,
    pub phone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendEmailRequest {
    pub to: String,
    pub subject: String,
    pub body: String,
    pub html_body: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendEmailResponse {
    pub success: bool,
    pub message: String,
}

// ============== Handler Functions ==============

/// POST /api/v1/email/contact-notification
/// Sends a notification email for a new contact form submission
#[utoipa::path(
    post,
    path = "/api/v1/email/contact-notification",
    tag = "Email",
    request_body = ContactNotificationRequest,
    responses(
        (status = 200, description = "Email notification sent successfully", body = SendEmailResponse),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn send_contact_notification(
    State(email_service): State<EmailService>,
    Json(contact): Json<ContactSubmission>,  // Use the actual ContactSubmission model
) -> ApiResponse<SendEmailResponse> {
    email_service
        .send_contact_notification(&contact)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to send email: {}", e)))?;

    Ok(Json(SendEmailResponse {
        success: true,
        message: "Contact notification email sent successfully".to_string(),
    }))
}

/// POST /api/v1/email/send
/// Sends an arbitrary email using configured provider
#[utoipa::path(
    post,
    path = "/api/v1/email/send",
    tag = "Email",
    request_body = SendEmailRequest,
    responses(
        (status = 200, description = "Email sent successfully", body = SendEmailResponse),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn send_email(
    State(email_service): State<EmailService>,
    Json(request): Json<SendEmailRequest>,
) -> ApiResponse<SendEmailResponse> {
    use crate::models::email::EmailMessage; // Import EmailMessage

    let message = EmailMessage::new(request.to, request.subject, request.body)
        .with_html_body(request.html_body);

    email_service
        .send(message)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to send email: {}", e)))?;

    Ok(Json(SendEmailResponse {
        success: true,
        message: "Email sent successfully".to_string(),
    }))
}

/// Register email routes  
pub fn register_routes<T>(router: axum::Router<T>) -> axum::Router<T> {
    use axum::routing::{post, get, put, delete};

    router
        .route("/api/v1/email/contact-notification", post(send_contact_notification))
        .route("/api/v1/email/send", post(send_email))
}