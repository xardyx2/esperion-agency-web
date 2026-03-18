## Why

The frontend already loads multiple third-party analytics and pixels while also sending events to backend analytics endpoints. Before adding new privacy-focused analytics tooling, the project needs a clear audit of what is already collected, where consent and disclosure expectations apply, and whether a lighter privacy-friendly analytics layer should complement or replace parts of the current stack.

## What Changes

### Goals
- Inventory the current analytics and pixel setup across frontend runtime config, client plugins, dashboard settings, and backend endpoints.
- Define a privacy-oriented analytics strategy that avoids duplication and clarifies the role of each tracker.
- Evaluate whether an additional privacy-friendly analytics module is justified for the public website.
- Establish rules for consent, event ownership, and data minimization before any new tracker is added.

### Non-Goals
- No immediate replacement of all existing analytics providers.
- No unrelated SEO or security hardening changes.
- No backend analytics redesign beyond what is required to clarify overlap.
- No assumption that a new analytics module will be adopted unless the audit supports it.

### Planned Changes
- Audit existing frontend analytics scripts, runtime config fields, and backend analytics endpoints.
- Classify each tracker as required, optional, redundant, or privacy-risky.
- Define decision criteria for adopting or rejecting a privacy-friendly analytics module.
- Capture the consent and integration requirements needed if a new analytics layer is introduced.

## Capabilities

### New Capabilities
- `analytics-privacy-governance`: Defines how website analytics, pixels, consent expectations, and privacy-friendly measurement are evaluated and governed.

### Modified Capabilities
- `analytics-dashboard`: Clarify how dashboard-managed analytics settings map to public tracking behavior and privacy expectations.

## Impact

- Affected code: frontend analytics plugin, frontend runtime config, dashboard analytics settings, backend analytics endpoints, and documentation for public tracking behavior.
- Affected systems: GA4/GTM, Clarity, Meta Pixel, TikTok Pixel, LinkedIn Insight, backend event tracking, and any future privacy-friendly analytics service.
- Dependencies: existing analytics integrations and any candidate privacy-oriented analytics module considered by the audit.
