/**
 * Contact Form Handlers
 * 
 * Handles all contact-related HTTP requests:
 * - POST /api/v1/contact - Submit contact form (with reCAPTCHA)
 * - GET /api/v1/contact/submissions - List submissions (auth required)
 * - PUT /api/v1/contact/submissions/:id - Update submission (auth required)
 * - GET /api/v1/contact/stats - Get contact statistics (auth required)
 */

use axum::{
    extract::{Path, Query, State},
    response::Json,
    Extension,
    Router,
};
use surrealdb::types::RecordId;
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::AppState;
use crate::models::contact::{ContactSubmission, ContactFilter, CreateContactRequest, UpdateContactRequest, ContactStats, ContactStatusCounts, ServiceCount};
use crate::models::user::UserClaims;
use crate::services::email::EmailService;
use crate::models::recaptcha::RecaptchaResponse;
use crate::errors::{AppError, RecaptchaError};
use std::sync::Arc;

/// Contact API tags for OpenAPI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactApi;

// ============== Request/Response Types ==============

/// List contact submissions response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListContactResponse {
    pub data: Vec<ContactSubmission>,
    pub total: u32,
    pub limit: u32,
    pub offset: u32,
}

// ============== Handler Functions ==============

async fn verify_recaptcha(token: &str, secret_key: &str) -> Result<f32, RecaptchaError> {
    let client = reqwest::Client::new();
    let params = [
        ("secret", secret_key),
        ("response", token),
    ];

    // Make the request to Google's reCAPTCHA verification endpoint
    let response = client
        .post("https://www.google.com/recaptcha/api/siteverify")
        .form(&params)
        .send()
        .await?;

    let result: RecaptchaResponse = response.json().await?;

    if !result.success {
        return Err(RecaptchaError::VerificationFailed);
    }

    // Additional validation: Ensure action matches expected value
    // Note: In a real implementation, we'd validate against known actions
    if result.score < 0.0 || result.score > 1.0 {
        return Err(RecaptchaError::InvalidResponse);
    }

    Ok(result.score)
}

impl From<AppError> for crate::api::ApiError {
    fn from(app_error: AppError) -> Self {
        match app_error {
            AppError::RecaptchaFailed => {
                crate::api::ApiError {
                    status: axum::http::StatusCode::BAD_REQUEST,
                    message: Some("reCAPTCHA verification failed".to_string()),
                }
            }
            AppError::RecaptchaTokenMissing => {
                crate::api::ApiError {
                    status: axum::http::StatusCode::BAD_REQUEST,
                    message: Some("reCAPTCHA token is required".to_string()),
                }
            }
            AppError::InternalServerError(msg) => {
                crate::api::ApiError {
                    status: axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                    message: Some(format!("Internal server error: {}", msg)),
                }
            }
        }
    }
}

