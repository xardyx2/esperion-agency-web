## Why

The frontend currently uses manual validation patterns across login, register, contact, and dashboard forms, while public pages still rely on ISR-oriented `routeRules` and the project has no Nuxt-side API reference or MCP server integration. This change is needed to turn the requested Nuxt modules into verified, working project capabilities instead of leaving them as unintegrated dependencies.

## What Changes

- Add a shared frontend validation capability for selected public and dashboard forms using a Nuxt-native validation module instead of repeated page-local validation logic.
- Add a Nuxt-hosted Scalar API reference experience that consumes the backend OpenAPI document already exposed at `/api/v1/openapi.json`.
- Add a Nuxt MCP server surface for safe project tools, resources, and prompts using `@nuxtjs/mcp-toolkit`.
- Update public rendering strategy from ISR-focused caching to SWR route rules where appropriate, while keeping dashboard routes explicitly client-rendered.
- Keep module adoption verifiable by requiring concrete runtime usage for newly added modules rather than installation-only changes.

## Capabilities

### New Capabilities
- `shared-form-validation`: Provide a reusable validation layer for key public and dashboard forms with consistent error, submit, and schema behavior.
- `api-reference-ui`: Provide a Nuxt-hosted Scalar reference page sourced from the backend OpenAPI specification.
- `ai-assistant-tooling`: Provide a Nuxt MCP endpoint with project-scoped tools, resources, and prompts for supported MCP clients.

### Modified Capabilities
- `public-website`: Change public rendering requirements from the current ISR-only route strategy to SWR-based route behavior while preserving SEO-facing public route integrity.

## Impact

- Frontend dependencies and Nuxt module registration in `frontend/package.json` and `frontend/nuxt.config.ts`
- Public page rendering rules and hybrid rendering behavior in `frontend/nuxt.config.ts`
- Form-heavy pages such as `frontend/app/pages/login.vue`, `frontend/app/pages/register.vue`, `frontend/app/pages/contact-us.vue`, and selected dashboard forms
- New Nuxt server-side MCP files under `frontend/server/mcp/`
- New or updated API docs surface in the frontend using the backend OpenAPI source at `backend/src/api/mod.rs`
