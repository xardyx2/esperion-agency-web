/**
 * API Module
 *
 * Contains OpenAPI documentation configuration using utoipa.
 *
 * Features:
 * - OpenAPI schema generation
 * - Scalar API documentation UI
 * - API versioning
 */
use axum::{http::StatusCode, response::Json, Router};
use serde::Serialize;
use utoipa::OpenApi;

/// API Response type alias for handlers
/// Returns Result<Json<T>, ApiError>
pub type ApiResponse<T> = Result<Json<T>, ApiError>;

/// Helper function to convert error to ApiResponse error
pub fn api_error<E: std::fmt::Display>(err: E) -> ApiError {
    ApiError {
        status: StatusCode::INTERNAL_SERVER_ERROR,
        message: Some(err.to_string()),
    }
}

/// Helper function for internal server error
pub fn internal_error<E: std::fmt::Display>(err: E) -> ApiError {
    ApiError {
        status: StatusCode::INTERNAL_SERVER_ERROR,
        message: Some(err.to_string()),
    }
}

/// Helper function for not found error
pub fn not_found_error(msg: &str) -> ApiError {
    ApiError {
        status: StatusCode::NOT_FOUND,
        message: Some(msg.to_string()),
    }
}

/// Helper function for bad request error
pub fn bad_request_error(msg: &str) -> ApiError {
    ApiError {
        status: StatusCode::BAD_REQUEST,
        message: Some(msg.to_string()),
    }
}

/// API Error type that implements IntoResponse
#[derive(Debug)]
pub struct ApiError {
    pub status: StatusCode,
    pub message: Option<String>,
}

impl axum::response::IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let body = self.message.unwrap_or_else(|| self.status.to_string());
        (self.status, body).into_response()
    }
}

impl From<StatusCode> for ApiError {
    fn from(status: StatusCode) -> Self {
        ApiError {
            status,
            message: Some(status.to_string()),
        }
    }
}

impl From<surrealdb::Error> for ApiError {
    fn from(_err: surrealdb::Error) -> Self {
        ApiError {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: Some("Database error".to_string()),
        }
    }
}

