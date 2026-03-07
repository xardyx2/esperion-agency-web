use chrono::Datelike;
/**
 * Media Model
 *
 * Represents media files in the media library
 * Used for image/video upload and management
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// Media file types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum MediaType {
    Image,
    Video,
    Audio,
    Document,
    Other,
}

impl std::fmt::Display for MediaType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MediaType::Image => write!(f, "image"),
            MediaType::Video => write!(f, "video"),
            MediaType::Audio => write!(f, "audio"),
            MediaType::Document => write!(f, "document"),
            MediaType::Other => write!(f, "other"),
        }
    }
}

impl MediaType {
    pub fn from_extension(ext: &str) -> Self {
        match ext.to_lowercase().as_str() {
            "jpg" | "jpeg" | "png" | "gif" | "webp" | "svg" | "bmp" => MediaType::Image,
            "mp4" | "webm" | "avi" | "mov" | "mkv" => MediaType::Video,
            "mp3" | "wav" | "ogg" | "flac" => MediaType::Audio,
            "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" => MediaType::Document,
            _ => MediaType::Other,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            MediaType::Image => "image",
            MediaType::Video => "video",
            MediaType::Audio => "audio",
            MediaType::Document => "document",
            MediaType::Other => "other",
        }
    }
}

/// Media size variant with path metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaSize {
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub path: String,
}

/// Media file record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Media {
    pub id: Option<Thing>,
    pub filename: String,
    pub path: String,
    pub alt_text: Option<String>,
    pub year: i32,
    pub month: i32,
    #[serde(rename = "type")]
    pub media_type: String,
    pub size: i64,
    pub webp_path: Option<String>,
    pub original_path: String,
    pub thumbnail_path: Option<String>,
    pub sizes: Vec<MediaSize>,
    pub keep_original: bool,
    pub uploaded_by: Option<Thing>,
    pub created_at: Option<String>,
}

impl Media {
    /// Create a new media record
    pub fn new(
        filename: String,
        path: String,
        original_path: String,
        media_type: MediaType,
        size: i64,
        uploaded_by: Option<Thing>,
    ) -> Self {
        let now = chrono::Utc::now();

        Self {
            id: None,
            filename,
            path,
            alt_text: None,
            year: now.year(),
            month: now.month() as i32,
            media_type: media_type.as_str().to_string(),
            size,
            webp_path: None,
            original_path,
            thumbnail_path: None,
            sizes: Vec::new(),
            keep_original: true, // Default to keeping originals
            uploaded_by,
            created_at: Some(now.to_rfc3339()),
        }
    }

    /// Set alt text for the media
    pub fn with_alt_text(mut self, alt_text: String) -> Self {
        self.alt_text = Some(alt_text);
        self
    }

    /// Set WebP path for the media
    pub fn with_webp_path(mut self, webp_path: String) -> Self {
        self.webp_path = Some(webp_path);
        self
    }

    /// Set thumbnail path for the media
    pub fn with_thumbnail_path(mut self, thumbnail_path: String) -> Self {
        self.thumbnail_path = Some(thumbnail_path);
        self
    }

    /// Add media sizes
    pub fn with_sizes(mut self, sizes: Vec<MediaSize>) -> Self {
        self.sizes = sizes;
        self
    }

    /// Set whether to keep the original file
    pub fn with_keep_original(mut self, keep_original: bool) -> Self {
        self.keep_original = keep_original;
        self
    }
}

/// Media upload response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaUploadResponse {
    pub id: String,
    pub filename: String,
    pub path: String,
    pub url: String,
    pub webp_url: Option<String>,
    pub thumbnail_url: Option<String>,
    pub sizes: Vec<MediaSize>,
    pub keep_original: bool,
    pub media_type: String,
    pub size: i64,
    pub alt_text: Option<String>,
}

/// Media filter options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MediaFilter {
    pub year: Option<i32>,
    pub month: Option<i32>,
    pub media_type: Option<String>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl MediaFilter {
    /// Build WHERE clause for SurrealDB query
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

        if let Some(year) = self.year {
            conditions.push(format!("year = {}", year));
        }

        if let Some(month) = self.month {
            conditions.push(format!("month = {}", month));
        }

        if let Some(ref media_type) = self.media_type {
            conditions.push(format!("type = '{}'", media_type));
        }

        if let Some(ref search) = self.search {
            conditions.push(format!(
                "filename CONTAINS '{}' OR alt_text CONTAINS '{}'",
                search.replace('\'', "''"),
                search.replace('\'', "''")
            ));
        }

        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }
}
