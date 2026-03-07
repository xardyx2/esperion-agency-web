/**
 * Media Library Handlers
 * 
 * Handles all media-related HTTP requests:
 * - GET /api/v1/media - List media files with filters
 * - GET /api/v1/media/:id - Get single media file
 * - POST /api/v1/media/upload - Upload new media
 * - PUT /api/v1/media/:id - Update media metadata
 * - DELETE /api/v1/media/:id - Delete media file
 */

use axum::{
    extract::{Multipart, Path, Query, State},
    response::Json,
    Extension,
    Router,
};
use surrealdb::sql::Thing;
use serde::{Deserialize, Serialize};
use tokio::fs::{self, File};
use tokio::io::AsyncWriteExt;
use uuid::Uuid;
use chrono::Datelike;

use crate::api::ApiResponse;
use crate::db::DbState;
use crate::models::media::{Media, MediaType, MediaFilter, MediaUploadResponse};

// Define the response types locally to avoid undefined references
type UploadResponse = MediaUploadResponse;
use crate::models::user::UserClaims;

/// Media API tags for OpenAPI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaApi;

/// Register media routes
pub fn register_routes(router: Router<crate::db::DbState>) -> Router<crate::db::DbState> {
    router
        .route("/api/v1/media", axum::routing::get(list_media))
        .route("/api/v1/media/:id", axum::routing::get(get_media))
        .route("/api/v1/media/upload", axum::routing::post(upload_media))
        .route("/api/v1/media/:id", axum::routing::put(update_media))
        .route("/api/v1/media/:id", axum::routing::delete(delete_media))
        .route("/api/v1/media/stats", axum::routing::get(get_media_stats))
}

// ============== Request/Response Types ==============

/// List media response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListMediaResponse {
    pub data: Vec<Media>,
    pub total: u32,
    pub limit: u32,
    pub offset: u32,
}

/// Update media request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateMediaRequest {
    pub alt_text: Option<String>,
}

// Remove duplicate UploadResponse definition - use existing one from models
// The UploadResponse struct is already defined in models::media::MediaUploadResponse

// ============== Handler Functions ==============

/// GET /api/v1/media
/// List all media files with optional filters
#[utoipa::path(
    get,
    path = "/api/v1/media",
    tag = "Media",
    params(
        ("year" = Option<i32>, Query, description = "Filter by year"),
        ("month" = Option<i32>, Query, description = "Filter by month"),
        ("type" = Option<String>, Query, description = "Filter by media type"),
        ("search" = Option<String>, Query, description = "Search in filename and alt_text"),
        ("limit" = Option<u32>, Query, description = "Limit results"),
        ("offset" = Option<u32>, Query, description = "Offset for pagination")
    ),
    responses(
        (status = 200, description = "List of media files", body = ListMediaResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn list_media(
    State(db): State<DbState>,
    Query(filters): Query<MediaFilter>,
) -> ApiResponse<ListMediaResponse> {
    let where_clause = filters.to_where_clause();
    let limit = filters.limit.unwrap_or(50);
    let offset = filters.offset.unwrap_or(0);

    // Build query
    let query = format!(
        "SELECT * FROM media_library{} ORDER BY created_at DESC LIMIT {} START {};",
        where_clause, limit, offset
    );

    let mut result = db.query(query).await.map_err(|e| crate::api::internal_error(e))?;
    
    let media: Vec<Media> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    // Get total count
    let count_query = format!(
        "SELECT count() FROM media_library{};",
        where_clause
    );
    let mut count_result = db.query(count_query).await.map_err(|e| crate::api::internal_error(e))?;
    let total: Option<u32> = count_result.take(0).ok().flatten();

    Ok(Json(ListMediaResponse {
        data: media,
        total: total.unwrap_or(0),
        limit,
        offset,
    }))
}

/// GET /api/v1/media/:id
/// Get a single media file by ID
#[utoipa::path(
    get,
    path = "/api/v1/media/{id}",
    tag = "Media",
    params(
        ("id" = String, Path, description = "Media ID")
    ),
    responses(
        (status = 200, description = "Media file details", body = Media),
        (status = 404, description = "Media not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_media(
    State(db): State<DbState>,
    Path(id): Path<String>,
) -> ApiResponse<Media> {
    let query = "SELECT * FROM media_library WHERE id = $id LIMIT 1";
    let mut result = db.query(query).bind(("id", Thing::from(("media_library", id.as_str())))).await.map_err(|e| crate::api::internal_error(e))?;
    
    let media: Option<Media> = result.take(0).map_err(|e| crate::api::internal_error(e))?;
    
    match media {
        Some(m) => Ok(Json(m)),
        None => Err(crate::api::not_found_error("Media not found")),
    }
}

/// POST /api/v1/media/upload
/// Upload a new media file
#[utoipa::path(
    post,
    path = "/api/v1/media/upload",
    tag = "Media",
    request_body = UploadResponse,
    responses(
        (status = 201, description = "File uploaded successfully", body = UploadResponse),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn upload_media(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    mut multipart: Multipart,
) -> ApiResponse<UploadResponse> {
    // Get the file field
    let Some(field) = multipart.next_field().await.map_err(|e| {
        crate::api::bad_request_error(&format!("Failed to read multipart: {}", e))
    })? else {
        return Err(crate::api::bad_request_error("No file provided"));
    };

    let file_name = field.file_name().unwrap_or("unnamed").to_string();
    let _content_type = field.content_type().map(|ct| ct.to_string()).unwrap_or_default();
    let data = field.bytes().await.map_err(|e| {
        crate::api::bad_request_error(&format!("Failed to read file data: {}", e))
    })?;

    // Determine media type from extension
    let extension = file_name.split('.').last().unwrap_or("");
    let media_type = MediaType::from_extension(extension);

    // Generate unique filename
    let uuid = Uuid::new_v4().to_string();
    let new_filename = format!("{}_{}", uuid, file_name.clone());
    
    // Create upload directory structure: uploads/{year}/{month}/
    let now = chrono::Utc::now();
    let year = now.year();
    let month = now.month();
    let upload_dir = format!("uploads/{}/{}/", year, month);
    
    // Ensure directory exists
    fs::create_dir_all(&upload_dir).await.map_err(|e| {
        crate::api::internal_error(format!("Failed to create upload directory: {}", e))
    })?;

    // Save original file
    let file_path = format!("{}{}", upload_dir, new_filename);
    let mut file = File::create(&file_path).await.map_err(|e| {
        crate::api::internal_error(format!("Failed to save file: {}", e))
    })?;
    file.write_all(&data).await.map_err(|e| {
        crate::api::internal_error(format!("Failed to write file: {}", e))
    })?;

    // Create media record
    let media = Media::new(
        file_name.clone(),
        file_path.clone(),
        file_path.clone(),
        media_type.clone(),
        data.len() as i64,
        None, // Will be set to the user who uploaded
    );

    // Save to database
    let query = "CREATE media_library CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&media).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize media: {}", e))
        })?))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let created_media: Option<Media> = result.take(0).ok().flatten();
    
    let created_media = created_media.ok_or_else(|| crate::api::internal_error("Failed to create media record"))?;

    let id = created_media.id.as_ref().unwrap().id.to_string();

    Ok(Json(MediaUploadResponse {
        id: id.clone(),
        filename: file_name.clone(),
        path: file_path.clone(),
        url: format!("/{}", file_path),
        webp_url: None, // Will be set when WebP conversion is implemented
        media_type: media_type.to_string(),
        size: data.len() as i64,
        alt_text: media.alt_text.clone(),
    }))
}

