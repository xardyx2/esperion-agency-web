## Why

The public website and dashboard rely on Nuxt for page delivery while the Rust/Axum backend exposes a permissive API surface. The frontend currently lacks a dedicated Nuxt-side security hardening layer, which leaves useful protections such as stricter response headers, clearer CSP posture, and frontend/backend security coordination under-defined.

## What Changes

### Goals
- Introduce a Nuxt-side security hardening strategy that complements, rather than conflicts with, the Axum backend.
- Define which protections belong to the frontend response layer versus the backend API layer.
- Improve default security posture for public pages and dashboard delivery.
- Document integration constraints so future module additions do not weaken security or break analytics, embeds, or auth.

### Non-Goals
- No full backend security rewrite.
- No replacement of Axum auth, rate limiting, or API middleware.
- No unrelated SEO or analytics changes.
- No production deployment topology changes beyond what is needed for header/security coordination.

### Planned Changes
- Evaluate and integrate a Nuxt-compatible security hardening module or equivalent configuration for the frontend runtime.
- Define CSP, security header, and cookie-related expectations for the Nuxt side.
- Audit overlap with Axum CORS, auth cookies/tokens, third-party scripts, and iframe/embed usage.
- Add verification guidance for both public pages and dashboard routes.

## Capabilities

### New Capabilities
- `frontend-security-hardening`: Covers security headers, CSP posture, and frontend delivery protections for Nuxt-served pages.

### Modified Capabilities
- `user-authentication`: Ensure frontend-side hardening remains compatible with the current token and session flow.
- `public-website`: Define security expectations for publicly rendered pages without breaking embeds, SEO, or analytics.

## Impact

- Affected code: `frontend/nuxt.config.ts`, frontend runtime configuration, public page delivery, dashboard shell behavior, and possibly backend CORS/header coordination.
- Affected systems: browser security headers, script execution policy, embeds, auth flows, and deployment review.
- Dependencies: likely a Nuxt security module plus any supporting configuration needed to interoperate with Axum.
