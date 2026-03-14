/**
 * SEO Score Handlers
 * 
 * Handles SEO score calculation and competitor analysis:
 * - POST /api/v1/seo/calculate - Calculate SEO score for an article
 * - GET /api/v1/seo/:article_id - Get SEO score for an article
 * - GET /api/v1/seo/competitor/:keyword - Get competitor analysis
 */

use axum::{
    extract::{Path, State},
    response::Json,
    Extension,
    Router,
};
use surrealdb::types::RecordId;
use surrealdb::types::ToSql;
use serde::{Deserialize, Serialize};
use crate::api::ApiResponse;
use crate::AppState;
use crate::models::seo_score::{SeoScore, SeoScoreBreakdown, CalculateSeoScoreRequest, CompetitorAnalysis};
use crate::models::user::UserClaims;

/// SEO Score response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SeoScoreResponse {
    pub article_id: String,
    pub score: u32,
    pub max_score: u32,
    pub grade: String,
    pub breakdown: SeoScoreBreakdown,
    pub suggestions: Vec<String>,
}

impl SeoScoreResponse {
    pub fn from_score(score: SeoScore) -> Self {
        let grade = match score.score {
            90..=100 => "Excellent".to_string(),
            80..=89 => "Good".to_string(),
            70..=79 => "Fair".to_string(),
            60..=69 => "Needs Improvement".to_string(),
            _ => "Poor".to_string(),
        };

        Self {
            article_id: format!("{}:{:?}", score.article_id.table, score.article_id.key),
            score: score.score,
            max_score: 100,
            grade,
            breakdown: score.breakdown,
            suggestions: score.suggestions,
        }
    }
}

/// Calculate SEO score
pub fn calculate_seo_score(request: &CalculateSeoScoreRequest) -> SeoScoreResponse {
    let mut suggestions = Vec::new();
    let mut breakdown = SeoScoreBreakdown {
        content_quality: 0,
        on_page_seo: 0,
        readability: 0,
        internal_linking: 0,
        technical_seo: 0,
        local_seo: 0,
    };

    // Content Quality (35 points max)
    let word_count = request.content.split_whitespace().count();
    if word_count >= 1000 {
        breakdown.content_quality = 35;
    } else if word_count >= 500 {
        breakdown.content_quality = 25;
        suggestions.push("Consider adding more content (aim for 1000+ words)".to_string());
    } else if word_count >= 300 {
        breakdown.content_quality = 15;
        suggestions.push("Content is too short. Add more detailed information (aim for 1000+ words)".to_string());
    } else {
        breakdown.content_quality = 5;
        suggestions.push("Content is very short. Expand your article significantly".to_string());
    }

    // On-Page SEO (25 points max)
    let title = &request.title;
    let slug = &request.slug;
    let content_lower = request.content.to_lowercase();

    // Title optimization (5 points)
    if !title.is_empty() && title.len() <= 60 {
        breakdown.on_page_seo += 5;
    } else if !title.is_empty() {
        breakdown.on_page_seo += 2;
        suggestions.push("Keep title under 60 characters for better SEO".to_string());
    }

    // Slug optimization (5 points)
    if !slug.is_empty() && slug.len() < 60 {
        breakdown.on_page_seo += 5;
    } else {
        suggestions.push("Optimize URL slug (keep it short and descriptive)".to_string());
    }

    // Meta description (5 points)
    if let Some(ref meta_desc) = request.meta_description {
        if meta_desc.len() >= 120 && meta_desc.len() <= 160 {
            breakdown.on_page_seo += 5;
        } else if meta_desc.len() >= 50 {
            breakdown.on_page_seo += 3;
            suggestions.push("Meta description should be 120-160 characters".to_string());
        } else {
            breakdown.on_page_seo += 1;
            suggestions.push("Add a more detailed meta description (120-160 characters)".to_string());
        }
    } else {
        suggestions.push("Add a meta description (120-160 characters)".to_string());
    }

    // Headings structure (5 points)
    if content_lower.contains("<h2>") || content_lower.contains("##") {
        breakdown.on_page_seo += 5;
    } else {
        suggestions.push("Add H2 headings to structure your content".to_string());
    }

    // Keywords in content (5 points)
    if !title.is_empty() && content_lower.contains(&title.to_lowercase()) {
        breakdown.on_page_seo += 5;
    } else {
        suggestions.push("Include your main keyword in the content".to_string());
    }

    // Readability (15 points max)
    let sentences = request.content.split('.').filter(|s| !s.trim().is_empty()).count();
    if sentences > 0 {
        let avg_words_per_sentence = request.content.split_whitespace().count() / sentences;
        if avg_words_per_sentence <= 20 {
            breakdown.readability = 15;
        } else if avg_words_per_sentence <= 25 {
            breakdown.readability = 10;
            suggestions.push("Try using shorter sentences for better readability".to_string());
        } else {
            breakdown.readability = 5;
            suggestions.push("Sentences are too long. Break them into shorter ones".to_string());
        }
    }

    // Internal Linking (10 points max)
    let content_lower = request.content.to_lowercase();
    let internal_links = content_lower.matches("href=\"/").count() + content_lower.matches("\\[").count();
    if internal_links >= 3 {
        breakdown.internal_linking = 10;
    } else if internal_links >= 1 {
        breakdown.internal_linking = 5;
        suggestions.push("Add more internal links (aim for 3+)".to_string());
    } else {
        breakdown.internal_linking = 0;
        suggestions.push("Add internal links to related content".to_string());
    }

    // Technical SEO (10 points max)
    // Image alt text check
    if content_lower.contains("alt=\"") || content_lower.contains("alt='") {
        breakdown.technical_seo += 5;
    } else {
        suggestions.push("Add alt text to images for better accessibility".to_string());
    }

    // Mobile-friendly (5 points)
    breakdown.technical_seo += 5;

    // Local SEO (5 points max)
    if content_lower.contains("jakarta") || content_lower.contains("indonesia") || content_lower.contains("Indonesia") {
        breakdown.local_seo = 5;
    } else {
        suggestions.push("Consider adding local keywords for better local SEO".to_string());
    }

    SeoScoreResponse {
        article_id: request.article_id.clone(),
        score: breakdown.total(),
        max_score: 100,
        grade: match breakdown.total() {
            90..=100 => "Excellent".to_string(),
            80..=89 => "Good".to_string(),
            70..=79 => "Fair".to_string(),
            60..=69 => "Needs Improvement".to_string(),
            _ => "Poor".to_string(),
        },
        breakdown,
        suggestions,
    }
}

