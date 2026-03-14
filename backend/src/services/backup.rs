use std::collections::HashSet;
use std::path::{Path, PathBuf};

use serde::de::DeserializeOwned;
use serde_json::{json, Value};
use tokio::fs;

use crate::db::schema::TABLES;
use crate::models::backup::{
    BackupHistoryResponse, BackupJob, BackupSettings, CreateBackupRequest, RestoreBackupRequest,
    RestoreBackupResponse,
};

const KEY_BACKUP_SETTINGS: &str = "backup.restore.settings";

pub struct BackupService;

impl BackupService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_settings(&self, db: &crate::db::DbState) -> Result<BackupSettings, String> {
        let defaults = default_backup_settings();
        let settings = read_setting::<BackupSettings>(db, KEY_BACKUP_SETTINGS)
            .await?
            .unwrap_or(defaults);
        Ok(settings)
    }

    pub async fn update_settings(
        &self,
        db: &crate::db::DbState,
        settings: BackupSettings,
    ) -> Result<BackupSettings, String> {
        validate_settings(&settings)?;
        write_setting(db, KEY_BACKUP_SETTINGS, &settings).await?;
        self.get_settings(db).await
    }

    pub async fn list_backups(
        &self,
        db: &crate::db::DbState,
        limit: u32,
        offset: u32,
    ) -> Result<BackupHistoryResponse, String> {
        let mut result = db
            .query("SELECT * FROM backup_jobs ORDER BY created_at DESC LIMIT $limit START $offset")
            .bind(("limit", limit))
            .bind(("offset", offset))
            .await
            .map_err(|error| format!("Failed to query backup jobs: {error}"))?;

        let rows: Vec<Value> = result
            .take(0)
            .map_err(|error| format!("Failed to parse backup job rows: {error}"))?;

        let data = rows.into_iter().map(map_backup_job).collect::<Vec<_>>();
        Ok(BackupHistoryResponse {
            total: data.len() as u32,
            data,
        })
    }

    pub async fn create_backup(
        &self,
        db: &crate::db::DbState,
        payload: CreateBackupRequest,
    ) -> Result<BackupJob, String> {
        if payload.scopes.is_empty() {
            return Err("At least one scope is required".to_string());
        }

        validate_scopes(payload.scopes.as_slice())?;

        let settings = self.get_settings(db).await?;
        let backup_root = std::env::var("BACKUP_DIR").unwrap_or_else(|_| "backups".to_string());
        fs::create_dir_all(&backup_root)
            .await
            .map_err(|error| format!("Failed to ensure backup root directory: {error}"))?;

        let backup_name = format!(
            "backup-{}",
            chrono::Utc::now().format("%Y%m%d%H%M%S")
        );
        let backup_path = Path::new(&backup_root).join(&backup_name);
        fs::create_dir_all(&backup_path)
            .await
            .map_err(|error| format!("Failed to create backup directory: {error}"))?;

        let mut create_result = db
            .query(
                "CREATE backup_jobs CONTENT { status: 'running', scopes: $scopes, reason: $reason, location: $location, created_at: time::now() }",
            )
            .bind(("scopes", payload.scopes.clone()))
            .bind(("reason", payload.reason.clone()))
            .bind(("location", backup_path.to_string_lossy().to_string()))
            .await
            .map_err(|error| format!("Failed to create backup job record: {error}"))?;

        let created: Option<Value> = create_result
            .take(0)
            .map_err(|error| format!("Failed to parse backup job record: {error}"))?;

        let id = created
            .as_ref()
            .and_then(|row| row.get("id"))
            .and_then(extract_record_id)
            .ok_or_else(|| "Backup job id is missing".to_string())?;

        let execution = self
            .create_backup_artifacts(db, payload.scopes.as_slice(), &settings, backup_path.as_path())
            .await;

        if let Err(error) = execution {
            db.query("UPDATE $job_id SET status = 'failed', error = $error, completed_at = time::now()")
                .bind(("job_id", id.clone()))
                .bind(("error", error.clone()))
                .await
                .map_err(|db_error| format!("Backup failed: {error}. Failed to mark job failed: {db_error}"))?;
            return Err(error);
        }

        db.query("UPDATE $job_id SET status = 'completed', completed_at = time::now()")
            .bind(("job_id", id.clone()))
            .await
            .map_err(|error| format!("Failed to mark backup completed: {error}"))?;

        enforce_retention(&backup_root, settings.retention_count)
            .await
            .map_err(|error| format!("Failed retention cleanup: {error}"))?;

        Ok(BackupJob {
            id,
            status: "completed".to_string(),
            scopes: payload.scopes,
            reason: payload.reason,
            location: Some(backup_path.to_string_lossy().to_string()),
            error: None,
            created_at: Some(chrono::Utc::now().to_rfc3339()),
            completed_at: Some(chrono::Utc::now().to_rfc3339()),
        })
    }

    pub async fn restore_backup(
        &self,
        db: &crate::db::DbState,
        payload: RestoreBackupRequest,
    ) -> Result<RestoreBackupResponse, String> {
        let required_confirmation = format!("RESTORE {}", payload.backup_id);
        if payload.confirmation != required_confirmation {
            return Err(format!(
                "Invalid confirmation. Use exact phrase: {required_confirmation}"
            ));
        }

        let scope = payload.scope.trim().to_lowercase();
        if !matches!(scope.as_str(), "database" | "files" | "all") {
            return Err("scope must be database, files, or all".to_string());
        }

        let mut result = db
            .query("SELECT * FROM $job_id LIMIT 1")
            .bind(("job_id", payload.backup_id.clone()))
            .await
            .map_err(|error| format!("Failed to load backup job: {error}"))?;

        let backup_row: Option<Value> = result
            .take(0)
            .map_err(|error| format!("Failed to parse backup job: {error}"))?;
        let row = backup_row.ok_or_else(|| "Backup job not found".to_string())?;

        let location = row
            .get("location")
            .and_then(|value| value.as_str())
            .ok_or_else(|| "Backup location missing".to_string())?;
        let backup_path = PathBuf::from(location);

        if scope == "database" || scope == "all" {
            restore_database_scope(db, backup_path.as_path()).await?;
        }
        if scope == "files" || scope == "all" {
            let files_dir = std::env::var("BACKUP_FILES_DIR").unwrap_or_else(|_| "uploads".to_string());
            let snapshot_files = backup_path.join("files");
            if snapshot_files.exists() {
                copy_dir_recursive(snapshot_files.as_path(), Path::new(&files_dir)).await?;
            }
        }

        Ok(RestoreBackupResponse {
            success: true,
            message: format!("Restore completed for scope '{scope}'"),
        })
    }

    async fn create_backup_artifacts(
        &self,
        db: &crate::db::DbState,
        scopes: &[String],
        settings: &BackupSettings,
        backup_path: &Path,
    ) -> Result<(), String> {
        let normalized = scopes
            .iter()
            .map(|scope| scope.trim().to_lowercase())
            .collect::<HashSet<String>>();

        let mut manifest = json!({
            "created_at": chrono::Utc::now().to_rfc3339(),
            "scopes": scopes,
            "encryption_enabled": settings.encryption_enabled,
        });

        if normalized.contains("database") {
            let mut snapshot = serde_json::Map::new();
            for table in TABLES {
                let mut result = db
                    .query(format!("SELECT * FROM {table}"))
                    .await
                    .map_err(|error| format!("Failed to snapshot table {table}: {error}"))?;
                let rows: Vec<Value> = result
                    .take(0)
                    .map_err(|error| format!("Failed to parse table snapshot for {table}: {error}"))?;
                snapshot.insert((*table).to_string(), Value::Array(rows));
            }

            let db_json = serde_json::to_vec_pretty(&Value::Object(snapshot))
                .map_err(|error| format!("Failed to serialize database snapshot: {error}"))?;

            if settings.encryption_enabled {
                let key = std::env::var("BACKUP_ENCRYPTION_KEY")
                    .map_err(|_| "BACKUP_ENCRYPTION_KEY is required when encryption is enabled".to_string())?;
                let encrypted = xor_bytes(db_json.as_slice(), key.as_bytes());
                fs::write(backup_path.join("database.enc"), encrypted)
                    .await
                    .map_err(|error| format!("Failed to write encrypted database backup: {error}"))?;
            } else {
                fs::write(backup_path.join("database.json"), db_json)
                    .await
                    .map_err(|error| format!("Failed to write database backup: {error}"))?;
            }
        }

        if normalized.contains("files") {
            let source_files = std::env::var("BACKUP_FILES_DIR").unwrap_or_else(|_| settings.files_directory.clone());
            let source_path = Path::new(&source_files);
            if source_path.exists() {
                copy_dir_recursive(source_path, &backup_path.join("files")).await?;
            }
            manifest["files_directory"] = Value::String(source_files);
        }

        fs::write(
            backup_path.join("manifest.json"),
            serde_json::to_vec_pretty(&manifest)
                .map_err(|error| format!("Failed to encode manifest: {error}"))?,
        )
        .await
        .map_err(|error| format!("Failed to write manifest: {error}"))?;

        Ok(())
    }
}

