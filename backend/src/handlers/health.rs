use axum::{Json, Router, routing::get};
use serde_json::json;
use utoipa::ToSchema;

/// Health check response
#[derive(Debug, serde::Serialize, ToSchema)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: String,
    pub service: String,
}

/// Health check endpoint
#[utoipa::path(
    get,
    path = "/health",
    tag = "Health",
    responses(
        (status = 200, description = "Service is healthy", body = HealthResponse)
    )
)]
pub async fn health_check() -> Json<serde_json::Value> {
    Json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "service": "esperion-backend"
    }))
}

/// Register health routes
pub fn register_routes(router: Router<crate::AppState>) -> Router<crate::AppState> {
    router.route("/health", axum::routing::get(health_check))
}
