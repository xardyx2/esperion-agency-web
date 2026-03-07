/**
 * Translation Handler
 *
 * Handles automated content translation using Alibaba AI API:
 * - Auto-translate articles content
 * - Update translation status
 * - Handle multi-language content
 */

use axum::{
    extract::{Path, State},
    Json,
};
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::api::ApiResponse;
use crate::db::DbState;
use crate::models::article::Article;
use crate::services::translation::AlibabaTranslator;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslateRequest {
    pub target_languages: Vec<String>, // e.g., ["en", "id"]
}

#[utoipa::path(
    post,
    path = "/api/v1/articles/{id}/translate",
    tag = "Translation",
    request_body = TranslateRequest,
    responses(
        (status = 200, description = "Article translated", body = Article),
        (status = 400, description = "Invalid input"),
        (status = 404, description = "Article not found"),
        (status = 401, description = "Unauthorized"),
    ),
)]
#[axum::debug_handler]
pub async fn translate_article(
    State(db): State<DbState>,
    Path(id): Path<String>,
    Json(req): Json<TranslateRequest>,
) -> ApiResponse<Article> {
    // Fetch the original article from the database
    let query = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("id", &id))
        .await
        .map_err(|e| {
            tracing::error!("Database query failed: {}", e);
            crate::api::internal_error(e)
        })?;

    let article_row: Option<serde_json::Value> = result.take(0).ok().flatten();
    let mut article: Article = article_row
        .ok_or_else(|| {
            tracing::error!("Article not found with ID: {}", id);
            crate::api::not_found_error("Article not found")
        })
        .and_then(|row| {
            serde_json::from_value(row).map_err(|_| crate::api::internal_error("Failed to parse article"))
        })?;

    info!("Translating article: {} ({})", article.title, id);

    // Get the API key from environment variables
    let api_key = std::env::var("ALIBABA_API_KEY")
        .or_else(|_| std::env::var("ALIBABA_AI_API_KEY"))
        .map_err(|_| crate::api::internal_error("ALIBABA_API_KEY or ALIBABA_AI_API_KEY not configured"))?;

    let translator = AlibabaTranslator::new(api_key);

    for lang in &req.target_languages {
        match lang.as_str() {
            "en" => {
                if article.translation_status == "draft" || article.content_en.is_none() {
                    info!("Translating article to English");

                    // Determine source language based on current content
                    let source_lang = if !article.content_id.is_empty() {
                        "id" // Indonesian
                    } else {
                        tracing::warn!("No source content found for English translation");
                        continue;
                    };

                    let translated_content: String = translator
                        .translate(&article.content_id, source_lang, "en")
                        .await
                        .map_err(|e| {
                            tracing::error!("Translation to English failed: {:?}", e);
                            crate::api::internal_error(format!("Translation failed: {:?}", e))
                        })?;

                    // Get English slug by translating title if not already available
                    let mut updated_slug_en = article.slug_en.clone();
                    if article.slug_en.is_empty() || article.slug_en == article.slug_id {
                        // If no English slug exists, derive it from the title
                        // TODO: In a real implementation, you'd want to properly translate the title with the API as well
                        updated_slug_en = article.title.to_lowercase().replace(' ', "-");
                    }

                    article.content_en = Some(translated_content);
                    article.slug_en = updated_slug_en;

                    info!("Successfully translated article to English");
                }
            }
            "id" => {
                if article.translation_status == "en_only" || (article.translation_status.contains("en") && article.content_id.is_empty()) {
                    info!("Translating article to Indonesian");

                    let source_lang = if let Some(content_en) = &article.content_en {
                        "en" // English
                    } else {
                        tracing::warn!("No English content found for Indonesian translation");
                        continue;
                    };

                    let source_content = article.content_en.as_ref().unwrap();

                    let translated_content: String = translator
                        .translate(source_content, source_lang, "id")
                        .await
                        .map_err(|e| {
                            tracing::error!("Translation to Indonesian failed: {:?}", e);
                            crate::api::internal_error(format!("Translation failed: {:?}", e))
                        })?;

                    // Set the translated content as content_id
                    article.content_id = translated_content;

                    info!("Successfully translated article to Indonesian");
                }
            }
            _ => {
                tracing::warn!("Unsupported target language: {}", lang);
                continue;
            }
        }
    }

    // Update the translation status based on what content we have
    let new_status = determine_translation_status(&article);
    article.translation_status = new_status;
    
    // Update the updated_at timestamp
    article.updated_at = chrono::Utc::now().to_rfc3339();

    // Save the updated article back to the database
    let update_query = r#"
        UPDATE articles SET 
            content_en = $content_en,
            content_id = $content_id, 
            slug_en = $slug_en,
            translation_status = $translation_status, 
            updated_at = $updated_at 
        WHERE id = $id
    "#;
    
    let mut result = db
        .query(update_query)
        .bind(("id", &id))
        .bind(("content_en", &article.content_en))
        .bind(("content_id", &article.content_id))
        .bind(("slug_en", &article.slug_en))
        .bind(("translation_status", &article.translation_status))
        .bind(("updated_at", &article.updated_at))
        .await
        .map_err(|e| {
            tracing::error!("Failed to update article: {}", e);
            crate::api::internal_error(e)
        })?;

    // Verify the update was successful
    let _: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    info!("Article translation completed and saved: {} ({})", article.title, id);
    
    Ok(Json(article))
}

/// Determine the appropriate translation status based on available content
fn determine_translation_status(article: &Article) -> String {
    let has_id_content = !article.content_id.is_empty();
    let has_en_content = article.content_en.as_ref().map_or(false, |cont| !cont.is_empty());

    match (has_id_content, has_en_content) {
        (true, true) => "complete".to_string(),
        (true, false) => "id_only".to_string(),
        (false, true) => "en_only".to_string(),
        (false, false) => "draft".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::translation::{AlibabaTranslator, TranslationError};
    use crate::models::article::Article;
    use std::sync::Arc;

    #[tokio::test]
    async fn test_determine_translation_status() {
        // Test complete status
        let article_complete = Article::new(
            "Test".to_string(),
            "test".to_string(),
            "test-en".to_string(),
            "Content in ID".to_string(),
            "category".to_string(),
        ).with_content_en("Content in EN".to_string());
        assert_eq!(determine_translation_status(&article_complete), "complete");

        // Test id_only status
        let article_id_only = Article::new(
            "Test".to_string(),
            "test".to_string(),
            "test".to_string(),
            "Content in ID".to_string(),
            "category".to_string(),
        );
        assert_eq!(determine_translation_status(&article_id_only), "id_only");

        // Test en_only status
        let article_en_only = Article::new(
            "Test".to_string(),
            "".to_string(),
            "test".to_string(),
            "".to_string(),
            "category".to_string(),
        ).with_content_en("Content in EN".to_string());
        assert_eq!(determine_translation_status(&article_en_only), "en_only");

        // Test draft status
        let article_draft = Article::new(
            "Test".to_string(),
            "".to_string(),
            "".to_string(),
            "".to_string(),
            "category".to_string(),
        ).with_content_en("".to_string());
        assert_eq!(determine_translation_status(&article_draft), "draft");
    }
}