pub fn default_backup_settings() -> BackupSettings {
    BackupSettings {
        schedule_enabled: false,
        schedule_cron: "0 3 * * *".to_string(),
        retention_count: 14,
        encryption_enabled: false,
        files_directory: std::env::var("BACKUP_FILES_DIR").unwrap_or_else(|_| "uploads".to_string()),
    }
}

fn validate_scopes(scopes: &[String]) -> Result<(), String> {
    let allowed: HashSet<&str> = ["database", "files"].into_iter().collect();
    for scope in scopes {
        let normalized = scope.trim().to_lowercase();
        if !allowed.contains(normalized.as_str()) {
            return Err(format!("Invalid backup scope: {scope}"));
        }
    }
    Ok(())
}

fn validate_settings(settings: &BackupSettings) -> Result<(), String> {
    if settings.retention_count == 0 {
        return Err("retention_count must be greater than 0".to_string());
    }
    if settings.schedule_cron.trim().is_empty() {
        return Err("schedule_cron is required".to_string());
    }
    Ok(())
}

fn map_backup_job(row: Value) -> BackupJob {
    BackupJob {
        id: row
            .get("id")
            .and_then(extract_record_id)
            .unwrap_or_default(),
        status: row
            .get("status")
            .and_then(|value| value.as_str())
            .unwrap_or("unknown")
            .to_string(),
        scopes: row
            .get("scopes")
            .and_then(|value| value.as_array())
            .map(|items| {
                items
                    .iter()
                    .filter_map(|item| item.as_str().map(ToString::to_string))
                    .collect::<Vec<String>>()
            })
            .unwrap_or_default(),
        reason: row
            .get("reason")
            .and_then(|value| value.as_str())
            .map(ToString::to_string),
        location: row
            .get("location")
            .and_then(|value| value.as_str())
            .map(ToString::to_string),
        error: row
            .get("error")
            .and_then(|value| value.as_str())
            .map(ToString::to_string),
        created_at: row
            .get("created_at")
            .and_then(|value| value.as_str())
            .map(ToString::to_string),
        completed_at: row
            .get("completed_at")
            .and_then(|value| value.as_str())
            .map(ToString::to_string),
    }
}

