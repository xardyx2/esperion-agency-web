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
        description = "API for Esperion Digital Agency - Company Profile & Dashboard CMS",
        version = "1.0.0",
        contact(
            name = "Esperion Support",
            email = "support@esperion.com"
        )
    ),
    tags(
        (name = "Geo", description = "IP-based geolocation endpoints"),
        (name = "Auth", description = "Authentication endpoints"),
        (name = "Articles", description = "Article management endpoints"),
        (name = "Works", description = "Portfolio management endpoints"),
        (name = "Services", description = "Service management endpoints"),
        (name = "Clients", description = "Client management endpoints"),
        (name = "Contact", description = "Contact form endpoints")
    ),
    servers(
        (url = "/api/v1", description = "API v1"),
    )
)]
pub struct ApiDoc;

/// Register OpenAPI documentation routes
pub fn register_openapi(router: Router) -> Router {
    // OpenAPI docs are available at /api-docs/openapi.json
    // Scalar UI has been disabled due to version compatibility issues
    router
}
