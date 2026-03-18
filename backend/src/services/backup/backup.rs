use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupOptions {
    pub backup_type: BackupType,
    pub scope: BackupScope,
    pub encrypt: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BackupType {
    Full,
    Database,
    Files,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BackupScope {
    All,
    Articles,
    Media,
    Settings,
}

pub struct BackupService;

impl BackupService {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn create_backup(&self, options: BackupOptions) -> Result<String, String> {
        // TODO: Implement
        Ok("backup_path".to_string())
    }
}
