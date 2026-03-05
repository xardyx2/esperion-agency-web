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
    http::StatusCode,
    response::Json,
    Extension,
};
use surrealdb::sql::Thing;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::ApiResponse;
use crate::db::Db;
use crate::models::contact::{ContactSubmission, ContactFilter, CreateContactRequest, UpdateContactRequest, ContactStatus, ContactStats, ContactStatusCounts, ServiceCount};
use crate::models::user::UserClaims;

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

/// POST /api/v1/contact
/// Submit a new contact form
#[utoipa::path(
    post,
    path = "/api/v1/contact",
    tag = "Contact",
    request_body(
        description = "Contact form submission",
        content = "application/json",
        example = json!({
            "full_name": "John Doe",
            "company_name": "Acme Corp",
            "service": "Web Development",
            "description": "We need a new website",
            "email": "john@example.com",
            "phone": "+1234567890",
            "recaptcha_token": "..."
        })
    ),
    responses(
        (status = 201, description = "Contact form submitted successfully", body = ContactSubmission),
        (status = 400, description = "Bad request (invalid reCAPTCHA)"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn submit_contact(
    State(db): State<Arc<Db>>,
    Json(request): Json<CreateContactRequest>,
) -> ApiResponse<ContactSubmission> {
    // Verify reCAPTCHA if token provided
    let recaptcha_score: Option<f32> = None;
    if let Some(token) = request.recaptcha_token {
        // TODO: Implement reCAPTCHA verification
        // For now, we'll just log that we received a token
        tracing::info!("reCAPTCHA token received: {}", token);
        // In production, verify with Google's API
    }

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
            (StatusCode::INTERNAL_SERVER_ERROR, Json(Some(format!("Failed to serialize submission: {}", e))))
        })?))
        .await?;

    let created_submission: Option<ContactSubmission> = result.take(0).ok().flatten();
    
    // TODO: Send email notification
    // TODO: Send Google Chat webhook notification

    match created_submission {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(Some("Failed to create submission".to_string())))),
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
pub async fn list_submissions(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Query(filters): Query<ContactFilter>,
) -> ApiResponse<ListContactResponse> {
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query
    let query = format!(
        "SELECT * FROM contact_submissions{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await?;
    let submissions: Vec<ContactSubmission> = result.take(0)?;

    // Get total count
    let count_query = format!(
        "SELECT count() FROM contact_submissions{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await?;
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
pub async fn get_submission(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<ContactSubmission> {
    let query = "SELECT * FROM contact_submissions WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("contact_submissions", id.as_str()))))
        .await?;
    
    let submission: Option<ContactSubmission> = result.take(0)?;
    
    match submission {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::NOT_FOUND, Json(None::<ContactSubmission>))),
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
    request_body(
        description = "Update submission request",
        content = "application/json"
    ),
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
pub async fn update_submission(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateContactRequest>,
) -> ApiResponse<ContactSubmission> {
    // First check if submission exists
    let query = "SELECT * FROM contact_submissions WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("contact_submissions", id.as_str()))))
        .await?;
    
    let existing: Option<ContactSubmission> = result.take(0)?;
    
    if existing.is_none() {
        return Err((StatusCode::NOT_FOUND, Json(None::<ContactSubmission>)));
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
        return Err((StatusCode::BAD_REQUEST, Json(Some("No fields to update".to_string()))));
    }

    let update_query = format!(
        "UPDATE contact_submissions SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", Thing::from(("contact_submissions", id.as_str()))))
        .await?;

    let updated: Option<ContactSubmission> = update_result.take(0)?;
    
    match updated {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::NOT_FOUND, Json(None::<ContactSubmission>))),
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
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn get_contact_stats(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
) -> ApiResponse<ContactStats> {
    // Get total count
    let total_query = "SELECT count() as count FROM contact_submissions";
    let mut total_result = db.query(total_query).await?;
    let total_result: Option<Vec<serde_json::Value>> = total_result.take(0).ok();
    let total = total_result
        .and_then(|r| r.first().and_then(|v| v.get("count").and_then(|c| c.as_u64()).map(|c| c as u32)))
        .unwrap_or(0);

    // Get counts by status
    let status_query = "SELECT status, count() as count FROM contact_submissions GROUP BY status";
    let mut status_result = db.query(status_query).await?;
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
    let mut service_result = db.query(service_query).await?;
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

/// Register contact routes
pub fn register_routes(router: axum::Router) -> axum::Router {
    router
        .route("/api/v1/contact", axum::routing::post(submit_contact))
        .route("/api/v1/contact/submissions", axum::routing::get(list_submissions))
        .route("/api/v1/contact/submissions/:id", axum::routing::get(get_submission))
        .route("/api/v1/contact/submissions/:id", axum::routing::put(update_submission))
        .route("/api/v1/contact/stats", axum::routing::get(get_contact_stats))
}