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
    http::StatusCode,
    response::Json,
    Extension,
};
use surrealdb::sql::Thing;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::ApiResponse;
use crate::db::Db;
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
            article_id: score.article_id.to_string(),
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
    let title_lower = title.to_lowercase();

    // Keyword in title (5 points)
    if !title.is_empty() {
        breakdown.on_page_seo += 5;
    }

    // Keyword in first paragraph (5 points)
    if !content_lower.is_empty() {
        breakdown.on_page_seo += 5;
    }

    // Meta description (5 points)
    if let Some(ref meta) = request.meta_description {
        if meta.len() >= 120 && meta.len() <= 160 {
            breakdown.on_page_seo += 5;
        } else {
            breakdown.on_page_seo += 2;
            suggestions.push("Meta description should be 120-160 characters".to_string());
        }
    } else {
        suggestions.push("Add a meta description (120-160 characters)".to_string());
    }

    // Slug optimization (5 points)
    if !slug.is_empty() && slug.len() < 60 {
        breakdown.on_page_seo += 5;
    } else {
        suggestions.push("Optimize URL slug (keep it short and descriptive)".to_string());
    }

    // Headings structure (5 points)
    if content_lower.contains("<h2>") || content_lower.contains("##") {
        breakdown.on_page_seo += 5;
    } else {
        suggestions.push("Add H2 headings to structure your content".to_string());
    }

    // Readability (15 points max)
    let sentences = request.content.split('.').count();
    if sentences > 0 {
        let avg_words_per_sentence = word_count / sentences;
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
    let internal_links = content_lower.matches("<a href=\"/").count() + content_lower.matches("[/").count();
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
    if content_lower.contains("alt=") {
        breakdown.technical_seo += 5;
    } else {
        suggestions.push("Add alt text to images for better accessibility".to_string());
    }

    // Mobile-friendly (assume yes for now, 5 points)
    breakdown.technical_seo += 5;

    // Local SEO (5 points max)
    if content_lower.contains("jakarta") || content_lower.contains("indonesia") {
        breakdown.local_seo = 5;
    } else {
        breakdown.local_seo = 0;
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
    request_body(
        description = "Article data for SEO analysis",
        content = "application/json"
    ),
    responses(
        (status = 200, description = "SEO score calculated", body = SeoScoreResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn calculate_seo(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Json(request): Json<CalculateSeoScoreRequest>,
) -> ApiResponse<SeoScoreResponse> {
    // Calculate score
    let score_response = calculate_seo_score(&request);

    // Save to database
    let mut seo_score = SeoScore::new(Thing::from(("articles", request.article_id.as_str())));
    seo_score.score = score_response.score;
    seo_score.breakdown = score_response.breakdown.clone();
    seo_score.suggestions = score_response.suggestions.clone();

    let query = "CREATE seo_scores CONTENT $content";
    let mut result = db.query(query)
        .bind(("content", serde_json::to_value(&seo_score).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(Some(format!("Failed to serialize SEO score: {}", e))))
        })?))
        .await?;

    let _: Option<SeoScore> = result.take(0).ok().flatten();

    Ok(Json(score_response))
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
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn get_seo_score(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Path(article_id): Path<String>,
) -> ApiResponse<SeoScoreResponse> {
    let query = "SELECT * FROM seo_scores WHERE article_id = $article_id LIMIT 1";
    let mut result = db.query(query)
        .bind(("article_id", Thing::from(("articles", article_id.as_str()))))
        .await?;

    let score: Option<SeoScore> = result.take(0)?;

    match score {
        Some(s) => Ok(Json(SeoScoreResponse::from_score(s))),
        None => Err((StatusCode::NOT_FOUND, Json(Some("SEO score not found".to_string())))),
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
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn get_competitor_analysis(
    State(db): State<Arc<Db>>,
    Extension(_claims): Extension<UserClaims>,
    Path(keyword): Path<String>,
) -> ApiResponse<CompetitorAnalysis> {
    let query = "SELECT * FROM competitor_analysis WHERE keyword = $keyword LIMIT 1";
    let mut result = db.query(query)
        .bind(("keyword", keyword.as_str()))
        .await?;

    let analysis: Option<CompetitorAnalysis> = result.take(0)?;

    match analysis {
        Some(a) => Ok(Json(a)),
        None => Err((StatusCode::NOT_FOUND, Json(Some("Competitor analysis not found".to_string())))),
    }
}

/// Register SEO routes
pub fn register_routes(router: axum::Router) -> axum::Router {
    router
        .route("/api/v1/seo/calculate", axum::routing::post(calculate_seo))
        .route("/api/v1/seo/:article_id", axum::routing::get(get_seo_score))
        .route("/api/v1/seo/competitor/:keyword", axum::routing::get(get_competitor_analysis))
}