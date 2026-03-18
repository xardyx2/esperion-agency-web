# Analytics & Privacy Audit Report

## 1. Current Analytics Stack Inventory

### 1.1 Frontend Trackers (Loaded via `analytics.client.ts`)

| Tracker | Type | Purpose | Configuration Source | Loaded Conditionally |
|---------|------|---------|---------------------|---------------------|
| **Google Analytics 4 (GA4)** | Operational Analytics | Page views, user behavior, traffic sources | `publicConfig.ga4_measurement_id` | Yes (if ID present) |
| **Google Tag Manager (GTM)** | Tag Management | Container for marketing/tracking tags | `publicConfig.gtm_container_id` | Yes (if ID present) |
| **Microsoft Clarity** | Session Insight | Heatmaps, session recordings, user behavior | `publicConfig.clarity_project_id` | Yes (if ID present) |
| **Meta Pixel** | Marketing Pixel | Facebook/Instagram ad tracking, retargeting | `publicConfig.meta_pixel_id` | Yes (if ID present) |
| **TikTok Pixel** | Marketing Pixel | TikTok ad tracking, conversion events | `publicConfig.tiktok_pixel_id` | Yes (if ID present) |
| **LinkedIn Insight** | Marketing Pixel | LinkedIn ad tracking, professional audience | `publicConfig.linkedin_partner_id` | Yes (if ID present) |

### 1.2 Backend Analytics System

| Component | Purpose | Data Collected |
|-----------|---------|----------------|
| **Custom Event Tracking** (`/api/v1/analytics/track`) | First-party analytics | Event name, session ID, page URL, referrer, language, metadata |
| **Analytics Events Table** | Data persistence | event_type, session_id, page_url, referrer, country, language, device_type, metadata |
| **Funnel Tracking** | Conversion analysis | Multi-step funnel definitions with event/path filters |
| **Reporting** (`/api/v1/analytics/report`) | Analytics aggregation | Total events, unique sessions, page views, conversion events |

### 1.3 Configuration Flow

```
Dashboard Settings → Backend (analytics_settings table) → Public Config API → Frontend Plugin
     ↓
Environment Variables (fallback defaults for initial setup)
```

**Configuration Sources (in order of precedence):**
1. Database-stored settings (via dashboard `/dashboard/settings`)
2. Environment variables (fallback in `default_analytics_settings()`)
3. Runtime config (nuxt.config.ts public fields)

**Environment Variables:**
- `NUXT_GA4_MEASUREMENT_ID`
- `NUXT_GTM_CONTAINER_ID`
- `NUXT_CLARITY_PROJECT_ID`
- `NUXT_META_PIXEL_ID`
- `NUXT_TIKTOK_PIXEL_ID`
- `NUXT_LINKEDIN_PIXEL_ID`

### 1.4 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Nuxt 3)                        │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ analytics.client│───▶│ Third-party      │                   │
│  │ .ts plugin      │    │ trackers loaded  │                   │
│  │                 │    │ conditionally    │                   │
│  └─────────────────┘    └──────────────────┘                   │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐    Backend custom events                   │
│  │ Backend API     │───▶│ (/api/v1/analytics/track)            │
│  │ Event tracking  │    │ session_id, page_url, referrer        │
│  └─────────────────┘    │ language, metadata                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Rust/Axum)                      │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ Analytics       │───▶│ SurrealDB        │                   │
│  │ Service         │    │ analytics_events │                   │
│  └─────────────────┘    └──────────────────┘                   │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Dashboard API   │                                            │
│  │ (/analytics/    │                                            │
│  │  report)        │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Tracker Classification & Privacy Posture

### 2.1 Classification by Purpose

#### Operational Analytics (Required for Business Intelligence)
| Tracker | Classification | Justification |
|---------|---------------|---------------|
| **Google Analytics 4** | Operational Analytics | Primary traffic analysis, source attribution, user behavior |
| **Backend Custom Events** | Operational Analytics | First-party event tracking, funnel analysis, conversion tracking |

#### Session Insight Tools (UX Optimization)
| Tracker | Classification | Justification |
|---------|---------------|---------------|
| **Microsoft Clarity** | Session Insight | Heatmaps, session recordings for UX improvement |

#### Marketing Pixels (Advertising & Retargeting)
| Tracker | Classification | Justification |
|---------|---------------|---------------|
| **Meta Pixel** | Marketing Pixel | Facebook/Instagram advertising conversion tracking |
| **TikTok Pixel** | Marketing Pixel | TikTok advertising conversion tracking |
| **LinkedIn Insight** | Marketing Pixel | LinkedIn advertising conversion tracking |

