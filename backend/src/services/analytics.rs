use std::collections::HashSet;

use serde::de::DeserializeOwned;
use serde_json::json;

use crate::models::analytics::{
    AnalyticsFunnel, AnalyticsIntegrationSettings, AnalyticsOverview, AnalyticsReportResponse,
    AnalyticsSettings, ConsentPreferences, ConsentSavedResponse, ConsentTierConfig,
    ConsentTierState, FunnelReport, FunnelStepMetric, PublicAnalyticsConfig, TrackEventRequest,
};

const KEY_ANALYTICS_INTEGRATIONS: &str = "analytics.integrations";

pub struct AnalyticsService;

impl AnalyticsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_settings(&self, db: &crate::db::DbState) -> Result<AnalyticsSettings, String> {
        let defaults = default_analytics_settings();
        let integrations = read_setting::<AnalyticsIntegrationSettings>(db, KEY_ANALYTICS_INTEGRATIONS)
            .await?
            .unwrap_or(defaults.integrations);

        let funnels = self.list_funnels(db).await?;

        Ok(AnalyticsSettings {
            integrations,
            funnels,
        })
    }

    pub async fn update_settings(
        &self,
        db: &crate::db::DbState,
        settings: AnalyticsSettings,
    ) -> Result<AnalyticsSettings, String> {
        validate_integrations(&settings.integrations)?;
        validate_funnels(&settings.funnels)?;

        write_setting(db, KEY_ANALYTICS_INTEGRATIONS, &settings.integrations).await?;
        self.save_funnels(db, settings.funnels.as_slice()).await?;

        self.get_settings(db).await
    }

    pub async fn get_public_config(
        &self,
        db: &crate::db::DbState,
    ) -> Result<PublicAnalyticsConfig, String> {
        let settings = self.get_settings(db).await?;
        Ok(PublicAnalyticsConfig {
            ga4_measurement_id: settings.integrations.ga4_measurement_id,
            gtm_container_id: settings.integrations.gtm_container_id,
            clarity_project_id: settings.integrations.clarity_project_id,
            meta_pixel_id: settings.integrations.meta_pixel_id,
            tiktok_pixel_id: settings.integrations.tiktok_pixel_id,
            linkedin_partner_id: settings.integrations.linkedin_partner_id,
            enabled: settings.integrations.enabled,
            consent_required: settings.integrations.consent_required,
            consent_tiers: None,
            trackers_blocked: vec![],
        })
    }

    // NEW: Get public config with consent filtering
    pub async fn get_public_config_with_consent(
        &self,
        db: &crate::db::DbState,
        user_consent: Option<ConsentPreferences>,
    ) -> Result<PublicAnalyticsConfig, String> {
        let settings = self.get_settings(db).await?;
        
        // If analytics disabled globally, return empty
        if !settings.integrations.enabled {
            return Ok(PublicAnalyticsConfig {
                enabled: false,
                ..Default::default()
            });
        }
        
        // If consent not required, return full config
        if !settings.integrations.consent_required {
            return self.get_public_config(db).await;
        }
        
        // Filter by user consent
        let config = self.filter_config_by_consent(
            &settings.integrations,
            user_consent
        );
        
        Ok(config)
    }

    fn filter_config_by_consent(
        &self,
        integrations: &AnalyticsIntegrationSettings,
        user_consent: Option<ConsentPreferences>,
    ) -> PublicAnalyticsConfig {
        let consent = user_consent.unwrap_or_else(|| self.default_consent());
        let mut trackers_blocked: Vec<String> = vec![];
        
        // Essential: Always included (backend analytics)
        let mut config = PublicAnalyticsConfig {
            enabled: integrations.enabled,
            ga4_measurement_id: None,
            gtm_container_id: None,
            clarity_project_id: None,
            meta_pixel_id: None,
            tiktok_pixel_id: None,
            linkedin_partner_id: None,
            consent_required: integrations.consent_required,
            consent_tiers: Some(consent.tiers.clone()),
            trackers_blocked: vec![],
        };
        
        // Analytics tier: GA4 (requires analytics consent)
        if consent.tiers.analytics {
            config.ga4_measurement_id = integrations.ga4_measurement_id.clone();
            config.gtm_container_id = integrations.gtm_container_id.clone();
        } else {
            if integrations.ga4_measurement_id.is_some() {
                trackers_blocked.push("ga4".to_string());
            }
            if integrations.gtm_container_id.is_some() {
                trackers_blocked.push("gtm".to_string());
            }
        }
        
        // Functional tier: Clarity (requires functional consent)
        if consent.tiers.functional {
            config.clarity_project_id = integrations.clarity_project_id.clone();
        } else if integrations.clarity_project_id.is_some() {
            trackers_blocked.push("clarity".to_string());
        }
        
        // Marketing tier: Pixels (requires explicit marketing consent)
        if consent.tiers.marketing {
            config.meta_pixel_id = integrations.meta_pixel_id.clone();
            config.tiktok_pixel_id = integrations.tiktok_pixel_id.clone();
            config.linkedin_partner_id = integrations.linkedin_partner_id.clone();
        } else {
            if integrations.meta_pixel_id.is_some() {
                trackers_blocked.push("meta_pixel".to_string());
            }
            if integrations.tiktok_pixel_id.is_some() {
                trackers_blocked.push("tiktok_pixel".to_string());
            }
            if integrations.linkedin_partner_id.is_some() {
                trackers_blocked.push("linkedin".to_string());
            }
        }
        
        config.trackers_blocked = trackers_blocked;
        config
    }

    fn default_consent(&self) -> ConsentPreferences {
        ConsentPreferences {
            version: "1.0.0".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            tiers: ConsentTierState {
                essential: true,      // Always true
                analytics: true,      // Default ON (business essential)
                functional: false,    // Default OFF
                marketing: false,     // Default OFF
            },
        }
    }

    // NEW: Parse consent from request header or query param
    pub fn parse_consent_from_request(
        &self,
        header_value: Option<&str>,
        query_param: Option<&str>,
    ) -> Option<ConsentPreferences> {
        // Try header first
        if let Some(header) = header_value {
            if let Ok(decoded) = base64::decode(header) {
                if let Ok(json_str) = String::from_utf8(decoded) {
                    if let Ok(consent) = serde_json::from_str::<ConsentPreferences>(&json_str) {
                        return Some(consent);
                    }
                }
            }
        }
        
        // Fall back to query param
        if let Some(param) = query_param {
            if let Ok(decoded) = urlencoding::decode(param) {
                if let Ok(consent) = serde_json::from_str::<ConsentPreferences>(&decoded) {
                    return Some(consent);
                }
            }
        }
        
        None
    }

    // NEW: Save consent audit (optional)
    pub async fn save_consent_audit(
        &self,
        db: &crate::db::DbState,
        preferences: &ConsentPreferences,
    ) -> Result<(), String> {
        db.query(
            "CREATE analytics_consent_logs SET version = $version, timestamp = $timestamp, tiers = $tiers, created_at = time::now()",
        )
        .bind(("version", &preferences.version))
        .bind(("timestamp", &preferences.timestamp))
        .bind(("tiers", serde_json::to_value(&preferences.tiers).unwrap_or_default()))
        .await
        .map_err(|error| format!("Failed to save consent audit: {error}"))?;
        
        Ok(())
    }

    pub async fn track_event(
        &self,
        db: &crate::db::DbState,
        payload: TrackEventRequest,
    ) -> Result<(), String> {
        if payload.event_name.trim().is_empty() {
            return Err("event_name is required".to_string());
        }

        if payload.page_url.trim().is_empty() {
            return Err("page_url is required".to_string());
        }

        db.query(
            "CREATE analytics_events SET event_type = $event_type, session_id = $session_id, page_url = $page_url, referrer = $referrer, country = $country, language = $language, device_type = $device_type, metadata = $metadata, created_at = time::now()",
        )
        .bind(("event_type", payload.event_name))
        .bind(("session_id", payload.session_id))
        .bind(("page_url", payload.page_url))
        .bind(("referrer", payload.referrer))
        .bind(("country", payload.country))
        .bind(("language", payload.language))
        .bind(("device_type", payload.device_type))
        .bind(("metadata", payload.metadata.unwrap_or_else(|| json!({}))))
        .await
        .map_err(|error| format!("Failed to persist analytics event: {error}"))?;

        Ok(())
    }

    pub async fn get_report(
        &self,
        db: &crate::db::DbState,
    ) -> Result<AnalyticsReportResponse, String> {
        let mut result = db
            .query("SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5000")
            .await
            .map_err(|error| format!("Failed to query analytics events: {error}"))?;

        let rows: Vec<serde_json::Value> = result
            .take(0)
            .map_err(|error| format!("Failed to parse analytics rows: {error}"))?;

        let total_events = rows.len() as u64;
        let mut sessions = HashSet::new();
        let mut page_views = 0_u64;
        let mut conversion_events = 0_u64;

        for row in &rows {
            if let Some(session_id) = row.get("session_id").and_then(|value| value.as_str()) {
                if !session_id.is_empty() {
                    sessions.insert(session_id.to_string());
                }
            }

            let event_type = row
                .get("event_type")
                .and_then(|value| value.as_str())
                .unwrap_or_default();

            if event_type == "page_view" {
                page_views += 1;
            }

            if matches!(
                event_type,
                "generate_lead" | "purchase" | "contact_submit" | "begin_checkout" | "form_submit"
            ) {
                conversion_events += 1;
            }
        }

        let funnels = self.list_funnels(db).await?;
        let funnel_reports = build_funnel_reports(&rows, &funnels);

        Ok(AnalyticsReportResponse {
            overview: AnalyticsOverview {
                total_events,
                total_sessions: sessions.len() as u64,
                page_views,
                conversion_events,
            },
            funnels: funnel_reports,
        })
    }

    pub async fn list_funnels(&self, db: &crate::db::DbState) -> Result<Vec<AnalyticsFunnel>, String> {
        let mut result = db
            .query("SELECT * FROM analytics_funnels ORDER BY updated_at DESC")
            .await
            .map_err(|error| format!("Failed to query funnels: {error}"))?;

        let rows: Vec<serde_json::Value> = result
            .take(0)
            .map_err(|error| format!("Failed to parse funnels: {error}"))?;

        let funnels = rows
            .into_iter()
            .filter_map(|row| serde_json::from_value::<AnalyticsFunnel>(row).ok())
            .collect::<Vec<AnalyticsFunnel>>();

        Ok(funnels)
    }

    pub async fn save_funnels(
        &self,
        db: &crate::db::DbState,
        funnels: &[AnalyticsFunnel],
    ) -> Result<(), String> {
        db.query("DELETE analytics_funnels")
            .await
            .map_err(|error| format!("Failed to reset funnels: {error}"))?;

        for funnel in funnels {
            let value = serde_json::to_value(funnel)
                .map_err(|error| format!("Failed to serialize funnel: {error}"))?;

            db.query("CREATE analytics_funnels CONTENT $content")
                .bind(("content", value))
                .await
                .map_err(|error| format!("Failed to persist funnel: {error}"))?;
        }

        Ok(())
    }
}

