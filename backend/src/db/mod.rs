/**
 * Database Module
 * 
 * Contains database connection and operations using SurrealDB.
 * 
 * Features:
 * - Connection pooling
 * - Schema migrations
 * - Query helpers
 */

#[macro_use]
extern crate lazy_static;

pub mod schema;
pub mod migrations;

use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use std::sync::{Arc, OnceLock};

/// Database client type alias
pub type Db = Surreal<surrealdb::engine::remote::ws::Client>;

/// Database state type for Axum State extractor
pub type DbState = Arc<Db>;

/// Global database connection
static DB: OnceLock<Db> = OnceLock::new();

/// Initialize database connection
pub async fn init() -> Result<(), Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    
    // Sign in as root
    db.signin(Root {
        username: "root",
        password: "root",
    }).await?;
    
    // Select namespace and database
    db.use_ns("esperion").use_db("esperion_db").await?;
    
    // Store connection globally
    DB.set(db).map_err(|_| "Failed to set global DB connection")?;
    
    tracing::info!("Database connection initialized");
    
    Ok(())
}

/// Get database connection
pub fn get_db() -> &'static Db {
    DB.get().expect("Database not initialized")
}

/// Get database connection as Arc (for Axum State)
pub fn get_db_state() -> DbState {
    DB.get().cloned().expect("Database not initialized").into()
}

/// Initialize database connection with migrations
pub async fn init_with_migrations() -> Result<Db, Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    
    // Sign in as root
    db.signin(Root {
        username: "root",
        password: "root",
    }).await?;
    
    // Select namespace and database
    db.use_ns("esperion").use_db("esperion_db").await?;
    
    // Run migrations
    crate::db::migrations::run_migrations(db.clone()).await.map_err(|e| {
        Box::<dyn std::error::Error>::from(format!("Migration failed: {}", e))
    })?;
    
    tracing::info!("Database initialized with migrations");
    
    Ok(db)
}

/// Initialize database schema
pub async fn init_schema() -> Result<(), Box<dyn std::error::Error>> {
    let db = get_db();
    
    // Run schema SQL
    let schema_sql = schema::get_schema();
    let mut schema_result = db.query(&schema_sql).await?;
    let _result: Vec<surrealdb::sql::Value> = schema_result.take(0)?;
    
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
        
        let count_result: Vec<surrealdb::sql::Value> = check_result.take(0)?;  // Get Vec<Value>
        let count_value = if !count_result.is_empty() {
            if let surrealdb::sql::Value::Number(num) = &count_result[0] {
                num.to_int() // Get as integer
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
            
            let created_service: Option<surrealdb::sql::Value> = insert_result.take(0).ok().flatten();
            if created_service.is_some() {
                tracing::info!("Seeded service: {}", slug);
            }
        }
    }
    
    tracing::info!("Initial data seeded");
    
    Ok(())
}