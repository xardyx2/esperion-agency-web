/**
 * Database Module
 * 
 * Contains database connection and operations using SurrealDB.
 * 
 * Features:
 * - Shared SurrealDB client lifecycle
 * - Schema migrations
 * - Query helpers
 */


pub mod schema;
pub mod migrations;

use surrealdb::engine::remote::ws::Ws;
use surrealdb::Surreal;
use surrealdb::opt::auth::Root;
use std::sync::{Arc, OnceLock};

/// Database client type alias
pub type Db = Surreal<surrealdb::engine::remote::ws::Client>;

/// Database state type for Axum State extractor.
///
/// This project currently reuses one initialized SurrealDB client behind an `Arc`.
/// It does not implement a separate connection pool abstraction.
pub type DbState = Arc<Db>;

/// Global shared database client used across handlers.
static DB: OnceLock<Db> = OnceLock::new();

/// Get database URL from environment
fn get_database_url() -> String {
    let host = std::env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("DB_PORT").unwrap_or_else(|_| "8000".to_string());
    format!("{}:{}", host, port)
}

/// Initialize the shared database client.
pub async fn init() -> Result<(), Box<dyn std::error::Error>> {
    let db_url = get_database_url();
    let db = Surreal::new::<Ws>(&db_url).await?;
    
    // Sign in as root
    db.signin(Root {
        username: std::env::var("DB_USER").unwrap_or_else(|_| "root".to_string()),
        password: std::env::var("DB_PASS").unwrap_or_else(|_| "root".to_string()),
    }).await?;
    
    // Select namespace and database
    db.use_ns(std::env::var("DB_NS").unwrap_or_else(|_| "esperion".to_string()))
     .use_db(std::env::var("DB_DB").unwrap_or_else(|_| "esperion_db".to_string())).await?;
    
    // Store connection globally
    DB.set(db).map_err(|_| "Failed to set global DB connection")?;
    
    tracing::info!("Database connection initialized to {}", db_url);
    
    Ok(())
}

/// Get database connection
pub fn get_db() -> &'static Db {
    DB.get().expect("Database not initialized")
}

/// Get the shared database client wrapped in `Arc` for Axum state usage.
///
/// This keeps handler access cheap and consistent, but it is still a shared client,
/// not a true pool with multiple managed connections.
pub fn get_db_state() -> DbState {
    DB.get().cloned().expect("Database not initialized").into()
}

/// Initialize database connection with migrations
pub async fn init_with_migrations() -> Result<Db, Box<dyn std::error::Error>> {
    let db_url = get_database_url();
    let db = Surreal::new::<Ws>(&db_url).await?;
    
    // Sign in as root
    db.signin(Root {
        username: std::env::var("DB_USER").unwrap_or_else(|_| "root".to_string()),
        password: std::env::var("DB_PASS").unwrap_or_else(|_| "root".to_string()),
    }).await?;
    
    // Select namespace and database
    db.use_ns(std::env::var("DB_NS").unwrap_or_else(|_| "esperion".to_string()))
     .use_db(std::env::var("DB_DB").unwrap_or_else(|_| "esperion_db".to_string())).await?;
    
    // Run migrations
    crate::db::migrations::run_migrations(db.clone()).await.map_err(|e| {
        Box::<dyn std::error::Error>::from(format!("Migration failed: {}", e))
    })?;
    
    tracing::info!("Database initialized with migrations on {}", db_url);
    
    Ok(db)
}

/// Initialize database schema
pub async fn init_schema() -> Result<(), Box<dyn std::error::Error>> {
    let db = get_db();
    
    // Run schema SQL
    let schema_sql = schema::get_schema();
    let mut schema_result = db.query(&schema_sql).await?;
    let _result: Vec<surrealdb::types::Value> = schema_result.take(0)?;
    
    tracing::info!("Database schema initially loaded from schema file");
    
    Ok(())
}

/// Seed initial data
pub async fn seed_initial_data() -> Result<(), Box<dyn std::error::Error>> {
    let db = get_db();
    
    // Seed default services if not exists
    let services = vec![
        ("Digital Advertising", "digital-advertising", "Ads yang Right Target, Right Time", "Average ROAS 4.5x"),
        ("Marketplace Marketing", "marketplace-marketing", "Dominasi Shopee & Tokopedia", "Naik 150% dalam 3 bulan"),
        ("Social Media Marketing", "social-media-marketing", "Engagement Bukan Sekedar Likes", "Average engagement 5.2%"),
        ("Search Engine Optimization", "seo", "Ranking #1 untuk Keyword Kompetitif", "90% client halaman 1 dalam 90 hari"),
        ("Consultant", "consultant", "Strategi yang Actionable", "Client implement 80%+ recommendation"),
        ("Web & Mobile Development", "web-mobile-development", "Fast, Beautiful, Conversion-Optimized", "Load time < 2s, bounce rate turun 40%"),
    ];
    
    for (title, slug, description, _usp) in services {
        // Check if service exists
        let mut check_result = db.query("SELECT count() FROM services WHERE slug = $slug")
            .bind(("slug", slug))
            .await?;
        
        let count_result: Vec<surrealdb::types::Value> = check_result.take(0)?;  // Get Vec<Value>
        let count_value: i64 = if !count_result.is_empty() {
            if let surrealdb::types::Value::Number(num) = &count_result[0] {
                num.to_int().unwrap_or(0)
            } else {
                0
            }
        } else {
            0
        };
        if count_value == 0 {
            // Insert service
            let mut insert_result = db.query(r#"
                CREATE services SET
                    title = $title,
                    slug = $slug,
                    description = $description,
                    featured = true,
                    display_order = 0
            "#)
            .bind(("title", title))
            .bind(("slug", slug))
            .bind(("description", description))
            .await?;
            
            let created_service: Option<surrealdb::types::Value> = insert_result.take(0).ok().flatten();
            if created_service.is_some() {
                tracing::info!("Seeded service: {}", slug);
            }
        }
    }
    
    tracing::info!("Initial data seeded");
    
    Ok(())
}
