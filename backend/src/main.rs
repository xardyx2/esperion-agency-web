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

use clap::Parser;
use clap::Subcommand;
use std::sync::Arc;
use axum::{extract::FromRef, Router};

use dotenvy;

mod handlers;
mod models;
mod routes;
mod middleware;
mod db;
mod api;
mod services;
mod errors;

/// Combined application state holding both database and email service
#[derive(Clone)]
pub struct AppState {
    pub db: Arc<crate::db::Db>,
    pub email_service: crate::services::email::EmailService,
}

/// Implement FromRef to allow extraction of individual state components in handlers
impl FromRef<AppState> for Arc<crate::db::Db> {
    fn from_ref(app_state: &AppState) -> Arc<crate::db::Db> {
        app_state.db.clone()
    }
}

impl FromRef<AppState> for crate::services::email::EmailService {
    fn from_ref(app_state: &AppState) -> crate::services::email::EmailService {
        app_state.email_service.clone()
    }
}

#[derive(Parser)]
#[command(name = "esperion-backend")]
#[command(about = "Backend API for Esperion Digital Agency", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Run database migrations
    Migrate,
    
    /// Rollback last database migration
    MigrateRollback {
        /// Specific migration version to rollback (optional)
        #[arg(short, long)]
        version: Option<String>,
    },
    
    /// Show migration status
    MigrateStatus,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables from .env file if available
    let _ = dotenvy::dotenv().ok();

    // Parse command line arguments
    let cli = Cli::parse();

    // Handle migration commands
    match &cli.command {
        Some(Commands::Migrate) => {
            // Initialize database connection with migrations
            let db = crate::db::init_with_migrations().await?;
            
            let manager = crate::db::migrations::MigrationManager::new(db.clone());
            let applied = manager.get_applied_migrations().await?;
            
            println!("Applied migrations: {} found", applied.len());
            for migration in applied {
                println!("  ✓ {}: {}", migration.version, migration.name);
            }
            return Ok(());
        }
        Some(Commands::MigrateStatus) => {
            // Initialize database connection
            crate::db::init().await.expect("Failed to initialize database");
            
            let db_ref = crate::db::get_db().clone();
            let manager = crate::db::migrations::MigrationManager::new(db_ref);
            manager.init().await?;
            let (applied, pending) = manager.status().await?;
            
            println!("Applied migrations: {} found", applied.len());
            for migration in applied {
                println!("  ✓ {}: {}", migration.version, migration.name);
            }
            
            println!("Pending migrations: {} found", pending.len());
            for migration in pending {
                println!("  ○ {}: {}", migration.version, migration.name);
            }
            return Ok(());
        }
        Some(Commands::MigrateRollback { version }) => {
            // Initialize database connection
            crate::db::init().await.expect("Failed to initialize database");
            
            let db_ref = crate::db::get_db().clone();
            let manager = crate::db::migrations::MigrationManager::new(db_ref);
            manager.init().await?;
            
            let result = manager.rollback(version.as_deref()).await;
            match result {
                Ok(migrated_version) => {
                    println!("Rolled back migration: {}", migrated_version);
                }
                Err(e) => {
                    eprintln!("Failed to rollback migration: {}", e);
                    std::process::exit(1);
                }
            }
            return Ok(());
        }
        None => {
            // Continue with normal server startup
        }
    }

    // Initialize logging for server mode
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "esperion_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting Esperion Backend API...");

    // Use migration-powered init for database
    let db_state = db::init_with_migrations().await?.into();

    // Initialize the email service with configuration from environment
    let email_settings = crate::models::email::EmailSettings {
        provider: std::env::var("EMAIL_PROVIDER")
            .unwrap_or_else(|_| "smtp".to_string()),
        smtp_host: std::env::var("SMTP_HOST").ok(),
        smtp_port: std::env::var("SMTP_PORT")
            .ok()
            .and_then(|port| port.parse::<u16>().ok()),
        smtp_username: std::env::var("SMTP_USER").ok(),
        smtp_password: std::env::var("SMTP_PASS").ok(),
        smtp_encryption: Some(std::env::var("SMTP_ENCRYPTION")
            .unwrap_or_else(|_| "starttls".to_string())),
        api_key: std::env::var("SENDGRID_API_KEY")
            .or_else(|_| std::env::var("MAILGUN_API_KEY"))
            .or_else(|_| std::env::var("POSTMARK_API_KEY"))
            .or_else(|_| std::env::var("SMTP2GO_API_KEY"))
            .ok(),
        from_address: std::env::var("EMAIL_FROM")
            .unwrap_or_else(|_| "noreply@esperion.agency".to_string()),
        domain: std::env::var("MAILGUN_DOMAIN").or_else(|_| std::env::var("EMAIL_DOMAIN")).ok(),
        region: std::env::var("AWS_REGION").or_else(|_| std::env::var("SES_REGION")).ok(),
        access_key_id: std::env::var("AWS_ACCESS_KEY_ID").ok(),
        secret_access_key: std::env::var("AWS_SECRET_ACCESS_KEY").ok(),
    };

    // Create the email service based on configuration
    let email_service = crate::services::email::EmailService::new(&email_settings)
        .map_err(|e| format!("Failed to initialize email service: {}", e))?;

    // Combine the states
    let app_state = AppState {
        db: db_state,
        email_service,
    };

    let app = build_router(app_state);

    // Get host and port from environment
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("{}:{}", host, port);

    tracing::info!("Listening on {}", addr);

    // Start server
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

/// Build the main router with all routes and middleware
fn build_router(state: AppState) -> axum::Router {
    use axum::routing::{get, post, put, delete};
    use tower_http::cors::CorsLayer;
    
    // Create base router with all routes registered directly, then add state
    axum::Router::new()
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
        // Article translation routes
        .route("/api/v1/articles/:id/translate", post(handlers::translation::translate_article))
        // Email routes
        .route("/api/v1/email/contact-notification", post(handlers::email::send_contact_notification))
        .route("/api/v1/email/send", post(handlers::email::send_email))
        // Health routes
        .route("/health", get(handlers::health::health_check))
        // Add CORS layer
        .layer(CorsLayer::very_permissive())
        // Add state at the end
        .with_state(state)
}
