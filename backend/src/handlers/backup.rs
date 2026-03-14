use axum::{
    extract::{Query, State},
    response::Json,
    Extension,
};
use serde::Deserialize;

use crate::api::{ApiError, ApiResponse};
use crate::models::backup::{
    BackupHistoryResponse, BackupJob, BackupSettings, CreateBackupRequest, RestoreBackupRequest,
    RestoreBackupResponse,
};
use crate::models::user::UserClaims;
use crate::services::backup::BackupService;

#[derive(Debug, Deserialize)]
pub struct BackupQuery {
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

fn forbidden_error(message: &str) -> ApiError {
    ApiError {
        status: axum::http::StatusCode::FORBIDDEN,
        message: Some(message.to_string()),
    }
}

fn ensure_admin(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_manage_users() {
        Ok(())
    } else {
        Err(forbidden_error("Admin access required"))
    }
}

/// GET /api/v1/backups/settings
#[utoipa::path(
    get,
    path = "/api/v1/backups/settings",
    tag = "Backups",
    responses(
        (status = 200, description = "Backup settings", body = BackupSettings),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_settings(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<BackupSettings> {
    ensure_admin(&claims)?;

    let service = BackupService::new();
    let settings = service
        .get_settings(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(settings))
}

/// PUT /api/v1/backups/settings
#[utoipa::path(
    put,
    path = "/api/v1/backups/settings",
    tag = "Backups",
    request_body = BackupSettings,
    responses(
        (status = 200, description = "Backup settings updated", body = BackupSettings),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn update_settings(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<BackupSettings>,
) -> ApiResponse<BackupSettings> {
    ensure_admin(&claims)?;

    let service = BackupService::new();
    let settings = service
        .update_settings(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(settings))
}

/// GET /api/v1/backups/history
#[utoipa::path(
    get,
    path = "/api/v1/backups/history",
    tag = "Backups",
    params(
        ("limit" = Option<u32>, Query, description = "Maximum rows"),
        ("offset" = Option<u32>, Query, description = "Pagination offset")
    ),
    responses(
        (status = 200, description = "Backup history", body = BackupHistoryResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn list_history(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Query(query): Query<BackupQuery>,
) -> ApiResponse<BackupHistoryResponse> {
    ensure_admin(&claims)?;

    let service = BackupService::new();
    let history = service
        .list_backups(
            &app_state.db,
            query.limit.unwrap_or(25).clamp(1, 100),
            query.offset.unwrap_or(0),
        )
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(history))
}

/// POST /api/v1/backups/create
#[utoipa::path(
    post,
    path = "/api/v1/backups/create",
    tag = "Backups",
    request_body = CreateBackupRequest,
    responses(
        (status = 200, description = "Backup created", body = BackupJob),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn create_backup(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<CreateBackupRequest>,
) -> ApiResponse<BackupJob> {
    ensure_admin(&claims)?;

    let service = BackupService::new();
    let job = service
        .create_backup(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(job))
}

/// POST /api/v1/backups/restore
#[utoipa::path(
    post,
    path = "/api/v1/backups/restore",
    tag = "Backups",
    request_body = RestoreBackupRequest,
    responses(
        (status = 200, description = "Restore completed", body = RestoreBackupResponse),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn restore_backup(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<RestoreBackupRequest>,
) -> ApiResponse<RestoreBackupResponse> {
    ensure_admin(&claims)?;

    let service = BackupService::new();
    let response = service
        .restore_backup(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(response))
}