async fn enforce_retention(root: &str, keep: u32) -> Result<(), String> {
    let mut entries = fs::read_dir(root)
        .await
        .map_err(|error| format!("Failed to read backup root: {error}"))?;

    let mut dirs = Vec::new();
    while let Some(entry) = entries
        .next_entry()
        .await
        .map_err(|error| format!("Failed to iterate backup root: {error}"))?
    {
        let metadata = entry
            .metadata()
            .await
            .map_err(|error| format!("Failed to read backup metadata: {error}"))?;
        if metadata.is_dir() {
            dirs.push((entry.path(), metadata.modified().ok()));
        }
    }

    dirs.sort_by(|a, b| b.1.cmp(&a.1));
    for (index, (path, _)) in dirs.into_iter().enumerate() {
        if (index as u32) >= keep {
            fs::remove_dir_all(path)
                .await
                .map_err(|error| format!("Failed to remove old backup directory: {error}"))?;
        }
    }

    Ok(())
}

async fn restore_database_scope(db: &crate::db::DbState, backup_path: &Path) -> Result<(), String> {
    let manifest_path = backup_path.join("manifest.json");
    let manifest_bytes = fs::read(manifest_path)
        .await
        .map_err(|error| format!("Failed to read backup manifest: {error}"))?;
    let manifest: Value = serde_json::from_slice(&manifest_bytes)
        .map_err(|error| format!("Failed to decode backup manifest: {error}"))?;

    let encrypted = manifest
        .get("encryption_enabled")
        .and_then(|value| value.as_bool())
        .unwrap_or(false);

    let bytes = if encrypted {
        let key = std::env::var("BACKUP_ENCRYPTION_KEY")
            .map_err(|_| "BACKUP_ENCRYPTION_KEY is required to restore encrypted backup".to_string())?;
        let cipher = fs::read(backup_path.join("database.enc"))
            .await
            .map_err(|error| format!("Failed to read encrypted database backup: {error}"))?;
        xor_bytes(cipher.as_slice(), key.as_bytes())
    } else {
        fs::read(backup_path.join("database.json"))
            .await
            .map_err(|error| format!("Failed to read database backup: {error}"))?
    };

    let snapshot: Value = serde_json::from_slice(&bytes)
        .map_err(|error| format!("Failed to decode database backup: {error}"))?;

    for table in TABLES {
        db.query(format!("DELETE {table}"))
            .await
            .map_err(|error| format!("Failed to clear table {table} before restore: {error}"))?;

        let rows = snapshot
            .get(*table)
            .and_then(|value| value.as_array())
            .cloned()
            .unwrap_or_default();

        for row in rows {
            db.query(format!("CREATE {table} CONTENT $content"))
                .bind(("content", row))
                .await
                .map_err(|error| format!("Failed to restore row for table {table}: {error}"))?;
        }
    }

    Ok(())
}

