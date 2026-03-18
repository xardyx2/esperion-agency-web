/**
 * Email Management Handlers
 * 
 * Provides API endpoints for:
 * - Email settings management
 * - Email template management
 * - Email log/delivery tracking
 * - Email sending with templates
 */

use axum::{
    extract::{Path, Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::models::email_log::EmailLogRecord;
use crate::models::email_settings::EmailSettingsRecord;
use crate::models::email_template::EmailTemplateRecord;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailApi;

// ============== Request/Response Types ==============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailSettingsListResponse {
    pub settings: Vec<EmailSettingsRecord>,
    pub total: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateEmailSettingsRequest {
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
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateEmailSettingsRequest {
    pub provider: Option<String>,
    pub smtp_host: Option<Option<String>>,
    pub smtp_port: Option<Option<u16>>,
    pub smtp_username: Option<Option<String>>,
    pub smtp_password: Option<Option<String>>,
    pub smtp_encryption: Option<Option<String>>,
    pub api_key: Option<Option<String>>,
    pub from_address: Option<String>,
    pub domain: Option<Option<String>>,
    pub region: Option<Option<String>>,
    pub access_key_id: Option<Option<String>>,
    pub secret_access_key: Option<Option<String>>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailTemplateListResponse {
    pub templates: Vec<EmailTemplateRecord>,
    pub total: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateEmailTemplateRequest {
    pub name: String,
    pub slug: String,
    pub subject: String,
    pub body_plain: String,
    pub body_html: Option<String>,
    pub variables: Option<Vec<String>>,
    pub category: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateEmailTemplateRequest {
    pub name: Option<String>,
    pub slug: Option<String>,
    pub subject: Option<String>,
    pub body_plain: Option<String>,
    pub body_html: Option<Option<String>>,
    pub variables: Option<Vec<String>>,
    pub category: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendEmailWithTemplateRequest {
    pub template_slug: String,
    pub to: String,
    pub variables: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendEmailResponse {
    pub success: bool,
    pub message: String,
    pub log_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailLogListResponse {
    pub logs: Vec<EmailLogRecord>,
    pub total: u64,
    pub stats: Option<EmailLogStatsResponse>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailLogStatsResponse {
    pub total: u64,
    pub sent: u64,
    pub delivered: u64,
    pub failed: u64,
    pub bounced: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetEmailLogQuery {
    pub status: Option<String>,
    pub limit: Option<u32>,
}

// ============== Email Settings Handlers ==============

/// GET /api/v1/email/settings
/// List all email settings
#[utoipa::path(
    get,
    path = "/api/v1/email/settings",
    tag = "Email",
    responses(
        (status = 200, description = "List of email settings", body = EmailSettingsListResponse),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_email_settings(
    State(app_state): State<crate::AppState>,
) -> ApiResponse<EmailSettingsListResponse> {
    use surrealdb::engine::remote::ws::Client;
    use surrealdb::Surreal;
    
    let db = &app_state.db;
    
    let mut result = db
        .query("SELECT * FROM email_settings ORDER BY created_at DESC")
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query email settings: {}", e)))?;
    
    let settings: Vec<EmailSettingsRecord> = result
        .take(0)
        .map_err(|e| crate::api::internal_error(format!("Failed to parse email settings: {}", e)))?;
    
    let total = settings.len() as u64;
    
    Ok(Json(EmailSettingsListResponse { settings, total }))
}

/// POST /api/v1/email/settings
/// Create new email settings
#[utoipa::path(
    post,
    path = "/api/v1/email/settings",
    tag = "Email",
    request_body = CreateEmailSettingsRequest,
    responses(
        (status = 201, description = "Settings created successfully", body = EmailSettingsRecord),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn create_email_settings(
    State(app_state): State<crate::AppState>,
    Json(request): Json<CreateEmailSettingsRequest>,
) -> ApiResponse<EmailSettingsRecord> {
    let db = &app_state.db;
    
    // Validate provider
    let valid_providers = ["smtp", "sendgrid", "mailgun", "ses", "postmark", "smtp2go"];
    if !valid_providers.contains(&request.provider.as_str()) {
        return Err(crate::api::bad_request(format!(
            "Invalid provider. Must be one of: {:?}",
            valid_providers
        )));
    }
    
    let settings = EmailSettingsRecord {
        id: None,
        provider: request.provider,
        smtp_host: request.smtp_host,
        smtp_port: request.smtp_port,
        smtp_username: request.smtp_username,
        smtp_password: request.smtp_password,
        smtp_encryption: request.smtp_encryption,
        api_key: request.api_key,
        from_address: request.from_address,
        domain: request.domain,
        region: request.region,
        access_key_id: request.access_key_id,
        secret_access_key: request.secret_access_key,
        is_active: request.is_active.unwrap_or(true),
        created_at: None,
        updated_at: None,
    };
    
    settings
        .save(db)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to save settings: {}", e)))
        .map(Json)
}

/// PUT /api/v1/email/settings/:id
/// Update email settings
#[utoipa::path(
    put,
    path = "/api/v1/email/settings/{id}",
    tag = "Email",
    params(("id" = String, description = "Settings ID")),
    request_body = UpdateEmailSettingsRequest,
    responses(
        (status = 200, description = "Settings updated successfully", body = EmailSettingsRecord),
        (status = 400, description = "Bad request"),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn update_email_settings(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Json(request): Json<UpdateEmailSettingsRequest>,
) -> ApiResponse<EmailSettingsRecord> {
    use surrealdb::types::RecordId;
    use surrealdb::sql::thing;
    
    let db = &app_state.db;
    
    // Parse ID as RecordId
    let record_id = thing(&format!("email_settings:{}", id))
        .map_err(|_| crate::api::bad_request("Invalid settings ID"))?;
    
    // Get existing settings
    let mut query = db
        .query("SELECT * FROM email_settings WHERE id = $id LIMIT 1")
        .bind(("id", record_id.clone()))
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query settings: {}", e)))?;
    
    let mut existing: Option<EmailSettingsRecord> = query
        .take(0)
        .map_err(|e| crate::api::internal_error(format!("Failed to parse settings: {}", e)))?;
    
    let mut settings = existing
        .take()
        .ok_or_else(|| crate::api::not_found("Email settings not found"))?;
    
    // Update fields if provided
    if let Some(provider) = request.provider {
        settings.provider = provider;
    }
    if let Some(smtp_host) = request.smtp_host {
        settings.smtp_host = smtp_host;
    }
    if let Some(smtp_port) = request.smtp_port {
        settings.smtp_port = smtp_port;
    }
    if let Some(smtp_username) = request.smtp_username {
        settings.smtp_username = smtp_username;
    }
    if let Some(smtp_password) = request.smtp_password {
        settings.smtp_password = smtp_password;
    }
    if let Some(smtp_encryption) = request.smtp_encryption {
        settings.smtp_encryption = smtp_encryption;
    }
    if let Some(api_key) = request.api_key {
        settings.api_key = api_key;
    }
    if let Some(from_address) = request.from_address {
        settings.from_address = from_address;
    }
    if let Some(domain) = request.domain {
        settings.domain = domain;
    }
    if let Some(region) = request.region {
        settings.region = region;
    }
    if let Some(access_key_id) = request.access_key_id {
        settings.access_key_id = access_key_id;
    }
    if let Some(secret_access_key) = request.secret_access_key {
        settings.secret_access_key = secret_access_key;
    }
    if let Some(is_active) = request.is_active {
        settings.is_active = is_active;
    }
    
    settings
        .update(db)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to update settings: {}", e)))
        .map(Json)
}

/// DELETE /api/v1/email/settings/:id
/// Delete email settings
#[utoipa::path(
    delete,
    path = "/api/v1/email/settings/{id}",
    tag = "Email",
    params(("id" = String, description = "Settings ID")),
    responses(
        (status = 204, description = "Settings deleted successfully"),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn delete_email_settings(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<()> {
    use surrealdb::types::RecordId;
    use surrealdb::sql::thing;
    
    let db = &app_state.db;
    let record_id = thing(&format!("email_settings:{}", id))
        .map_err(|_| crate::api::bad_request("Invalid settings ID"))?;
    
    EmailSettingsRecord::delete(db, &record_id)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to delete settings: {}", e)))?;
    
    Ok(Json(()))
}

// ============== Email Template Handlers ==============

/// GET /api/v1/email/templates
/// List all email templates
#[utoipa::path(
    get,
    path = "/api/v1/email/templates",
    tag = "Email",
    responses(
        (status = 200, description = "List of email templates", body = EmailTemplateListResponse),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_email_templates(
    State(app_state): State<crate::AppState>,
) -> ApiResponse<EmailTemplateListResponse> {
    let db = &app_state.db;
    
    EmailTemplateRecord::get_all(db)
        .await
        .map(|templates| {
            let total = templates.len() as u64;
            Json(EmailTemplateListResponse { templates, total })
        })
        .map_err(|e| crate::api::internal_error(format!("Failed to query templates: {}", e)))
}

/// GET /api/v1/email/templates/:slug
/// Get email template by slug
#[utoipa::path(
    get,
    path = "/api/v1/email/templates/{slug}",
    tag = "Email",
    params(("slug" = String, description = "Template slug")),
    responses(
        (status = 200, description = "Template details", body = EmailTemplateRecord),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_email_template(
    State(app_state): State<crate::AppState>,
    Path(slug): Path<String>,
) -> ApiResponse<EmailTemplateRecord> {
    let db = &app_state.db;
    
    EmailTemplateRecord::get_by_slug(db, &slug)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query template: {}", e)))?
        .ok_or_else(|| crate::api::not_found("Template not found"))
        .map(Json)
}

/// POST /api/v1/email/templates
/// Create new email template
#[utoipa::path(
    post,
    path = "/api/v1/email/templates",
    tag = "Email",
    request_body = CreateEmailTemplateRequest,
    responses(
        (status = 201, description = "Template created successfully", body = EmailTemplateRecord),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn create_email_template(
    State(app_state): State<crate::AppState>,
    Json(request): Json<CreateEmailTemplateRequest>,
) -> ApiResponse<EmailTemplateRecord> {
    let db = &app_state.db;
    
    let mut template = EmailTemplateRecord::new(
        request.name,
        request.slug,
        request.subject,
        request.body_plain,
        request.category.unwrap_or_else(|| "general".to_string()),
    );
    
    if let Some(body_html) = request.body_html {
        template = template.with_html_body(body_html);
    }
    
    if let Some(variables) = request.variables {
        template = template.with_variables(variables);
    }
    
    template
        .save(db)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to save template: {}", e)))
        .map(Json)
}

/// PUT /api/v1/email/templates/:id
/// Update email template
#[utoipa::path(
    put,
    path = "/api/v1/email/templates/{id}",
    tag = "Email",
    params(("id" = String, description = "Template ID")),
    request_body = UpdateEmailTemplateRequest,
    responses(
        (status = 200, description = "Template updated successfully", body = EmailTemplateRecord),
        (status = 400, description = "Bad request"),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn update_email_template(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Json(request): Json<UpdateEmailTemplateRequest>,
) -> ApiResponse<EmailTemplateRecord> {
    use surrealdb::sql::thing;
    
    let db = &app_state.db;
    let record_id = thing(&format!("email_templates:{}", id))
        .map_err(|_| crate::api::bad_request("Invalid template ID"))?;
    
    // Get existing template
    let mut query = db
        .query("SELECT * FROM email_templates WHERE id = $id LIMIT 1")
        .bind(("id", record_id.clone()))
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query template: {}", e)))?;
    
    let mut existing: Option<EmailTemplateRecord> = query
        .take(0)
        .map_err(|e| crate::api::internal_error(format!("Failed to parse template: {}", e)))?;
    
    let mut template = existing
        .take()
        .ok_or_else(|| crate::api::not_found("Template not found"))?;
    
    // Update fields if provided
    if let Some(name) = request.name {
        template.name = name;
    }
    if let Some(slug) = request.slug {
        template.slug = slug;
    }
    if let Some(subject) = request.subject {
        template.subject = subject;
    }
    if let Some(body_plain) = request.body_plain {
        template.body_plain = body_plain;
    }
    if let Some(body_html) = request.body_html {
        template.body_html = body_html;
    }
    if let Some(variables) = request.variables {
        template.variables = variables;
    }
    if let Some(category) = request.category {
        template.category = category;
    }
    if let Some(is_active) = request.is_active {
        template.is_active = is_active;
    }
    
    template
        .update(db)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to update template: {}", e)))
        .map(Json)
}

/// DELETE /api/v1/email/templates/:id
/// Delete email template
#[utoipa::path(
    delete,
    path = "/api/v1/email/templates/{id}",
    tag = "Email",
    params(("id" = String, description = "Template ID")),
    responses(
        (status = 204, description = "Template deleted successfully"),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn delete_email_template(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<()> {
    use surrealdb::sql::thing;
    
    let db = &app_state.db;
    let record_id = thing(&format!("email_templates:{}", id))
        .map_err(|_| crate::api::bad_request("Invalid template ID"))?;
    
    EmailTemplateRecord::delete(db, &record_id)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to delete template: {}", e)))?;
    
    Ok(Json(()))
}

// ============== Email Log Handlers ==============

/// GET /api/v1/email/logs
/// List email logs with optional filtering
#[utoipa::path(
    get,
    path = "/api/v1/email/logs",
    tag = "Email",
    params(GetEmailLogQuery),
    responses(
        (status = 200, description = "List of email logs", body = EmailLogListResponse),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_email_logs(
    State(app_state): State<crate::AppState>,
    Query(query): Query<GetEmailLogQuery>,
) -> ApiResponse<EmailLogListResponse> {
    let db = &app_state.db;
    let limit = query.limit.unwrap_or(50);
    
    let logs = if let Some(status) = query.status {
        EmailLogRecord::get_by_status(db, &status, limit)
            .await
            .map_err(|e| crate::api::internal_error(format!("Failed to query logs: {}", e)))?
    } else {
        EmailLogRecord::get_recent(db, limit)
            .await
            .map_err(|e| crate::api::internal_error(format!("Failed to query logs: {}", e)))?
    };
    
    let total = logs.len() as u64;
    
    // Get stats
    let stats = EmailLogRecord::get_stats(db)
        .await
        .map(|s| EmailLogStatsResponse {
            total: s.total,
            sent: s.sent,
            delivered: s.delivered,
            failed: s.failed,
            bounced: s.bounced,
        })
        .ok();
    
    Ok(Json(EmailLogListResponse { logs, total, stats }))
}

/// GET /api/v1/email/logs/:id
/// Get email log by ID
#[utoipa::path(
    get,
    path = "/api/v1/email/logs/{id}",
    tag = "Email",
    params(("id" = String, description = "Log ID")),
    responses(
        (status = 200, description = "Log details", body = EmailLogRecord),
        (status = 404, description = "Not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_email_log(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<EmailLogRecord> {
    use surrealdb::sql::thing;
    
    let db = &app_state.db;
    let record_id = thing(&format!("email_logs:{}", id))
        .map_err(|_| crate::api::bad_request("Invalid log ID"))?;
    
    let mut query = db
        .query("SELECT * FROM email_logs WHERE id = $id LIMIT 1")
        .bind(("id", record_id))
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query log: {}", e)))?;
    
    let log: Option<EmailLogRecord> = query
        .take(0)
        .map_err(|e| crate::api::internal_error(format!("Failed to parse log: {}", e)))?;
    
    log.ok_or_else(|| crate::api::not_found("Email log not found"))
        .map(Json)
}

// ============== Email Sending with Templates ==============

/// POST /api/v1/email/send-with-template
/// Send email using a template
#[utoipa::path(
    post,
    path = "/api/v1/email/send-with-template",
    tag = "Email",
    request_body = SendEmailWithTemplateRequest,
    responses(
        (status = 200, description = "Email sent successfully", body = SendEmailResponse),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn send_email_with_template(
    State(app_state): State<crate::AppState>,
    Json(request): Json<SendEmailWithTemplateRequest>,
) -> ApiResponse<SendEmailResponse> {
    let db = &app_state.db;
    
    // Get template
    let template = EmailTemplateRecord::get_by_slug(db, &request.template_slug)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query template: {}", e)))?
        .ok_or_else(|| crate::api::bad_request("Template not found"))?;
    
    // Render template
    let rendered = template
        .render(&request.variables)
        .map_err(|e| crate::api::bad_request(format!("Template render error: {}", e)))?;
    
    // Get active email settings
    let settings = EmailSettingsRecord::get_active(db)
        .await
        .map_err(|e| crate::api::internal_error(format!("Failed to query settings: {}", e)))?
        .ok_or_else(|| crate::api::internal_error("No email provider configured"))?;
    
    // Create email service
    let email_settings = crate::models::email::EmailSettings {
        provider: settings.provider,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_username: settings.smtp_username,
        smtp_password: settings.smtp_password,
        smtp_encryption: settings.smtp_encryption,
        api_key: settings.api_key,
        from_address: settings.from_address,
        domain: settings.domain,
        region: settings.region,
        access_key_id: settings.access_key_id,
        secret_access_key: settings.secret_access_key,
    };
    
    let email_service = crate::services::email::EmailService::new(&email_settings)
        .map_err(|e| crate::api::internal_error(format!("Failed to create email service: {}", e)))?;
    
    // Create email message
    let message = crate::models::email::EmailMessage::new(
        request.to,
        rendered.subject,
        rendered.body_plain,
    )
    .with_html_body(rendered.body_html)
    .with_from(Some(email_settings.from_address.clone()));
    
    // Create log entry
    let mut log = EmailLogRecord::new(
        message.to.clone(),
        message.from.clone().unwrap_or_default(),
        message.subject.clone(),
        settings.provider.clone(),
    );
    
    if let Some(id) = &template.id {
        log.template_id = Some(id.clone());
        log.template_name = Some(template.name.clone());
    }
    
    // Send email
    match email_service.send(message).await {
        Ok(_) => {
            log.mark_sent(None);
            log.save(db)
                .await
                .map_err(|e| crate::api::internal_error(format!("Failed to save log: {}", e)))?;
            
            let log_id = log.id.map(|id| id.to_string());
            
            Ok(Json(SendEmailResponse {
                success: true,
                message: "Email sent successfully".to_string(),
                log_id,
            }))
        }
        Err(e) => {
            log.mark_failed(e.to_string(), None);
            log.save(db)
                .await
                .map_err(|e| crate::api::internal_error(format!("Failed to save log: {}", e)))?;
            
            Err(crate::api::internal_error(format!("Failed to send email: {}", e)))
        }
    }
}

// ============== Route Registration ==============

/// Register email routes
pub fn register_routes(router: axum::Router<crate::AppState>) -> axum::Router<crate::AppState> {
    use axum::routing::{delete, get, post, put};
    
    // Settings routes
    router
        .route("/api/v1/email/settings", get(list_email_settings))
        .route("/api/v1/email/settings", post(create_email_settings))
        .route(
            "/api/v1/email/settings/:id",
            put(update_email_settings).delete(delete_email_settings),
        )
        // Template routes
        .route("/api/v1/email/templates", get(list_email_templates))
        .route("/api/v1/email/templates", post(create_email_template))
        .route(
            "/api/v1/email/templates/:slug",
            get(get_email_template),
        )
        .route(
            "/api/v1/email/templates/:id",
            put(update_email_template).delete(delete_email_template),
        )
        // Log routes
        .route("/api/v1/email/logs", get(list_email_logs))
        .route("/api/v1/email/logs/:id", get(get_email_log))
        // Send email routes
        .route(
            "/api/v1/email/send-with-template",
            post(send_email_with_template),
        )
}