/// POST /api/v1/contact
/// Submit a new contact form
#[utoipa::path(
    post,
    path = "/api/v1/contact",
    tag = "Contact",
    request_body = CreateContactRequest,
    responses(
        (status = 201, description = "Contact form submitted successfully", body = ContactSubmission),
        (status = 400, description = "Bad request (invalid reCAPTCHA)"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn submit_contact(
    State(app_state): State<crate::AppState>,
    Json(request): Json<CreateContactRequest>,
) -> ApiResponse<ContactSubmission> {
    let db = &app_state.db;
    let email_service = &app_state.email_service;
    // Get reCAPTCHA secret key from environment
    let recaptcha_secret = std::env::var("RECAPTCHA_SECRET_KEY")
        .map_err(|_| crate::api::internal_error("RECAPTCHA_SECRET_KEY not configured"))?;
    let min_score: f32 = std::env::var("RECAPTCHA_MIN_SCORE")
        .unwrap_or_else(|_| "0.5".to_string())
        .parse()
        .unwrap_or(0.5);

    // Verify reCAPTCHA if token provided
    let recaptcha_score = if let Some(token) = request.recaptcha_token {
        match verify_recaptcha(&token, &recaptcha_secret).await {
            Ok(score) => {
                if score < min_score {
                    return Err(crate::api::bad_request_error("reCAPTCHA verification failed"));
                }
                Some(score)
            }
            Err(e) => {
                tracing::error!("reCAPTCHA verification failed: {}", e);
                return Err(crate::api::bad_request_error("reCAPTCHA verification failed"));
            }
        }
    } else {
        return Err(crate::api::bad_request_error("reCAPTCHA token is required"));
    };

    let mut submission = ContactSubmission::new(
        request.full_name,
        request.service,
        request.description,
    );

    if let Some(company_name) = request.company_name {
        submission = submission.with_company_name(company_name);
    }
    if let Some(email) = request.email {
        submission = submission.with_email(email);
    }
    if let Some(phone) = request.phone {
        submission = submission.with_phone(phone);
    }
    if let Some(score) = recaptcha_score {
        submission = submission.with_recaptcha_score(score);
    }

    // Save to database
    let query = "CREATE contact_submissions CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&submission).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize submission: {}", e))
        })?))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let created_submission: Option<ContactSubmission> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    // Send email notification asynchronously (but handle errors gracefully)
    if let Some(submitted) = &created_submission {
        // Attempt to send email notification
        let _ = email_service.send_contact_notification(submitted).await
            .map_err(|e| tracing::error!("Failed to send contact notification email: {}", e));
    }

    match created_submission {
        Some(s) => Ok(Json(s)),
        None => Err(crate::api::internal_error("Failed to create submission")),
    }
}

