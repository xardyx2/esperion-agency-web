## Why

The current analytics implementation loads multiple third-party trackers (GA4, Clarity, Meta Pixel, TikTok Pixel, LinkedIn) without explicit user consent, creating GDPR and Indonesian PDP (Personal Data Protection) compliance risks. While the privacy policy mentions consent requirements, no actual consent mechanism exists in the codebase. This change implements a comprehensive consent management system that allows users to control which trackers are active while maintaining essential analytics functionality.

## What Changes

- **Cookie Consent Banner**: New Vue component (`CookieConsentBanner.vue`) that displays on first visit with tiered consent options (Essential, Analytics, Functional, Marketing)
- **Tiered Consent System**: Four-tier classification - Essential (always on), Analytics (GA4 - default on), Functional (Clarity, GTM - default off), Marketing (Pixels - default off)
- **Consent-Aware Public Config API**: Modified `/api/v1/analytics/public-config` endpoint to accept and filter by user consent preferences, returning only authorized tracker configurations
- **Consent Fields in Dashboard**: Extended `AnalyticsIntegrationSettings` model with `consent_tiers`, `tracker_rules`, and governance controls in `/dashboard/settings`
- **Refactored Analytics Plugin**: Updated `analytics.client.ts` to check consent before initializing any third-party trackers, with dynamic re-initialization when consent changes
- **Consent Persistence**: LocalStorage-based consent storage with versioning (6-month expiration) and encoding for API transmission
- **Backend Consent Filtering**: New service layer logic to filter tracker configurations based on consent tiers before exposing to frontend

## Capabilities

### New Capabilities
- `analytics-consent-management`: Comprehensive consent banner, preference storage, and tiered tracker governance
- `consent-aware-config-api`: Backend API filtering that respects user consent preferences when exposing analytics configuration

### Modified Capabilities
- `analytics-dashboard`: Extended to include consent governance settings in dashboard, clarifying tracker classification and consent requirements per tracker type

## Impact

**Affected Code:**
- Frontend: `app/plugins/analytics.client.ts` (major refactor), new `components/CookieConsentBanner.vue`, new `composables/useConsent.ts`, extended `app/pages/dashboard/settings.vue`
- Backend: `src/models/analytics.rs` (extended), `src/services/analytics.rs` (consent filtering), `src/handlers/analytics.rs` (new endpoint for consent)
- Types: New `types/consent.ts`, extended `types/api.ts`
- i18n: New translation keys for consent UI in `locales/id.json` and `locales/en.json`

**Affected Systems:**
- All third-party analytics trackers now gated by consent
- Public analytics config API behavior changes (filtered by consent)
- Dashboard analytics settings gain consent governance section

**Dependencies:**
- Existing analytics infrastructure (GA4, Clarity, Meta, TikTok, LinkedIn integrations)
- localStorage API for consent persistence
- No new external dependencies required
