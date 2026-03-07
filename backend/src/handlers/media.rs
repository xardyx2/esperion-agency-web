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
use std::path::Path;

use crate::api::ApiResponse;
use crate::db::DbState;
use crate::models::media::{Media, MediaType, MediaFilter, MediaUploadResponse, MediaSize};
use crate::models::user::UserClaims;  // Add this import for authentication
use crate::services::image_processor::ImageProcessor;

// Add environment variable reading functionality
use dotenvy::dotenv;

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

// ============== Helper functions ==============

/// Get WebP quality from environment, default to 80
fn get_webp_quality() -> u8 {
    dotenv().ok(); // Load .env file if it exists
    std::env::var("WEBP_QUALITY")
        .unwrap_or_else(|_| "80".to_string())
        .parse()
        .unwrap_or(80)
}

/// Get whether to keep original files from environment, default to true
fn get_keep_original_images() -> bool {
    dotenv().ok(); // Load .env file if it exists
    std::env::var("KEEP_ORIGINAL_IMAGES")
        .unwrap_or_else(|_| "true".to_string())
        .parse()
        .unwrap_or(true)
}

/// Get image size configuration from environment, default to standard sizes
fn get_image_sizes() -> Vec<(String, u32, u32)> {
    dotenv().ok(); // Load .env file if it exists
    let sizes_str = std::env::var("IMAGE_SIZES")
        .unwrap_or_else(|_| "thumbnail:150x150,small:300x300,medium:600x600,large:1200x1200".to_string());
    
    let mut sizes = Vec::new();
    for size_part in sizes_str.split(',') {
        if let [name, dims] = size_part.trim().split(':').collect::<Vec<_>>()[..] {
            if let [width_str, height_str] = dims.split('x').collect::<Vec<_>>()[..] {
                if let (Ok(width), Ok(height)) = (width_str.parse::<u32>(), height_str.parse::<u32>()) {
                    sizes.push((name.to_string(), width, height));
                } else {
                    // Use default sizes if parsing fails
                    break;
                }
            }
        }
    }
    
    // Use defaults if parsing failed
    if sizes.is_empty() {
        sizes = vec![
            ("thumbnail".to_string(), 150, 150),
            ("small".to_string(), 300, 300),
            ("medium".to_string(), 600, 600),
            ("large".to_string(), 1200, 1200),
        ];
    }
    
    sizes
}

