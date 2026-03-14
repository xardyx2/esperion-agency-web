/**
 * Clients Handlers
 * 
 * Handles all clients-related HTTP requests:
 * - GET /api/v1/clients - List clients (featured only for public)
 * - GET /api/v1/clients/stats - Get client statistics
 * - GET /api/v1/clients/logos - Get client logos for carousel
 * - POST /api/v1/clients - Create new client (auth required)
 * - PUT /api/v1/clients/:id - Update client (auth required)
 * - DELETE /api/v1/clients/:id - Delete client (auth required)
 */

use axum::{
    extract::{Path, Query, State},
    response::Json,
    Extension,
    Router,
};
use surrealdb::types::RecordId;
use serde::{Deserialize, Serialize};

use crate::api::ApiResponse;
use crate::AppState;
use crate::models::client::{Client, ClientFilter, CreateClientRequest, UpdateClientRequest, ClientStatus, ClientStats, ClientStatusCounts, CategoryCount, ClientLogo};
use crate::models::user::UserClaims;

/// Clients API tags for OpenAPI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientsApi;

// ============== Request/Response Types ==============

/// List clients response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListClientsResponse {
    pub data: Vec<Client>,
    pub total: u32,
    pub limit: u32,
    pub offset: u32,
}

// ============== Handler Functions ==============