/// GET /api/v1/contact/submissions
/// List all contact submissions (auth required)
#[utoipa::path(
    get,
    path = "/api/v1/contact/submissions",
    tag = "Contact",
    params(
        ("service" = Option<String>, Query, description = "Filter by service"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("date_from" = Option<String>, Query, description = "Filter by date from (ISO 8601)"),
        ("date_to" = Option<String>, Query, description = "Filter by date to (ISO 8601)"),
        ("limit" = Option<u32>, Query, description = "Limit results"),
        ("offset" = Option<u32>, Query, description = "Offset for pagination")
    ),
    responses(
        (status = 200, description = "List of contact submissions", body = ListContactResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn list_submissions(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Query(filters): Query<ContactFilter>,
) -> ApiResponse<ListContactResponse> {
    let db = &app_state.db;
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query
    let query = format!(
        "SELECT * FROM contact_submissions{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await.map_err(|e| crate::api::internal_error(e))?;
    let submissions: Vec<ContactSubmission> = result.take(0).map_err(|e| crate::api::internal_error(e))?;

    // Get total count
    let count_query = format!(
        "SELECT count() FROM contact_submissions{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total: Option<u32> = count_result.take(0).ok().flatten();

    Ok(Json(ListContactResponse {
        data: submissions,
        total: total.unwrap_or(0),
        limit,
        offset,
    }))
}

/// GET /api/v1/contact/submissions/:id
/// Get a single submission by ID
#[utoipa::path(
    get,
    path = "/api/v1/contact/submissions/{id}",
    tag = "Contact",
    params(
        ("id" = String, Path, description = "Submission ID")
    ),
    responses(
        (status = 200, description = "Submission details", body = ContactSubmission),
        (status = 404, description = "Submission not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn get_submission(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<ContactSubmission> {
    let db = &app_state.db;
    let query = "SELECT * FROM contact_submissions WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", RecordId::new("contact_submissions", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let submission: Option<ContactSubmission> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match submission {
        Some(s) => Ok(Json(s)),
        None => Err(crate::api::not_found_error("Submission not found")),
    }
}

/// PUT /api/v1/contact/submissions/:id
/// Update a submission (mark as contacted, add notes, etc.)
#[utoipa::path(
    put,
    path = "/api/v1/contact/submissions/{id}",
    tag = "Contact",
    params(
        ("id" = String, Path, description = "Submission ID")
    ),
    request_body = UpdateContactRequest,
    responses(
        (status = 200, description = "Submission updated successfully", body = ContactSubmission),
        (status = 404, description = "Submission not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn update_submission(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateContactRequest>,
) -> ApiResponse<ContactSubmission> {
    let db = &app_state.db;
    // First check if submission exists
    let query = "SELECT * FROM contact_submissions WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", RecordId::new("contact_submissions", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<ContactSubmission> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Submission not found"));
    }

    // Build update fields
    let mut updates = Vec::new();
    if let Some(company_name) = update.company_name {
        updates.push(format!("company_name = '{}'", company_name.replace('\'', "''")));
    }
    if let Some(service) = update.service {
        updates.push(format!("service = '{}'", service.replace('\'', "''")));
    }
    if let Some(description) = update.description {
        updates.push(format!("description = '{}'", description.replace('\'', "''")));
    }
    if let Some(email) = update.email {
        updates.push(format!("email = '{}'", email.replace('\'', "''")));
    }
    if let Some(phone) = update.phone {
        updates.push(format!("phone = '{}'", phone.replace('\'', "''")));
    }
    if let Some(status) = update.status {
        updates.push(format!("status = '{}'", status.replace('\'', "''")));
    }
    if let Some(notes) = update.notes {
        updates.push(format!("notes = '{}'", notes.replace('\'', "''")));
    }

    if updates.is_empty() {
        return Err(crate::api::bad_request_error("No fields to update"));
    }

    let update_query = format!(
        "UPDATE contact_submissions SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", RecordId::new("contact_submissions", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let updated: Option<ContactSubmission> = update_result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match updated {
        Some(s) => Ok(Json(s)),
        None => Err(crate::api::not_found_error("Submission not found")),
    }
}

/// GET /api/v1/contact/stats
/// Get contact submission statistics
#[utoipa::path(
    get,
    path = "/api/v1/contact/stats",
    tag = "Contact",
    responses(
        (status = 200, description = "Contact statistics", body = ContactStats),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_contact_stats(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
) -> ApiResponse<ContactStats> {
    let db = &app_state.db;
    // Get total count
    let total_query = "SELECT count() as count FROM contact_submissions";
    let mut total_result = db.query(total_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total_result: Option<Vec<serde_json::Value>> = total_result.take(0).ok();
    let total = total_result
        .and_then(|r| r.first().and_then(|v| v.get("count").and_then(|c| c.as_u64()).map(|c| c as u32)))
        .unwrap_or(0);

    // Get counts by status
    let status_query = "SELECT status, count() as count FROM contact_submissions GROUP BY status";
    let mut status_result = db.query(status_query).await.map_err(|e| crate::api::internal_error(e))?;
    let status_results: Option<Vec<serde_json::Value>> = status_result.take(0).ok();
    
    let mut new = 0u32;
    let mut contacted = 0u32;
    let mut qualified = 0u32;
    let mut converted = 0u32;
    let mut lost = 0u32;
    
    if let Some(results) = status_results {
        for row in results {
            if let Some(status) = row.get("status").and_then(|s| s.as_str()) {
                let count = row.get("count").and_then(|c| c.as_u64()).map(|c| c as u32).unwrap_or(0);
                match status {
                    "new" => new = count,
                    "contacted" => contacted = count,
                    "qualified" => qualified = count,
                    "converted" => converted = count,
                    "lost" => lost = count,
                    _ => {}
                }
            }
        }
    }

    // Get counts by service
    let service_query = "SELECT service, count() as count FROM contact_submissions GROUP BY service";
    let mut service_result = db.query(service_query).await.map_err(|e| crate::api::internal_error(e))?;
    let service_results: Option<Vec<serde_json::Value>> = service_result.take(0).ok();
    
    let mut by_service = Vec::new();
    if let Some(results) = service_results {
        for row in results {
            if let Some(service) = row.get("service").and_then(|s| s.as_str()).map(|s| s.to_string()) {
                let count = row.get("count").and_then(|c| c.as_u64()).map(|c| c as u32).unwrap_or(0);
                by_service.push(ServiceCount { service, count });
            }
        }
    }

    Ok(Json(ContactStats {
        total,
        by_status: ContactStatusCounts { new, contacted, qualified, converted, lost },
        by_service,
    }))
}
