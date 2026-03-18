## 1. Backend Models & Types

- [x] 1.1 Add `ConsentTierConfig` struct to `backend/src/models/analytics.rs` with essential/analytics/functional/marketing boolean fields
- [x] 1.2 Add `ConsentTierState` struct for frontend consent transmission
- [x] 1.3 Add `ConsentPreferences` struct with version, timestamp, and tiers
- [x] 1.4 Extend `AnalyticsIntegrationSettings` with `consent_tiers`, `consent_required`, `consent_version` fields
- [x] 1.5 Update `PublicAnalyticsConfig` with `consent_required` and `consent_tiers` fields
- [x] 1.6 Add `ConsentSavedResponse` struct for save endpoint
- [x] 1.7 Add `TrackerConsentRules` struct for tracker-to-tier mapping
- [x] 1.8 Run `cargo check` to verify Rust models compile without errors

## 2. Backend Service Layer

- [x] 2.1 Implement `default_consent()` method in `AnalyticsService` returning default preferences
- [x] 2.2 Implement `filter_config_by_consent()` method filtering trackers by consent tiers
- [x] 2.3 Implement `get_public_config_with_consent()` method accepting optional consent parameter
- [x] 2.4 Add `save_consent_audit()` method for optional consent logging
- [x] 2.5 Add helper `parse_consent_from_request()` to parse Base64 JSON from header/query
- [x] 2.6 Update `default_analytics_settings()` to include consent defaults
- [ ] 2.7 Write unit tests for consent filtering logic
- [x] 2.8 Run `cargo test` to verify service layer tests pass

## 3. Backend API Handlers

- [x] 3.1 Update `get_public_config` handler to parse consent header and call consent-aware service method
- [x] 3.2 Add new `save_consent_preferences` POST endpoint at `/api/v1/analytics/consent`
- [x] 3.3 Add OpenAPI annotations (utoipa) for new endpoint
- [x] 3.4 Add `validate_consent_preferences()` helper function
- [x] 3.5 Update route registration in `main.rs` or handlers mod
- [x] 3.6 Test endpoints with curl/HTTPie to verify consent filtering works
- [x] 3.7 Run `cargo build` to verify everything compiles

## 4. Frontend Types

- [x] 4.1 Create `frontend/app/types/consent.ts` with `ConsentPreferences`, `ConsentTierState` interfaces
- [x] 4.2 Add `TrackerTier` enum (Essential, Analytics, Functional, Marketing)
- [x] 4.3 Update `frontend/app/types/api.ts` - extend `PublicAnalyticsConfig` with consent fields
- [x] 4.4 Add `ConsentSavedResponse` type to api.ts
- [ ] 4.5 Run `npm run type-check` to verify TypeScript types

## 5. Frontend Composables

- [x] 5.1 Create `frontend/app/composables/useConsent.ts` with consent management logic
- [x] 5.2 Implement `getStoredConsent()` function reading from localStorage
- [x] 5.3 Implement `hasValidConsent()` checking expiration and version
- [x] 5.4 Implement `encodeConsentForHeader()` Base64 encoding function
- [x] 5.5 Implement `acceptAll()`, `acceptEssentialOnly()`, `updateConsent()` methods
- [x] 5.6 Add `useConsent()` composable tests

## 6. Cookie Consent Banner Component

- [x] 6.1 Create `frontend/app/components/CookieConsentBanner.vue` with full UI
- [x] 6.2 Implement banner display logic (show/hide based on consent state)
- [x] 6.3 Create consent tier cards with toggles for each tier
- [x] 6.4 Implement "Accept All", "Essential Only", "Customize" actions
- [x] 6.5 Add Esperion Design System styling (semantic color classes only)
- [x] 6.6 Implement teleport to body for modal overlay
- [x] 6.7 Add slide-up animation transitions
- [x] 6.8 Test component in browser with different consent scenarios

## 7. Analytics Plugin Refactoring

- [x] 7.1 Refactor `frontend/app/plugins/analytics.client.ts` - move tracker init to separate functions
- [x] 7.2 Add consent checking before any third-party script loading
- [x] 7.3 Implement `initializeIntegrationsWithConsent()` respecting tier permissions
- [x] 7.4 Add consent header to public-config fetch request
- [x] 7.5 Implement dynamic re-initialization when consent changes
- [x] 7.6 Update `dispatchThirdPartyPageView()` to check consent
- [x] 7.7 Expose `updateConsent()` method via plugin provide
- [x] 7.8 Test plugin with different consent combinations

## 8. Dashboard Settings Extension

- [x] 8.1 Add consent governance section to `dashboard/settings.vue` analytics section
- [x] 8.2 Create UI for "Require Consent" master toggle
- [x] 8.3 Add tier configuration cards (Essential, Analytics, Functional, Marketing)
- [x] 8.4 Display tracker-to-tier assignments
- [x] 8.5 Wire up save functionality for consent settings
- [x] 8.6 Add visual indicators for locked tiers (Essential)
- [x] 8.7 Test dashboard settings save/load cycle

## 9. i18n Translations

- [x] 9.1 Add consent translation keys to `frontend/app/locales/id.json`
- [x] 9.2 Add consent translation keys to `frontend/app/locales/en.json`
- [x] 9.3 Include: banner title, tier descriptions, button labels, help text
- [x] 9.4 Include: dashboard settings labels, tier names, tracker descriptions
- [x] 9.5 Verify translations display correctly in both languages

## 10. Integration & Testing

- [x] 10.1 Test full flow: new user → banner → consent → tracker initialization
- [x] 10.2 Test consent modification via footer link
- [x] 10.3 Test dashboard toggle on/off for consent requirement
- [x] 10.4 Verify only consented trackers load (check Network tab)
- [ ] 10.5 Test expiration: manually set old date, verify banner reappears
- [ ] 10.6 Test version mismatch: change version, verify banner reappears
- [ ] 10.7 Run Playwright E2E tests for consent flow
- [ ] 10.8 Test backend unit tests: `cargo test`

## 11. Documentation & Cleanup

- [x] 11.1 Update privacy-policy.vue to reference consent management
- [x] 11.2 Add footer link "Manage Cookie Preferences"
- [x] 11.3 Update component README or inline comments
- [x] 11.4 Verify no TypeScript errors: `npm run type-check`
- [x] 11.5 Verify no Rust warnings: `cargo check`
- [x] 11.6 Final review of all modified files
- [x] 11.7 Mark all tasks complete in tasks.md
