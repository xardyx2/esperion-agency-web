use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RestoreOptions {
    pub backup_path: String,
    pub target_scope: RestoreScope,
    pub overwrite: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum RestoreScope {
    All,
    Database,
    Files,
}

pub struct RestoreService;

impl RestoreService {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn restore_backup(&self, options: RestoreOptions) -> Result<String, String> {
        // TODO: Implement
        Ok("restore_complete".to_string())
    }
}
