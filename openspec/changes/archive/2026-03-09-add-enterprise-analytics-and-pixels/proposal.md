## Why

Analytics, pixels, funnel/journey tracking, and enterprise reporting remain proposal-only scope in the legacy change. They are operationally separate from the retained public/auth/content capabilities and should move into a focused change before `esperion-agency-web` can be archived cleanly.

## What Changes

- Define the analytics stack for GA4, GTM, Clarity, pixel integrations, and journey/funnel tracking.
- Separate analytics persistence and dashboard reporting from the retained CMS/public website baseline.
- Introduce the dashboard/settings work needed to manage analytics identifiers and reports.

### Scope
- GA4, GTM, Clarity, Meta/TikTok/LinkedIn pixels.
- Journey tracking and funnel builder/reporting.
- Analytics-oriented persistence such as `user_sessions` and report endpoints.
- Dashboard analytics widgets and settings for these integrations.

### Not Included
- Public website routing/theme/brand work already archived.
- Core auth/session mechanics.
- Backup or monitoring concerns.

## Capabilities

### New Capabilities
- `analytics-dashboard`: enterprise analytics, journey tracking, and pixel integrations.

## Impact

- Affected code: `frontend/app/pages/dashboard/settings.vue`, dashboard analytics surfaces, frontend tracking hooks, backend analytics/reporting handlers, and analytics-oriented storage.
- Affected systems: marketing analytics, conversion tracking, enterprise reporting.
