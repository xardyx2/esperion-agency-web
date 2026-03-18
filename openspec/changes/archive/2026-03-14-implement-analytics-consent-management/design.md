## Context

The Esperion project currently has a mature analytics infrastructure with 6 third-party trackers (GA4, GTM, Clarity, Meta Pixel, TikTok Pixel, LinkedIn) plus a custom backend analytics system. The audit revealed a critical gap: while the privacy policy mentions consent requirements, no actual consent mechanism exists. Trackers load automatically when configured, violating GDPR and Indonesian PDP compliance standards.

Current analytics flow: Dashboard Settings → Backend API → Public Config → Frontend Plugin loads all trackers unconditionally.

This design introduces a consent management layer that filters trackers based on user preferences while maintaining business-critical analytics functionality.

## Goals / Non-Goals

**Goals:**
- Implement tiered consent system with four categories (Essential, Analytics, Functional, Marketing)
- Create consent banner component with customizable preferences
- Modify public config API to filter trackers by consent
- Refactor analytics plugin to respect consent before initializing trackers
- Add consent governance controls to dashboard settings
- Ensure first-party backend analytics always function (Essential tier)
- Support consent versioning for policy updates
- Maintain backward compatibility (consent can be disabled globally)

**Non-Goals:**
- Replace existing third-party trackers (only add consent gating)
- Implement server-side consent storage (localStorage sufficient)
- Create separate cookie management (focus on tracker consent)
- Build full CMP (Consent Management Platform) - keep it lightweight
- Support IAB TCF (Transparency & Consent Framework) standards
- Remove any existing trackers

## Decisions

### 1. Consent Storage: localStorage vs Backend Database
**Decision:** Store consent in browser localStorage, not backend database.

**Rationale:**
- Consent is a user-agent preference, not application data
- Reduces backend complexity (no consent table needed)
- Faster access (no API call required to check consent)
- Aligns with GDPR "consent should be as easy to withdraw as to give" principle
- Backend only needs consent audit logging (optional)

**Alternatives considered:**
- Database storage: Rejected - adds unnecessary complexity and latency
- Cookie storage: Rejected - limited size, requires cookie consent for the consent cookie itself

### 2. Consent Transmission: Header vs Query Param vs Cookie
**Decision:** Transmit consent via `X-Consent-Preferences` header (Base64-encoded JSON).

**Rationale:**
- Headers don't pollute URL or require cookie handling
- Base64 encoding ensures safe transmission of JSON
- Can be sent with every request that needs consent-aware response
- Easy to parse in Axum handlers

**Alternatives considered:**
- Query param: Rejected - exposes consent state in URLs (logging, sharing)
- Cookie: Rejected - requires cookie consent before setting consent cookie
- JWT token: Rejected - overkill for consent data, adds crypto overhead

### 3. Default Consent Strategy: Opt-in vs Opt-out
**Decision:** Mixed approach per tier:
- Essential: Always ON (no opt-out)
- Analytics (GA4): Default ON (business essential, minimal privacy impact)
- Functional (Clarity, GTM): Default OFF (requires opt-in)
- Marketing (Pixels): Default OFF (requires explicit opt-in)

**Rationale:**
- Balances business needs with privacy compliance
- GA4 is essential for traffic analysis (arguably legitimate interest)
- Marketing pixels have highest privacy risk, require explicit consent
- User can customize all tiers except Essential

**Alternatives considered:**
- All opt-in: Rejected - would cripple analytics for most users
- All opt-out: Rejected - non-compliant for high-risk trackers

### 4. Consent Expiration: Time-based vs Version-based
**Decision:** Both time-based (6 months) AND version-based.

**Rationale:**
- Time-based: Ensures periodic re-confirmation (regulatory best practice)
- Version-based: Forces re-consent when policy changes (new trackers added)
- Combined approach maximizes compliance

**Implementation:**
```typescript
// Check expiration
const expiryDate = new Date(consentDate)
expiryDate.setMonth(expiryDate.getMonth() + 6)

// Check version
if (consent.version !== CONSENT_VERSION) return null
```

