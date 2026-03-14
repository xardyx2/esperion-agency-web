/**
 * Translation Handler
 *
 * Handles automated content translation, human translation review, and translation memory.
 * - Auto-translate articles content using Alibaba AI
 * - Review, approve/refine AI translations
 * - Manage translation memory for approved human translations
 */

use axum::{
    extract::{Extension, Path, State},
    Json,
};
use serde::{Deserialize, Serialize};
use surrealdb::types::RecordId;
use tracing::info;

use crate::api::ApiResponse;
use crate::AppState;
use crate::models::user::UserClaims;
use crate::models::article::Article;
use crate::models::translation::TranslationMemory;
use crate::services::translation::AlibabaTranslator;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslateRequest {
    pub target_languages: Vec<String>, // e.g., ["en", "id"]
    pub update_cache: Option<bool>,    // Whether to update the translation cache
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslationReviewRequest {
    pub translated_text: String,
    pub approve: Option<bool>,
    pub notes: Option<String>,
    pub update_memory: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslationMemoryRequest {
    pub source_text: String,
    pub translated_text: String,
    pub source_lang: String,
    pub target_lang: String,
    pub notes: Option<String>,
    pub approved: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FindTranslationMemoryRequest {
    pub source_text: String,
    pub source_lang: String,
    pub target_lang: String,
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
    security(("bearer_auth" = [])),
)]
#[axum::debug_handler]
pub async fn translate_article(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Extension(_claims): Extension<UserClaims>,
    Json(req): Json<TranslateRequest>,
) -> ApiResponse<Article> {
    let db = &app_state.db;
    
    // Fetch the original article from the database
    let query = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("id", id.clone()))
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

                    article.content_en = Some(translated_content.clone());
                    article.slug_en = updated_slug_en.clone();

                    // Optionally update the translation cache
                    if req.update_cache.unwrap_or(true) {
                        update_translation_cache(
                            db,
                            &article.content_id, 
                            &article.slug_id, 
                            &translated_content, 
                            &updated_slug_en,
                            "id",
                            "en"
                        )
                        .await?;
                    }

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
                    article.content_id = translated_content.clone();

                    // Optionally update the translation cache
                    if req.update_cache.unwrap_or(true) {
                        update_translation_cache(
                            db,
                            &article.content_en.as_ref().unwrap_or(&"".to_string()), 
                            &article.slug_en, 
                            &article.content_id, 
                            &article.slug_id, 
                            "en",
                            "id"
                        )
                        .await?;
                    }

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
        .bind(("id", id.clone()))
        .bind(("content_en", article.content_en.clone()))
        .bind(("content_id", article.content_id.clone()))
        .bind(("slug_en", article.slug_en.clone()))
        .bind(("translation_status", article.translation_status.clone()))
        .bind(("updated_at", article.updated_at.clone()))
        .await
        .map_err(|e| {
            tracing::error!("Failed to update article: {}", e);
            crate::api::internal_error(e)
        })?;

    // Verify the update was successful
    let _: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    // Log activity
    // app_state.log_activity(
    //     &_claims.sub,  // Assuming claims has a sub field for user ID
    //     "TRANSLATE_ARTICLE",
    //     "ARTICLE",
    //     Some(&id),
    //     &serde_json::json!({"target_languages": req.target_languages}),
    // ).await?;


    info!("Article translation completed and saved: {} ({})", article.title, id);
    
    Ok(Json(article))
}

/// Updates the translation cache with newly translated content
async fn update_translation_cache(
    db: &surrealdb::Surreal<surrealdb::engine::remote::ws::Client>,
    source_content: &str,
    source_slug: &str,
    translated_content: &str,
    translated_slug: &str,
    source_lang: &str,
    target_lang: &str,
) -> Result<(), crate::api::ApiError> {
    // Convert &str to owned Strings to avoid lifetime issues
    let source_content = source_content.to_owned();
    let source_slug = source_slug.to_owned();
    let translated_content = translated_content.to_owned();
    let translated_slug = translated_slug.to_owned();
    let source_lang = source_lang.to_owned();
    let target_lang = target_lang.to_owned();
    
    let query = r#"
        -- Update or insert into translation cache for article content
        INSERT INTO translation_cache (
            source_text, 
            translated_text, 
            source_lang, 
            target_lang, 
            content_type,
            created_at
        ) VALUES ( 
            $source_content,
            $translated_content,
            $source_lang, 
            $target_lang, 
            "article",
            time::now()
        ) ON DUPLICATE KEY UPDATE
            translated_text = $translated_content,
            updated_at = time::now();
        
        -- Also cache the slug translation
        INSERT INTO translation_cache (
            source_text, 
            translated_text, 
            source_lang, 
            target_lang, 
            content_type,
            created_at
        ) VALUES ( 
            $source_slug,
            $translated_slug,
            $source_lang, 
            $target_lang, 
            "slug",
            time::now()
        ) ON DUPLICATE KEY UPDATE
            translated_text = $translated_slug,
            updated_at = time::now();
    "#;

    db.query(query)
        .bind(("source_content", source_content))
        .bind(("source_slug", source_slug))
        .bind(("translated_content", translated_content))
        .bind(("translated_slug", translated_slug))
        .bind(("source_lang", source_lang.to_owned()))
        .bind(("target_lang", target_lang.to_owned()))
        .await
        .map_err(|e| {
            tracing::error!("Failed to update translation cache: {}", e);
            crate::api::internal_error(e)
        })?;

    Ok(())
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

#[utoipa::path(
    post,
    path = "/api/v1/articles/{id}/translate/{lang}/review",
    tag = "Translation",
    request_body = TranslationReviewRequest,
    responses(
        (status = 200, description = "Translation reviewed", body = Article),
        (status = 400, description = "Invalid input"),
        (status = 404, description = "Article not found"),
        (status = 401, description = "Unauthorized"),
    ),
    security(("bearer_auth" = [])),
)]
#[axum::debug_handler]
pub async fn review_translation(
    State(app_state): State<crate::AppState>,
    Path((id, lang)): Path<(String, String)>,
    Extension(claims): Extension<UserClaims>,
    Json(req): Json<TranslationReviewRequest>,
) -> ApiResponse<Article> {
    let db = &app_state.db;
    
    // Fetch the article from the database
    let query = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("id", id.clone()))
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

    info!("Reviewing {} translation for article: {} ({})", 
          &lang, article.title, id);

    // Apply the reviewed translation
    match lang.as_str() {
        "en" => {
            if let Some(content_en_opt) = &mut article.content_en {
                if content_en_opt != &req.translated_text {
                    *content_en_opt = req.translated_text.clone();
                    info!("Updated English translation after review");
                    
                    // If approving this change, potentially add to translation memory
                    if let Some(update_memory) = req.update_memory {
                        if update_memory {
                            let source_lang = if !article.content_id.is_empty() {
                                "id"
                            } else {
                                tracing::warn!("Could not determine source language for translation memory");
                                ""
                            };
                            
                            if !source_lang.is_empty() {
                                add_to_translation_memory(
                                    db,
                                    &article.content_id,
                                    &req.translated_text,
                                    source_lang,
                                    "en",
                                    Some(RecordId::new("users", claims.sub.clone())),
                                    req.approve.unwrap_or(true),
                                    req.notes.clone(),
                                ).await?;
                            }
                        }
                    }
                }
            }
        },
        "id" => {
            if article.content_id != req.translated_text {
                article.content_id = req.translated_text.clone();
                info!("Updated Indonesian translation after review");
                
                // If approving this change, potentially add to translation memory
                if let Some(update_memory) = req.update_memory {
                    if update_memory {
                        let source_lang = if article.content_en.is_some() && article.content_en.as_ref().map_or(false, |c| !c.is_empty()) {
                            "en"
                        } else {
                            tracing::warn!("Could not determine source language for translation memory");
                            ""
                        };
                        
                        if !source_lang.is_empty() {
                            add_to_translation_memory(
                                db,
                                article.content_en.as_ref().unwrap_or(&"".to_string()),
                                &req.translated_text,
                                source_lang,
                                "id",
                                Some(RecordId::new("users", claims.sub.clone())),
                                req.approve.unwrap_or(true),
                                req.notes.clone(),
                            ).await?;
                        }
                    }
                }
            }
        },
        _ => {
            tracing::error!("Unsupported language for review: {}", lang);
            return Err(crate::api::bad_request_error("Unsupported language"));
        }
    }

    // Update article if it was approved
    if let Some(approve) = req.approve {
        if approve {
            info!("Translation approved for article: {} ({} - {})", article.title, id, lang);
        } else {
            info!("Translation rejected for article: {} ({} - {})", article.title, id, lang);
        }
    }

    // Update the translation status
    let new_status = determine_translation_status(&article);
    article.translation_status = new_status;
    
    // Update the updated_at timestamp
    article.updated_at = chrono::Utc::now().to_rfc3339();

    // Save the updated article back to the database
    let update_query = r#"
        UPDATE articles SET 
            content_en = $content_en,
            content_id = $content_id,
            translation_status = $translation_status,
            updated_at = $updated_at 
        WHERE id = $id
    "#;
    
    let _result = db
        .query(update_query)
        .bind(("id", id.clone()))
        .bind(("content_en", article.content_en.clone()))
        .bind(("content_id", article.content_id.clone()))
        .bind(("translation_status", article.translation_status.clone()))
        .bind(("updated_at", article.updated_at.clone()))
        .await
        .map_err(|e| {
            tracing::error!("Failed to update reviewed article: {}", e);
            crate::api::internal_error(e)
        })?;

    // Log activity
    // app_state.log_activity(
    //     &_claims.sub.into(), // Assuming claims has a sub field for user ID
    //     "REVIEW_TRANSLATION",
    //     "ARTICLE",
    //     Some(&id),
    //     &serde_json::json!({"language": lang, "action": if req.approve.unwrap_or(false) {"approved"} else {"not_approved"}}),
    // ).await?;

    info!("Translation review completed for article: {} ({})", article.title, id);
    Ok(Json(article))
}

