/**
 * SEO Score Model
 *
 * Represents SEO scoring results for articles
 * Used for tracking and improving article SEO
 */
use serde::{Deserialize, Serialize};
use surrealdb::types::SurrealValue;
use surrealdb::types::RecordId;

/// SEO Score breakdown
#[derive(Debug, Clone, Serialize, Deserialize, surrealdb::types::SurrealValue)]
pub struct SeoScoreBreakdown {
    pub content_quality: u32,  // 35 points max
    pub on_page_seo: u32,      // 25 points max
    pub readability: u32,      // 15 points max
    pub internal_linking: u32, // 10 points max
    pub technical_seo: u32,    // 10 points max
    pub local_seo: u32,        // 5 points max
}

impl SeoScoreBreakdown {
    pub fn total(&self) -> u32 {
        self.content_quality
            + self.on_page_seo
            + self.readability
            + self.internal_linking
            + self.technical_seo
            + self.local_seo
    }
}

/// SEO Score record
#[derive(Debug, Clone, Serialize, Deserialize, surrealdb::types::SurrealValue)]
pub struct SeoScore {
    pub id: Option<RecordId>,
    pub article_id: RecordId,
    pub score: u32,
    pub breakdown: SeoScoreBreakdown,
    pub suggestions: Vec<String>,
    pub created_at: Option<String>,
}

impl SeoScore {
    pub fn new(article_id: RecordId) -> Self {
        Self {
            id: None,
            article_id,
            score: 0,
            breakdown: SeoScoreBreakdown {
                content_quality: 0,
                on_page_seo: 0,
                readability: 0,
                internal_linking: 0,
                technical_seo: 0,
                local_seo: 0,
            },
            suggestions: Vec::new(),
            created_at: Some(chrono::Utc::now().to_rfc3339()),
        }
    }
}

/// SEO Score request for calculation
#[derive(Debug, Clone, Serialize, Deserialize, surrealdb::types::SurrealValue)]
pub struct CalculateSeoScoreRequest {
    pub article_id: String,
    pub title: String,
    pub content: String,
    pub meta_description: Option<String>,
    pub slug: String,
}

/// Competitor analysis record
#[derive(Debug, Clone, Serialize, Deserialize, surrealdb::types::SurrealValue)]
pub struct CompetitorAnalysis {
    pub id: Option<RecordId>,
    pub keyword: String,
    pub data: serde_json::Value,
    pub fetched_at: Option<String>,
    pub source: String,
}
