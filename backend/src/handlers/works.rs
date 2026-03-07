/**
 * Works/Portfolio Handlers
 * 
 * Handles all works-related HTTP requests:
 * - GET /api/v1/works - List works with filters
 * - GET /api/v1/works/:slug - Get single work by slug
 * - GET /api/v1/works/featured - Get featured works
 * - POST /api/v1/works - Create new work (auth required)
 * - PUT /api/v1/works/:id - Update work (auth required)
 * - DELETE /api/v1/works/:id - Delete work (auth required)
 */

use axum::{
    extract::{Path, Query, State},
    response::Json,
    Extension,
    Router,
};
use surrealdb::sql::Thing;
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::db::DbState;
use crate::models::work::{Work, WorkFilter, CreateWorkRequest, UpdateWorkRequest};
use crate::models::user::UserClaims;

/// Works API tags for OpenAPI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorksApi;

// ============== Request/Response Types ==============

/// List works response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListWorksResponse {
    pub data: Vec<Work>,
    pub total: u32,
    pub limit: u32,
    pub offset: u32,
}

// ============== Handler Functions ==============

/// GET /api/v1/works
/// List all works with optional filters
#[utoipa::path(
    get,
    path = "/api/v1/works",
    tag = "Works",
    params(
        ("service" = Option<String>, Query, description = "Filter by service"),
        ("platform" = Option<String>, Query, description = "Filter by platform"),
        ("featured" = Option<bool>, Query, description = "Filter by featured status"),
        ("limit" = Option<u32>, Query, description = "Limit results"),
        ("offset" = Option<u32>, Query, description = "Offset for pagination")
    ),
    responses(
        (status = 200, description = "List of works", body = ListWorksResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_works(
    State(db): State<DbState>,
    Query(filters): Query<WorkFilter>,
) -> ApiResponse<ListWorksResponse> {
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query
    let query = format!(
        "SELECT * FROM works{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await.map_err(|e| crate::api::internal_error(e.to_string()))?;
    let works: Vec<Work> = result.take(0).map_err(|e| crate::api::internal_error(e.to_string()))?;

    // Get total count
    let count_query = format!(
        "SELECT count() FROM works{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total: Option<u32> = count_result.take(0).ok().flatten();

    Ok(Json(ListWorksResponse {
        data: works,
        total: total.unwrap_or(0),
        limit,
        offset,
    }))
}

/// GET /api/v1/works/featured
/// Get featured works only
#[utoipa::path(
    get,
    path = "/api/v1/works/featured",
    tag = "Works",
    params(
        ("limit" = Option<u32>, Query, description = "Limit results")
    ),
    responses(
        (status = 200, description = "List of featured works", body = Vec<Work>),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_featured_works(
    State(db): State<DbState>,
    Query(limit_query): Query<Option<u32>>,
) -> ApiResponse<Vec<Work>> {
    let limit = limit_query.unwrap_or(10);
    
    let query = "SELECT * FROM works WHERE featured = true ORDER BY created_at DESC LIMIT $limit";
    let mut result = db.query(query).bind(("limit", limit)).await.map_err(|e| crate::api::internal_error(e))?;
    let works: Vec<Work> = result.take(0).map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(works))
}

/// GET /api/v1/works/:slug
/// Get a single work by slug
#[utoipa::path(
    get,
    path = "/api/v1/works/{slug}",
    tag = "Works",
    params(
        ("slug" = String, Path, description = "Work slug")
    ),
    responses(
        (status = 200, description = "Work details", body = Work),
        (status = 404, description = "Work not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_work(
    State(db): State<DbState>,
    Path(slug): Path<String>,
) -> ApiResponse<Work> {
    let query = "SELECT * FROM works WHERE slug = $slug LIMIT 1";
    let mut result = db.query(query).bind(("slug", slug)).await.map_err(|e| crate::api::internal_error(e))?;
    
    let work: Option<Work> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match work {
        Some(w) => Ok(Json(w)),
        None => Err(crate::api::not_found_error("Work not found")),
    }
}

/// POST /api/v1/works
/// Create a new work
#[utoipa::path(
    post,
    path = "/api/v1/works",
    tag = "Works",
    request_body = CreateWorkRequest,
    responses(
        (status = 201, description = "Work created successfully", body = Work),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn create_work(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Json(request): Json<CreateWorkRequest>,
) -> ApiResponse<Work> {
    let mut work = Work::new(
        request.title,
        request.slug,
        request.description,
        request.service,
        request.platform,
        request.image,
        request.client_name,
    );

    if let Some(metrics) = request.metrics {
        work.metrics = metrics;
    }
    if let Some(featured) = request.featured {
        work.featured = featured;
    }

    // Save to database
    let query = "CREATE works CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&work).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize work: {}", e))
        })?))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let created_work: Option<Work> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match created_work {
        Some(w) => Ok(Json(w)),
        None => Err(crate::api::internal_error("Failed to create work")),
    }
}

