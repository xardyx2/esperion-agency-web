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

use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use std::sync::OnceLock;

/// Global database connection
static DB: OnceLock<Surreal<surrealdb::engine::remote::ws::Client>> = OnceLock::new();

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
pub fn get_db() -> &'static Surreal<surrealdb::engine::remote::ws::Client> {
    DB.get().expect("Database not initialized")
}

// TODO: Implement schema migrations
// pub mod migrations;

// TODO: Implement query helpers
// pub mod queries;