pub fn default_analytics_settings() -> AnalyticsSettings {
    AnalyticsSettings {
        integrations: AnalyticsIntegrationSettings {
            ga4_measurement_id: std::env::var("NUXT_GA4_MEASUREMENT_ID").ok(),
            gtm_container_id: std::env::var("NUXT_GTM_CONTAINER_ID").ok(),
            clarity_project_id: std::env::var("NUXT_CLARITY_PROJECT_ID").ok(),
            meta_pixel_id: std::env::var("NUXT_META_PIXEL_ID").ok(),
            tiktok_pixel_id: std::env::var("NUXT_TIKTOK_PIXEL_ID").ok(),
            linkedin_partner_id: std::env::var("NUXT_LINKEDIN_PIXEL_ID").ok(),
            enabled: true,
            // NEW: Consent defaults
            consent_tiers: Some(ConsentTierConfig {
                essential_enabled: true,
                analytics_enabled: true,
                functional_enabled: false,
                marketing_enabled: false,
            }),
            tracker_rules: Some(vec![
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "ga4".to_string(),
                    tier: crate::models::analytics::TrackerTier::Analytics,
                    requires_consent: true,
                    default_allowed: true,
                    description: "Google Analytics 4 - Traffic analysis".to_string(),
                },
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "gtm".to_string(),
                    tier: crate::models::analytics::TrackerTier::Analytics,
                    requires_consent: true,
                    default_allowed: true,
                    description: "Google Tag Manager".to_string(),
                },
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "clarity".to_string(),
                    tier: crate::models::analytics::TrackerTier::Functional,
                    requires_consent: true,
                    default_allowed: false,
                    description: "Microsoft Clarity - Session recordings".to_string(),
                },
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "meta_pixel".to_string(),
                    tier: crate::models::analytics::TrackerTier::Marketing,
                    requires_consent: true,
                    default_allowed: false,
                    description: "Meta Pixel - Facebook/Instagram tracking".to_string(),
                },
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "tiktok_pixel".to_string(),
                    tier: crate::models::analytics::TrackerTier::Marketing,
                    requires_consent: true,
                    default_allowed: false,
                    description: "TikTok Pixel - TikTok advertising".to_string(),
                },
                crate::models::analytics::TrackerConsentRules {
                    tracker_id: "linkedin".to_string(),
                    tier: crate::models::analytics::TrackerTier::Marketing,
                    requires_consent: true,
                    default_allowed: false,
                    description: "LinkedIn Insight - LinkedIn advertising".to_string(),
                },
            ]),
            consent_required: false,
            consent_version: "1.0.0".to_string(),
        },
        funnels: vec![],
    }
}

