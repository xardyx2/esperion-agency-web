use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// ============== Consent Types ==============

// Consent tier configuration for admin settings
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ConsentTierConfig {
    pub essential_enabled: bool,
    pub analytics_enabled: bool,
    pub functional_enabled: bool,
    pub marketing_enabled: bool,
}

// Consent tier state for frontend transmission
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ConsentTierState {
    pub essential: bool,
    pub analytics: bool,
    pub functional: bool,
    pub marketing: bool,
}

// User consent preferences
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ConsentPreferences {
    pub version: String,
    pub timestamp: String,
    pub tiers: ConsentTierState,
}

// ============== Stats Widget Types ==============

/// Dashboard stats for widgets
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct DashboardStats {
    pub total_articles: u64,
    pub total_works: u64,
    pub total_clients: u64,
    pub total_contacts: u64,
    pub published_articles: u64,
    pub featured_works: u64,
    pub active_clients: u64,
    pub new_contacts: u64,
}

// ============== User Behavior Tracking Types ==============

/// User behavior metrics
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserBehaviorMetrics {
    pub country: String,
    pub city: Option<String>,
    pub page_views: u64,
    pub sessions: u64,
}

/// Top pages data
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TopPage {
    pub path: String,
    pub views: u64,
    pub unique_visitors: u64,
    pub avg_time_on_page: Option<f64>,
}

/// Behavior overview
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BehaviorOverview {
    pub by_country: Vec<UserBehaviorMetrics>,
    pub by_city: Vec<UserBehaviorMetrics>,
    pub top_pages: Vec<TopPage>,
    pub total_unique_visitors: u64,
    pub total_sessions: u64,
    pub avg_session_duration: Option<f64>,
}

// ============== Real-time Stats Types ==============

/// Real-time statistics for WebSocket
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RealTimeStats {
    pub active_users: u64,
    pub page_views_last_hour: u64,
    pub events_last_hour: u64,
    pub top_active_page: Option<String>,
    pub timestamp: String,
}

// ============== Journey Tracking Types ==============

/// Journey step definition
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyStep {
    pub order: u32,
    pub path_pattern: String,
    pub event_name: Option<String>,
}

/// Custom journey definition
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CustomJourney {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub steps: Vec<JourneyStep>,
    pub active: bool,
    pub created_at: Option<String>,
}

/// Journey completion data
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyCompletion {
    pub journey_id: String,
    pub journey_name: String,
    pub total_completions: u64,
    pub completion_rate: f64,
    pub avg_steps_completed: f64,
}

