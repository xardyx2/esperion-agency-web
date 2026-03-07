use axum::{Json, Router, routing::get};
use serde_json::json;

/// Health check endpoint
#[axum::debug_handler]
pub async fn health_check() -> Json<serde_json::Value> {
    Json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "service": "esperion-backend"
    }))
}

/// Register health routes
pub fn register_routes(router: Router<crate::db::DbState>) -> Router<crate::db::DbState> {
    router.route("/health", axum::routing::get(health_check))
}
