/**
 * Services Handlers
 * 
 * Handles all services-related HTTP requests:
 * - GET /api/v1/services - List services with filters
 * - GET /api/v1/services/:slug - Get single service by slug
 * - GET /api/v1/services?featured=true - Get featured services
 * - POST /api/v1/services - Create new service (auth required)
 * - PUT /api/v1/services/:id - Update service (auth required)
 * - DELETE /api/v1/services/:id - Delete service (auth required)
 */

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    Extension,
    Router,
};
use surrealdb::sql::Thing;
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::db::DbState;
use crate::models::service::{Service, ServiceFilter, CreateServiceRequest, UpdateServiceRequest, DEFAULT_SERVICES};
use crate::models::user::UserClaims;

/// Services API tags for OpenAPI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServicesApi;

// ============== Request/Response Types ==============

/// List services response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListServicesResponse {
    pub data: Vec<Service>,
    pub total: u32,
    pub limit: u32,
    pub offset: u32,
}

// ============== Handler Functions ==============

/// GET /api/v1/services
/// List all services with optional filters
#[utoipa::path(
    get,
    path = "/api/v1/services",
    tag = "Services",
    params(
        ("featured" = Option<bool>, Query, description = "Filter by featured status"),
        ("limit" = Option<u32>, Query, description = "Limit results"),
        ("offset" = Option<u32>, Query, description = "Offset for pagination")
    ),
    responses(
        (status = 200, description = "List of services", body = ListServicesResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn list_services(
    State(db): State<DbState>,
    Query(filters): Query<ServiceFilter>,
) -> ApiResponse<ListServicesResponse> {
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query with ordering
    let query = format!(
        "SELECT * FROM services{} ORDER BY display_order ASC, created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await?;
    let services: Vec<Service> = result.take(0)?;

    // Get total count
    let count_query = format!(
        "SELECT count() FROM services{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await?;
    let total: Option<u32> = count_result.take(0).ok().flatten();

    Ok(Json(ListServicesResponse {
        data: services,
        total: total.unwrap_or(0),
        limit,
        offset,
    }))
}

/// GET /api/v1/services/:slug
/// Get a single service by slug
#[utoipa::path(
    get,
    path = "/api/v1/services/{slug}",
    tag = "Services",
    params(
        ("slug" = String, Path, description = "Service slug")
    ),
    responses(
        (status = 200, description = "Service details", body = Service),
        (status = 404, description = "Service not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn get_service(
    State(db): State<DbState>,
    Path(slug): Path<String>,
) -> ApiResponse<Service> {
    let query = "SELECT * FROM services WHERE slug = $slug LIMIT 1";
    let mut result = db.query(query).bind(("slug", slug)).await?;
    
    let service: Option<Service> = result.take(0)?;
    
    match service {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::NOT_FOUND, Json(None::<Service>))),
    }
}

/// POST /api/v1/services
/// Create a new service
#[utoipa::path(
    post,
    path = "/api/v1/services",
    tag = "Services",
    request_body = CreateServiceRequest,
    responses(
        (status = 201, description = "Service created successfully", body = Service),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn create_service(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Json(request): Json<CreateServiceRequest>,
) -> ApiResponse<Service> {
    let mut service = Service::new(
        request.title,
        request.slug,
        request.description,
    );

    if let Some(icon) = request.icon {
        service = service.with_icon(icon);
    }
    if let Some(featured) = request.featured {
        service = service.with_featured(featured);
    }
    if let Some(display_order) = request.display_order {
        service = service.with_display_order(display_order);
    }
    if let Some(pricing_table) = request.pricing_table {
        service = service.with_pricing_table(pricing_table);
    }
    if let Some(faq) = request.faq {
        service = service.with_faq(faq);
    }

    // Save to database
    let query = "CREATE services CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&service).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(Some(format!("Failed to serialize service: {}", e))))
        })?))
        .await?;

    let created_service: Option<Service> = result.take(0).ok().flatten();
    
    match created_service {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(Some("Failed to create service".to_string())))),
    }
}