/// Journey path comparison
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyComparison {
    pub journey_id: String,
    pub journey_name: String,
    pub period_a: JourneyPeriodData,
    pub period_b: JourneyPeriodData,
    pub change_percentage: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyPeriodData {
    pub period_name: String,
    pub start_date: String,
    pub end_date: String,
    pub completions: u64,
    pub drop_off_points: Vec<DropOffPoint>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct DropOffPoint {
    pub step_order: u32,
    pub step_name: String,
    pub drop_off_count: u64,
    pub drop_off_rate: f64,
}

// ============== Funnel Builder Types ==============

/// Funnel step with position
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelStepDefinition {
    pub id: String,
    pub name: String,
    pub event_name: String,
    pub path_pattern: Option<String>,
    pub order: u32,
}

/// User-defined funnel
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserFunnel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub steps: Vec<FunnelStepDefinition>,
    pub active: bool,
    pub created_by: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

/// Funnel analysis response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelAnalysisResponse {
    pub funnel_id: String,
    pub funnel_name: String,
    pub total_entries: u64,
    pub completions: u64,
    pub overall_conversion_rate: f64,
    pub step_metrics: Vec<FunnelStepAnalysis>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelStepAnalysis {
    pub step_id: String,
    pub step_name: String,
    pub step_order: u32,
    pub entries: u64,
    pub completions: u64,
    pub conversion_rate: f64,
    pub drop_off_count: u64,
    pub drop_off_rate: f64,
    pub avg_time_to_complete: Option<f64>,
}

// ============== Enterprise Dashboard Types ==============

/// Enterprise dashboard summary
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct EnterpriseDashboardSummary {
    pub stats: DashboardStats,
    pub behavior: BehaviorOverview,
    pub real_time: RealTimeStats,
    pub funnels: Vec<FunnelReport>,
    pub journeys: Vec<JourneyCompletion>,
    pub trends: DataTrends,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct DataTrends {
    pub page_views_trend: Vec<TrendPoint>,
    pub sessions_trend: Vec<TrendPoint>,
    pub conversions_trend: Vec<TrendPoint>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrendPoint {
    pub date: String,
    pub value: u64,
}

// ============== Request/Response Types ==============

/// Request to create custom journey
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateJourneyRequest {
    pub name: String,
    pub description: Option<String>,
    pub steps: Vec<JourneyStep>,
}

/// Request to create user funnel
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateFunnelRequest {
    pub name: String,
    pub description: Option<String>,
    pub steps: Vec<FunnelStepDefinition>,
}

/// Request to analyze funnel
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyzeFunnelRequest {
    pub funnel_id: String,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
}

/// Request for journey comparison
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyComparisonRequest {
    pub journey_id: String,
    pub period_a_start: String,
    pub period_a_end: String,
    pub period_b_start: String,
    pub period_b_end: String,
}

/// Real-time stats WebSocket message
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RealTimeStatsMessage {
    pub r#type: String,
    pub data: RealTimeStats,
}

// Tracker to tier mapping
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrackerConsentRules {
    pub tracker_id: String,
    pub tier: TrackerTier,
    pub requires_consent: bool,
    pub default_allowed: bool,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub enum TrackerTier {
    Essential,
    Analytics,
    Functional,
    Marketing,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyticsIntegrationSettings {
    pub ga4_measurement_id: Option<String>,
    pub gtm_container_id: Option<String>,
    pub clarity_project_id: Option<String>,
    pub meta_pixel_id: Option<String>,
    pub tiktok_pixel_id: Option<String>,
    pub linkedin_partner_id: Option<String>,
    pub enabled: bool,
    // NEW: Consent governance fields
    pub consent_tiers: Option<ConsentTierConfig>,
    pub tracker_rules: Option<Vec<TrackerConsentRules>>,
    pub consent_required: bool,
    pub consent_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelStep {
    pub name: String,
    pub event_name: String,
    pub path: Option<String>,
    pub order: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyticsFunnel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub steps: Vec<FunnelStep>,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyticsSettings {
    pub integrations: AnalyticsIntegrationSettings,
    pub funnels: Vec<AnalyticsFunnel>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, Default)]
pub struct PublicAnalyticsConfig {
    pub ga4_measurement_id: Option<String>,
    pub gtm_container_id: Option<String>,
    pub clarity_project_id: Option<String>,
    pub meta_pixel_id: Option<String>,
    pub tiktok_pixel_id: Option<String>,
    pub linkedin_partner_id: Option<String>,
    pub enabled: bool,
    // NEW: Consent metadata
    pub consent_required: bool,
    pub consent_tiers: Option<ConsentTierState>,
    pub trackers_blocked: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ConsentSavedResponse {
    pub success: bool,
    pub message: String,
    pub effective_config: PublicAnalyticsConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrackEventRequest {
    pub event_name: String,
    pub session_id: Option<String>,
    pub page_url: String,
    pub referrer: Option<String>,
    pub country: Option<String>,
    pub language: Option<String>,
    pub device_type: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrackEventResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyticsOverview {
    pub total_events: u64,
    pub total_sessions: u64,
    pub page_views: u64,
    pub conversion_events: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelStepMetric {
    pub step_name: String,
    pub event_name: String,
    pub count: u64,
    pub conversion_rate_from_previous: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelReport {
    pub funnel_id: String,
    pub funnel_name: String,
    pub steps: Vec<FunnelStepMetric>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AnalyticsReportResponse {
    pub overview: AnalyticsOverview,
    pub funnels: Vec<FunnelReport>,
}

// ============== Stats Endpoints Response Types ==============

/// Response for dashboard stats endpoint
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct DashboardStatsResponse {
    pub stats: DashboardStats,
    pub trends: DataTrends,
}

/// Response for behavior tracking endpoint
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BehaviorOverviewResponse {
    pub overview: BehaviorOverview,
}

/// Response for real-time stats endpoint
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RealTimeStatsResponse {
    pub stats: RealTimeStats,
}

/// Response for journey list endpoint
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JourneyListResponse {
    pub journeys: Vec<CustomJourney>,
}

/// Response for funnel list endpoint
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FunnelListResponse {
    pub funnels: Vec<UserFunnel>,
}

/// Response for enterprise dashboard
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct EnterpriseDashboardResponse {
    pub summary: EnterpriseDashboardSummary,
    pub generated_at: String,
}