fn validate_integrations(integrations: &AnalyticsIntegrationSettings) -> Result<(), String> {
    if let Some(ga4) = &integrations.ga4_measurement_id {
        if !ga4.starts_with("G-") {
            return Err("GA4 measurement id must start with G-".to_string());
        }
    }

    if let Some(gtm) = &integrations.gtm_container_id {
        if !gtm.starts_with("GTM-") {
            return Err("GTM container id must start with GTM-".to_string());
        }
    }

    Ok(())
}

fn validate_funnels(funnels: &[AnalyticsFunnel]) -> Result<(), String> {
    for funnel in funnels {
        if funnel.id.trim().is_empty() || funnel.name.trim().is_empty() {
            return Err("Each funnel must have id and name".to_string());
        }

        if funnel.steps.is_empty() {
            return Err(format!("Funnel '{}' must include at least one step", funnel.name));
        }
    }

    Ok(())
}

fn build_funnel_reports(rows: &[serde_json::Value], funnels: &[AnalyticsFunnel]) -> Vec<FunnelReport> {
    let mut reports = Vec::new();

    for funnel in funnels.iter().filter(|funnel| funnel.active) {
        let mut metrics = Vec::new();
        let mut previous_count: Option<u64> = None;

        let mut ordered_steps = funnel.steps.clone();
        ordered_steps.sort_by_key(|step| step.order);

        for step in ordered_steps {
            let count = rows
                .iter()
                .filter(|row| {
                    let event_name = row
                        .get("event_type")
                        .and_then(|value| value.as_str())
                        .unwrap_or_default();

                    if event_name != step.event_name {
                        return false;
                    }

                    if let Some(path_filter) = &step.path {
                        let page_url = row
                            .get("page_url")
                            .and_then(|value| value.as_str())
                            .unwrap_or_default();
                        return page_url.contains(path_filter);
                    }

                    true
                })
                .count() as u64;

            let conversion_rate_from_previous = previous_count.and_then(|prev| {
                if prev == 0 {
                    None
                } else {
                    Some((count as f64 / prev as f64) * 100.0)
                }
            });

            metrics.push(FunnelStepMetric {
                step_name: step.name,
                event_name: step.event_name,
                count,
                conversion_rate_from_previous,
            });

            previous_count = Some(count);
        }

        reports.push(FunnelReport {
            funnel_id: funnel.id.clone(),
            funnel_name: funnel.name.clone(),
            steps: metrics,
        });
    }

    reports
}