### 5. Re-initialization Strategy: Full Page Reload vs Dynamic
**Decision:** Dynamic re-initialization without page reload.

**Rationale:**
- Better UX (no jarring page reload)
- Vue/Nuxt supports dynamic script injection
- Can initialize newly-allowed trackers immediately
- Existing trackers can't be "unloaded", but future events can be blocked

**Implementation:**
- Plugin exposes `updateConsent()` method
- Re-fetches public config with new consent
- Initializes newly-allowed trackers
- Sets flag to block events from now-disabled trackers

### 6. Backend Filtering: Service Layer vs Handler Layer
**Decision:** Filter in service layer (`AnalyticsService`).

**Rationale:**
- Keeps handlers thin (HTTP concerns only)
- Reusable logic for multiple endpoints
- Easier to unit test
- Consistent filtering across all config retrieval methods

**Implementation:**
```rust
pub async fn get_public_config_with_consent(
    &self,
    db: &DbState,
    user_consent: Option<ConsentPreferences>,
) -> Result<PublicAnalyticsConfig, String>
```

## Risks / Trade-offs

**[Risk] Users may reject all non-essential consent, reducing analytics coverage**
→ **Mitigation:**
- Make Analytics tier (GA4) default ON with clear value proposition
- Show impact preview in consent banner ("This helps us improve your experience")
- Monitor consent rates and adjust defaults if needed
- First-party backend analytics always function

**[Risk] Marketing teams may resist default-OFF for pixels**
→ **Mitigation:**
- Document legal requirements (GDPR/PDP)
- Provide dashboard analytics showing consent rates
- Allow admin override in dashboard (force consent required OFF)
- Show blocked tracker metrics to demonstrate compliance

**[Risk] Consent stored in localStorage may be cleared by users**
→ **Mitigation:**
- Banner reappears if no consent found (graceful degradation)
- Treat "no consent" same as "rejected all"
- Only essential trackers load without consent

**[Risk] Third-party trackers may load before consent check**
→ **Mitigation:**
- Refactor plugin to fetch config BEFORE any tracker initialization
- All third-party scripts loaded dynamically after consent verification
- CSP headers already prevent unauthorized script sources

**[Risk] Version updates force all users to re-consent**
→ **Mitigation:**
- Only bump version for significant policy changes (new tracker categories)
- Minor changes don't require re-consent
- Provide "remember my preferences" option in banner

**[Trade-off] Additional complexity vs Compliance**
- Adds ~500 lines of code across frontend/backend
- Requires ongoing maintenance (consent version updates)
- **Worth it:** Legal compliance, user trust, regulatory risk mitigation

## Migration Plan

**Phase 1: Backend (No breaking changes)**
1. Add consent fields to `AnalyticsIntegrationSettings` model
2. Implement `get_public_config_with_consent()` service method
3. Update public-config handler to parse consent header
4. Keep existing endpoint backward compatible (consent optional)

**Phase 2: Frontend (Progressive enhancement)**
1. Create `useConsent` composable
2. Create `CookieConsentBanner` component (hidden by default)
3. Refactor analytics plugin to check consent
4. Test with `consent_required: false` (existing behavior)

**Phase 3: Activation**
1. Add consent section to dashboard settings
2. Set `consent_required: true` in dashboard
3. Banner appears for all users
4. Monitor consent rates and adjust defaults

**Rollback Strategy:**
- Dashboard toggle `consent_required: false` disables entire system
- Returns to pre-consent behavior (all configured trackers load)
- No data migration needed (consent stored locally)

## Open Questions

1. **Consent Audit Logging:** Should backend log consent choices for regulatory audit trail? (Recommended: Yes, low effort, high compliance value)

2. **Geo-targeting:** Should consent banner only show for EU/Indonesian IPs? (Decision: Show globally for simplicity, but make it configurable)

3. **Dark Pattern Prevention:** How to ensure "Accept All" and "Reject All" buttons have equal prominence? (Decision: Primary action is "Customize", secondary actions are "Accept All" and "Essential Only")

4. **Consent Revocation:** Should users be able to change consent after initial choice? (Decision: Yes, via footer link "Manage Cookie Preferences" or privacy policy page)
