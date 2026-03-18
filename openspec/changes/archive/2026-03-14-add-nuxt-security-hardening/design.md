## Context

Nuxt serves the public website and dashboard shell, while Axum serves the API, auth endpoints, analytics endpoints, and contact submission routes. The frontend currently lacks a dedicated Nuxt-side security hardening layer, and the backend uses permissive CORS. Adding security hardening on the Nuxt side is useful, but it has to coexist with third-party analytics scripts, reCAPTCHA, Google Maps embeds, JWT/refresh flows, and Axum API behavior.

This is a cross-cutting change because it affects page delivery, browser policy, auth compatibility, and frontend/backend coordination.

## Goals / Non-Goals

**Goals:**
- Define a Nuxt-side hardening strategy for response headers and script/embed policy.
- Preserve current public features such as analytics scripts, reCAPTCHA, and Google Maps.
- Make frontend security responsibilities distinct from Axum API security responsibilities.
- Document the integration points that need coordinated review.

**Non-Goals:**
- Replacing Axum authentication or API authorization.
- Rewriting backend middleware wholesale.
- Performing unrelated analytics or SEO consolidation.

## Decisions

### 1. Scope security hardening to Nuxt-delivered pages first
The frontend change will focus on the browser-facing layer owned by Nuxt: security headers, CSP posture, page delivery, and compatibility with client-side integrations. Backend API security remains owned by Axum.

**Alternatives considered:**
- Treat frontend and backend security as one combined implementation. Rejected because it is too broad and mixes separate concerns.

### 2. Use explicit allowlists for third-party scripts and embeds
Because the site already uses multiple trackers, reCAPTCHA, and Google Maps, hardening cannot rely on blanket blocking. It should define an explicit allowlist so security policy stays intentional and reviewable.

### 3. Validate auth and dashboard compatibility before tightening policy
JWT and refresh flows, cookie usage, and dashboard requests must remain functional under any stricter browser-facing policy. Auth compatibility is a first-class acceptance criterion, not an afterthought.

### 4. Treat Axum CORS review as a coordination point, not a frontend replacement
The Nuxt layer cannot solve permissive backend CORS by itself. The change should document the boundary and call out backend coordination where required.

## Risks / Trade-offs

- **[Risk] CSP or headers break analytics, reCAPTCHA, or Maps** -> **Mitigation:** build policy from an explicit allowlist and verify each integration.
- **[Risk] Dashboard auth requests fail under stricter browser policy** -> **Mitigation:** test login, token refresh, and authenticated API access as part of hardening validation.
- **[Risk] Security expectations stay split-brain between Nuxt and Axum** -> **Mitigation:** document which protections belong to page delivery versus API delivery.

## Migration Plan

1. Inventory current third-party script, iframe, and auth dependencies.
2. Define the frontend-side security policy and allowlists.
3. Implement and verify public pages and dashboard compatibility.
4. Record any required Axum-side follow-up separately if CORS or API headers need tighter handling.

Rollback is low-risk: revert the frontend security configuration if it blocks critical user flows.

## Open Questions

- Should CSP be rolled out in report-only form first if the tool supports it?
- Which third-party integrations are mandatory in production versus optional by environment?