/// Adds a translation pair to the translation memory database
async fn add_to_translation_memory(
    db: &surrealdb::Surreal<surrealdb::engine::remote::ws::Client>,
    source_text: &str,
    translated_text: &str,
    source_lang: &str,
    target_lang: &str,
    reviewer_id: Option<RecordId>,
    approved: bool,
    notes: Option<String>,
) -> Result<(), crate::api::ApiError> {
    let query = r#"
        INSERT INTO translation_memory (
            source_text,
            translated_text,
            source_lang,
            target_lang,
            reviewer_id,
            approved,
            notes,
            created_at,
            updated_at
        ) VALUES (
            $source_text,
            $translated_text,
            $source_lang,
            $target_lang,
            $reviewer_id,
            $approved,
            $notes,
            time::now(),
            time::now()
        ) ON DUPLICATE KEY UPDATE
            translated_text = $translated_text,
            approved = $approved,
            notes = $notes,
            updated_at = time::now();
    "#;

    db.query(query)
        .bind(("source_text", source_text.to_owned()))
        .bind(("translated_text", translated_text.to_owned()))
        .bind(("source_lang", source_lang.to_owned()))
        .bind(("target_lang", target_lang.to_owned()))
        .bind(("reviewer_id", reviewer_id))
        .bind(("approved", approved))
        .bind(("notes", notes))
        .await
        .map_err(|e| {
            tracing::error!("Failed to add to translation memory: {}", e);
            crate::api::internal_error(e)
        })?;

    info!(
        "Added/updated translation memory entry: {} -> {} ({} to {})",
        source_text.chars().take(20).collect::<String>(),
        translated_text.chars().take(20).collect::<String>(),
        source_lang,
        target_lang
    );

    Ok(())
}