/// OpenAPI documentation configuration
#[derive(OpenApi)]
#[openapi(
    info(
        title = "Esperion API",
        description = "API for Esperion Digital Agency - Company Profile & Dashboard CMS\n\n## Authentication\nMost endpoints require JWT authentication. Include the `Authorization: Bearer <token>` header.\n\n## Rate Limiting\nAll endpoints are rate-limited. Check the `X-RateLimit-Remaining` header for quota.",
        version = "1.0.0",
        contact(
            name = "Esperion Support",
            email = "support@esperion.com"
        )
    ),
    tags(
        (name = "Geo", description = "IP-based geolocation endpoints"),
        (name = "Auth", description = "Authentication endpoints - register, login, logout, refresh"),
        (name = "Articles", description = "Article management endpoints with multi-language support"),
        (name = "Works", description = "Portfolio management endpoints"),
        (name = "Services", description = "Service management endpoints"),
        (name = "Clients", description = "Client management endpoints"),
        (name = "Contact", description = "Contact form endpoints with reCAPTCHA"),
        (name = "Media", description = "Media library endpoints"),
        (name = "User Management", description = "Administrative user management endpoints"),
        (name = "SEO", description = "SEO scoring endpoints"),
        (name = "Translation", description = "AI-powered translation endpoints"),
        (name = "Email", description = "Email notification endpoints"),
        (name = "Monitoring", description = "Monitoring settings, status, and alert routing"),
        (name = "Analytics", description = "Analytics integrations, tracking, and reporting"),
        (name = "Backups", description = "Backup policy, history, and restore workflow")
    ),
    servers(
        (url = "/api/v1", description = "API v1"),
    ),
    paths(
        crate::handlers::auth::register,
        crate::handlers::auth::login,
        crate::handlers::auth::logout,
        crate::handlers::auth::refresh_token,
        crate::handlers::auth::get_current_user,
        crate::handlers::auth::get_sessions,
        crate::handlers::auth::force_logout_session,
        crate::handlers::articles::list_articles,
        crate::handlers::articles::get_article,
        crate::handlers::articles::get_article_by_slug,
        crate::handlers::articles::get_article_translations,
        crate::handlers::articles::create_article,
        crate::handlers::articles::update_article,
        crate::handlers::articles::update_translation_status,
        crate::handlers::articles::delete_article,
        crate::handlers::works::list_works,
        crate::handlers::works::list_featured_works,
        crate::handlers::works::get_work,
        crate::handlers::works::create_work,
        crate::handlers::works::update_work,
        crate::handlers::works::delete_work,
        crate::handlers::services::list_services,
        crate::handlers::services::get_service,
        crate::handlers::services::create_service,
        crate::handlers::services::update_service,
        crate::handlers::services::delete_service,
        crate::handlers::clients::list_clients,
        crate::handlers::clients::get_client,
        crate::handlers::clients::create_client,
        crate::handlers::clients::update_client,
        crate::handlers::clients::delete_client,
        crate::handlers::clients::get_client_stats,
        crate::handlers::clients::get_client_logos,
        crate::handlers::contact::submit_contact,
        crate::handlers::contact::list_submissions,
        crate::handlers::contact::get_submission,
        crate::handlers::contact::update_submission,
        crate::handlers::contact::get_contact_stats,
        crate::handlers::media::list_media,
        crate::handlers::media::get_media,
        crate::handlers::media::upload_media,
        crate::handlers::media::update_media,
        crate::handlers::media::delete_media,
        crate::handlers::media::get_media_stats,
        crate::handlers::user_management::list_users,
        crate::handlers::user_management::get_user,
        crate::handlers::user_management::create_user,
        crate::handlers::user_management::update_user,
        crate::handlers::user_management::delete_user,
        crate::handlers::user_management::list_roles,
        crate::handlers::user_management::list_activity_logs,
        crate::handlers::seo_score::calculate_seo,
        crate::handlers::seo_score::get_seo_score,
        crate::handlers::seo_score::get_competitor_analysis,
        crate::handlers::translation::translate_article,
        crate::handlers::email::send_contact_notification,
        crate::handlers::email::send_email,
        crate::handlers::monitoring::get_settings,
        crate::handlers::monitoring::update_settings,
        crate::handlers::monitoring::get_status,
        crate::handlers::monitoring::list_alerts,
        crate::handlers::monitoring::send_test_alert,
        crate::handlers::analytics::get_settings,
        crate::handlers::analytics::update_settings,
        crate::handlers::analytics::get_public_config,
        crate::handlers::analytics::track_event,
        crate::handlers::analytics::get_report,
        crate::handlers::backup::get_settings,
        crate::handlers::backup::update_settings,
        crate::handlers::backup::list_history,
        crate::handlers::backup::create_backup,
        crate::handlers::backup::restore_backup,
        crate::handlers::geo::get_geo_info,
        crate::handlers::health::health_check,
    ),
    components(
        schemas(
            crate::handlers::auth::RegisterRequest,
            crate::handlers::auth::LoginRequest,
            crate::handlers::auth::LogoutRequest,
            crate::handlers::auth::RefreshRequest,
            crate::handlers::auth::AuthResponse,
            crate::handlers::auth::UserResponse,
            crate::handlers::auth::Session,
            crate::handlers::auth::ListSessionsResponse,
            crate::handlers::articles::ArticleResponse,
            crate::handlers::articles::ArticleTranslationsResponse,
            crate::handlers::articles::TranslationStatusRequest,
            crate::handlers::user_management::ManagedUser,
            crate::handlers::user_management::UserListResponse,
            crate::handlers::user_management::CreateManagedUserRequest,
            crate::handlers::user_management::UpdateManagedUserRequest,
            crate::handlers::user_management::FixedRoleCatalogEntry,
            crate::handlers::user_management::FixedRoleCatalogResponse,
            crate::handlers::user_management::ActivityLogItem,
            crate::handlers::user_management::ActivityLogListResponse,
            crate::models::monitoring::MonitoringSettings,
            crate::models::monitoring::MonitoringIntegrations,
            crate::models::monitoring::MonitoringIntegration,
            crate::models::monitoring::MonitoredService,
            crate::models::monitoring::MonitoringThreshold,
            crate::models::monitoring::AlertDestination,
            crate::models::monitoring::MonitoringStatusResponse,
            crate::models::monitoring::MonitoringServiceStatus,
            crate::models::monitoring::AlertListResponse,
            crate::models::monitoring::AlertInstanceItem,
            crate::models::monitoring::SendTestAlertRequest,
            crate::models::monitoring::SendTestAlertResponse,
            crate::models::analytics::AnalyticsIntegrationSettings,
            crate::models::analytics::FunnelStep,
            crate::models::analytics::AnalyticsFunnel,
            crate::models::analytics::AnalyticsSettings,
            crate::models::analytics::PublicAnalyticsConfig,
            crate::models::analytics::TrackEventRequest,
            crate::models::analytics::TrackEventResponse,
            crate::models::analytics::AnalyticsOverview,
            crate::models::analytics::FunnelStepMetric,
            crate::models::analytics::FunnelReport,
            crate::models::analytics::AnalyticsReportResponse,
            crate::models::backup::BackupSettings,
            crate::models::backup::CreateBackupRequest,
            crate::models::backup::BackupJob,
            crate::models::backup::BackupHistoryResponse,
            crate::models::backup::RestoreBackupRequest,
            crate::models::backup::RestoreBackupResponse,
        )
    )
)]
pub struct ApiDoc;

/// Register OpenAPI documentation routes
pub fn register_openapi<S>(router: Router<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    use axum::routing::get;
    
    // OpenAPI spec available at /api/v1/openapi.json
    // Use any OpenAPI viewer (Swagger UI, Scalar, etc.) to view the spec
    router
        .route("/api/v1/openapi.json", get(|| async { 
            axum::Json(ApiDoc::openapi()) 
        }))
}
