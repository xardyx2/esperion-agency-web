/**
 * Article Model
 *
 * Represents an article with multi-language support:
 * - Indonesian (id) and English (en) content
 * - Translation status tracking
 * - SEO-friendly slugs
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// Article model matching the articles table in SurrealDB
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Article {
    pub id: Option<Thing>,
    pub title: String,
    pub slug_id: String,
    pub slug_en: String,
    pub content_id: String,
    pub content_en: Option<String>,
    pub excerpt_id: Option<String>,
    pub excerpt_en: Option<String>,
    pub category: String,
    pub image: Option<String>,
    pub author: Option<Thing>,
    pub published: bool,
    pub published_at: Option<String>,
    pub translation_status: String,
    pub created_at: String,
    pub updated_at: String,
}

impl Article {
    /// Create a new article
    pub fn new(
        title: String,
        slug_id: String,
        slug_en: String,
        content_id: String,
        category: String,
    ) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            id: None,
            title,
            slug_id,
            slug_en,
            content_id,
            content_en: None,
            excerpt_id: None,
            excerpt_en: None,
            category,
            image: None,
            author: None,
            published: false,
            published_at: None,
            translation_status: "draft".to_string(),
            created_at: now.clone(),
            updated_at: now,
        }
    }

    /// Set English content
    pub fn with_content_en(mut self, content_en: String) -> Self {
        self.content_en = Some(content_en);
        self
    }

    /// Set excerpt in Indonesian
    pub fn with_excerpt_id(mut self, excerpt_id: String) -> Self {
        self.excerpt_id = Some(excerpt_id);
        self
    }

    /// Set excerpt in English
    pub fn with_excerpt_en(mut self, excerpt_en: String) -> Self {
        self.excerpt_en = Some(excerpt_en);
        self
    }

    /// Set featured image
    pub fn with_image(mut self, image: String) -> Self {
        self.image = Some(image);
        self
    }

    /// Set author
    pub fn with_author(mut self, author: Thing) -> Self {
        self.author = Some(author);
        self
    }

    /// Set published status
    pub fn with_published(mut self, published: bool) -> Self {
        self.published = published;
        if published {
            self.published_at = Some(chrono::Utc::now().to_rfc3339());
        }
        self
    }

    /// Set translation status
    pub fn with_translation_status(mut self, status: &str) -> Self {
        self.translation_status = status.to_string();
        self
    }
}

/// Request to create a new article
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateArticleRequest {
    pub title: String,
    pub slug_id: Option<String>,
    pub slug_en: Option<String>,
    pub content_id: String,
    pub content_en: Option<String>,
    pub excerpt_id: Option<String>,
    pub excerpt_en: Option<String>,
    pub category: String,
    pub image: Option<String>,
    pub published: Option<bool>,
}

/// Request to update an article
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateArticleRequest {
    pub title: Option<String>,
    pub slug_id: Option<String>,
    pub slug_en: Option<String>,
    pub content_id: Option<String>,
    pub content_en: Option<String>,
    pub excerpt_id: Option<String>,
    pub excerpt_en: Option<String>,
    pub category: Option<String>,
    pub image: Option<String>,
    pub published: Option<bool>,
    pub translation_status: Option<String>,
}

/// Filter for listing articles
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ArticleFilter {
    pub page: Option<u32>,
    pub limit: Option<u32>,
    pub category: Option<String>,
    pub language: Option<String>,
    pub published: Option<bool>,
    pub translation_status: Option<String>,
}

impl ArticleFilter {
    /// Build WHERE clause from filters
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

        if let Some(ref category) = self.category {
            conditions.push(format!("category = '{}'", category.replace('\'', "''")));
        }

        if let Some(ref language) = self.language {
            if language == "id" {
                conditions.push("slug_id != null".to_string());
            } else if language == "en" {
                conditions.push("slug_en != null".to_string());
            }
        }

        if let Some(published) = self.published {
            conditions.push(format!("published = {}", published));
        }

        if let Some(ref status) = self.translation_status {
            conditions.push(format!(
                "translation_status = '{}'",
                status.replace('\'', "''")
            ));
        }

        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }

    /// Calculate offset for pagination
    pub fn offset(&self) -> u32 {
        let page = self.page.unwrap_or(1);
        let limit = self.limit.unwrap_or(10);
        (page - 1) * limit
    }
}