#[utoipa::path(
    post,
    path = "/api/v1/translation/memory",
    tag = "Translation",
    request_body = TranslationMemoryRequest,
    responses(
        (status = 200, description = "Translation memory entry added", body = TranslationMemory),
        (status = 400, description = "Invalid input"),
        (status = 401, description = "Unauthorized"),
    ),
    security(("bearer_auth" = [])),
)]
#[axum::debug_handler]
pub async fn add_translation_memory_entry(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(req): Json<TranslationMemoryRequest>,
) -> ApiResponse<TranslationMemory> {
    let db = &app_state.db;
    
    // Create a new translation memory entry
    let mut translation_memory = TranslationMemory::new(
        req.source_text,
        req.translated_text,
        req.source_lang,
        req.target_lang,
        req.approved.unwrap_or(true),
    );
    
    if let Some(notes) = req.notes {
        translation_memory = translation_memory.with_notes(notes);
    }
    
    // Add the entry to the database
    let query = r#"
        CREATE translation_memory CONTENT {
            source_text: $source_text,
            translated_text: $translated_text,
            source_lang: $source_lang,
            target_lang: $target_lang,
            approved: $approved,
            notes: $notes,
            created_at: time::now(),
            updated_at: time::now(),
            reviewer_id: $reviewer_id
        }
    "#;
    
    let mut result = db
        .query(query)
        .bind(("source_text", translation_memory.source_text.clone()))
        .bind(("translated_text", translation_memory.translated_text.clone()))
        .bind(("source_lang", translation_memory.source_lang.clone()))
        .bind(("target_lang", translation_memory.target_lang.clone()))
        .bind(("approved", translation_memory.approved))
        .bind(("notes", translation_memory.notes.clone()))
        .bind(("reviewer_id", RecordId::new("users", claims.sub.clone())))
        .await
        .map_err(|e| {
            tracing::error!("Failed to create translation memory entry: {}", e);
            crate::api::internal_error(e)
        })?;
    
    let created_entry: Option<TranslationMemory> = result.take(0).ok().flatten()
        .map(|v: serde_json::Value| serde_json::from_value(v)
        .map_err(|_| crate::api::internal_error("Failed to serialize translation memory entry")))
        .transpose()?;
    
    let created_entry = created_entry.ok_or_else(|| {
        crate::api::internal_error("Failed to retrieve created translation memory entry")
    })?;
    

    // Log activity
    // app_state.log_activity(
    //     &_claims.sub.into(), // Assuming claims has a sub field for user ID
    //     "ADD_TRANSLATION_MEMORY",
    //     "TRANSLATION_MEMORY",
    //     Some(&created_entry.id.map(|id| id.to_string()).unwrap_or_default()),
    //     &serde_json::json!({"language_pair": format!("{}->{}", created_entry.source_lang, created_entry.target_lang)}),
    // ).await?;

    Ok(Json(created_entry))
}

