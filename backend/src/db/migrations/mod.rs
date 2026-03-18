use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use surrealdb::types::RecordId;
use surrealdb::types::SurrealValue;
use sha2::{Sha256, Digest};
use lazy_static::lazy_static;

#[derive(Debug, Clone)]
pub struct Migration {
    pub version: String,
    pub name: String,
    pub up: String,
    pub down: Option<String>,
}

#[derive(Debug, Clone, serde::Deserialize, serde::Serialize, surrealdb::types::SurrealValue)]
pub struct MigrationRecord {
    pub id: RecordId,
    pub version: String,
    pub name: String,
    pub applied_at: chrono::DateTime<chrono::Utc>,
    pub checksum: String,
}

#[derive(Debug)]
pub enum MigrationError {
    DbError(surrealdb::Error),
    MigrationNotFound,
    AlreadyApplied(String),
    ChecksumMismatch(String),
}

impl std::fmt::Display for MigrationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MigrationError::DbError(e) => write!(f, "Database error: {}", e),
            MigrationError::MigrationNotFound => write!(f, "Migration not found"),
            MigrationError::AlreadyApplied(version) => write!(f, "Migration {} already applied", version),
            MigrationError::ChecksumMismatch(version) => write!(f, "Checksum mismatch for migration {}", version),
        }
    }
}

impl std::error::Error for MigrationError {}

impl From<surrealdb::Error> for MigrationError {
    fn from(err: surrealdb::Error) -> Self {
        MigrationError::DbError(err)
    }
}

impl From<MigrationError> for surrealdb::Error {
    fn from(err: MigrationError) -> Self {
        match err {
            MigrationError::DbError(e) => e,
            _ => surrealdb::Error::thrown(format!("Migration error: {}", err).into()),
        }
    }
}

pub struct MigrationManager {
    db: Surreal<Client>,
}

impl MigrationManager {
    pub fn new(db: Surreal<Client>) -> Self {
        Self { db }
    }

    // Initialize migrations table
    pub async fn init(&self) -> Result<(), MigrationError> {
        let sql = r#"
            DEFINE TABLE migrations SCHEMAFULL;
            DEFINE FIELD version ON migrations TYPE string;
            DEFINE FIELD name ON migrations TYPE string;
            DEFINE FIELD applied_at ON migrations TYPE datetime;
            DEFINE FIELD checksum ON migrations TYPE string;
            DEFINE INDEX idx_version ON migrations FIELDS version UNIQUE;
        "#;
        
        self.db.query(sql).await?;
        Ok(())
    }

    // Get applied migrations
    pub async fn get_applied_migrations(&self) -> Result<Vec<MigrationRecord>, MigrationError> {
        let mut result = self.db
            .query("SELECT * FROM migrations ORDER BY version")
            .await?;
        
        let migrations: Vec<MigrationRecord> = result.take(0)?;
        Ok(migrations)
    }

    // Apply pending migrations
    pub async fn migrate(&self) -> Result<Vec<String>, MigrationError> {
        let applied = self.get_applied_migrations().await?;
        let applied_versions: Vec<String> = applied.iter()
            .map(|m| m.version.clone())
            .collect();

        let mut executed = Vec::new();
        
        for migration in MIGRATIONS.iter() {
            if !applied_versions.contains(&migration.version) {
                self.apply_migration(migration).await?;
                executed.push(migration.version.clone());
            }
        }

        Ok(executed)
    }

    // Apply single migration
    async fn apply_migration(&self, migration: &Migration) -> Result<(), MigrationError> {
        // Execute migration SQL
        self.db.query(&migration.up).await?;
        
        // Calculate checksum
        let checksum = calculate_checksum(&migration.up);
        
        // Record migration
        let sql = r#"
            CREATE migrations CONTENT {
                version: $version,
                name: $name,
                applied_at: time::now(),
                checksum: $checksum
            }
        "#;
        
        self.db.query(sql)
            .bind(("version", migration.version.to_owned()))
            .bind(("name", migration.name.to_owned()))
            .bind(("checksum", checksum))
            .await?;

        Ok(())
    }

    // Rollback last migration
    pub async fn rollback(&self, version: Option<&str>) -> Result<String, MigrationError> {
        let mut latest_migration_query = if let Some(v) = version {
            self.db.query("SELECT * FROM migrations WHERE version = $version ORDER BY version DESC LIMIT 1")
                .bind(("version", v.to_owned()))
                .await?
        } else {
            self.db.query("SELECT * FROM migrations ORDER BY version DESC LIMIT 1")
                .await?
        };

        let last_migration: Option<MigrationRecord> = latest_migration_query.take(0)?;
        
        if let Some(migration) = last_migration {
            // Find migration definition
            if let Some(mig_def) = MIGRATIONS.iter().find(|m| m.version == migration.version) {
                if let Some(down) = &mig_def.down {
                    // Execute down migration
                    self.db.query(down).await?;
                    
                    // Remove migration record
                    self.db.query("DELETE FROM migrations WHERE version = $version")
                        .bind(("version", migration.version.to_owned()))
                        .await?;
                    
                    return Ok(migration.version);
                } else {
                    return Err(MigrationError::MigrationNotFound);
                }
            }
        }

        Err(MigrationError::MigrationNotFound)
    }