/// PUT /api/v1/services/:id
/// Update an existing service
#[utoipa::path(
    put,
    path = "/api/v1/services/{id}",
    tag = "Services",
    params(
        ("id" = String, Path, description = "Service ID")
    ),
    request_body = UpdateServiceRequest,
    responses(
        (status = 200, description = "Service updated successfully", body = Service),
        (status = 404, description = "Service not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn update_service(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateServiceRequest>,
) -> ApiResponse<Service> {
    // First check if service exists
    let query = "SELECT * FROM services WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("services", id.as_str()))))
        .await?;
    
    let existing: Option<Service> = result.take(0)?;
    
    if existing.is_none() {
        return Err((StatusCode::NOT_FOUND, Json(None::<Service>)));
    }

    // Build update fields
    let mut updates = Vec::new();
    if let Some(title) = update.title {
        updates.push(format!("title = '{}'", title.replace('\'', "''")));
    }
    if let Some(description) = update.description {
        updates.push(format!("description = '{}'", description.replace('\'', "''")));
    }
    if let Some(icon) = update.icon {
        updates.push(format!("icon = '{}'", icon.replace('\'', "''")));
    }
    if let Some(featured) = update.featured {
        updates.push(format!("featured = {}", featured));
    }
    if let Some(display_order) = update.display_order {
        updates.push(format!("display_order = {}", display_order));
    }
    if let Some(pricing_table) = update.pricing_table {
        let pricing_json = serde_json::to_string(&pricing_table).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(Some(format!("Failed to serialize pricing table: {}", e))))
        })?;
        updates.push(format!("pricing_table = {}", pricing_json));
    }
    if let Some(faq) = update.faq {
        let faq_json = serde_json::to_string(&faq).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(Some(format!("Failed to serialize FAQ: {}", e))))
        })?;
        updates.push(format!("faq = {}", faq_json));
    }

    if updates.is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(Some("No fields to update".to_string()))));
    }

    let update_query = format!(
        "UPDATE services SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", Thing::from(("services", id.as_str()))))
        .await?;

    let updated: Option<Service> = update_result.take(0)?;
    
    match updated {
        Some(s) => Ok(Json(s)),
        None => Err((StatusCode::NOT_FOUND, Json(None::<Service>))),
    }
}

/// DELETE /api/v1/services/:id
/// Delete a service
#[utoipa::path(
    delete,
    path = "/api/v1/services/{id}",
    tag = "Services",
    params(
        ("id" = String, Path, description = "Service ID")
    ),
    responses(
        (status = 200, description = "Service deleted successfully"),
        (status = 404, description = "Service not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn delete_service(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<serde_json::Value> {
    // First check if service exists
    let query = "SELECT * FROM services WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("services", id.as_str()))))
        .await?;
    
    let existing: Option<Service> = result.take(0)?;
    
    if existing.is_none() {
        return Err((StatusCode::NOT_FOUND, Json(Some("Service not found".to_string()))));
    }

    // Delete from database
    let delete_query = "DELETE services WHERE id = $id";
    db.query(delete_query)
        .bind(("id", Thing::from(("services", id.as_str()))))
        .await?;

    Ok(Json(serde_json::json!({ "success": true, "message": "Service deleted successfully" })))
}

/// Seed default services
pub async fn seed_default_services(db: DbState) -> Result<(), String> {
    // Check if services already exist
    let query = "SELECT count() as count FROM services";
    let mut result = db.query(query).await.map_err(|e| format!("Failed to query services: {}", e))?;
    
    let count_result: Option<Vec<serde_json::Value>> = result.take(0).ok();
    if let Some(results) = count_result {
        if let Some(count_obj) = results.first() {
            if let Some(count) = count_obj.get("count").and_then(|v| v.as_u64()) {
                if count > 0 {
                    return Ok(()); // Services already exist
                }
            }
        }
    }

    // Insert default services
    for (title, slug, description) in DEFAULT_SERVICES {
        let service = Service::new(
            title.to_string(),
            slug.to_string(),
            description.to_string(),
        );
        
        let create_query = "CREATE services CONTENT $content";
        let mut create_result = db.query(create_query)
            .bind(("content", serde_json::to_value(&service).map_err(|e| e.to_string())?))
            .await
            .map_err(|e| format!("Failed to create service: {}", e))?;
        
        let _: Option<Service> = create_result.take(0).map_err(|e| format!("Failed to get created service: {}", e))?;
    }

    Ok(())
}

/// Register services routes
pub fn register_routes(router: axum::Router) -> axum::Router {
    router
        .route("/api/v1/services", axum::routing::get(list_services))
        .route("/api/v1/services/:slug", axum::routing::get(get_service))
        .route("/api/v1/services", axum::routing::post(create_service))
        .route("/api/v1/services/:id", axum::routing::put(update_service))
        .route("/api/v1/services/:id", axum::routing::delete(delete_service))
}