#[utoipa::path(
    post,
    path = "/api/v1/translation/memory/search",
    tag = "Translation",
    request_body = FindTranslationMemoryRequest,
    responses(
        (status = 200, description = "Translation memory entries", body = Vec<TranslationMemory>),
        (status = 400, description = "Invalid input"),
    ),
)]
#[axum::debug_handler]
pub async fn find_translation_memory(
    State(db): State<crate::AppState>,
    Json(req): Json<FindTranslationMemoryRequest>,
) -> ApiResponse<Vec<TranslationMemory>> {
    let query = r#"
        SELECT * FROM translation_memory 
        WHERE source_text = $source_text 
          AND source_lang = $source_lang 
          AND target_lang = $target_lang
          AND approved = true
    "#;
    
    let mut result = db
        .db
        .query(query)
        .bind(("source_text", req.source_text.clone()))
        .bind(("source_lang", req.source_lang.clone()))
        .bind(("target_lang", req.target_lang.clone()))
        .await
        .map_err(|e| {
            tracing::error!("Failed to search translation memory: {}", e);
            crate::api::internal_error(e)
        })?;
    
    let entries: Option<Vec<TranslationMemory>> = result.take(0).ok().flatten()
        .map(|v: serde_json::Value| serde_json::from_value(v)
        .map_err(|_| crate::api::internal_error("Failed to serialize translation memory entries")))
        .transpose()?;
    
    let entries = entries.unwrap_or_default();
    
    tracing::info!("Found {} matching approved translation memory entries", entries.len());

    Ok(Json(entries))
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
