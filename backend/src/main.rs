/**
 * Esperion Backend API
 * 
 * Rust + Axum backend for Esperion Digital Agency
 * Provides REST API for:
 * - Authentication (JWT + Argon2)
 * - Articles management
 * - Works/Portfolio
 * - Services
 * - Clients
 * - Contact form
 * - Geo location (Cloudflare IP detection)
 * 
 * Tech Stack:
 * - Axum: Web framework
 * - Tokio: Async runtime
 * - SurrealDB: Database
 * - utoipa: OpenAPI documentation
 * - Argon2: Password hashing
 * - JSON Web Token: Authentication
 */

mod handlers;
mod models;
mod routes;
mod middleware;
mod db;
mod api;

use axum::Router;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "esperion_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting Esperion Backend API...");

    // Initialize database connection
    db::init().await.expect("Failed to initialize database");

    // Build router
    let app = build_router();

    // Get host and port from environment
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("{}:{}", host, port);

    tracing::info!("Listening on {}", addr);

    // Start server
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

/// Build the main router with all routes and middleware
fn build_router() -> Router {
    // Create base router
    let mut router = Router::new();

    // Register geo routes
    router = handlers::geo::register_routes(router);

    // TODO: Register other routes
    // router = handlers::auth::register_routes(router);
    // router = handlers::articles::register_routes(router);
    // router = handlers::works::register_routes(router);
    // router = handlers::services::register_routes(router);
    // router = handlers::clients::register_routes(router);
    // router = handlers::contact::register_routes(router);

    // Add CORS layer
    router = router.layer(
        CorsLayer::very_permissive()
    );

    // Add OpenAPI documentation
    router = api::register_openapi(router);

    router
}