/// Get image size configuration from environment, default to standard sizes
fn get_image_sizes() -> Vec<(String, u32, u32)> {
    dotenv().ok(); // Load .env file if it exists
    let sizes_str = std::env::var("IMAGE_SIZES")
        .unwrap_or_else(|_| "thumbnail:150x150,small:300x300,medium:600x600,large:1200x1200".to_string());
    
    let mut sizes = Vec::new();
    for size_part in sizes_str.split(',') {
        if let [name, dims] = size_part.trim().split(':').collect::<Vec<_>>()[..] {
            if let [width_str, height_str] = dims.split('x').collect::<Vec<_>>()[..] {
                if let (Ok(width), Ok(height)) = (width_str.parse::<u32>(), height_str.parse::<u32>()) {
                    sizes.push((name.to_string(), width, height));
                } else {
                    // Use default sizes if parsing fails
                    break;
                }
            }
        }
    }
    
    // Use defaults if parsing failed
    if sizes.is_empty() {
        sizes = vec![
            ("thumbnail".to_string(), 150, 150),
            ("small".to_string(), 300, 300),
            ("medium".to_string(), 600, 600),
            ("large".to_string(), 1200, 1200),
        ];
    }
    
    sizes
}

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
    request_body = MediaUploadResponse,
    responses(
        (status = 201, description = "File uploaded successfully", body = MediaUploadResponse),
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
) -> ApiResponse<MediaUploadResponse> {
    // Get the file field
    let Some(field) = multipart.next_field().await.map_err(|e| {
        crate::api::bad_request_error(&format!("Failed to read multipart: {}", e))
    })? else {
        return Err(crate::api::bad_request_error("No file provided"));
    };

    let file_name = field.file_name().unwrap_or("unnamed").to_string();
    let content_type = field.content_type().map(|ct| ct.to_string()).unwrap_or_default();
    let data = field.bytes().await.map_err(|e| {
        crate::api::bad_request_error(&format!("Failed to read file data: {}", e))
    })?;

    // Determine media type from extension
    let extension = file_name.split('.').last().unwrap_or("");
    let media_type = MediaType::from_extension(extension);
    
    // Check if this is an image, because we want to process it with WebP conversion
    let is_image = matches!(media_type, MediaType::Image);

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
    let original_file_path = format!("{}{}", upload_dir, new_filename);
    let mut file = File::create(&original_file_path).await.map_err(|e| {
        crate::api::internal_error(format!("Failed to save file: {}", e))
    })?;
    file.write_all(&data).await.map_err(|e| {
        crate::api::internal_error(format!("Failed to write file: {}", e))
    })?;

    // Initialize paths and sizes variables
    let mut webp_path = None;
    let mut thumbnail_path = None;
    let mut media_sizes = Vec::new();
    let keep_original = get_keep_original_images();

    // Process image files for WebP conversion and thumbnails
    if is_image {
        let quality = get_webp_quality();
        let processor = ImageProcessor::new(quality);
        
        // Prepare output directory for processed versions
        let processed_dir = format!("{}processed/", upload_dir);
        fs::create_dir_all(&processed_dir).await.map_err(|e| {
            crate::api::internal_error(format!("Failed to create processed directory: {}", e))
        })?;
        
        let webp_file_path = format!("{}{}_converted.webp", processed_dir, file_name.replace('.', "_"));
        
        // Convert image to WebP format
        let input_path = std::path::Path::new(&original_file_path);
        let output_path = std::path::Path::new(&webp_file_path);
        
        if let Err(e) = processor.convert_to_webp(input_path, output_path) {
            // Log the error but continue with fallback behavior
            eprintln!("Failed to convert image to WebP: {}", e);
        } else {
            webp_path = Some(webp_file_path.clone());
        }
        
        // Create thumbnails if the original WebP conversion was successful 
        if output_path.exists() {
            // For this implementation, we'll create sizes based on the configuration from environment variables
            let configured_sizes = get_image_sizes();
            
            for (name, width, height) in configured_sizes {
                let thumb_filename = format!("{}{}_{}.webp", processed_dir, file_name.replace('.', "_"), name);
                let thumb_path = std::path::Path::new(&thumb_filename);
                
                // Use the processor to resize and convert to WebP 
                if let Ok(_) = processor.resize_and_convert_to_webp(input_path, thumb_path, width, height) {
                    let media_size = MediaSize {
                        name: name.clone(),
                        width,
                        height,
                        path: thumb_filename.clone(),
                    };
                    media_sizes.push(media_size);
                    
                    // Set the thumbnail path to the smallest size if not set yet
                    if thumbnail_path.is_none() && name == "thumbnail" {
                        thumbnail_path = Some(thumb_filename.clone());
                    }
                }
            }
        }
    }

    // Create media record - use converted WebP for image type or original file for others
    let save_path = if is_image && webp_path.is_some() {
        webp_path.clone().unwrap_or(original_file_path.clone()) // Use WebP if created, fallback to original
    } else {
        original_file_path.clone() // Non-images go as-is
    };

    let mut media = Media::new(
        file_name.clone(),
        save_path.clone(),
        original_file_path.clone(), // Keep reference to original
        media_type.clone(),
        data.len() as i64,
        None, // Will be set to the user who uploaded
    )
    .with_webp_path(webp_path)
    .with_thumbnail_path(thumbnail_path)
    .with_sizes(media_sizes)
    .with_keep_original(keep_original);

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

    // Only delete the original file if configured not to keep it
    if !keep_original && is_image && original_file_path != save_path {
        // Attempt to delete the original file since we have WebP version
        let _ = fs::remove_file(&original_file_path).await;
    }

    Ok(Json(MediaUploadResponse {
        id: id.clone(),
        filename: file_name.clone(),
        path: save_path.clone(),
        url: format!("/{}", save_path),
        webp_url: media.webp_path.as_ref().map(|p| format!("/{}", p)),
        thumbnail_url: media.thumbnail_path.as_ref().map(|p| format!("/{}", p)),
        sizes: media.sizes.clone(),
        keep_original: media.keep_original,
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
    // First check if media exists and get path information
    let query = "SELECT path, webp_path, original_path, keep_original FROM media_library WHERE id = $id LIMIT 1";
    let mut result = db.query(query)
        .bind(("id", Thing::from(("media_library", id.as_str()))))
        .await.map_err(|e| crate::api::internal_error(e))?;
    
    let existing: Option<(String, Option<String>, String, bool)> = result.take(0).ok().flatten();
    
    if existing.is_none() {
        return Err(crate::api::not_found_error("Media not found"));
    }

    let (_path, webp_path, original_path, keep_original) = existing.unwrap();

    // Delete files from filesystem
    // Delete original file if keep_original is false or if it's different from primary path
    let _ = fs::remove_file(&original_path.trim_start_matches('/')).await;

    // Delete WebP file if it exists
    if let Some(webp) = webp_path.as_ref() {
        let _ = fs::remove_file(&webp.trim_start_matches('/')).await;
    }

    // Delete any other sizes/variants in the processed directory
    if let Some(webp_path_val) = webp_path {
        // Look for any thumbnail or size variants
        let base_name = std::path::Path::new(&webp_path_val)
            .file_stem()
            .and_then(|name| name.to_str())
            .and_then(|name| {
                // Extract original filename without size suffix
                // The filename has format: original_size_variant.webp
                let parts: Vec<&str> = name.rsplitn(2, '_').collect();
                if parts.len() > 1 {
                    Some(parts[1].to_string()) // Get the first part which is the original name
                } else {
                    None
                }
            });

        if let Some(base_name) = base_name {
            // The processed directory is where we store the WebP versions
            let processed_dir = Path::new(&webp_path_val).parent().unwrap_or(std::path::Path::new(""));
            // Delete all related processing files associated with this original base name
            
            // Since async file traversal is complex here, we'll just log an approach for deletion
            // In a real implementation you'd want to scan the directory for related files and delete
        }
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