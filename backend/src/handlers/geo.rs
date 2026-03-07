/**
 * Geo Location Handler
 * Provides IP-based geolocation using Cloudflare headers
 * 
 * When deployed behind Cloudflare, this endpoint extracts country code
 * from Cloudflare's built-in IP geolocation (free, no external API needed).
 * 
 * Reference: https://developers.cloudflare.com/fundamentals/reference/http-request-headers/#cf-ipcountry
 */

use axum::{
    extract::Request,
    Json,
    Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::ApiResponse;

/// Geo location response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct GeoResponse {
    /// ISO 3166-1 alpha-2 country code (e.g., "ID", "US")
    pub country_code: String,
    
    /// Primary language code for the country (e.g., "id", "en")
    pub language: String,
    
    /// Whether the detection was successful
    pub success: bool,
    
    /// Detection method used
    pub method: DetectionMethod,
}

/// Detection method used
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum DetectionMethod {
    /// Detected from Cloudflare CF-IPCountry header
    Cloudflare,
    
    /// Detected from X-Forwarded-For header (fallback)
    Forwarded,
    
    /// Default fallback
    Default,
}

/// Country to language mapping
const COUNTRY_LANGUAGE_MAP: &[(&str, &str)] = &[
    // Indonesian-speaking countries
    ("ID", "id"),
    
    // English-speaking countries
    ("US", "en"),
    ("GB", "en"),
    ("AU", "en"),
    ("CA", "en"),
    ("NZ", "en"),
    ("IE", "en"),
    ("SG", "en"),
    ("MY", "en"),
    ("PH", "en"),
    ("IN", "en"),
    
    // Other major countries (default to English for international users)
    ("JP", "en"),
    ("KR", "en"),
    ("CN", "en"),
    ("TW", "en"),
    ("HK", "en"),
    ("TH", "en"),
    ("VN", "en"),
];

/// Get language from country code
fn get_language_from_country(country_code: &str) -> &str {
    COUNTRY_LANGUAGE_MAP
        .iter()
        .find(|(code, _)| *code == country_code)
        .map(|(_, lang)| *lang)
        .unwrap_or("en") // Default to English for unknown countries
}

/// Get geo information from request
///
/// Extracts country code from Cloudflare headers or fallback headers.
#[utoipa::path(
    get,
    path = "/api/geo",
    tag = "Geo",
    responses(
        (status = 200, description = "Geo information", body = GeoResponse),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn get_geo_info(request: Request) -> ApiResponse<GeoResponse> {
    let headers = request.headers();
    
    // Try to get country from Cloudflare CF-IPCountry header
    // This is the most reliable method when deployed behind Cloudflare
    if let Some(cf_country) = headers.get("cf-ipcountry") {
        if let Ok(country_code_str) = cf_country.to_str() {
            let country_code = country_code_str.to_uppercase();
            let language = get_language_from_country(&country_code);
            let language_string = language.to_string();
            
            tracing::info!(
                country_code = %country_code,
                language = %language,
                method = "cloudflare",
                "Geo detection successful"
            );
            
            return Ok(Json(GeoResponse {
                country_code,
                language: language_string,
                success: true,
                method: DetectionMethod::Cloudflare,
            }));
        }
    }
    
    // Fallback: Try to get country from X-Forwarded-For header
    // This is less reliable but works for non-Cloudflare deployments
    if let Some(forwarded) = headers.get("x-forwarded-for") {
        if let Ok(_forwarded_str) = forwarded.to_str() {  // Prefix with underscore to indicate it's intentionally unused
            // In a real implementation, you would use an IP geolocation service here
            // For now, we'll return a default response
            tracing::warn!("X-Forwarded-For header present but IP geolocation not implemented");
            
            return Ok(Json(GeoResponse {
                country_code: "US".to_string(),
                language: "en".to_string(),
                success: false,
                method: DetectionMethod::Forwarded,
            }));
        }
    }
    
    // Default fallback
    tracing::warn!("No geo headers found, using default");
    
    Ok(Json(GeoResponse {
        country_code: "US".to_string(),
        language: "en".to_string(),
        success: false,
        method: DetectionMethod::Default,
    }))
}

/// Register geo routes
pub fn register_routes<S>(router: Router<S>) -> Router<S> 
where 
    S: Clone + Send + Sync + 'static,
{
    router.route("/api/v1/geo", axum::routing::get(get_geo_info))
}