/// PUT /api/v1/works/:id
/// Update an existing work
#[utoipa::path(
    put,
    path = "/api/v1/works/{id}",
    tag = "Works",
    params(
        ("id" = String, Path, description = "Work ID")
    ),
    request_body = UpdateWorkRequest,
    responses(
        (status = 200, description = "Work updated successfully", body = Work),
        (status = 404, description = "Work not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn update_work(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateWorkRequest>,
) -> ApiResponse<Work> {
    // First check if work exists
    let query = "SELECT * FROM works WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("works", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<Work> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Work not found"));
    }

    // Build update fields
    let mut updates = Vec::new();
    if let Some(title) = update.title {
        updates.push(format!("title = '{}'", title.replace('\'', "''")));
    }
    if let Some(description) = update.description {
        updates.push(format!("description = '{}'", description.replace('\'', "''")));
    }
    if let Some(service) = update.service {
        updates.push(format!("service = '{}'", service.replace('\'', "''")));
    }
    if let Some(platform) = update.platform {
        updates.push(format!("platform = '{}'", platform.replace('\'', "''")));
    }
    if let Some(image) = update.image {
        updates.push(format!("image = '{}'", image.replace('\'', "''")));
    }
    if let Some(client_name) = update.client_name {
        updates.push(format!("client_name = '{}'", client_name.replace('\'', "''")));
    }
    if let Some(featured) = update.featured {
        updates.push(format!("featured = {}", featured));
    }
    if let Some(metrics) = update.metrics {
        let metrics_json = serde_json::to_string(&metrics).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize metrics: {}", e))
        })?;
        updates.push(format!("metrics = {}", metrics_json));
    }

    if updates.is_empty() {
        return Err(crate::api::bad_request_error("No fields to update"));
    }

    let update_query = format!(
        "UPDATE works SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", Thing::from(("works", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let updated: Option<Work> = update_result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match updated {
        Some(w) => Ok(Json(w)),
        None => Err(crate::api::not_found_error("Work not found")),
    }
}

/// DELETE /api/v1/works/:id
/// Delete a work
#[utoipa::path(
    delete,
    path = "/api/v1/works/{id}",
    tag = "Works",
    params(
        ("id" = String, Path, description = "Work ID")
    ),
    responses(
        (status = 200, description = "Work deleted successfully"),
        (status = 404, description = "Work not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn delete_work(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<serde_json::Value> {
    // First check if work exists
    let query = "SELECT * FROM works WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("works", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<Work> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Work not found"));
    }

    // Delete from database
    let delete_query = "DELETE works WHERE id = $id";
    db.query(delete_query)
        .bind(("id", Thing::from(("works", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(serde_json::json!({ "success": true, "message": "Work deleted successfully" })))
}

/// Register works routes
pub fn register_routes(router: axum::Router<crate::db::DbState>) -> axum::Router<crate::db::DbState> {
    router
        .route("/api/v1/works", axum::routing::get(list_works))
        .route("/api/v1/works/featured", axum::routing::get(list_featured_works))
        .route("/api/v1/works/:slug", axum::routing::get(get_work))
        .route("/api/v1/works", axum::routing::post(create_work))
        .route("/api/v1/works/:id", axum::routing::put(update_work))
        .route("/api/v1/works/:id", axum::routing::delete(delete_work))
}