async fn read_setting<T>(db: &crate::db::DbState, key: &str) -> Result<Option<T>, String>
where
    T: DeserializeOwned,
{
    let mut result = db
        .query("SELECT value FROM site_settings WHERE key = $key LIMIT 1")
        .bind(("key", key))
        .await
        .map_err(|error| format!("Failed to read setting {key}: {error}"))?;

    let row: Option<serde_json::Value> = result
        .take(0)
        .map_err(|error| format!("Failed to parse setting {key}: {error}"))?;

    let Some(row_value) = row else {
        return Ok(None);
    };

    let Some(setting_value) = row_value.get("value") else {
        return Ok(None);
    };

    serde_json::from_value(setting_value.clone())
        .map(Some)
        .map_err(|error| format!("Failed to decode setting {key}: {error}"))
}

async fn write_setting<T>(db: &crate::db::DbState, key: &str, value: &T) -> Result<(), String>
where
    T: serde::Serialize,
{
    let json_value = serde_json::to_value(value)
        .map_err(|error| format!("Failed to serialize setting {key}: {error}"))?;

    db.query("DELETE site_settings WHERE key = $key")
        .bind(("key", key))
        .await
        .map_err(|error| format!("Failed to replace setting {key}: {error}"))?;

    db.query(
        "CREATE site_settings CONTENT { key: $key, value: $value, type: 'json', updated_at: time::now() }",
    )
    .bind(("key", key))
    .bind(("value", json_value))
    .await
    .map_err(|error| format!("Failed to write setting {key}: {error}"))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{build_funnel_reports, AnalyticsFunnel};
    use crate::models::analytics::FunnelStep;
    use serde_json::json;

    #[test]
    fn funnel_report_counts_step_events() {
        let rows = vec![
            json!({"event_type": "view_pricing", "page_url": "/pricing"}),
            json!({"event_type": "view_pricing", "page_url": "/pricing"}),
            json!({"event_type": "submit_contact", "page_url": "/contact-us"}),
        ];

        let funnels = vec![AnalyticsFunnel {
            id: "lead-funnel".to_string(),
            name: "Lead Funnel".to_string(),
            description: None,
            active: true,
            steps: vec![
                FunnelStep {
                    name: "Pricing View".to_string(),
                    event_name: "view_pricing".to_string(),
                    path: None,
                    order: 1,
                },
                FunnelStep {
                    name: "Contact Submit".to_string(),
                    event_name: "submit_contact".to_string(),
                    path: None,
                    order: 2,
                },
            ],
        }];

        let reports = build_funnel_reports(&rows, &funnels);
        assert_eq!(reports.len(), 1);
        assert_eq!(reports[0].steps[0].count, 2);
        assert_eq!(reports[0].steps[1].count, 1);
        assert_eq!(reports[0].steps[1].conversion_rate_from_previous, Some(50.0));
    }
}