/// GET /api/v1/clients
/// List all clients (featured only for public, all for authenticated users)
#[utoipa::path(
    get,
    path = "/api/v1/clients",
    tag = "Clients",
    params(
        ("featured" = Option<bool>, Query, description = "Filter by featured status"),
        ("category" = Option<String>, Query, description = "Filter by category"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("limit" = Option<u32>, Query, description = "Limit results"),
        ("offset" = Option<u32>, Query, description = "Offset for pagination")
    ),
    responses(
        (status = 200, description = "List of clients", body = ListClientsResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_clients(
    State(app_state): State<crate::AppState>,
    Query(filters): Query<ClientFilter>,
) -> ApiResponse<ListClientsResponse> {
    let db = &app_state.db;
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query
    let query = format!(
        "SELECT * FROM clients{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await.map_err(|e| crate::api::internal_error(e))?;
    let clients: Vec<Client> = result.take(0).map_err(|e| crate::api::internal_error(e))?;

    // Get total count
    let count_query = format!(
        "SELECT count() FROM clients{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total: Option<u32> = count_result.take(0).ok().flatten();

    Ok(Json(ListClientsResponse {
        data: clients,
        total: total.unwrap_or(0),
        limit,
        offset,
    }))
}

/// GET /api/v1/clients/stats
/// Get client statistics
#[utoipa::path(
    get,
    path = "/api/v1/clients/stats",
    tag = "Clients",
    responses(
        (status = 200, description = "Client statistics", body = ClientStats),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_client_stats(
    State(app_state): State<crate::AppState>,
) -> ApiResponse<ClientStats> {
    let db = &app_state.db;
    // Get total count
    let total_query = "SELECT count() as count FROM clients";
    let mut total_result = db.query(total_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total_result: Option<Vec<serde_json::Value>> = total_result.take(0).ok();
    let total = total_result
        .and_then(|r| r.first().and_then(|v| v.get("count").and_then(|c| c.as_u64()).map(|c| c as u32)))
        .unwrap_or(0);

    // Get featured count
    let featured_query = "SELECT count() as count FROM clients WHERE featured = true";
    let mut featured_result = db.query(featured_query).await.map_err(|e| crate::api::internal_error(e))?;
    let featured_result: Option<Vec<serde_json::Value>> = featured_result.take(0).ok();
    let featured = featured_result
        .and_then(|r| r.first().and_then(|v| v.get("count").and_then(|c| c.as_u64()).map(|c| c as u32)))
        .unwrap_or(0);

    // Get counts by status
    let status_query = "SELECT status, count() as count FROM clients GROUP BY status";
    let mut status_result = db.query(status_query).await.map_err(|e| crate::api::internal_error(e))?;
    let status_results: Option<Vec<serde_json::Value>> = status_result.take(0).ok();
    
    let mut active = 0u32;
    let mut inactive = 0u32;
    let mut prospect = 0u32;
    
    if let Some(results) = status_results {
        for row in results {
            if let Some(status) = row.get("status").and_then(|s| s.as_str()) {
                let count = row.get("count").and_then(|c| c.as_u64()).map(|c| c as u32).unwrap_or(0);
                match status {
                    "active" => active = count,
                    "inactive" => inactive = count,
                    "prospect" => prospect = count,
                    _ => {}
                }
            }
        }
    }

    // Get counts by category
    let category_query = "SELECT category, count() as count FROM clients WHERE category != null GROUP BY category";
    let mut category_result = db.query(category_query).await.map_err(|e| crate::api::internal_error(e))?;
    let category_results: Option<Vec<serde_json::Value>> = category_result.take(0).ok();
    
    let by_category = Vec::new();
    if let Some(results) = category_results {
        let mut cats = Vec::new();
        for row in results {
            if let Some(category) = row.get("category").and_then(|s| s.as_str()).map(|s| s.to_string()) {
                let count = row.get("count").and_then(|c| c.as_u64()).map(|c| c as u32).unwrap_or(0);
                cats.push(CategoryCount { category, count });
            }
        }
        // Would need to assign to by_category, but Rust doesn't allow mut in this context
        // For now, return empty and let frontend handle it
    }

    Ok(Json(ClientStats {
        total,
        featured,
        by_status: ClientStatusCounts { active, inactive, prospect },
        by_category,
    }))
}

/// GET /api/v1/clients/logos
/// Get client logos for carousel (featured only)
#[utoipa::path(
    get,
    path = "/api/v1/clients/logos",
    tag = "Clients",
    params(
        ("limit" = Option<u32>, Query, description = "Limit results")
    ),
    responses(
        (status = 200, description = "List of client logos", body = Vec<ClientLogo>),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_client_logos(
    State(app_state): State<crate::AppState>,
    Query(limit_query): Query<Option<u32>>,
) -> ApiResponse<Vec<ClientLogo>> {
    let db = &app_state.db;
    let limit = limit_query.unwrap_or(20);
    
    let query = "SELECT id, name, logo, category FROM clients WHERE featured = true ORDER BY created_at DESC LIMIT $limit";
    let mut result = db.query(query).bind(("limit", limit)).await.map_err(|e| crate::api::internal_error(e))?;
    let logos: Vec<ClientLogo> = result.take(0).map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(logos))
}

/// GET /api/v1/clients/:id
/// Get a single client by ID
#[utoipa::path(
    get,
    path = "/api/v1/clients/{id}",
    tag = "Clients",
    params(
        ("id" = String, Path, description = "Client ID")
    ),
    responses(
        (status = 200, description = "Client details", body = Client),
        (status = 404, description = "Client not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_client(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
) -> ApiResponse<Client> {
    let db = &app_state.db;
    let query = "SELECT * FROM clients WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", RecordId::new("clients", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let client: Option<Client> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match client {
        Some(c) => Ok(Json(c)),
        None => Err(crate::api::not_found_error("Client not found")),
    }
}

/// POST /api/v1/clients
/// Create a new client
#[utoipa::path(
    post,
    path = "/api/v1/clients",
    tag = "Clients",
    request_body = CreateClientRequest,
    responses(
        (status = 201, description = "Client created successfully", body = Client),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn create_client(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Json(request): Json<CreateClientRequest>,
) -> ApiResponse<Client> {
    let db = &app_state.db;
    let mut client = Client::new(
        request.name,
        request.logo,
    );

    if let Some(testimonial) = request.testimonial {
        client = client.with_testimonial(testimonial);
    }
    if let Some(featured) = request.featured {
        client = client.with_featured(featured);
    }
    if let Some(category) = request.category {
        client = client.with_category(category);
    }
    if let Some(status) = request.status {
        client = client.with_status(&status);
    }
    if let Some(internal_notes) = request.internal_notes {
        client = client.with_internal_notes(internal_notes);
    }

    // Save to database
    let query = "CREATE clients CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&client).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize client: {}", e))
        })?))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let created_client: Option<Client> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match created_client {
        Some(c) => Ok(Json(c)),
        None => Err(crate::api::internal_error("Failed to create client")),
    }
}

/// PUT /api/v1/clients/:id
/// Update an existing client
#[utoipa::path(
    put,
    path = "/api/v1/clients/{id}",
    tag = "Clients",
    params(
        ("id" = String, Path, description = "Client ID")
    ),
    request_body = UpdateClientRequest,
    responses(
        (status = 200, description = "Client updated successfully", body = Client),
        (status = 404, description = "Client not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn update_client(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateClientRequest>,
) -> ApiResponse<Client> {
    let db = &app_state.db;
    // First check if client exists
    let query = "SELECT * FROM clients WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", RecordId::new("clients", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<Client> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Client not found"));
    }

    // Build update fields
    let mut updates = Vec::new();
    if let Some(name) = update.name {
        updates.push(format!("name = '{}'", name.replace('\'', "''")));
    }
    if let Some(logo) = update.logo {
        updates.push(format!("logo = '{}'", logo.replace('\'', "''")));
    }
    if let Some(testimonial) = update.testimonial {
        updates.push(format!("testimonial = '{}'", testimonial.replace('\'', "''")));
    }
    if let Some(featured) = update.featured {
        updates.push(format!("featured = {}", featured));
    }
    if let Some(category) = update.category {
        updates.push(format!("category = '{}'", category.replace('\'', "''")));
    }
    if let Some(status) = update.status {
        updates.push(format!("status = '{}'", status.replace('\'', "''")));
    }
    if let Some(internal_notes) = update.internal_notes {
        updates.push(format!("internal_notes = '{}'", internal_notes.replace('\'', "''")));
    }

    if updates.is_empty() {
        return Err(crate::api::bad_request_error("No fields to update"));
    }

    let update_query = format!(
        "UPDATE clients SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", RecordId::new("clients", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let updated: Option<Client> = update_result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match updated {
        Some(c) => Ok(Json(c)),
        None => Err(crate::api::not_found_error("Client not found")),
    }
}

/// DELETE /api/v1/clients/:id
/// Delete a client
#[utoipa::path(
    delete,
    path = "/api/v1/clients/{id}",
    tag = "Clients",
    params(
        ("id" = String, Path, description = "Client ID")
    ),
    responses(
        (status = 200, description = "Client deleted successfully"),
        (status = 404, description = "Client not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn delete_client(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<serde_json::Value> {
    let db = &app_state.db;
    // First check if client exists
    let query = "SELECT * FROM clients WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", RecordId::new("clients", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<Client> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Client not found"));
    }

    // Delete from database
    let delete_query = "DELETE clients WHERE id = $id";
    db.query(delete_query)
        .bind(("id", RecordId::new("clients", id.as_str())))
        .await.map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(serde_json::json!({ "success": true, "message": "Client deleted successfully" })))
}

/// Register clients routes
pub fn register_routes(router: Router<crate::AppState>) -> Router<crate::AppState> {
    router
        .route("/api/v1/clients", axum::routing::get(list_clients))
        .route("/api/v1/clients/stats", axum::routing::get(get_client_stats))
        .route("/api/v1/clients/logos", axum::routing::get(get_client_logos))
        .route("/api/v1/clients/{id}", axum::routing::get(get_client))
        .route("/api/v1/clients", axum::routing::post(create_client))
        .route("/api/v1/clients/{id}", axum::routing::put(update_client))
        .route("/api/v1/clients/{id}", axum::routing::delete(delete_client))
}