async fn copy_dir_recursive(from: &Path, to: &Path) -> Result<(), String> {
    let mut stack = vec![(from.to_path_buf(), to.to_path_buf())];

    while let Some((source_dir, destination_dir)) = stack.pop() {
        fs::create_dir_all(&destination_dir)
            .await
            .map_err(|error| format!("Failed to ensure destination directory: {error}"))?;

        let mut entries = fs::read_dir(&source_dir)
            .await
            .map_err(|error| format!("Failed to read source directory: {error}"))?;

        while let Some(entry) = entries
            .next_entry()
            .await
            .map_err(|error| format!("Failed to iterate source directory: {error}"))?
        {
            let path = entry.path();
            let dest = destination_dir.join(entry.file_name());
            let metadata = entry
                .metadata()
                .await
                .map_err(|error| format!("Failed to read source metadata: {error}"))?;

            if metadata.is_dir() {
                stack.push((path, dest));
            } else {
                fs::copy(path.as_path(), dest.as_path())
                    .await
                    .map_err(|error| format!("Failed to copy backup file: {error}"))?;
            }
        }
    }

    Ok(())
}

fn xor_bytes(data: &[u8], key: &[u8]) -> Vec<u8> {
    if key.is_empty() {
        return data.to_vec();
    }

    data.iter()
        .enumerate()
        .map(|(index, value)| value ^ key[index % key.len()])
        .collect::<Vec<u8>>()
}

fn extract_record_id(value: &Value) -> Option<String> {
    if let Some(id) = value.as_str() {
        return Some(id.to_string());
    }

    let tb = value.get("tb").and_then(|item| item.as_str())?;
    let id = value.get("id").and_then(|item| item.as_str())?;
    Some(format!("{tb}:{id}"))
}

async fn read_setting<T>(db: &crate::db::DbState, key: &str) -> Result<Option<T>, String>
where
    T: DeserializeOwned,
{
    let mut result = db
        .query("SELECT value FROM site_settings WHERE key = $key LIMIT 1")
        .bind(("key", key.to_owned()))
        .await
        .map_err(|error| format!("Failed to read setting {key}: {error}"))?;

    let row: Option<Value> = result
        .take(0)
        .map_err(|error| format!("Failed to parse setting {key}: {error}"))?;

    let Some(row_value) = row else {
        return Ok(None);
    };
    let Some(setting_value) = row_value.get("value") else {
        return Ok(None);
    };

    serde_json::from_value(setting_value.clone())
        .map(Some)
        .map_err(|error| format!("Failed to decode setting {key}: {error}"))
}

async fn write_setting<T>(db: &crate::db::DbState, key: &str, value: &T) -> Result<(), String>
where
    T: serde::Serialize,
{
    let json_value = serde_json::to_value(value)
        .map_err(|error| format!("Failed to serialize setting {key}: {error}"))?;

    db.query("DELETE site_settings WHERE key = $key")
        .bind(("key", key.to_owned()))
        .await
        .map_err(|error| format!("Failed to replace setting {key}: {error}"))?;

    db.query(
        "CREATE site_settings CONTENT { key: $key, value: $value, type: 'json', updated_at: time::now() }",
    )
    .bind(("key", key.to_owned()))
    .bind(("value", json_value))
    .await
    .map_err(|error| format!("Failed to write setting {key}: {error}"))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{validate_scopes, xor_bytes};

    #[test]
    fn xor_roundtrip_restores_original_content() {
        let payload = b"backup-payload";
        let key = b"secret";
        let encrypted = xor_bytes(payload, key);
        let decrypted = xor_bytes(encrypted.as_slice(), key);
        assert_eq!(decrypted, payload);
    }

    #[test]
    fn validate_scopes_rejects_unknown_scope() {
        let scopes = vec!["database".to_string(), "unknown".to_string()];
        let result = validate_scopes(scopes.as_slice());
        assert!(result.is_err());
    }
}
