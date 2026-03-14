use axum::{
    extract::{Query, State},
    response::Json,
    Extension,
};
use serde::Deserialize;

use crate::api::{ApiError, ApiResponse};
use crate::models::monitoring::{
    AlertListResponse, MonitoringSettings, MonitoringStatusResponse, SendTestAlertRequest,
    SendTestAlertResponse,
};
use crate::models::user::UserClaims;
use crate::services::monitoring::MonitoringService;

#[derive(Debug, Deserialize)]
pub struct AlertsQuery {
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

fn forbidden_error(message: &str) -> ApiError {
    ApiError {
        status: axum::http::StatusCode::FORBIDDEN,
        message: Some(message.to_string()),
    }
}

fn ensure_editor(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_edit() {
        Ok(())
    } else {
        Err(forbidden_error("Editor access required"))
    }
}

fn ensure_admin(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_manage_users() {
        Ok(())
    } else {
        Err(forbidden_error("Admin access required"))
    }
}

/// GET /api/v1/monitoring/settings
#[utoipa::path(
    get,
    path = "/api/v1/monitoring/settings",
    tag = "Monitoring",
    responses(
        (status = 200, description = "Monitoring settings", body = MonitoringSettings),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_settings(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<MonitoringSettings> {
    ensure_admin(&claims)?;

    let service = MonitoringService::new();
    let settings = service
        .get_settings(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(settings))
}

/// PUT /api/v1/monitoring/settings
#[utoipa::path(
    put,
    path = "/api/v1/monitoring/settings",
    tag = "Monitoring",
    request_body = MonitoringSettings,
    responses(
        (status = 200, description = "Monitoring settings updated", body = MonitoringSettings),
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
    Json(payload): Json<MonitoringSettings>,
) -> ApiResponse<MonitoringSettings> {
    ensure_admin(&claims)?;

    let service = MonitoringService::new();
    let settings = service
        .update_settings(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(settings))
}

/// GET /api/v1/monitoring/status
#[utoipa::path(
    get,
    path = "/api/v1/monitoring/status",
    tag = "Monitoring",
    responses(
        (status = 200, description = "Monitoring status", body = MonitoringStatusResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_status(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<MonitoringStatusResponse> {
    ensure_editor(&claims)?;

    let service = MonitoringService::new();
    let status = service
        .get_status(&app_state.db, &app_state.email_service)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(status))
}

/// GET /api/v1/monitoring/alerts
#[utoipa::path(
    get,
    path = "/api/v1/monitoring/alerts",
    tag = "Monitoring",
    params(
        ("limit" = Option<u32>, Query, description = "Maximum number of alert rows"),
        ("offset" = Option<u32>, Query, description = "Offset for alert rows")
    ),
    responses(
        (status = 200, description = "Alert list", body = AlertListResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn list_alerts(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Query(query): Query<AlertsQuery>,
) -> ApiResponse<AlertListResponse> {
    ensure_editor(&claims)?;

    let limit = query.limit.unwrap_or(50).clamp(1, 200);
    let offset = query.offset.unwrap_or(0);

    let service = MonitoringService::new();
    let alerts = service
        .list_alerts(&app_state.db, limit, offset)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(alerts))
}

/// POST /api/v1/monitoring/alerts/test
#[utoipa::path(
    post,
    path = "/api/v1/monitoring/alerts/test",
    tag = "Monitoring",
    request_body = SendTestAlertRequest,
    responses(
        (status = 200, description = "Test alert sent", body = SendTestAlertResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn send_test_alert(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<SendTestAlertRequest>,
) -> ApiResponse<SendTestAlertResponse> {
    ensure_admin(&claims)?;

    let service = MonitoringService::new();
    let response = service
        .send_test_alert(&app_state.db, &app_state.email_service, payload.message)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(response))
}
