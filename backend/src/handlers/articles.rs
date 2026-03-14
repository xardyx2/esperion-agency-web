/**
 * Articles Handler
 * 
 * Handles article CRUD operations:
 * - List articles (with pagination, filters)
 * - Get article by slug
 * - Create article
 * - Update article
 * - Delete article
 */

use axum::{
    extract::{Path, Query, State},
    Json,
    Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::ApiResponse;
use crate::AppState;

/// Article response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ArticleResponse {
    pub id: String,
    pub title: String,
    pub slug_id: String,
    pub slug_en: String,
    pub content_id: String,
    pub content_en: String,
    pub excerpt_id: Option<String>,
    pub excerpt_en: Option<String>,
    pub category: String,
    pub image: Option<String>,
    pub author: Option<String>,
    pub published: bool,
    pub published_at: Option<String>,
    pub translation_status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ArticleTranslationsResponse {
    pub id: String,
    pub slug_id: String,
    pub slug_en: String,
    pub content_id: String,
    pub content_en: Option<String>,
    pub translation_status: String,
    pub available_languages: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TranslationStatusRequest {
    pub translation_status: String,
    pub publication_options: Option<String>,
}

/// List articles query params
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, utoipa::IntoParams)]
pub struct ListArticlesQuery {
    pub page: Option<u32>,
    pub limit: Option<u32>,
    pub category: Option<String>,
    pub language: Option<String>,
}

impl ListArticlesQuery {
    fn build_where_clause(&self) -> String {
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
        
        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }
    
    fn offset(&self) -> u32 {
        let page = self.page.unwrap_or(1);
        let limit = self.limit.unwrap_or(10);
        (page - 1) * limit
    }
}

/// Create/update article request
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ArticleRequest {
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

/// List articles
#[utoipa::path(
    get,
    path = "/api/v1/articles",
    tag = "Articles",
    params(ListArticlesQuery),
    responses(
        (status = 200, description = "List of articles", body = Vec<ArticleResponse>),
        (status = 401, description = "Unauthorized"),
    ),
)]
#[axum::debug_handler]
pub async fn list_articles(
    State(app_state): State<crate::AppState>,
    Query(query): Query<ListArticlesQuery>,
) -> ApiResponse<Vec<ArticleResponse>> {
    let db = &app_state.db;
    let where_clause = query.build_where_clause();
    let limit = query.limit.unwrap_or(10);
    let offset = query.offset();
    
    let list_query = format!(
        "SELECT * FROM articles{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );
    
    let mut result = db
        .query(list_query)
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let articles: Vec<serde_json::Value> = result.take(0).unwrap_or_default();
    let responses = articles.into_iter().filter_map(|a| serde_json::from_value(a).ok()).collect();
    
    Ok(Json(responses))
}

fn slugify(value: &str) -> String {
    value
        .trim()
        .to_lowercase()
        .chars()
        .map(|ch| if ch.is_alphanumeric() { ch } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|segment| !segment.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn determine_translation_status(content_id: &str, content_en: Option<&String>) -> String {
    let has_id = !content_id.trim().is_empty();
    let has_en = content_en.map(|value| !value.trim().is_empty()).unwrap_or(false);

    match (has_id, has_en) {
        (true, true) => "complete".to_string(),
        (true, false) => "id_only".to_string(),
        (false, true) => "en_only".to_string(),
        _ => "draft".to_string(),
    }
}

fn available_languages(article: &ArticleResponse) -> Vec<String> {
    let mut languages = Vec::new();
    if !article.content_id.trim().is_empty() && !article.slug_id.trim().is_empty() {
        languages.push("id".to_string());
    }
    if !article.content_en.trim().is_empty() && !article.slug_en.trim().is_empty() {
        languages.push("en".to_string());
    }
    languages
}

/// Get article by slug
#[utoipa::path(
    get,
    path = "/api/v1/articles/{slug}",
    tag = "Articles",
    params(
        ("slug" = String, Path, description = "Article slug (id or en)"),
    ),
    responses(
        (status = 200, description = "Article details", body = ArticleResponse),
        (status = 404, description = "Article not found"),
    ),
)]
#[axum::debug_handler]
pub async fn get_article(
    State(app_state): State<crate::AppState>,
    Path(slug): Path<String>,
) -> ApiResponse<ArticleResponse> {
    let db = &app_state.db;
    let query = "SELECT * FROM articles WHERE id = $slug OR slug_id = $slug OR slug_en = $slug LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("slug", slug.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let article: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = article.ok_or_else(|| crate::api::not_found_error("Article not found"))?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| crate::api::internal_error("Failed to parse article"))
}

/// Get article by any slug with translation mapping context.
#[utoipa::path(
    get,
    path = "/api/v1/articles/by-slug/{slug}",
    tag = "Articles",
    params(("slug" = String, Path, description = "Article slug (id or en)")),
    responses(
        (status = 200, description = "Article details with translation mapping", body = ArticleTranslationsResponse),
        (status = 404, description = "Article not found")
    )
)]
#[axum::debug_handler]
pub async fn get_article_by_slug(
    State(app_state): State<crate::AppState>,
    Path(slug): Path<String>,
) -> ApiResponse<ArticleTranslationsResponse> {
    let Json(article) = get_article(State(app_state), Path(slug)).await?;
    Ok(Json(ArticleTranslationsResponse {
        id: article.id.clone(),
        slug_id: article.slug_id.clone(),
        slug_en: article.slug_en.clone(),
        content_id: article.content_id.clone(),
        content_en: if article.content_en.is_empty() { None } else { Some(article.content_en.clone()) },
        translation_status: article.translation_status.clone(),
        available_languages: available_languages(&article),
    }))
}

