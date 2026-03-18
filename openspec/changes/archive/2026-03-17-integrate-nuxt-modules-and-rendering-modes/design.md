## Context

The current frontend already runs as a hybrid Nuxt application, but its public rendering and module usage are inconsistent with the requested direction.

- `frontend/nuxt.config.ts` currently uses production `routeRules` with `isr` for public pages and `ssr: false` for `/dashboard/**` and `/capital/**`.
- Public and auth-facing forms such as `frontend/app/pages/login.vue`, `frontend/app/pages/register.vue`, and `frontend/app/pages/contact-us.vue` use page-local refs, computed error maps, and manual submit guards instead of a shared validation layer.
- The backend already exposes an OpenAPI document at `/api/v1/openapi.json` via `backend/src/api/mod.rs`, but the Nuxt frontend does not expose a first-class API reference viewer.
- The repo has no MCP implementation today, so `@nuxtjs/mcp-toolkit` would be a new server-side surface inside the Nuxt app.

The user requested that the named Nuxt modules be installed and actually used in the project, and that public pages move to SWR while dashboard pages remain CSR.

## Goals / Non-Goals

**Goals:**
- Add `@vee-validate/nuxt` as the shared validation layer for key public and dashboard forms.
- Add `@scalar/nuxt` and point it at the backend OpenAPI JSON so the frontend serves a working API reference UI.
- Add `@nuxtjs/mcp-toolkit` with an initial MCP surface under the Nuxt server runtime.
- Replace public ISR route rules with SWR route rules where the site needs cache-backed freshness.
- Preserve explicit CSR behavior for dashboard routes through centralized `routeRules`.
- Ensure every newly introduced module has a concrete, testable integration point.

**Non-Goals:**
- Rewriting every form in the application during the first pass.
- Replacing the backend OpenAPI generator or redesigning the Rust API documentation source.
- Turning dashboard pages back into SSR or hybrid-rendered admin pages.
- Defining high-risk MCP tools that mutate sensitive production data without a narrower approval flow.

## Decisions

### 1. Use Nuxt-native modules instead of ad hoc package wiring

**Decision:** Register `@vee-validate/nuxt`, `@scalar/nuxt`, and `@nuxtjs/mcp-toolkit` in `frontend/nuxt.config.ts` instead of using only framework-agnostic packages.

**Rationale:**
- The user explicitly asked for Nuxt modules, not only raw packages.
- Each module provides Nuxt-oriented auto-imports, runtime integration, and clearer ownership in `nuxt.config.ts`.
- This aligns with the repository's existing module-driven frontend architecture.

**Alternatives considered:**
- Use plain `vee-validate` without the Nuxt module: rejected because it adds more manual setup and weakens consistency.
- Use backend-only Scalar via `utoipa-scalar`: rejected because the request targets Nuxt modules and the frontend already has a natural docs entrypoint.
- Build a custom MCP endpoint without the Nuxt module: rejected because `@nuxtjs/mcp-toolkit` already models the needed server structure.

### 2. Scope VeeValidate to high-value forms first

**Decision:** Apply shared validation first to the most visible and repeated manual-validation forms: login, register, contact, and at least one representative dashboard CRUD form.

**Rationale:**
- These pages currently duplicate field state, regex checks, and error rendering.
- They cover both public and authenticated workflows.
- A phased adoption reduces migration risk while still making the module meaningfully used.

**Alternatives considered:**
- Rewrite every form at once: rejected because the project has many dashboard forms and the change would become too broad.
- Keep manual validation and install VeeValidate only nominally: rejected because it would violate the user's request and module-governance intent.

### 3. Use the backend OpenAPI JSON as Scalar's source of truth

**Decision:** Configure the Nuxt Scalar module to consume the existing backend OpenAPI document exposed at `/api/v1/openapi.json` (hosted on `localhost:8081` in Docker development).

**Rationale:**
- The backend already generates a complete spec and documents that endpoint.
- Reusing that source avoids drift between frontend docs and backend contracts.
- It creates observable value for the Scalar module immediately.

**Alternatives considered:**
- Maintain a second OpenAPI file in the frontend: rejected because duplication would drift.
- Keep docs backend-only: rejected because the request is to install and use the Nuxt module.

### 4. Host MCP tools inside the Nuxt server runtime under `frontend/server/mcp/`

