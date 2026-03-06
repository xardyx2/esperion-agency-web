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

use axum::{Router, response::Json, http::StatusCode};
use utoipa::OpenApi;
use serde::Serialize;

/// API Response type alias for handlers
/// Returns Result<Json<T>, (StatusCode, Option<String>)>
pub type ApiResponse<T> = Result<Json<T>, (StatusCode, Option<String>)>;

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
