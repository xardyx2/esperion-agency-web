## Context

The repository already contains the baseline implementation for a Nuxt public website, a Rust/Axum backend, and several dashboard surfaces, but the legacy task list overclaims completion for parts of the dashboard that are still hardcoded or only partially wired.

This design narrows `esperion-agency-web` to the currently retained capability set and records the main cleanup targets that must be finished before archive.

## Retained Architecture

- Public pages remain Nuxt ISR pages under `frontend/app/pages/`.
- Dashboard pages remain CSR-oriented surfaces under `frontend/app/pages/dashboard/`.
- Backend remains Axum + SurrealDB with handler modules for auth, articles, works, services, clients, contact, translation, and supporting services.
- Existing delta specs remain the authority for requirements.

## Key Drift To Resolve

### 1. Authentication frontend drift
- Login/register pages still simulate requests instead of fully using the auth store/API flow.
- Protected-route behavior on dashboard pages needs to reflect the actual session/auth contract.

### 2. Dashboard management drift
- Article, works, services, clients, and contact dashboard pages contain placeholder or hardcoded data despite being marked complete.
- The retained change must finish real data-backed behavior for these spec-backed admin surfaces.

### 3. Dashboard routing and verification drift
- Route rules still reference `/agency/**` while the active page tree uses `/dashboard/**`.
- Playwright/global verification remains partially broken and must not be treated as complete until fixed.

## Split Boundaries

The following domains are intentionally moved out of this change and must progress in their own changes:

- user management backend and roles
- enterprise analytics and pixels
- backup and restore
- monitoring and alerting

## Archive Goal

To archive `esperion-agency-web` cleanly, the change must end with:

- proposal, design, tasks, and current specs aligned to the same retained scope
- checked tasks matching real implementation
- reopened items closed or explicitly descoped through the split changes