**Decision:** Use `@nuxtjs/mcp-toolkit` with the default server-first directory structure and expose a minimal initial set of safe capabilities, such as read-only project/resource access and tightly scoped helper tools.

**Rationale:**
- The Nuxt module is designed around `server/mcp/tools`, `server/mcp/resources`, and `server/mcp/prompts`.
- Frontend-side MCP integration keeps module ownership in the Nuxt app where the user asked to install it.
- A read-mostly initial toolset is safer than exposing broad content mutation immediately.

**Alternatives considered:**
- Build MCP in Rust backend handlers: rejected for this change because it bypasses the requested Nuxt module.
- Expose write-heavy MCP tools on day one: rejected because it expands security review surface too quickly.

### 5. Convert public caching from ISR to SWR and keep dashboard CSR centralized

**Decision:** Replace the public `isr` route rules in `frontend/nuxt.config.ts` with `swr` route rules while preserving `ssr: false` on dashboard and capital routes.

**Rationale:**
- Official Nuxt guidance treats `swr` as the portable Nitro caching mode for stale-while-revalidate behavior on Node deployments.
- The project already centralizes rendering behavior in `routeRules`, so the change can remain consistent and easy to audit.
- Dashboard CSR is already correct and should be preserved, not reworked.

**Alternatives considered:**
- Keep ISR everywhere: rejected because the request explicitly asks for public SWR.
- Use client-only data libraries for public caching instead of routeRules: rejected because rendering policy already lives in `nuxt.config.ts`.

### 6. Execute implementation through parallel workstreams after setup

**Decision:** After module installation and baseline config are complete, implementation should split into parallel tracks for form validation, Scalar integration, MCP toolkit bootstrapping, and rendering-rule migration.

**Rationale:**
- The change crosses multiple independent modules and surfaces.
- The work naturally decomposes into specialist lanes with minimal overlap after the shared setup step.
- Parallel execution reduces elapsed time while keeping each workstream narrowly scoped and easier to verify.

**Alternatives considered:**
- Implement everything serially in one pass: rejected because it increases context switching and makes regressions harder to isolate.

## Risks / Trade-offs

- **[Form migration drift]** Existing manual validation messages may diverge during migration → Mitigation: port current error copy and validation rules into typed schemas before deleting page-local logic.
- **[Scalar environment coupling]** Frontend docs depend on backend OpenAPI availability in development → Mitigation: document the expected backend URL and provide a fallback/error state when the spec is unreachable.
- **[MCP security scope]** New MCP endpoints can expand read/write access unexpectedly → Mitigation: start with explicitly scoped tools/resources, avoid privileged mutations, and document auth expectations.
- **[Rendering behavior change]** Switching from `isr` to `swr` changes cache semantics for public pages → Mitigation: preserve existing route groupings and verify SEO-critical pages still render server HTML with the intended freshness windows.
- **[Hybrid rendering confusion in dev]** Current `routeRules` are disabled in development by `isDev ? {} : ...` → Mitigation: document that production behavior must be validated with build/preview or an equivalent environment-aware test path.

## Migration Plan

1. Add and register the three Nuxt modules in the frontend app.
2. Split implementation into parallel tracks for VeeValidate rollout, Scalar docs integration, MCP toolkit bootstrap, and rendering updates.
3. Introduce VeeValidate schemas/composables and migrate the initial target forms.
4. Add a Scalar route/page backed by the backend OpenAPI URL and verify docs rendering.
5. Add `server/mcp/` resources, prompts, and tools with an intentionally narrow first scope.
6. Replace public `isr` route rules with `swr` route rules and keep dashboard `ssr: false` rules intact.
7. Validate public rendering, dashboard CSR behavior, docs loading, and MCP endpoint exposure in Docker development.

Rollback strategy:
- Remove the new modules from `nuxt.config.ts` and `package.json` if any integration is not stable.
- Restore prior manual form logic page by page if validation migration introduces regressions.
- Revert public route rules from `swr` back to `isr` if cache semantics prove unsuitable.

## Open Questions

- Which dashboard form should be the first required VeeValidate migration: users, clients, services, or article editor?
- Should the Scalar UI live on a public route (for developer convenience) or under a protected dashboard route?
- Should the first MCP toolset be strictly read-only, or is one low-risk write tool acceptable in the initial scope?
- Does deployment target generic Node hosting only, or should the design preserve optional `isr` support for Vercel/Netlify environments later?
