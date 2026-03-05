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
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Article response
#[derive(Debug, Serialize, ToSchema)]
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

/// List articles query params
#[derive(Debug, Deserialize, ToSchema)]
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
#[derive(Debug, Deserialize, ToSchema)]
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
pub async fn list_articles(
    State(db): State<crate::db::DbState>,
    Query(query): Query<ListArticlesQuery>,
) -> Result<Json<Vec<ArticleResponse>>, StatusCode> {
    let where_clause = query.build_where_clause();
    let limit = query.limit.unwrap_or(10);
    let offset = query.offset();
    
    let list_query = format!(
        "SELECT * FROM articles{} ORDER BY created_at DESC LIMIT {} START {}",
        where_clause, limit, offset
    );
    
    let mut result = db::get_db()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .query(list_query)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let articles: Vec<serde_json::Value> = result.take(0).unwrap_or_default();
    let responses = articles.into_iter().filter_map(|a| serde_json::from_value(a).ok()).collect();
    
    Ok(Json(responses))
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
pub async fn get_article(
    State(db): State<crate::db::DbState>,
    Path(slug): Path<String>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    let query = "SELECT * FROM articles WHERE slug_id = $slug OR slug_en = $slug LIMIT 1";
    let mut result = db::get_db()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .query(query)
        .bind(("slug", &slug))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let article: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = article.ok_or(StatusCode::NOT_FOUND)?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
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
pub async fn create_article(
    State(db): State<crate::db::DbState>,
    Json(req): Json<ArticleRequest>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    let slug_id = req.slug_id.clone().unwrap_or_else(|| req.title.to_lowercase().replace(' ', "-"));
    let slug_en = req.slug_en.clone().unwrap_or_else(|| slug_id.clone());
    let now = chrono::Utc::now().to_rfc3339();
    
    let insert_query = "CREATE articles SET title = $title, slug_id = $slug_id, slug_en = $slug_en, content_id = $content_id, content_en = $content_en, excerpt_id = $excerpt_id, excerpt_en = $excerpt_en, category = $category, image = $image, published = $published, translation_status = 'published', created_at = $now, updated_at = $now";
    
    let mut result = db::get_db()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .query(insert_query)
        .bind(("title", &req.title))
        .bind(("slug_id", &slug_id))
        .bind(("slug_en", &slug_en))
        .bind(("content_id", &req.content_id))
        .bind(("content_en", &req.content_en))
        .bind(("excerpt_id", &req.excerpt_id))
        .bind(("excerpt_en", &req.excerpt_en))
        .bind(("category", &req.category))
        .bind(("image", &req.image))
        .bind(("published", &req.published.unwrap_or(false)))
        .bind(("now", &now))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let created: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = created.ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
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
pub async fn update_article(
    State(db): State<crate::db::DbState>,
    Path(id): Path<String>,
    Json(req): Json<ArticleRequest>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    let now = chrono::Utc::now().to_rfc3339();
    
    let update_query = "UPDATE articles SET title = $title, slug_id = $slug_id, slug_en = $slug_en, content_id = $content_id, content_en = $content_en, excerpt_id = $excerpt_id, excerpt_en = $excerpt_en, category = $category, image = $image, published = $published, updated_at = $now WHERE id = $id";
    
    let mut result = db::get_db()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .query(update_query)
        .bind(("id", &id))
        .bind(("title", &req.title))
        .bind(("slug_id", &req.slug_id.clone().unwrap_or_default()))
        .bind(("slug_en", &req.slug_en.clone().unwrap_or_default()))
        .bind(("content_id", &req.content_id))
        .bind(("content_en", &req.content_en.clone().unwrap_or_default()))
        .bind(("excerpt_id", &req.excerpt_id.clone().unwrap_or_default()))
        .bind(("excerpt_en", &req.excerpt_en.clone().unwrap_or_default()))
        .bind(("category", &req.category))
        .bind(("image", &req.image.clone().unwrap_or_default()))
        .bind(("published", &req.published.unwrap_or(false)))
        .bind(("now", &now))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let updated: Option<serde_json::Value> = result.take(0).ok().flatten();
    let article = updated.ok_or(StatusCode::NOT_FOUND)?;
    
    serde_json::from_value(article)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
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
pub async fn delete_article(
    State(db): State<crate::db::DbState>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let delete_query = "DELETE articles WHERE id = $id";
    
    let mut result = db::get_db()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .query(delete_query)
        .bind(("id", &id))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let deleted: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    if deleted.is_some() {
        Ok(StatusCode::OK)
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

/// Register articles routes
pub fn register_routes(router: axum::Router) -> axum::Router {
    use axum::routing::{delete, get, post, put};
    
    router
        .route("/api/v1/articles", get(list_articles))
        .route("/api/v1/articles", post(create_article))
        .route("/api/v1/articles/:slug", get(get_article))
        .route("/api/v1/articles/:id", put(update_article))
        .route("/api/v1/articles/:id", delete(delete_article))
}