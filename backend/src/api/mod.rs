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

use axum::Router;
use utoipa::OpenApi;
use utoipa_scalar::{Scalar, Servable as ScalarServable};

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
    // Generate OpenAPI schema
    let openapi = ApiDoc::openapi();
    
    // Add Scalar UI for API documentation
    router.merge(Scalar::with_url("/scalar", openapi))
}