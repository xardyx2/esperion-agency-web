use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::types::RecordId;
use surrealdb::types::SurrealValue;

/// Translation Memory Entry - for storing approved human translations
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslationMemory {
    pub id: Option<RecordId>,
    pub source_text: String,
    pub translated_text: String,
    pub source_lang: String,
    pub target_lang: String,
    pub approved: bool,
    pub reviewer_id: Option<RecordId>,
    pub version: i32,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl TranslationMemory {
    pub fn new(
        source_text: String,
        translated_text: String,
        source_lang: String,
        target_lang: String,
        approved: bool,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: None,
            source_text,
            translated_text,
            source_lang,
            target_lang,
            approved,
            reviewer_id: None,
            version: 1,
            notes: None,
            created_at: now,
            updated_at: now,
        }
    }

    pub fn with_reviewer(mut self, reviewer_id: RecordId) -> Self {
        self.reviewer_id = Some(reviewer_id);
        self
    }

    pub fn with_notes(mut self, notes: String) -> Self {
        self.notes = Some(notes);
        self
    }

    pub fn approve(mut self) -> Self {
        self.approved = true;
        self.updated_at = Utc::now();
        self
    }

    pub fn with_version(mut self, version: i32) -> Self {
        self.version = version;
        self
    }
}