#### Tag Management
| Tracker | Classification | Justification |
|---------|---------------|---------------|
| **Google Tag Manager** | Tag Management | Container for dynamic tag deployment (may load additional trackers) |

### 2.2 Privacy Risk Assessment

| Tracker | Privacy Risk | Consent Required | GDPR Classification | Overlap Risk |
|---------|-------------|------------------|-------------------|--------------|
| **Google Analytics 4** | High | Yes | Data processor (Google) | Medium - may duplicate backend events |
| **Google Tag Manager** | High | Yes | Depends on tags loaded | High - can load additional unvetted trackers |
| **Microsoft Clarity** | High | Yes | Data processor (Microsoft) | Low - unique session recording capability |
| **Meta Pixel** | Very High | Yes (marketing) | Data processor (Meta) | Medium - may overlap with GA4 conversion tracking |
| **TikTok Pixel** | High | Yes (marketing) | Data processor (TikTok) | Medium - similar to Meta Pixel |
| **LinkedIn Insight** | High | Yes (marketing) | Data processor (LinkedIn) | Low - professional audience focus |
| **Backend Custom Events** | Low | No (first-party) | Data controller (self) | Low - controlled first-party data |

### 2.3 Consent Expectations

#### Current State
- **No explicit consent mechanism** exists in the codebase
- All trackers load automatically if configured and `publicConfig.enabled` is true
- No cookie banner or consent dialog implemented
- Session tracking uses `localStorage` (not cookies), but third-party trackers may set cookies

#### CSP (Content Security Policy) Configuration
The `nuxt.config.ts` includes CSP headers that allow the analytics domains:
- `https://www.googletagmanager.com`
- `https://connect.facebook.net`
- `https://analytics.tiktok.com`
- `https://snap.licdn.com`
- `https://www.clarity.ms`
- `https://*.google-analytics.com`

### 2.4 Data Minimization Analysis

| Tracker | Data Collected | Minimization Status |
|---------|---------------|---------------------|
| **GA4** | Page views, events, user properties, device info | Moderate - Google collects extensive data |
| **GTM** | Depends on configured tags | Low - can load arbitrary scripts |
| **Clarity** | Page content, mouse movements, clicks, keystrokes (masked) | Low - records full sessions |
| **Meta Pixel** | Page views, events, user actions, device info | Low - Meta collects extensive data |
| **TikTok Pixel** | Page views, events, user actions, device info | Low - TikTok collects extensive data |
| **LinkedIn Insight** | Page views, conversions, professional data | Moderate - focused on professional context |
| **Backend Custom** | Event name, page URL, referrer, language, session ID | High - minimal data collected |

## 3. Privacy-Friendly Analytics Evaluation

### 3.1 Current Stack vs Privacy-Friendly Options

| Criteria | Current Stack | Privacy-Friendly Alternative (Plausible/Fathom) |
|----------|--------------|------------------------------------------------|
| **Data ownership** | Third-party processors | Self-hosted or privacy-first SaaS |
| **Cookie usage** | Multiple third-party cookies | No cookies or minimal first-party only |
| **Data collection** | Extensive behavioral data | Minimal, aggregated only |
| **GDPR compliance** | Requires explicit consent | May not require consent (legitimate interest) |
| **Cross-site tracking** | Yes (all marketing pixels) | No |
| **Cost** | Free tiers available | Paid (privacy-focused business model) |

### 3.2 Adoption Criteria for Privacy-Friendly Module

**MUST Have:**
- [ ] Self-hostable or EU-based data processing
- [ ] No cross-site tracking
- [ ] Minimal data collection (no personal data)
- [ ] No cookie consent required under GDPR
- [ ] Integration with existing dashboard settings
- [ ] Respect `publicConfig.enabled` toggle

**SHOULD Have:**
- [ ] Page view and basic event tracking
- [ ] Referrer analysis without PII
- [ ] Lightweight script (< 5KB)
- [ ] Easy migration path from GA4

**NICE TO Have:**
- [ ] Funnel visualization
- [ ] Real-time analytics
- [ ] Export capabilities

### 3.3 Recommendation: DEFER Adoption

**Rationale:**
1. **Current stack provides operational value** - GA4 + backend custom events cover core analytics needs
2. **Privacy-friendly module would add redundancy** - Backend analytics already provides first-party tracking
3. **Dashboard settings exist** - Current governance allows enabling/disabling trackers
4. **No immediate compliance deadline** - CSP and privacy policy exist, though consent mechanism is missing

**Instead, prioritize:**
1. Implement consent management platform (CMP)
2. Classify trackers by consent requirement
3. Gate marketing pixels behind explicit consent
4. Keep operational analytics (GA4, backend) as essential