    // Get migration status
    pub async fn status(&self) -> Result<(Vec<MigrationRecord>, Vec<&Migration>), MigrationError> {
        let applied = self.get_applied_migrations().await?;
        let applied_versions: std::collections::HashSet<String> = applied.iter()
            .map(|m| m.version.clone())
            .collect();

        let pending: Vec<&Migration> = MIGRATIONS.iter()
            .filter(|m| !applied_versions.contains(&m.version))
            .collect();

        Ok((applied, pending))
    }
}

// Define all migrations
lazy_static! {
    static ref MIGRATIONS: Vec<Migration> = vec![
        Migration {
            version: "1.0.0".to_string(),
            name: "Initial schema".to_string(),
            up: include_str!("./001_initial_schema.sql").to_string(),
            down: Some(include_str!("./001_initial_schema_down.sql").to_string()),
        },
        Migration {
            version: "1.1.0".to_string(),
            name: "Add user sessions".to_string(),
            up: include_str!("./002_add_user_sessions.sql").to_string(),
            down: Some(include_str!("./002_add_user_sessions_down.sql").to_string()),
        },
        Migration {
            version: "1.2.0".to_string(),
            name: "Add translation memory table".to_string(),
            up: include_str!("./003_add_translation_memory_table.sql").to_string(),
            down: Some(include_str!("./003_add_translation_memory_table_down.sql").to_string()),
        },
        Migration {
            version: "1.3.0".to_string(),
            name: "Add publication options to articles".to_string(),
            up: include_str!("./004_add_publication_options_to_articles.sql").to_string(),
            down: Some(include_str!("./004_add_publication_options_to_articles_down.sql").to_string()),
        },
        Migration {
            version: "1.4.0".to_string(),
            name: "Add monitoring alerting tables".to_string(),
            up: include_str!("./005_add_monitoring_alerting_tables.sql").to_string(),
            down: Some(include_str!("./005_add_monitoring_alerting_tables_down.sql").to_string()),
        },
        Migration {
            version: "1.5.0".to_string(),
            name: "Add analytics funnels table".to_string(),
            up: include_str!("./006_add_analytics_funnels.sql").to_string(),
            down: Some(include_str!("./006_add_analytics_funnels_down.sql").to_string()),
        },
        Migration {
            version: "1.6.0".to_string(),
            name: "Add backup jobs table".to_string(),
            up: include_str!("./007_add_backup_jobs.sql").to_string(),
            down: Some(include_str!("./007_add_backup_jobs_down.sql").to_string()),
        },
        Migration {
            version: "1.7.0".to_string(),
            name: "Create translation memory table".to_string(),
            up: include_str!("./006_translation_memory.sql").to_string(),
            down: Some(include_str!("./006_translation_memory_down.sql").to_string()),
        },
        Migration {
            version: "1.8.0".to_string(),
            name: "Add backup history table".to_string(),
            up: include_str!("./004_backup_history.sql").to_string(),
            down: None,
        },
        Migration {
            version: "1.9.0".to_string(),
            name: "Create user sessions table for analytics".to_string(),
            up: include_str!("./005_user_sessions.sql").to_string(),
            down: None,
        },
        Migration {
            version: "1.10.0".to_string(),
            name: "Add email system tables".to_string(),
            up: include_str!("./008_email_system.sql").to_string(),
            down: Some(include_str!("./008_email_system_down.sql").to_string()),
        },
        Migration {
            version: "1.11.0".to_string(),
            name: "Add migrations tracking table".to_string(),
            up: include_str!("./007_migrations_tracking.sql").to_string(),
            down: Some(include_str!("./007_migrations_tracking_down.sql").to_string()),
        },
    ];
}

fn calculate_checksum(sql: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(sql);
    format!("{:x}", hasher.finalize())
}

pub async fn run_migrations(db: Surreal<Client>) -> Result<Vec<String>, MigrationError> {
    let manager = MigrationManager::new(db);
    
    // Initialize migrations table if it doesn't exist
    manager.init().await?;
    
    // Apply pending migrations
    let applied = manager.migrate().await?;
    
    Ok(applied)
}

#[cfg(test)]
mod tests {
    use super::calculate_checksum;

    #[test]
    fn test_migration_checksum_calculation() {
        let sample_sql = "CREATE TABLE test_table;";
        let checksum = calculate_checksum(sample_sql);

        assert!(!checksum.is_empty());
        assert_eq!(checksum.len(), 64);

        let checksum2 = calculate_checksum(sample_sql);
        assert_eq!(checksum, checksum2);

        let different_sql = "CREATE TABLE another_table;";
        let checksum3 = calculate_checksum(different_sql);
        assert_ne!(checksum, checksum3);
    }
}
