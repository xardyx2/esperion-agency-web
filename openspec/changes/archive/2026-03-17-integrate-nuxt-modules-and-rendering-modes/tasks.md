## 1. Module registration and baseline wiring

- [x] 1.1 Add `@vee-validate/nuxt`, `@scalar/nuxt`, and `@nuxtjs/mcp-toolkit` (plus required peers such as `zod`) to `frontend/package.json` and install them so the lockfile reflects the final dependency set.
- [x] 1.2 Register the new modules in `frontend/nuxt.config.ts` with initial configuration for VeeValidate auto-imports, Scalar source routing, and MCP route/name metadata.
- [x] 1.3 Document any required development environment values or URL assumptions for backend OpenAPI access and MCP usage in `frontend/README.md` or adjacent docs.

## 2. Parallel workstream A - Shared form validation rollout

- [x] 2.1 Create reusable validation schemas/composables for the first migration set in `frontend/app/composables/` or `frontend/app/utils/`, covering login, register, contact, and one dashboard CRUD form.
- [x] 2.2 Migrate `frontend/app/pages/login.vue` and `frontend/app/pages/register.vue` from manual computed-error logic to the shared VeeValidate pattern while preserving existing translated messages and loading states.
- [x] 2.3 Migrate `frontend/app/pages/contact-us.vue` to the shared VeeValidate pattern while preserving required field behavior, reCAPTCHA flow, and duplicate-submit protection.
- [x] 2.4 Migrate one representative dashboard form page (for example `frontend/app/pages/dashboard/users.vue` or another chosen CRUD form) to the same validation workflow and verify parity with current submit behavior.

## 3. Parallel workstream B - Scalar API reference integration

- [x] 3.1 Configure Scalar in `frontend/nuxt.config.ts` to consume the backend OpenAPI document exposed at `http://localhost:8081/api/v1/openapi.json` during Docker development.
- [x] 3.2 Add the Nuxt route or page that hosts the Scalar UI and define whether it lives on a public developer route or a dashboard-scoped route.
- [x] 3.3 Add a graceful unavailable state for the docs route so missing backend/OpenAPI responses produce a visible error state instead of a blank screen.

## 4. Parallel workstream C - MCP toolkit bootstrap

- [x] 4.1 Create `frontend/server/mcp/` with at least one tool, one resource, and one prompt that are useful for this project and safe for an initial rollout.
- [x] 4.2 Ensure the initial MCP definitions use project-specific names/descriptions and avoid unrestricted privileged write actions.
- [x] 4.3 Document how a supported MCP client connects to the Nuxt MCP endpoint, including route and any auth expectations.

## 5. Parallel workstream D - Rendering strategy update

- [x] 5.1 Replace production public `isr` route rules with `swr` route rules in `frontend/nuxt.config.ts`, preserving current public route groupings and TTL intent where possible.
- [x] 5.2 Keep `/dashboard/**` and `/capital/**` on `ssr: false` and verify no page-level rendering overrides conflict with the centralized route rules.
- [x] 5.3 Confirm the build workflow remains compatible with hybrid rendering expectations (`nuxt build` rather than static-only assumptions) and update docs if needed.

## 6. Verification and regression coverage

- [x] 6.0 Run workstreams 2-5 with multiple specialists in parallel after section 1 is complete, then merge and verify their outputs together.
- [x] 6.1 Add or update automated tests for migrated validation flows, including invalid input feedback and submit-state behavior.
- [x] 6.2 Verify the Scalar route loads correctly against the backend OpenAPI endpoint and that failure handling is observable.
- [x] 6.3 Verify the MCP endpoint responds with the configured tool/resource/prompt inventory using a local MCP client or scripted check.
- [x] 6.4 Validate public SWR behavior and dashboard CSR behavior in a production-like build or preview flow, and record any deployment caveats discovered.
