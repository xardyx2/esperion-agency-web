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
use std::sync::Arc;
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

    // Get database state for Axum
    let db_state = db::get_db_state();

    // Build router with state
    let app = build_router(db_state);

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
fn build_router(db_state: Arc<crate::db::Db>) -> Router {
    use axum::routing::{get, post, put, delete};
    
    // Create base router with all routes registered directly, then add state
    Router::new()
        // Geo routes
        .route("/api/geo", get(handlers::geo::get_geo_info))
        // Auth routes
        .route("/api/v1/auth/register", post(handlers::auth::register))
        .route("/api/v1/auth/login", post(handlers::auth::login))
        .route("/api/v1/auth/logout", post(handlers::auth::logout))
        .route("/api/v1/auth/refresh", post(handlers::auth::refresh_token))
        // Articles routes
        .route("/api/v1/articles", get(handlers::articles::list_articles))
        .route("/api/v1/articles", post(handlers::articles::create_article))
        .route("/api/v1/articles/:slug", get(handlers::articles::get_article))
        .route("/api/v1/articles/:id", put(handlers::articles::update_article))
        .route("/api/v1/articles/:id", delete(handlers::articles::delete_article))
        // Media routes
        .route("/api/v1/media", get(handlers::media::list_media))
        .route("/api/v1/media/:id", get(handlers::media::get_media))
        .route("/api/v1/media/upload", post(handlers::media::upload_media))
        .route("/api/v1/media/:id", put(handlers::media::update_media))
        .route("/api/v1/media/:id", delete(handlers::media::delete_media))
        .route("/api/v1/media/stats", get(handlers::media::get_media_stats))
        // Works routes
        .route("/api/v1/works", get(handlers::works::list_works))
        .route("/api/v1/works/featured", get(handlers::works::list_featured_works))
        .route("/api/v1/works/:slug", get(handlers::works::get_work))
        .route("/api/v1/works", post(handlers::works::create_work))
        .route("/api/v1/works/:id", put(handlers::works::update_work))
        .route("/api/v1/works/:id", delete(handlers::works::delete_work))
        // Services routes
        .route("/api/v1/services", get(handlers::services::list_services))
        .route("/api/v1/services/:slug", get(handlers::services::get_service))
        .route("/api/v1/services", post(handlers::services::create_service))
        .route("/api/v1/services/:id", put(handlers::services::update_service))
        .route("/api/v1/services/:id", delete(handlers::services::delete_service))
        // Clients routes
        .route("/api/v1/clients", get(handlers::clients::list_clients))
        .route("/api/v1/clients/stats", get(handlers::clients::get_client_stats))
        .route("/api/v1/clients/logos", get(handlers::clients::get_client_logos))
        .route("/api/v1/clients/:id", get(handlers::clients::get_client))
        .route("/api/v1/clients", post(handlers::clients::create_client))
        .route("/api/v1/clients/:id", put(handlers::clients::update_client))
        .route("/api/v1/clients/:id", delete(handlers::clients::delete_client))
        // Contact routes
        .route("/api/v1/contact", post(handlers::contact::submit_contact))
        .route("/api/v1/contact/submissions", get(handlers::contact::list_submissions))
        .route("/api/v1/contact/submissions/:id", get(handlers::contact::get_submission))
        .route("/api/v1/contact/submissions/:id", put(handlers::contact::update_submission))
        .route("/api/v1/contact/stats", get(handlers::contact::get_contact_stats))
        // SEO routes
        .route("/api/v1/seo/calculate", post(handlers::seo_score::calculate_seo))
        .route("/api/v1/seo/:article_id", get(handlers::seo_score::get_seo_score))
        .route("/api/v1/seo/competitor/:keyword", get(handlers::seo_score::get_competitor_analysis))
        // Health routes
        .route("/health", get(handlers::health::health_check))
        // Add CORS layer
        .layer(CorsLayer::very_permissive())
        // Add state at the end
        .with_state(db_state)
}