/// Get article translations.
#[utoipa::path(
    get,
    path = "/api/v1/articles/{id}/translations",
    tag = "Articles",
    params(("id" = String, Path, description = "Article ID")),
    responses(
        (status = 200, description = "Article translation state", body = ArticleTranslationsResponse),
        (status = 404, description = "Article not found")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_article_translations(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<ArticleTranslationsResponse> {
    let db = &app_state.db;
    let query = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    let mut result = db.query(query).bind(("id", id)).await.map_err(|e| crate::api::internal_error(e.to_owned()))?;
    let article: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = article.ok_or_else(|| crate::api::not_found_error("Article not found"))?;
    let article: ArticleResponse = serde_json::from_value(article).map_err(|_| crate::api::internal_error("Failed to parse article"))?;

    Ok(Json(ArticleTranslationsResponse {
        id: article.id.clone(),
        slug_id: article.slug_id.clone(),
        slug_en: article.slug_en.clone(),
        content_id: article.content_id.clone(),
        content_en: if article.content_en.is_empty() { None } else { Some(article.content_en.clone()) },
        translation_status: article.translation_status.clone(),
        available_languages: available_languages(&article),
    }))
}

/// Create article
#[utoipa::path(
    post,
    path = "/api/v1/articles",
    tag = "Articles",
    request_body = ArticleRequest,
    responses(
        (status = 201, description = "Article created", body = ArticleResponse),
        (status = 400, description = "Invalid input"),
        (status = 401, description = "Unauthorized"),
    ),
)]
#[axum::debug_handler]
pub async fn create_article(
    State(app_state): State<crate::AppState>,
    Json(req): Json<ArticleRequest>,
) -> ApiResponse<ArticleResponse> {
    let db = &app_state.db;
    let slug_id = req.slug_id.clone().filter(|value| !value.trim().is_empty()).unwrap_or_else(|| slugify(&req.title));
    let slug_en = req.slug_en.clone().filter(|value| !value.trim().is_empty()).unwrap_or_else(|| slug_id.clone());
    let now = chrono::Utc::now().to_rfc3339();
    let translation_status = determine_translation_status(&req.content_id, req.content_en.as_ref());
    let published = req.published.unwrap_or(false);
    let published_at = if published { Some(now.clone()) } else { None };

    let insert_query = "CREATE articles SET title = $title, slug_id = $slug_id, slug_en = $slug_en, content_id = $content_id, content_en = $content_en, excerpt_id = $excerpt_id, excerpt_en = $excerpt_en, category = $category, image = $image, published = $published, published_at = $published_at, translation_status = $translation_status, created_at = $now, updated_at = $now";
    
    let mut result = db
        .query(insert_query)
        .bind(("title", req.title.to_owned()))
        .bind(("slug_id", slug_id.to_owned()))
        .bind(("slug_en", slug_en.to_owned()))
        .bind(("content_id", req.content_id.to_owned()))
        .bind(("content_en", req.content_en.to_owned()))
        .bind(("excerpt_id", req.excerpt_id.to_owned()))
        .bind(("excerpt_en", req.excerpt_en.to_owned()))
        .bind(("category", req.category.to_owned()))
        .bind(("image", req.image.to_owned()))
        .bind(("published", published.to_owned()))
        .bind(("published_at", published_at.to_owned()))
        .bind(("translation_status", translation_status.to_owned()))
        .bind(("now", now.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let created: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = created.ok_or_else(|| crate::api::internal_error("Failed to create article"))?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| crate::api::internal_error("Failed to parse article"))
}

/// Update article
#[utoipa::path(
    put,
    path = "/api/v1/articles/{id}",
    tag = "Articles",
    params(
        ("id" = String, Path, description = "Article ID"),
    ),
    request_body = ArticleRequest,
    responses(
        (status = 200, description = "Article updated", body = ArticleResponse),
        (status = 404, description = "Article not found"),
        (status = 401, description = "Unauthorized"),
    ),
)]
#[axum::debug_handler]
pub async fn update_article(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Json(req): Json<ArticleRequest>,
) -> ApiResponse<ArticleResponse> {
    let db = &app_state.db;
    let existing_query = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    let mut existing_result = db.query(existing_query).bind(("id", id.clone())).await.map_err(|e| crate::api::internal_error(e.to_owned()))?;
    let existing: Option<serde_json::Value> = existing_result.take(0).ok().flatten();
    let existing = existing.ok_or_else(|| crate::api::not_found_error("Article not found"))?;
    let existing: ArticleResponse = serde_json::from_value(existing).map_err(|_| crate::api::internal_error("Failed to parse article"))?;

    let title = req.title.clone();
    let slug_id = req.slug_id.clone().filter(|value| !value.trim().is_empty()).unwrap_or_else(|| existing.slug_id.clone());
    let slug_en = req.slug_en.clone().filter(|value| !value.trim().is_empty()).unwrap_or_else(|| if existing.slug_en.is_empty() { slug_id.clone() } else { existing.slug_en.clone() });
    let content_id = req.content_id.clone();
    let content_en = if req.content_en.clone().unwrap_or_default().trim().is_empty() { None } else { req.content_en.clone() };
    let excerpt_id = req.excerpt_id.clone();
    let excerpt_en = req.excerpt_en.clone();
    let category = req.category.clone();
    let image = req.image.clone();
    let published = req.published.unwrap_or(existing.published);
    let now = chrono::Utc::now().to_rfc3339();
    let published_at = if published {
        existing.published_at.clone().or_else(|| Some(now.clone()))
    } else {
        None
    };
    let translation_status = determine_translation_status(&content_id, content_en.as_ref());

    let update_query = "UPDATE articles SET title = $title, slug_id = $slug_id, slug_en = $slug_en, content_id = $content_id, content_en = $content_en, excerpt_id = $excerpt_id, excerpt_en = $excerpt_en, category = $category, image = $image, published = $published, published_at = $published_at, translation_status = $translation_status, updated_at = $now WHERE id = $id";
    
    let mut result = db
        .query(update_query)
        .bind(("id", id.to_owned()))
        .bind(("title", title.to_owned()))
        .bind(("slug_id", slug_id.to_owned()))
        .bind(("slug_en", slug_en.to_owned()))
        .bind(("content_id", content_id.to_owned()))
        .bind(("content_en", content_en.to_owned()))
        .bind(("excerpt_id", excerpt_id.to_owned()))
        .bind(("excerpt_en", excerpt_en.to_owned()))
        .bind(("category", category.to_owned()))
        .bind(("image", image.to_owned()))
        .bind(("published", published.to_owned()))
        .bind(("published_at", published_at.to_owned()))
        .bind(("translation_status", translation_status.to_owned()))
        .bind(("now", now.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let updated: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = updated.ok_or_else(|| crate::api::not_found_error("Article not found"))?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| crate::api::internal_error("Failed to parse article"))
}

#[utoipa::path(
    put,
    path = "/api/v1/articles/{id}/translation-status",
    tag = "Articles",
    params(("id" = String, Path, description = "Article ID")),
    request_body = TranslationStatusRequest,
    responses(
        (status = 200, description = "Article updated", body = ArticleResponse),
        (status = 404, description = "Article not found")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn update_translation_status(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Json(req): Json<TranslationStatusRequest>,
) -> ApiResponse<ArticleResponse> {
    let db = &app_state.db;
    let now = chrono::Utc::now().to_rfc3339();
    let query = "UPDATE articles SET translation_status = $translation_status, publication_options = $publication_options, updated_at = $updated_at WHERE id = $id";
    let mut result = db
        .query(query)
        .bind(("id", id.to_owned()))
        .bind(("translation_status", req.translation_status.to_owned()))
        .bind(("publication_options", req.publication_options.clone().unwrap_or_else(|| "both".to_string()).to_owned()))
        .bind(("updated_at", now.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;

    let updated: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = updated.ok_or_else(|| crate::api::not_found_error("Article not found"))?;
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| crate::api::internal_error("Failed to parse article"))
}

/// Delete article
#[utoipa::path(
    delete,
    path = "/api/v1/articles/{id}",
    tag = "Articles",
    params(
        ("id" = String, Path, description = "Article ID"),
    ),
    responses(
        (status = 200, description = "Article deleted"),
        (status = 404, description = "Article not found"),
        (status = 401, description = "Unauthorized"),
    ),
)]
#[axum::debug_handler]
pub async fn delete_article(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<serde_json::Value> {
    let db = &app_state.db;
    let delete_query = "DELETE articles WHERE id = $id";
    
    let mut result = db
        .query(delete_query)
        .bind(("id", id.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let deleted: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    if deleted.is_some() {
        Ok(Json(serde_json::json!({
            "message": "Article deleted",
            "id": id
        })))
    } else {
        Err(crate::api::not_found_error("Article not found"))
    }
}

/// Register articles routes
pub fn register_routes(router: Router<crate::AppState>) -> Router<crate::AppState> {
    use axum::routing::{delete, get, post, put};
    
    router
        .route("/api/v1/articles", get(list_articles))
        .route("/api/v1/articles", post(create_article))
        .route("/api/v1/articles/{article_ref}", get(get_article))
        .route("/api/v1/articles/{article_ref}", put(update_article))
        .route("/api/v1/articles/{article_ref}", delete(delete_article))
}
