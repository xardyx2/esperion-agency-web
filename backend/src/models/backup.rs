use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BackupSettings {
    pub schedule_enabled: bool,
    pub schedule_cron: String,
    pub retention_count: u32,
    pub encryption_enabled: bool,
    pub files_directory: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateBackupRequest {
    pub scopes: Vec<String>,
    pub reason: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BackupJob {
    pub id: String,
    pub status: String,
    pub scopes: Vec<String>,
    pub reason: Option<String>,
    pub location: Option<String>,
    pub error: Option<String>,
    pub created_at: Option<String>,
    pub completed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BackupHistoryResponse {
    pub data: Vec<BackupJob>,
    pub total: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RestoreBackupRequest {
    pub backup_id: String,
    pub scope: String,
    pub confirmation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RestoreBackupResponse {
    pub success: bool,
    pub message: String,
}