## 4. Governance & Consent Framework

### 4.1 Proposed Tracker Governance Rules

#### Tier 1: Essential (No Consent Required)
| Tracker | Justification | Governance Rule |
|---------|---------------|-----------------|
| **Backend Custom Events** | First-party, minimal data, necessary for site operation | Always allowed when `enabled: true` |
| **GA4 (configured minimally)** | Core traffic analysis, can be configured for essential mode only | Allowed by default with data minimization config |

#### Tier 2: Functional (Consent Required)
| Tracker | Justification | Governance Rule |
|---------|---------------|-----------------|
| **Microsoft Clarity** | Session recording for UX improvement | Require explicit opt-in consent |
| **Google Tag Manager** | Can load arbitrary tags | Only allow if specific tags pre-approved |

#### Tier 3: Marketing (Explicit Consent Required)
| Tracker | Justification | Governance Rule |
|---------|---------------|-----------------|
| **Meta Pixel** | Marketing/retargeting | Explicit opt-in required, default OFF |
| **TikTok Pixel** | Marketing/retargeting | Explicit opt-in required, default OFF |
| **LinkedIn Insight** | Marketing/retargeting | Explicit opt-in required, default OFF |

### 4.2 Dashboard Governance Implementation

**Current State:**
- Single `enabled` toggle controls all trackers
- No granularity for individual tracker control
- No consent status field

**Proposed Changes:**

```typescript
// Extended AnalyticsSettings model
interface AnalyticsSettings {
  integrations: {
    // Existing fields remain
    ga4_measurement_id?: string;
    gtm_container_id?: string;
    clarity_project_id?: string;
    meta_pixel_id?: string;
    tiktok_pixel_id?: string;
    linkedin_partner_id?: string;
    
    // New governance fields
    enabled: boolean;
    consent_required: boolean;
    tracker_tiers: {
      essential: boolean;    // Always allowed
      functional: boolean;   // Requires functional consent
      marketing: boolean;    // Requires marketing consent
    };
  };
}
```

### 4.3 Public Config Governance

**Current:** All configured trackers exposed in public config if `enabled: true`

**Proposed:** Filter by consent tier and environment

```typescript
interface PublicAnalyticsConfig {
  // Essential (always exposed if enabled)
  ga4_measurement_id?: string;
  
  // Functional (exposed only if functional consent granted or consent not required)
  clarity_project_id?: string;
  gtm_container_id?: string;
  
  // Marketing (exposed only if marketing consent granted)
  // These require explicit consent
  meta_pixel_id?: string;
  tiktok_pixel_id?: string;
  linkedin_partner_id?: string;
  
  enabled: boolean;
  consent_required: boolean;
}
```

### 4.4 Environment-Based Gating

**Development/Staging:**
- All trackers disabled by default
- Only backend custom events enabled
- Marketing pixels explicitly blocked

**Production:**
- Essential trackers enabled by default
- Functional trackers require user consent
- Marketing trackers require explicit opt-in
- Admin can override via dashboard

## 5. Implementation Recommendations

### Immediate Actions (This Audit)
1. ✅ Document current tracker inventory (COMPLETE)
2. ✅ Classify trackers by privacy risk (COMPLETE)
3. ✅ Define governance framework (COMPLETE)

### Short-term (Follow-up Change)
1. Implement consent management component (cookie banner)
2. Add tiered consent fields to analytics settings
3. Modify public config API to filter by consent
4. Update frontend plugin to check consent before loading Tier 2/3 trackers
5. Add privacy policy section explaining each tracker

### Medium-term
1. Evaluate if GA4 can be replaced with privacy-friendly alternative
2. Implement server-side GA4 proxy for data minimization
3. Add data retention controls to backend analytics
4. Create analytics data export/deletion functionality

## 6. Summary

| Metric | Count |
|--------|-------|
| **Total Trackers** | 7 (6 third-party + 1 first-party) |
| **Essential** | 2 (GA4, Backend Custom) |
| **Functional** | 2 (Clarity, GTM) |
| **Marketing** | 3 (Meta, TikTok, LinkedIn) |
| **Privacy Risk: High/Very High** | 6 |
| **Consent Required** | 5 |
| **Data Minimization: Poor** | 5 |

**Key Finding:** The project has a mature analytics stack but lacks consent management. The backend custom analytics provide a privacy-conscious foundation that could be expanded to reduce reliance on third-party trackers.

**Recommendation:** Implement consent management before considering additional analytics modules. The current backend analytics system already provides a privacy-friendly alternative to third-party trackers.