/// PUT /api/v1/media/:id
/// Update media metadata
#[utoipa::path(
    put,
    path = "/api/v1/media/{id}",
    tag = "Media",
    params(
        ("id" = String, Path, description = "Media ID")
    ),
    request_body = UpdateMediaRequest,
    responses(
        (status = 200, description = "Media updated successfully", body = Media),
        (status = 404, description = "Media not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn update_media(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
    Json(update): Json<UpdateMediaRequest>,
) -> ApiResponse<Media> {
    // First check if media exists
    let query = "SELECT * FROM media_library WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("media_library", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<Media> = result.take(0).ok().flatten();
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Media not found"));
    }

    // Build update fields
    let mut updates = Vec::new();
    if let Some(alt_text) = update.alt_text {
        updates.push(format!("alt_text = '{}'", alt_text.replace('\'', "''")));
    }

    if updates.is_empty() {
        return Err(crate::api::bad_request_error("No fields to update"));
    }

    let update_query = format!(
        "UPDATE media_library SET {} WHERE id = $id",
        updates.join(", ")
    );

    let mut update_result = db.query(update_query)
        .bind(("id", Thing::from(("media_library", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;

    let updated: Option<Media> = update_result.take(0).ok().flatten();
    
    match updated {
        Some(m) => Ok(Json(m)),
        None => Err(crate::api::not_found_error("Media not found")),
    }
}

/// DELETE /api/v1/media/:id
/// Delete a media file
#[utoipa::path(
    delete,
    path = "/api/v1/media/{id}",
    tag = "Media",
    params(
        ("id" = String, Path, description = "Media ID")
    ),
    responses(
        (status = 200, description = "Media deleted successfully"),
        (status = 404, description = "Media not found"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn delete_media(
    State(db): State<DbState>,
    Extension(_claims): Extension<UserClaims>,
    Path(id): Path<String>,
) -> ApiResponse<serde_json::Value> {
    // First check if media exists and get path
    let query = "SELECT path, webp_path FROM media_library WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("media_library", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<(String, Option<String>)> = result.take(0).ok().flatten();
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Media not found"));
    }

    let (path, webp_path) = existing.unwrap();

    // Delete from filesystem
    let _ = fs::remove_file(&path.trim_start_matches('/')).await;
    if let Some(webp) = webp_path {
        let _ = fs::remove_file(&webp.trim_start_matches('/')).await;
    }

    // Delete from database
    let delete_query = "DELETE media_library WHERE id = $id";
    db.query(delete_query)
        .bind(("id", Thing::from(("media_library", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(serde_json::json!({ "success": true, "message": "Media deleted successfully" })))
}

/// GET /api/v1/media/stats
/// Get media library statistics
#[utoipa::path(
    get,
    path = "/api/v1/media/stats",
    tag = "Media",
    responses(
        (status = 200, description = "Media statistics"),
    )
)]
#[axum::debug_handler]
pub async fn get_media_stats(
    State(db): State<DbState>,
) -> ApiResponse<serde_json::Value> {
    let query = r#"
        SELECT 
            count() as total,
            type,
            math::sum(size) as total_size
        FROM media_library 
        GROUP BY type
    "#;
    
    let mut result = db.query(query).await.map_err(|e| crate::api::internal_error(e))?;
    let stats: Vec<serde_json::Value> = result.take(0).map_err(|e| crate::api::internal_error(e))?;

    Ok(Json(serde_json::json!({
        "by_type": stats,
    })))
}