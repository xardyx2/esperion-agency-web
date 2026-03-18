# Esperion Agency Web Apply Plan

## Goal

Implement the remaining work for OpenSpec change `esperion-agency-web` without duplicating existing partial work, while keeping `openspec/changes/esperion-agency-web/tasks.md` aligned with code that is actually verified.

## Constraints

- The worktree is already dirty, so pre-existing user changes must be preserved.
- Several unchecked OpenSpec tasks already have partial or complete code paths in the repo.
- Implementation must update task checkboxes only after code is verified.
- Verification must include file-level diagnostics plus targeted backend/frontend tests and builds.
- Execution must use multiple agents in parallel for audit, implementation support, external-reference lookup, and review; this will not be a solo implementation pass.

## Multi-Agent Execution Strategy

### Agent Roles

- `explore` agents: parallel codebase audits, file-pattern discovery, gap confirmation, and post-change verification scans
- `librarian` agents: official docs, external integration references, and OSS implementation examples for unfamiliar APIs/services
- `metis`: planning and re-sequencing when scope or dependency ambiguity appears
- `momus`: plan and phase-review checkpoints before major implementation waves
- `oracle`: architecture/debugging review for risky backend, auth, analytics, backup, and monitoring changes

### Execution Rules

1. For every major phase, launch at least one `explore` agent in parallel with direct tool work.
2. For any external integration bucket (Alibaba AI, GA4, GTM, Clarity, pixels, email providers, Sentry, Uptime Kuma), launch at least one `librarian` agent before coding.
3. Before each major implementation wave, use `momus` or `oracle` review when the change spans multiple modules or has security/data-model impact.
4. Use agent findings to narrow edits, but verify all outputs with direct repo inspection before modifying or checking off tasks.

## Findings That Shape Execution

1. `openspec/changes/esperion-agency-web/tasks.md` has 78 unchecked tasks, but some are already partially implemented.
2. `backend/src/handlers/auth.rs` and `backend/src/main.rs` already expose session routes for `GET /api/v1/auth/sessions` and `DELETE /api/v1/auth/sessions/:session_id`.
3. `frontend/nuxt.config.ts` already contains `@nuxtjs/i18n` configuration and `/id` + `/en` route rules.
4. `backend/src/db/schema.rs` already defines a `sessions` auth table, and `backend/src/db/migrations/002_add_user_sessions.sql` only extends that same table; task `4.16` therefore needs an explicit reconcile decision before implementation.
5. Frontend routing/i18n and backend compile health must be treated as foundation gates before new feature delivery, because current partial work may not be fully runnable.
6. Dashboard surfaces such as users/settings include placeholder or static behavior, so checked tasks in those areas still require evidence-based audit.
7. The clearly missing areas are concentrated in dashboard pages, backend user-management APIs, analytics/backup/monitoring features, and QA coverage.
8. Existing OpenSpec/proposal files appear stale in places, so checkbox reconciliation must be evidence-based instead of task-list-only.

## Phase 1 - Baseline Audit And Foundation Repair

### Objective

Establish a runnable baseline before feature work by auditing partial implementations, fixing core build/compile blockers, and separating placeholder UI from real capability.

### Steps

1. Audit remaining unchecked tasks in these clusters:
   - Multi-language (`3.1`, `3.5`, `3.6`)
   - Schema/foundation (`4.14`, `4.15`, `4.16`, `4.19`)
   - Auth/user-management (`5.10`, `5.11`, `5.13`, `6.3`-`6.12`, `29.13`)
   - Email/analytics/backup/monitoring (`13.8`-`16.12`, `38.15`, `38.16`)
   - QA (`43.4`-`43.12`, `43.15`)
2. For each task, map:
   - current files already touching the feature
   - missing behavior versus spec
   - whether the task is a stale checkbox that should be reconciled instead of reimplemented
   - whether the task should stay unchecked, be split internally, or be completed after verification
3. Validate foundation health before any new feature implementation:
   - frontend routing model (`frontend/app.vue`, `frontend/app/pages/**`, `frontend/pages/**` if still relevant)
   - i18n buildability and locale-file resolution
   - backend compile health in translation, email, router wiring, and related modules
   - auth/settings contract mismatches such as frontend calls to APIs not implemented server-side