/// POST /api/v1/seo/calculate
/// Calculate SEO score for an article
#[utoipa::path(
    post,
    path = "/api/v1/seo/calculate",
    tag = "SEO",
    request_body = CalculateSeoScoreRequest,
    responses(
        (status = 200, description = "SEO score calculated", body = SeoScoreResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
#[axum::debug_handler]
pub async fn calculate_seo(
    State(app_state): State<crate::AppState>,
    Extension(_claims): Extension<UserClaims>,
    Json(request): Json<CalculateSeoScoreRequest>,
) -> ApiResponse<SeoScoreResponse> {
    let db = &app_state.db;
    // Calculate score
    let calculated_score = calculate_seo_score(&request);

    // Save to database
    let mut seo_record = SeoScore::new(RecordId::new("articles", request.article_id.as_str()));
    seo_record.score = calculated_score.score;
    seo_record.breakdown = calculated_score.breakdown.clone();
    seo_record.suggestions = calculated_score.suggestions.clone();

    let query = "CREATE seo_scores CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&seo_record).map_err(|e| {
            crate::api::internal_error(format!("Failed to serialize SEO score: {}", e))
        })?))
        .await
        .map_err(|e| crate::api::internal_error(e))?;

    let _: Option<SeoScore> = result.take(0).ok().flatten();

    Ok(Json(calculated_score))
}

/// GET /api/v1/seo/:article_id
/// Get SEO score for an article
#[utoipa::path(
    get,
    path = "/api/v1/seo/{article_id}",
    tag = "SEO",
    params(
        ("article_id" = String, Path, description = "Article ID")
    ),
    responses(
        (status = 200, description = "SEO score retrieved", body = SeoScoreResponse),
        (status = 404, description = "SEO score not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_seo_score(
    State(app_state): State<crate::AppState>,
    Path(article_id): Path<String>,
) -> ApiResponse<SeoScoreResponse> {
    let db = &app_state.db;
    let query = "SELECT * FROM seo_scores WHERE article_id = $article_id LIMIT 1";
    let mut result = db.query(query)
        .bind(("article_id", article_id.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;

    let score: Option<SeoScore> = result.take(0)
        .map_err(|e| crate::api::internal_error(e))?;

    match score {
        Some(s) => Ok(Json(SeoScoreResponse::from_score(s))),
        None => Err(crate::api::not_found_error("SEO score not found")),
    }
}

/// GET /api/v1/seo/competitor/:keyword
/// Get competitor analysis for a keyword
#[utoipa::path(
    get,
    path = "/api/v1/seo/competitor/{keyword}",
    tag = "SEO",
    params(
        ("keyword" = String, Path, description = "Keyword to analyze")
    ),
    responses(
        (status = 200, description = "Competitor analysis retrieved", body = CompetitorAnalysis),
        (status = 404, description = "Analysis not found"),
        (status = 500, description = "Internal server error")
    )
)]
#[axum::debug_handler]
pub async fn get_competitor_analysis(
    State(app_state): State<crate::AppState>,
    Path(keyword): Path<String>,
) -> ApiResponse<CompetitorAnalysis> {
    let db = &app_state.db;
    let query = "SELECT * FROM competitor_analysis WHERE keyword = $keyword LIMIT 1";
    let mut result = db.query(query)
        .bind(("keyword", keyword.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;

    let analysis: Option<CompetitorAnalysis> = result.take(0)
        .map_err(|e| crate::api::internal_error(e))?;

    match analysis {
        Some(a) => Ok(Json(a)),
        None => Err(crate::api::not_found_error("Competitor analysis not found")),
    }
}

/// Register SEO routes
pub fn register_routes(router: axum::Router<crate::AppState>) -> axum::Router<crate::AppState> {
    router
        .route("/api/v1/seo/calculate", axum::routing::post(calculate_seo))
        .route("/api/v1/seo/{article_id}", axum::routing::get(get_seo_score))
        .route("/api/v1/seo/competitor/{keyword}", axum::routing::get(get_competitor_analysis))
}
