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
    State(_db): State<crate::db::DbState>,
    Query(_query): Query<ListArticlesQuery>,
) -> Result<Json<Vec<ArticleResponse>>, StatusCode> {
    // TODO: Implement actual database query
    // For now, return mock response
    Ok(Json(vec![]))
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
    State(_db): State<crate::db::DbState>,
    Path(_slug): Path<String>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    // TODO: Implement actual database query
    Err(StatusCode::NOT_FOUND)
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
    State(_db): State<crate::db::DbState>,
    Json(_req): Json<ArticleRequest>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    // TODO: Implement actual database insert
    Err(StatusCode::INTERNAL_SERVER_ERROR)
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
    State(_db): State<crate::db::DbState>,
    Path(_id): Path<String>,
    Json(_req): Json<ArticleRequest>,
) -> Result<Json<ArticleResponse>, StatusCode> {
    // TODO: Implement actual database update
    Err(StatusCode::NOT_FOUND)
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
    State(_db): State<crate::db::DbState>,
    Path(_id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    // TODO: Implement actual database delete
    Err(StatusCode::NOT_FOUND)
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