4. Resolve the `4.16 user_sessions` ambiguity before any backend schema edits:
   - decide whether it is meant to be a new analytics-style table distinct from auth `sessions`
   - or whether existing `sessions` + migration coverage satisfies the intent and the task/spec state needs reconciliation
   - record the decision and only then proceed with schema work
5. Record the execution map before code changes so later checkbox updates are explicit and justified.

### Agent Usage In This Phase

- Run multiple `explore` agents in parallel to classify unchecked tasks by code evidence.
- Run a `librarian` agent for OpenSpec workflow/schema interpretation if CLI/task-state behavior is unclear.
- Use `metis` if the audit reveals conflicting interpretations for task intent or dependency order.

### Expected Files To Inspect/Touch

- `openspec/changes/esperion-agency-web/tasks.md`
- `backend/src/handlers/auth.rs`
- `backend/src/main.rs`
- `backend/src/db/schema.rs`
- `backend/src/db/migrations/*`
- `backend/src/handlers/translation.rs`
- `frontend/nuxt.config.ts`
- `frontend/app/pages/dashboard/*.vue`
- `frontend/app/composables/useApi.ts`
- `frontend/app/types/api.ts`

### Exit Criteria

- Frontend and backend foundation blockers are identified and, where necessary, scheduled for repair before feature work.
- Every unchecked task is classified as implemented, partial, placeholder, broken, or missing.
- No checkbox is changed yet unless the implementation is re-verified in the current session.

## Phase 2 - Backend Foundation And Access-Control Completion

### Objective

Finish the remaining backend/data tasks that other frontend and QA work depend on.

### Scope

1. Database/schema completion
   - Add/verify table definitions and migrations for `seo_scores`, `competitor_analysis`, and `user_sessions`.
   - Apply the `4.16` reconciliation decision from Phase 1 before editing auth/session-related schema.
   - Ensure model/schema alignment for those tables.
   - Resolve SurrealDB pooling/wiring task (`4.19`) based on current `DbState` implementation.
2. Auth/session completion
   - Validate and fix `GET /api/v1/auth/sessions` and `DELETE /api/v1/auth/sessions/:id` behavior against spec and actual auth middleware.
   - Implement optional 2FA/TOTP only if the surrounding auth flow and storage design are clear from current code/specs; otherwise identify the exact artifact gap before coding.
3. User-management API completion
   - Implement users CRUD endpoints.
   - Implement roles endpoints.
   - Implement filtered activity-log endpoint.
   - Add/expand OpenAPI coverage.
4. Auth/settings contract alignment
   - reconcile frontend API expectations such as `/auth/me` with actual backend routes
   - make sure backend capabilities needed by dashboard settings and session management are real before frontend wiring

### Agent Usage In This Phase

- Use parallel `explore` agents to inspect existing auth/user-management patterns before edits.
- Use `oracle` for backend architecture review around auth/session schema, 2FA, and role/permission design.
- Use `momus` after backend foundation changes to verify the phase is complete before shifting to frontend work.

### Expected Files To Modify

- `backend/src/db/schema.rs`
- `backend/src/db/migrations/mod.rs`
- new migration SQL files under `backend/src/db/migrations/`
- `backend/src/models/mod.rs`
- relevant new/existing model files under `backend/src/models/`
- `backend/src/handlers/auth.rs`
- new or existing user-management handler modules under `backend/src/handlers/`
- `backend/src/main.rs`
- `backend/src/api/mod.rs`

### Exit Criteria

- Required backend routes exist and pass targeted tests.
- Schema/migrations reflect the data model required by remaining frontend work.
- OpenAPI matches implemented endpoints.

## Phase 3 - Frontend Admin Workflows And Settings Completion

### Objective

Bring the dashboard/UI tasks in line with the backend capabilities completed in Phase 2.

### Scope

1. Translation management
   - Add the dashboard translation-management page.
   - Wire it to translation endpoints and review workflow.
2. Session management
   - Add a dashboard session-management page for viewing and force-logging-out sessions.
   - Use real auth/session APIs rather than placeholder data.
3. User/settings hardening
   - Replace placeholder `dashboard/users.vue` behavior with API-driven CRUD/role/activity-log flows.
   - Replace static `dashboard/settings.vue` behavior with persisted settings flows and then extend it for pixel settings and custom journey settings.
