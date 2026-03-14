use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

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
