#[cfg(test)]
mod tests {
    use surrealdb::engine::remote::ws::Ws;
    use surrealdb::Surreal;
    use std::time::Duration;
    use tokio::time::sleep;

    #[tokio::test]
    async fn test_migration_system() {
        // Skip test if surrealdb not available
        let db_result = Surreal::new::<Ws>("127.0.0.1:8000").await;
        if db_result.is Err() {
            eprintln!("Skipping migration tests - surrealdb is not running on port 8000");
            return;
        }

        let db = db_result.unwrap();
        
        // Try to sign in (note that this might fail if surrealdb is not configured with the right user)
        let signin_result = db.signin(surrealdb::opt::auth::Root {
            username: "root".to_owned(),
            password: "root".to_owned(),
        }).await;
        
        if signin_result.is_err() {
            // Try connecting without auth for memory db mode
            let db_result = Surreal::new::<surrealdb::engine::any::Any>("memory").await;
            if let Ok(new_db) = db_result {
                test_migration_flow(new_db).await;
                return;
            } else {
                eprintln!("Skipping migration tests - unable to connect to surrealdb");
                return;
            }
        }
        
        // Select namespace and database 
        db.use_ns("test").use_db("migration_test").await.unwrap();
        
        test_migration_flow(db).await;
    }

    async fn test_migration_flow(db: Surreal<surrealdb::engine::remote::ws::Client>) {
        use super::*;

        let manager = MigrationManager::new(db.clone());

        // Initialize migrations table
        assert!(manager.init().await.is_ok());

        // Get initially applied migrations - should be none
        let applied = manager.get_applied_migrations().await.unwrap();
        assert_eq!(applied.len(), 0);

        // Perform migrations
        let result = manager.migrate().await;
        assert!(result.is_ok());
        
        // Should have applied migrations now
        let applied = manager.get_applied_migrations().await.unwrap();
        assert!(!applied.is_empty());
        
        // Check migration status 
        let (applied, pending) = manager.status().await.unwrap();
        assert!(!applied.is_empty());
        assert_eq!(pending.len(), 0); // all should be applied
        
        // Test rollback (we'll go back to empty state if possible)
        let first_version = applied.first().map(|m| m.version.clone());
        if let Some(first_version) = first_version {
            let result = manager.rollback(Some(&first_version)).await;
            assert!(result.is_ok());
            
            // Sleep briefly to ensure deletion is processed
            sleep(Duration::from_millis(50)).await;
            
            let applied_after_rollback = manager.get_applied_migrations().await.unwrap();
            assert_eq!(applied_after_rollback.len(), applied.len() - 1);
        }

        // Clean up by removing test db
        let _ = db.query("REMOVE DATABASE migration_test").await;
    }

    #[tokio::test]  
    async fn test_migration_checksum_verification() {
        let db_result = Surreal::new::<surrealdb::engine::any::Any>("memory").await;
        if let Ok(db) = db_result {
            use super::*;
            
            let manager = MigrationManager::new(db.clone());

            // Initialize migrations table
            assert!(manager.init().await.is_ok());

            // Calculate checksum for some sample SQL
            let sample_sql = "CREATE TABLE test_table";
            let checksum = calculate_checksum(sample_sql);
            
            // Verify checksum isn't empty
            assert!(!checksum.is_empty());
            assert_eq!(checksum.len(), 64); // SHA256 produces 64 hex chars
        }
    }
}