4. API/type alignment
   - Extend `frontend/app/composables/useApi.ts` and `frontend/app/types/api.ts` for newly exposed backend endpoints.

### Agent Usage In This Phase

- Use `explore` agents to map existing dashboard component and composable patterns.
- Use a `librarian` agent if frontend integrations depend on third-party Nuxt/Vue libraries or testing patterns that are unclear.
- Use `momus` for a UI-flow completeness review before closing the phase.

### Expected Files To Modify

- `frontend/app/pages/dashboard/users.vue`
- `frontend/app/pages/dashboard/settings.vue`
- new dashboard pages/components for translation/session management
- `frontend/app/composables/useApi.ts`
- `frontend/app/types/api.ts`
- supporting stores/components as needed

### Exit Criteria

- Missing dashboard pages exist and use real API calls.
- Placeholder/mock admin data is removed from touched features.
- New frontend flows pass diagnostics and targeted UI tests.

## Phase 4 - Enterprise Feature Buckets

### Objective

Implement the major deferred modules in dependency order, while keeping each bucket shippable and testable.

### Buckets

1. Email system completion
   - template editor
   - delivery tracking
   - email settings page completion
   - provider tests
2. Analytics and tracking
   - GA4, GTM, Clarity, pixel integrations
   - dashboard stats widgets/charts
   - custom journey tracking/funnel builder/path comparison
   - backend tracking endpoints/storage as needed
3. Backup and restore
   - backup service, scheduling, retention, restore, optional encryption, UI
4. Monitoring and alerting
   - Uptime Kuma/Sentry setup surfaces
   - alert service and channel integrations
   - alert settings UI

### Agent Usage In This Phase

- For each bucket, use at least one `explore` agent for internal pattern discovery and one `librarian` agent for external-service implementation guidance.
- Use `oracle` before coding the highest-risk bucket in each wave (analytics tracking architecture, backup/restore behavior, monitoring/alert delivery).
- Use `momus` after each bucket to confirm that verification and checkbox criteria are satisfied before moving on.

### Sequencing Rule

Implement one bucket at a time, verifying each bucket before moving to the next, because these areas touch multiple layers and environment/config behavior.

### Exit Criteria

- Each bucket has complete backend/frontend wiring plus tests before the next bucket starts.

## Phase 5 - Quality Assurance, Task Reconciliation, And Final Verification

### Objective

Close the QA tasks and only then reconcile OpenSpec task checkboxes.

### Scope

1. Backend integration tests and API endpoint tests.
2. Validation/auth/public-page/responsive/accessibility/dark-mode coverage.
3. Performance testing for task `43.12`, including a concrete Lighthouse workflow for the public pages most affected by recent work; if environment constraints prevent meaningful scores, record the exact blocker and keep the task unchecked.
4. Visual regression setup.
5. Final pass over `openspec/changes/esperion-agency-web/tasks.md`:
   - mark tasks complete only when proven in this session or by validated existing implementation
   - leave ambiguous/deferred tasks unchecked and document why

### Agent Usage In This Phase

- Use `explore` agents to cross-check that completed tasks have corresponding code/test evidence.
- Use `oracle` only if verification failures remain unexplained after direct investigation.

### Verification Standards

- `lsp_diagnostics` clean on all modified files
- backend: `cargo test`, `cargo check`, and `cargo build` for touched modules
- frontend: `npm run test:unit`, relevant `playwright` suites when feasible, `npm run type-check`, and `npm run build`
- if a verification step is blocked by environment or existing unrelated failures, capture the exact blocker and keep unrelated tasks unchecked

## Implementation Order Summary

1. Baseline audit and repair frontend/backend foundation blockers
2. Reconcile partial work and decide `4.16 user_sessions`
3. Finish backend schema/auth/user-management foundation
4. Finish frontend translation/session/users/settings flows
5. Deliver email bucket
6. Deliver analytics bucket
7. Deliver backup bucket
8. Deliver monitoring bucket
9. Complete QA and reconcile `tasks.md`

## Risks To Manage

- Dirty worktree can hide user changes in files also needed for this work.
- OpenSpec task state is not fully trustworthy, so false checkbox updates are a real risk.
- Some large feature groups may require artifact refinement if spec/design coverage is too vague for safe implementation.
- Frontend placeholders and backend partial routes may compile while still failing real workflows, so runtime validation matters.
