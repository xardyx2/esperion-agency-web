use axum::{extract::State, response::Json, Extension};

use crate::api::{ApiError, ApiResponse};
use crate::models::analytics::{
    AnalyticsReportResponse, AnalyticsSettings, ConsentPreferences, ConsentSavedResponse,
    PublicAnalyticsConfig, TrackEventRequest, TrackEventResponse,
};
use crate::models::user::UserClaims;
use crate::services::analytics::AnalyticsService;

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

fn validate_consent_preferences(preferences: &ConsentPreferences) -> Result<(), String> {
    // Validate version format
    if preferences.version.is_empty() {
        return Err("Consent version is required".to_string());
    }
    
    // Validate timestamp
    if preferences.timestamp.is_empty() {
        return Err("Consent timestamp is required".to_string());
    }
    
    // Essential tier must always be true
    if !preferences.tiers.essential {
        return Err("Essential tier must be enabled".to_string());
    }
    
    Ok(())
}

/// GET /api/v1/analytics/settings
#[utoipa::path(
    get,
    path = "/api/v1/analytics/settings",
    tag = "Analytics",
    responses(
        (status = 200, description = "Analytics settings", body = AnalyticsSettings),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_settings(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<AnalyticsSettings> {
    ensure_admin(&claims)?;
    let service = AnalyticsService::new();
    let settings = service
        .get_settings(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(settings))
}

/// PUT /api/v1/analytics/settings
#[utoipa::path(
    put,
    path = "/api/v1/analytics/settings",
    tag = "Analytics",
    request_body = AnalyticsSettings,
    responses(
        (status = 200, description = "Analytics settings updated", body = AnalyticsSettings),
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
    Json(payload): Json<AnalyticsSettings>,
) -> ApiResponse<AnalyticsSettings> {
    ensure_admin(&claims)?;
    let service = AnalyticsService::new();
    let settings = service
        .update_settings(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(settings))
}

/// GET /api/v1/analytics/public-config
/// 
/// NOW SUPPORTS: Consent-aware configuration filtering
#[utoipa::path(
    get,
    path = "/api/v1/analytics/public-config",
    tag = "Analytics",
    params(
        ("X-Consent-Preferences" = Option<String>, Header, 
         description = "Base64-encoded consent preferences JSON"),
    ),
    responses(
        (status = 200, description = "Public analytics config filtered by consent", 
         body = PublicAnalyticsConfig),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_public_config(
    State(app_state): State<crate::AppState>,
    headers: axum::http::HeaderMap,
) -> ApiResponse<PublicAnalyticsConfig> {
    let service = AnalyticsService::new();
    
    // Parse consent from header
    let consent_header = headers
        .get("X-Consent-Preferences")
        .and_then(|value| value.to_str().ok());
    
    let user_consent = service.parse_consent_from_request(consent_header, None);
    
    let config = service
        .get_public_config_with_consent(&app_state.db, user_consent)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(config))
}

/// NEW ENDPOINT: POST /api/v1/analytics/consent
/// 
/// Endpoint untuk frontend menyimpan consent preferences ke backend
/// (optional - bisa juga disimpan di localStorage saja)
#[utoipa::path(
    post,
    path = "/api/v1/analytics/consent",
    tag = "Analytics",
    request_body = ConsentPreferences,
    responses(
        (status = 200, description = "Consent preferences saved", body = ConsentSavedResponse),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn save_consent_preferences(
    State(app_state): State<crate::AppState>,
    Json(preferences): Json<ConsentPreferences>,
) -> ApiResponse<ConsentSavedResponse> {
    let service = AnalyticsService::new();
    
    // Validate consent preferences
    validate_consent_preferences(&preferences)
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    
    // Persist to database (optional - for audit trail)
    service
        .save_consent_audit(&app_state.db, &preferences)
        .await
        .map_err(crate::api::internal_error)?;
    
    // Get effective config
    let effective_config = service
        .get_public_config_with_consent(&app_state.db, Some(preferences.clone()))
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(ConsentSavedResponse {
        success: true,
        message: "Consent preferences saved".to_string(),
        effective_config,
    }))
}

/// POST /api/v1/analytics/track
#[utoipa::path(
    post,
    path = "/api/v1/analytics/track",
    tag = "Analytics",
    request_body = TrackEventRequest,
    responses(
        (status = 200, description = "Track event accepted", body = TrackEventResponse),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn track_event(
    State(app_state): State<crate::AppState>,
    Json(payload): Json<TrackEventRequest>,
) -> ApiResponse<TrackEventResponse> {
    let service = AnalyticsService::new();
    service
        .track_event(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    Ok(Json(TrackEventResponse {
        success: true,
        message: "Event tracked".to_string(),
    }))
}

/// GET /api/v1/analytics/report
#[utoipa::path(
    get,
    path = "/api/v1/analytics/report",
    tag = "Analytics",
    responses(
        (status = 200, description = "Analytics reporting data", body = AnalyticsReportResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_report(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<AnalyticsReportResponse> {
    ensure_editor(&claims)?;
    let service = AnalyticsService::new();
    let report = service
        .get_report(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    Ok(Json(report))
}
