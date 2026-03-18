use axum::{extract::State, response::Json, Extension, extract::ws::{WebSocket, WebSocketUpgrade, Message}, extract::ws};
use futures::{sink::SinkExt, stream::StreamExt};
use tokio::sync::broadcast;

use crate::api::{ApiError, ApiResponse};
use crate::models::analytics::*;
use crate::models::user::UserClaims;

fn forbidden_error(message: &str) -> ApiError {
    ApiError {
        status: axum::http::StatusCode::FORBIDDEN,
        message: Some(message.to_string()),
    }
}

fn ensure_editor(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_edit() {
        Ok(())
    } else {
        Err(forbidden_error("Editor access required"))
    }
}

fn ensure_admin(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_manage_users() {
        Ok(())
    } else {
        Err(forbidden_error("Admin access required"))
    }
}

// ============== Stats Widget Endpoints ==============

/// GET /api/v1/analytics/stats
/// Get dashboard stats widgets data (articles, works, clients, contacts)
#[utoipa::path(
    get,
    path = "/api/v1/analytics/stats",
    tag = "Analytics",
    responses(
        (status = 200, description = "Dashboard stats", body = DashboardStatsResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_dashboard_stats(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<DashboardStatsResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let stats = service
        .get_dashboard_stats(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    let trends = service
        .get_data_trends(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(DashboardStatsResponse { stats, trends }))
}

// ============== Behavior Tracking Endpoints ==============

/// GET /api/v1/analytics/behavior
/// Get user behavior tracking data (country, city, top pages)
#[utoipa::path(
    get,
    path = "/api/v1/analytics/behavior",
    tag = "Analytics",
    responses(
        (status = 200, description = "Behavior overview", body = BehaviorOverviewResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_behavior_overview(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<BehaviorOverviewResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let overview = service
        .get_behavior_overview(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(BehaviorOverviewResponse { overview }))
}

// ============== Real-time Stats Endpoints ==============

/// GET /api/v1/analytics/realtime
/// Get real-time statistics
#[utoipa::path(
    get,
    path = "/api/v1/analytics/realtime",
    tag = "Analytics",
    responses(
        (status = 200, description = "Real-time stats", body = RealTimeStatsResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_realtime_stats(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<RealTimeStatsResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let stats = service
        .get_realtime_stats(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(RealTimeStatsResponse { stats }))
}

/// GET /api/v1/analytics/realtime/ws
/// WebSocket endpoint for real-time stats updates
#[utoipa::path(
    get,
    path = "/api/v1/analytics/realtime/ws",
    tag = "Analytics",
    responses(
        (status = 101, description = "Switching Protocols - WebSocket connection"),
        (status = 403, description = "Forbidden")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn realtime_stats_ws(
    ws: WebSocketUpgrade,
    Extension(claims): Extension<UserClaims>,
) -> Result<axum::response::Response, ApiError> {
    ensure_editor(&claims)?;
    Ok(ws.on_upgrade(handle_websocket_socket))
}

async fn handle_websocket_socket(socket: WebSocket) {
    let (mut sender, mut receiver) = socket.split();
    
    // Create broadcast channel for real-time updates
    let (tx, mut rx) = broadcast::channel::<RealTimeStats>(100);
    
    // Spawn task to send updates to client
    let send_task = tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(5));
        loop {
            tokio::select! {
                _ = interval.tick() => {
                    // Send periodic update (in production, get real data)
                    let stats = RealTimeStats {
                        active_users: 0,
                        page_views_last_hour: 0,
                        events_last_hour: 0,
                        top_active_page: None,
                        timestamp: chrono::Utc::now().to_rfc3339(),
                    };
                    
                    let msg = RealTimeStatsMessage {
                        r#type: "stats_update".to_string(),
                        data: stats,
                    };
                    
                    if let Ok(json) = serde_json::to_string(&msg) {
                        if sender.send(Message::Text(json)).await.is_err() {
                            break;
                        }
                    }
                }
                Some(stats) = rx.recv() => {
                    let msg = RealTimeStatsMessage {
                        r#type: "stats_update".to_string(),
                        data: stats,
                    };
                    
                    if let Ok(json) = serde_json::to_string(&msg) {
                        if sender.send(Message::Text(json)).await.is_err() {
                            break;
                        }
                    }
                }
            }
        }
    });
    
    // Receive messages from client (for keepalive or commands)
    let recv_task = tokio::spawn(async move {
        while let Some(Ok(_)) = receiver.next().await {}
    });
    
    // Wait for either task to complete
    tokio::select! {
        _ = send_task => {},
        _ = recv_task => {},
    }
}

// ============== Journey Tracking Endpoints ==============

/// GET /api/v1/analytics/journeys
/// List all custom journeys
#[utoipa::path(
    get,
    path = "/api/v1/analytics/journeys",
    tag = "Analytics",
    responses(
        (status = 200, description = "List of journeys", body = JourneyListResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn list_journeys(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<JourneyListResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let journeys = service
        .list_journeys(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(JourneyListResponse { journeys }))
}

/// POST /api/v1/analytics/journeys
/// Create a new custom journey
#[utoipa::path(
    post,
    path = "/api/v1/analytics/journeys",
    tag = "Analytics",
    request_body = CreateJourneyRequest,
    responses(
        (status = 200, description = "Journey created", body = CustomJourney),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn create_journey(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<CreateJourneyRequest>,
) -> ApiResponse<CustomJourney> {
    ensure_admin(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let journey = service
        .create_journey(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    
    Ok(Json(journey))
}

/// GET /api/v1/analytics/journeys/:id/completion
/// Get journey completion statistics
#[utoipa::path(
    get,
    path = "/api/v1/analytics/journeys/{journey_id}/completion",
    tag = "Analytics",
    params(
        ("journey_id" = String, Path, description = "Journey ID")
    ),
    responses(
        (status = 200, description = "Journey completion stats", body = JourneyCompletion),
        (status = 403, description = "Forbidden"),
        (status = 404, description = "Journey not found"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_journey_completion(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    axum::extract::Path(journey_id): axum::extract::Path<String>,
) -> ApiResponse<JourneyCompletion> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let completion = service
        .get_journey_completion(&app_state.db, &journey_id)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(completion))
}

/// POST /api/v1/analytics/journeys/:id/compare
/// Compare journey performance between two periods
#[utoipa::path(
    post,
    path = "/api/v1/analytics/journeys/{journey_id}/compare",
    tag = "Analytics",
    params(
        ("journey_id" = String, Path, description = "Journey ID")
    ),
    request_body = JourneyComparisonRequest,
    responses(
        (status = 200, description = "Journey comparison", body = JourneyComparison),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn compare_journeys(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    axum::extract::Path(journey_id): axum::extract::Path<String>,
    Json(payload): Json<JourneyComparisonRequest>,
) -> ApiResponse<JourneyComparison> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let comparison = service
        .compare_journey_periods(&app_state.db, &journey_id, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    
    Ok(Json(comparison))
}

// ============== Funnel Builder Endpoints ==============

/// GET /api/v1/analytics/funnels
/// List all user-defined funnels
#[utoipa::path(
    get,
    path = "/api/v1/analytics/funnels",
    tag = "Analytics",
    responses(
        (status = 200, description = "List of funnels", body = FunnelListResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn list_funnels(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<FunnelListResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let funnels = service
        .list_user_funnels(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(FunnelListResponse { funnels }))
}

/// POST /api/v1/analytics/funnels
/// Create a new user-defined funnel
#[utoipa::path(
    post,
    path = "/api/v1/analytics/funnels",
    tag = "Analytics",
    request_body = CreateFunnelRequest,
    responses(
        (status = 200, description = "Funnel created", body = UserFunnel),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn create_funnel(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<CreateFunnelRequest>,
) -> ApiResponse<UserFunnel> {
    ensure_admin(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let funnel = service
        .create_user_funnel(&app_state.db, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    
    Ok(Json(funnel))
}

/// POST /api/v1/analytics/funnels/:id/analyze
/// Analyze funnel performance
#[utoipa::path(
    post,
    path = "/api/v1/analytics/funnels/{funnel_id}/analyze",
    tag = "Analytics",
    params(
        ("funnel_id" = String, Path, description = "Funnel ID")
    ),
    request_body = AnalyzeFunnelRequest,
    responses(
        (status = 200, description = "Funnel analysis", body = FunnelAnalysisResponse),
        (status = 400, description = "Bad request"),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn analyze_funnel(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    axum::extract::Path(funnel_id): axum::extract::Path<String>,
    Json(payload): Json<AnalyzeFunnelRequest>,
) -> ApiResponse<FunnelAnalysisResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let analysis = service
        .analyze_funnel(&app_state.db, &funnel_id, payload)
        .await
        .map_err(|error| crate::api::bad_request_error(error.as_str()))?;
    
    Ok(Json(analysis))
}

// ============== Enterprise Dashboard Endpoints ==============

/// GET /api/v1/analytics/enterprise
/// Get comprehensive enterprise analytics dashboard data
#[utoipa::path(
    get,
    path = "/api/v1/analytics/enterprise",
    tag = "Analytics",
    responses(
        (status = 200, description = "Enterprise dashboard data", body = EnterpriseDashboardResponse),
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Internal server error")
    ),
    security(("bearer_auth" = []))
)]
#[axum::debug_handler]
pub async fn get_enterprise_dashboard(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<EnterpriseDashboardResponse> {
    ensure_editor(&claims)?;
    
    let service = crate::services::analytics::AnalyticsService::new();
    let summary = service
        .get_enterprise_summary(&app_state.db)
        .await
        .map_err(crate::api::internal_error)?;
    
    Ok(Json(EnterpriseDashboardResponse {
        summary,
        generated_at: chrono::Utc::now().to_rfc3339(),
    }))
}
