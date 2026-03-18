# Evidence-Based Task Audit + Local Docker Deploy (Esperion Agency Web)

## TL;DR
> **Summary**: Produce an evidence-based audit of OpenSpec tasks (DONE vs BROKEN vs PENDING), correct mismarked items in `openspec/changes/esperion-agency-web/tasks.md`, then make local dev Docker Compose (`docker-compose.yml`) boot to a verifiably healthy state.
> **Deliverables**:
> - Updated `openspec/changes/esperion-agency-web/tasks.md` (binary checkboxes preserved; mismatches corrected)
> - Audit report with tri-state classification + evidence links
> - Local dev compose smoke test evidence (DB + backend + frontend)
> **Effort**: Large
> **Parallel**: YES - 4 waves
> **Critical Path**: Baseline evidence -> backend build fixes -> docker compose up -> section-by-section task audit -> final verification wave

## Context
### Original Request
- Audit task keseluruhan: mana yang benar-benar done vs done-tapi-error vs belum.
- Update `openspec/changes/esperion-agency-web/tasks.md` jika ada yang ditandai selesai tapi ternyata belum.
- Deploy Docker sampai stack benar-benar jalan normal; gunakan banyak agent paralel.

### Interview Summary
- Docker target untuk "deploy" diputuskan: **Local dev compose** (`docker-compose.yml`).

### Repo-Truth Findings (grounded)
- OpenSpec task parsing expects standard markdown checkboxes only: `.clinerules/workflows/opsx-archive.md:37` and `.clinerules/workflows/opsx-apply.md:66`.
- `docker-compose.yml` dev ports: frontend `3000:3000`, backend `8081:8080`, surrealdb `8002:8000`; DB has healthcheck; backend/frontend do not.
- Backend health endpoint is routed at `/health` in `backend/src/main.rs:228` and implemented in `backend/src/handlers/health.rs` (per earlier scan).
- `cargo check` currently fails; key compile errors:
  - `backend/src/main.rs` (Router state typing + axum serve + OpenAPI router typing)
  - `backend/src/api/mod.rs` (register_openapi loses state typing)
  - `backend/src/handlers/translation.rs` (wrong error type + incorrect claims usage)
  - `backend/src/handlers/articles.rs` (typo `except_id`)
  - `backend/src/handlers/email.rs` (generic router bounds)
  - `backend/src/services/email.rs` (lettre async transport usage)
- `backend/src/db/migrations/mod.rs:192` registers only 1.0.0 and 1.1.0 while migration SQL files for 003/004 exist on disk.

### Metis Review (gaps addressed)
- Treat `tasks.md` as **binary checkbox** only; represent tri-state using: `[x]` + `BROKEN:` tag + separate audit report.
- Avoid scope creep into staging/prod compose; dev compose only.
- Mitigate stale health-path drift (`/api/v1/health` vs `/health`) by defining canonical smoke tests and recording stale references.

## Work Objectives
### Core Objective
- Make task status truthful (evidence-based) and make local docker stack verifiably healthy.

### Deliverables
- `.sisyphus/audit-reports/task-status-audit.md` (tri-state table + evidence pointers)
- `.sisyphus/evidence/*` artifacts (command outputs, curl responses, screenshots)
- Updated `openspec/changes/esperion-agency-web/tasks.md` with:
  - corrected checkboxes for "marked done but not implemented"
  - ASCII inline notes for nuance: `Partial:` and `BROKEN:`

### Definition of Done (agent-verifiable)
- `cargo check` passes in `backend/`.
- `docker compose -f docker-compose.yml config` exits 0.
- `docker compose -f docker-compose.yml up -d --build` brings up services.
- Smoke checks from host succeed:
  - `curl -sf http://localhost:8002/health`
  - `curl -sf http://localhost:8081/health` and response contains `"status":"healthy"`
  - `curl -I -sf http://localhost:3000` returns HTTP 200-399
- Audit report exists and lists every task line changed in `tasks.md` with evidence file reference.

### Must Have
- Preserve OpenSpec parseability: only `- [x]` and `- [ ]` checkboxes.
- Evidence for every downgrade/upgrade in `tasks.md`.
- Dev compose validation (no staging/prod changes unless required for dev).

### Must NOT Have (guardrails)
- Do not introduce non-standard checkbox markers (no emojis, no `[~]`, no custom syntax).
- Do not store secrets in evidence artifacts (redact env values).
- Do not commit generated artifacts (`.nuxt/`, `target/`, etc.) unless user explicitly asks for commits.

## Verification Strategy
> ZERO HUMAN INTERVENTION: all verification is agent-executed.
- Test decision: tests-after (align with existing CI expectations).
- Backend: `cargo fmt -- --check`, `cargo clippy -- -D warnings` (optional if feasible), `cargo test`, `cargo check` as hard gate.
- Frontend: `npm -C frontend run type-check`, `npm -C frontend run test:unit` (run only after dev compose is healthy, to reduce confounders).
- Runtime smoke: docker compose + curl checks (Definition of Done).
- Evidence format: `.sisyphus/evidence/task-{N}-{slug}.*`.

## Execution Strategy
### Parallel Execution Waves
Wave 1 (Baseline + scaffolding): evidence dirs, baseline error captures, unblock repo tools.
Wave 2 (Backend unbreak build): targeted compile fixes + migration registration + health-path compatibility.
Wave 3 (Docker dev health): compose env hardening + compose up + smoke tests + logs capture.
Wave 4 (Audit sweep): section-cluster audits updating tasks.md + audit report finalization.

### Multi-Agent Policy (MANDATORY)
- Do not execute this plan with a single agent.
- For each wave, dispatch the tasks in that wave to multiple agents concurrently.
- Minimum concurrency targets:
  - Wave 1: 3 agents
  - Wave 2: 6 agents (one file-focused agent per task 4-11)
  - Wave 3: 1-2 agents (docker operator + log triage helper)
  - Wave 4: 4 agents (one per audit cluster)

### Agent Dispatch Summary
- Wave 1:
  - Agent A: Task 1
  - Agent B: Task 2
  - Agent C: Task 3
- Wave 2 (run all in parallel; file ownership avoids conflicts):
  - Agent D (main.rs owner): Task 4 + Task 11
  - Agent E (api owner): Task 5
  - Agent F (articles handler): Task 6
  - Agent G (email handler): Task 7
  - Agent H (email service): Task 8
  - Agent I (translation handler): Task 9
  - Agent J (migrations): Task 10
  - Agent D runs Task 12 after all Wave 2 tasks finish
- Wave 3:
  - Agent K: Task 13 + Task 14
- Wave 4 (run all in parallel):
  - Agent L: Task 15
  - Agent M: Task 16
  - Agent N: Task 17
  - Agent O: Task 18
  - Agent P: Task 19 after Task 15-18 complete

### Dependency Matrix (high level)
- Wave 2 blocks Wave 3 (backend must compile to build container).
- Wave 3 blocks parts of Wave 4 that require runtime verification (curl/playwright).

## TODOs
> Every task below includes implementation + verification + evidence output.


- [ ] 1. Create Audit Scaffolding (report + evidence dirs)

  **What to do**: Create `.sisyphus/evidence/` and `.sisyphus/audit-reports/` artifacts used by the rest of the plan; create `.sisyphus/audit-reports/task-status-audit.md` with this exact template:

  ```markdown
  # Task Status Audit (Esperion Agency Web)

  Generated: {{ISO_8601_TIMESTAMP}}

  ## Rubric
  - DONE: verified by task-specific commands
  - BROKEN: implementation exists but verification fails; keep `[x]` in tasks.md and append `BROKEN: <short reason>`
  - PENDING: required artifact missing; set `[ ]` (use `Partial:` inline notes when helpful)

  ## Changes Log
  | Section | Task ID | Old Line | New Line | Verdict | Evidence | Notes |
  |---|---:|---|---|---|---|---|

  ## Broken Items (index)
  | Section | Task ID | Failure Signal | Evidence |
  |---|---:|---|---|
  ```
  **Must NOT do**: Do not write secrets into evidence; never dump full env or docker compose expanded env.

  **Rubric (decision complete)**:
  - `DONE`: verified by the task-specific command(s) listed in this plan
  - `BROKEN`: implementation exists (static evidence) but verification fails; keep `[x]` in `tasks.md` and append `BROKEN: <short reason>`
  - `PENDING`: required artifact missing; set checkbox to `[ ]` (and use `Partial:` inline notes when appropriate)

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: creating structured report templates and guardrails
  - Skills: []
  - Omitted: [`git-master`] - no commits in this plan

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: none | Blocked By: none

  **References**:
  - OpenSpec checkbox requirement: `.clinerules/workflows/opsx-apply.md:66`, `.clinerules/workflows/opsx-archive.md:37`
  - Existing audit dirs: `.sisyphus/audit-reports/`

  **Acceptance Criteria**:
  - [ ] `.sisyphus/audit-reports/task-status-audit.md` exists and includes the rubric + a table header
  - [ ] `.sisyphus/evidence/` exists

  **QA Scenarios**:
  ```
  Scenario: Scaffolding exists
    Tool: Bash
    Steps: mkdir -p .sisyphus/evidence .sisyphus/audit-reports && ls -la .sisyphus > .sisyphus/evidence/task-1-scaffolding.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-1-scaffolding.txt

  Scenario: Audit report template created
    Tool: Bash
    Steps: test -f .sisyphus/audit-reports/task-status-audit.md && grep -n "^# Task Status Audit" .sisyphus/audit-reports/task-status-audit.md > .sisyphus/evidence/task-1-audit-report-exists.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-1-audit-report-exists.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 2. Remove Windows-Special Untracked File `nul` (unblocks grep/rg tooling)

  **What to do**: Confirm `nul` is untracked (per `git status --porcelain`). If and only if it is untracked, delete it from the workspace root.
  **Must NOT do**: Do not delete anything that is tracked by git.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: single safe cleanup action
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: tasks that need repo-wide grep | Blocked By: none

  **References**:
  - Current status shows `?? nul` (untracked) in repo root (baseline observation)

  **Acceptance Criteria**:
  - [ ] `git status --porcelain` no longer shows `?? nul`

  **QA Scenarios**:
  ```
  Scenario: Safe deletion only if untracked
    Tool: Bash
    Steps: git status --porcelain > .sisyphus/evidence/task-2-git-porcelain.txt; (grep -q "^?? nul$" .sisyphus/evidence/task-2-git-porcelain.txt && rm -f nul || true); git status --porcelain > .sisyphus/evidence/task-2-git-porcelain-after.txt
    Expected: If it was untracked, it is gone; otherwise unchanged
    Evidence: .sisyphus/evidence/task-2-git-porcelain-after.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 3. Capture Baseline Evidence (build + compose + task headings)

  **What to do**: Record current state before fixes: backend compile errors, docker compose parse, and task section headings.
  **Must NOT do**: Do not start containers in this task.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multi-command evidence capture
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: none | Blocked By: tasks 1-2

  **References**:
  - `docker-compose.yml` for config validation
  - `openspec/changes/esperion-agency-web/tasks.md` section list (46 sections)

  **Acceptance Criteria**:
  - [ ] Evidence files created:
    - `.sisyphus/evidence/task-3-cargo-check.txt`
    - `.sisyphus/evidence/task-3-docker-compose-config.txt`
    - `.sisyphus/evidence/task-3-task-headings.txt`

  **QA Scenarios**:
  ```
  Scenario: Baseline command outputs captured
    Tool: Bash
    Steps: |
      (cd backend && cargo check) > .sisyphus/evidence/task-3-cargo-check.txt 2>&1 || true
      docker compose -f docker-compose.yml config > .sisyphus/evidence/task-3-docker-compose-config.txt
      grep -n "^## " openspec/changes/esperion-agency-web/tasks.md > .sisyphus/evidence/task-3-task-headings.txt
    Expected: evidence files exist and are non-empty
    Evidence: .sisyphus/evidence/task-3-task-headings.txt

  Scenario: Compose file is parseable
    Tool: Bash
    Steps: docker compose -f docker-compose.yml config > .sisyphus/evidence/task-3-compose-parse-ok.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-3-compose-parse-ok.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 4. Fix Backend Startup + Router State Typing (axum 0.7)

  **What to do**:
  - In `backend/src/main.rs`, ensure the router is typed as `Router<crate::AppState>` from creation time so handlers using `State<crate::AppState>` compile.
    - Change `let router = axum::Router::new()` (currently `backend/src/main.rs:225`) to `let router = axum::Router::<crate::AppState>::new()`.
    - Keep `.with_state(state)` at the end (currently `backend/src/main.rs:294`) to attach the value.
  - Fix server start to use a MakeService:
    - Change `axum::serve(listener, app).await?;` (currently `backend/src/main.rs:212`) to `axum::serve(listener, app.into_make_service()).await?;`.
  **Must NOT do**: Do not change route paths or handler behavior in this task.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: localized compile fix in one file
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: task 12 | Blocked By: task 3

  **References**:
  - Router and routes: `backend/src/main.rs:218` onward
  - Failing call site: `backend/src/main.rs:212`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports handler trait errors originating from `backend/src/main.rs:232` / `backend/src/main.rs:233`

  **QA Scenarios**:
  ```
  Scenario: cargo check after router typing fix
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-4-cargo-check.txt
    Expected: no E0277 Handler errors at main.rs:232-233; remaining errors (if any) are in other modules
    Evidence: .sisyphus/evidence/task-4-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 5. Fix OpenAPI Router Typing (preserve state)

  **What to do**:
  - Update `backend/src/api/mod.rs` so `register_openapi` is generic over router state and does not downcast to `Router<()>`.
  - Replace `pub fn register_openapi(router: Router) -> Router` (`backend/src/api/mod.rs:177`) with:
    - `pub fn register_openapi<S>(router: Router<S>) -> Router<S>`
    - Add bounds: `where S: Clone + Send + Sync + 'static` (to satisfy router layering constraints).
  **Must NOT do**: Do not change the OpenAPI JSON payload; only fix typing.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: localized generic typing change
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: task 12 | Blocked By: task 3

  **References**:
  - Current function: `backend/src/api/mod.rs:176`
  - Call site: `backend/src/main.rs:297`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports `expected Router<AppState>, found Router<()>` at `backend/src/main.rs:297`

  **QA Scenarios**:
  ```
  Scenario: cargo check after OpenAPI router typing fix
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-5-cargo-check.txt
    Expected: no E0308 at main.rs:297
    Evidence: .sisyphus/evidence/task-5-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 6. Fix Articles Handler Create Typo (`except_id` -> `excerpt_id`)

  **What to do**: In `backend/src/handlers/articles.rs`, fix the bind typo at `backend/src/handlers/articles.rs:200`:
  - Replace `req.except_id` with `req.excerpt_id`.
  **Must NOT do**: Do not refactor request types in this task.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: single-line correctness fix
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: backend compile | Blocked By: task 3

  **References**:
  - Faulty bind: `backend/src/handlers/articles.rs:191` (context) and `backend/src/handlers/articles.rs:200`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports `no field except_id` for `ArticleRequest`

  **QA Scenarios**:
  ```
  Scenario: cargo check confirms typo resolved
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-6-cargo-check.txt
    Expected: no E0609 for except_id
    Evidence: .sisyphus/evidence/task-6-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 7. Fix Email Handler Router Helper Typing

  **What to do**: In `backend/src/handlers/email.rs`, fix `register_routes` so it compiles under axum 0.7:
  - Option A (chosen): keep generic but add bounds:
    - `pub fn register_routes<T>(router: axum::Router<T>) -> axum::Router<T>`
    - add `where T: Clone + Send + Sync + 'static`
  **Must NOT do**: Do not change endpoints or handler functions.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: localized generic bound fix
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: backend compile | Blocked By: task 3

  **References**:
  - Function: `backend/src/handlers/email.rs:108`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports Router<T>.route trait-bound error from `backend/src/handlers/email.rs:113`

  **QA Scenarios**:
  ```
  Scenario: cargo check confirms email router helper compiles
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-7-cargo-check.txt
    Expected: no E0599 at handlers/email.rs:113
    Evidence: .sisyphus/evidence/task-7-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 8. Fix SMTP Send Implementation (lettre async transport)

  **What to do**: In `backend/src/services/email.rs`, fix SMTP provider to use async send correctly:
  - Import trait: `use lettre::AsyncTransport;`
  - Replace `tokio::task::spawn_blocking(move || { mailer.send(&email) }) ...` (see `backend/src/services/email.rs:153` onward) with direct async send:
    - `mailer.send(email).await ...`
  - Do the same for the second SMTP send block (error was also at around `backend/src/services/email.rs:460`).
  **Must NOT do**: Do not redesign provider abstractions; keep behavior equivalent.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multi-location fix in a large file
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: backend compile | Blocked By: task 3

  **References**:
  - SMTP send block: `backend/src/services/email.rs:128` to `backend/src/services/email.rs:162`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports lettre `send` missing / type annotation errors (E0599/E0282)

  **QA Scenarios**:
  ```
  Scenario: cargo check confirms SMTP provider compiles
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-8-cargo-check.txt
    Expected: no E0599/E0282 originating from backend/src/services/email.rs
    Evidence: .sisyphus/evidence/task-8-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 9. Fix Translation Handler Compile Errors (claims + error types)

  **What to do**:
  - In `backend/src/handlers/translation.rs`:
    - Change `Result<(), crate::api::ErrorResponse>` (see `backend/src/handlers/translation.rs:265` and `backend/src/handlers/translation.rs:515`) to `Result<(), crate::api::ApiError>`.
    - Replace all `user.user_id` references with `_claims.sub` (UserClaims is an alias for JwtClaims; see `backend/src/models/user.rs:96`).
      - Example locations: `backend/src/handlers/translation.rs:406`, `backend/src/handlers/translation.rs:438`, `backend/src/handlers/translation.rs:625`.
  **Must NOT do**: Do not attempt to "fix" Surreal SQL semantics in this task; compilation only.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: localized but error-prone handler changes
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: backend compile | Blocked By: task 3

  **References**:
  - Claims type alias: `backend/src/models/user.rs:84` and `backend/src/models/user.rs:96`
  - Error type: `backend/src/api/mod.rs:51`

  **Acceptance Criteria**:
  - [ ] `cargo check` no longer reports E0425/E0425 for `ErrorResponse` or `user` in `backend/src/handlers/translation.rs`

  **QA Scenarios**:
  ```
  Scenario: cargo check confirms translation handler compiles
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-9-cargo-check.txt
    Expected: no E0425 for ErrorResponse/user in translation.rs
    Evidence: .sisyphus/evidence/task-9-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 10. Register Migrations 003 + 004 in Migration Manager

  **What to do**: In `backend/src/db/migrations/mod.rs`, extend `MIGRATIONS` (currently only 1.0.0 and 1.1.0 at `backend/src/db/migrations/mod.rs:192`) to include:
  - Version `1.2.0`: `003_add_translation_memory_table.sql` + down file
  - Version `1.3.0`: `004_add_publication_options_to_articles.sql` + down file
  Keep ordering by version.
  **Must NOT do**: Do not rename migration files; use the existing `backend/src/db/migrations/003_*` and `backend/src/db/migrations/004_*` files.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: deterministic registry update
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: runtime correctness for translation/publication options | Blocked By: task 3

  **References**:
  - Migration registry: `backend/src/db/migrations/mod.rs:190`
  - Existing SQL files (untracked in git status earlier):
    - `backend/src/db/migrations/003_add_translation_memory_table.sql`
    - `backend/src/db/migrations/003_add_translation_memory_table_down.sql`
    - `backend/src/db/migrations/004_add_publication_options_to_articles.sql`
    - `backend/src/db/migrations/004_add_publication_options_to_articles_down.sql`

  **Acceptance Criteria**:
  - [ ] `cargo check` passes `backend/` (or at minimum no include_str missing-file errors)
  - [ ] `grep -n "003_add_translation_memory_table" backend/src/db/migrations/mod.rs` finds the registration
  - [ ] `grep -n "004_add_publication_options_to_articles" backend/src/db/migrations/mod.rs` finds the registration

  **QA Scenarios**:
  ```
  Scenario: Registry contains new migrations
    Tool: Bash
    Steps: |
      grep -n "003_add_translation_memory_table" backend/src/db/migrations/mod.rs | tee .sisyphus/evidence/task-10-mig-003.txt
      grep -n "004_add_publication_options_to_articles" backend/src/db/migrations/mod.rs | tee .sisyphus/evidence/task-10-mig-004.txt
    Expected: both greps exit 0
    Evidence: .sisyphus/evidence/task-10-mig-004.txt

  Scenario: Backend still compiles
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-10-cargo-check.txt
    Expected: exit 0 (or only warnings)
    Evidence: .sisyphus/evidence/task-10-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 11. Add Back-Compat Health Alias Route (`/api/v1/health` -> same handler)

  **What to do**: In `backend/src/main.rs`, add a GET route at `/api/v1/health` that calls the existing health handler (same as `/health`).
  **Must NOT do**: Do not remove `/health`.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: small compatibility fix
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: none | Blocked By: task 4

  **References**:
  - Existing route: `backend/src/main.rs:228`

  **Acceptance Criteria**:
  - [ ] `grep -n "\"/api/v1/health\"" backend/src/main.rs` finds the new route line
  - [ ] `cargo check` still passes

  **QA Scenarios**:
  ```
  Scenario: Route exists in router
    Tool: Bash
    Steps: grep -n "\"/api/v1/health\"" backend/src/main.rs | tee .sisyphus/evidence/task-11-route.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-11-route.txt

  Scenario: Backend compiles
    Tool: Bash
    Steps: cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-11-cargo-check.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-11-cargo-check.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 12. Backend Verification Gate (check + test)

  **What to do**: Run backend verification commands and capture output.
  **Must NOT do**: Do not mass-refactor to silence warnings.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: verification and evidence capture
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: docker build | Blocked By: tasks 4-11

  **References**:
  - CI expectations (inventory): `.github/workflows/ci.yml`, `.github/workflows/ci-cd.yml`

  **Acceptance Criteria**:
  - [ ] `cargo check` exit 0
  - [ ] `cargo test` exit 0
  - [ ] Evidence files exist:
    - `.sisyphus/evidence/task-12-cargo-check.txt`
    - `.sisyphus/evidence/task-12-cargo-test.txt`

  **QA Scenarios**:
  ```
  Scenario: Backend checks pass
    Tool: Bash
    Steps: |
      cd backend && cargo check 2>&1 | tee ../.sisyphus/evidence/task-12-cargo-check.txt
      cd backend && cargo test 2>&1 | tee ../.sisyphus/evidence/task-12-cargo-test.txt
    Expected: both commands exit 0
    Evidence: .sisyphus/evidence/task-12-cargo-test.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 13. Sanitize Dev Compose Secrets (remove hardcoded Alibaba key)

  **What to do**: In `docker-compose.yml`, remove the hardcoded default value for `ALIBABA_AI_API_KEY`. Replace with env-only expansion:
  - `- ALIBABA_AI_API_KEY=${ALIBABA_AI_API_KEY:-}`
  **Must NOT do**: Do not commit or log real keys.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: targeted env hardening
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: none | Blocked By: task 3

  **References**:
  - Compose file: `docker-compose.yml:34` (backend env block)

  **Acceptance Criteria**:
  - [ ] `docker compose -f docker-compose.yml config` still exits 0
  - [ ] The rendered config does not contain the previous literal leaked key value

  **QA Scenarios**:
  ```
  Scenario: Compose renders without hardcoded key
    Tool: Bash
    Steps: docker compose -f docker-compose.yml config > .sisyphus/evidence/task-13-compose-config.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-13-compose-config.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 14. Local Dev Docker Deploy + Smoke Checks (DB + backend + frontend)

  **What to do**:
  - Build and start the stack with dev compose.
  - Smoke check endpoints from host:
    - DB: `http://localhost:8002/health`
    - Backend: `http://localhost:8081/health` and `http://localhost:8081/api/v1/health`
    - Frontend: `http://localhost:3000`
  - Capture `docker compose ps` and, on any failure, `docker compose logs`.
  **Must NOT do**: Do not store secrets in evidence.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: docker + runtime verification
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: runtime-dependent audits | Blocked By: task 12, task 13

  **References**:
  - Dev compose: `docker-compose.yml`

  **Acceptance Criteria**:
  - [ ] `docker compose -f docker-compose.yml up -d --build` exits 0
  - [ ] `curl -sf http://localhost:8002/health` exits 0
  - [ ] `curl -sf http://localhost:8081/health` exits 0 and contains `"healthy"`
  - [ ] `curl -sf http://localhost:8081/api/v1/health` exits 0 and contains `"healthy"`
  - [ ] `curl -I -sf http://localhost:3000` exits 0

  **QA Scenarios**:
  ```
  Scenario: Bring up compose and smoke test
    Tool: Bash
    Steps: |
      docker compose -f docker-compose.yml up -d --build > .sisyphus/evidence/task-14-compose-up.txt 2>&1
      docker compose -f docker-compose.yml ps > .sisyphus/evidence/task-14-compose-ps.txt
      curl -sf http://localhost:8002/health > .sisyphus/evidence/task-14-db-health.txt
      curl -sf http://localhost:8081/health > .sisyphus/evidence/task-14-backend-health.txt
      curl -sf http://localhost:8081/api/v1/health > .sisyphus/evidence/task-14-backend-health-v1.txt
      curl -I -sf http://localhost:3000 > .sisyphus/evidence/task-14-frontend-head.txt
    Expected: all commands exit 0
    Evidence: .sisyphus/evidence/task-14-compose-ps.txt

  Scenario: Failure capture (only if smoke fails)
    Tool: Bash
    Steps: docker compose -f docker-compose.yml logs --no-color > .sisyphus/evidence/task-14-compose-logs.txt 2>&1 || true
    Expected: logs captured
    Evidence: .sisyphus/evidence/task-14-compose-logs.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 15. Audit Cluster A: Sections 1-17 (Infra + backend)

  **What to do**:
  - Scope: headings 1-17 in `openspec/changes/esperion-agency-web/tasks.md` (up to heading `## 17` at `tasks.md:273`).
  - For each task line in this scope, apply the rubric from task 1 and update `tasks.md` accordingly.
  - Mandatory runtime checks (because dev compose is up):
    - Any endpoint task marked `[x]` must have a working `curl` example (record output).
  - Record every changed task line in `.sisyphus/audit-reports/task-status-audit.md`.
  **Must NOT do**: Do not add non-standard checkbox states.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: broad evidence-based classification
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: audit completion | Blocked By: task 14

  **Acceptance Criteria**:
  - [ ] Audit report contains a "Changed Lines" subsection for sections 1-17

  **QA Scenarios**:
  ```
  Scenario: Capture route inventory evidence
    Tool: Bash
    Steps: grep -n "\.route(\"/api/v1/" backend/src/main.rs > .sisyphus/evidence/task-15-routes.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-15-routes.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 16. Audit Cluster B: Sections 18-28 (Frontend core + public pages)

  **What to do**:
  - Scope: headings 18-28 in `openspec/changes/esperion-agency-web/tasks.md`.
  - Deterministic checks:
    - Page/file existence: under `frontend/app/pages/`.
    - Runtime: `curl -I -sf http://localhost:3000/<path>` for top-level pages; record failures.
  - Apply rubric and log changes.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: frontend file+runtime verification
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: audit completion | Blocked By: task 14

  **Acceptance Criteria**:
  - [ ] Audit report contains a "Changed Lines" subsection for sections 18-28

  **QA Scenarios**:
  ```
  Scenario: Capture page inventory evidence
    Tool: Bash
    Steps: (cd frontend && ls -R app/pages > ../.sisyphus/evidence/task-16-pages-tree.txt 2>&1 || true)
    Expected: evidence file exists
    Evidence: .sisyphus/evidence/task-16-pages-tree.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 17. Audit Cluster C: Sections 29-38 (Auth + dashboard)

  **What to do**:
  - Scope: headings 29-38 in `openspec/changes/esperion-agency-web/tasks.md`.
  - Verify auth/dashboard page presence under `frontend/app/pages/` and any API bindings (`NUXT_PUBLIC_API_BASE` usage).
  - Apply rubric and log changes.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: higher coupling between frontend auth/dashboard and backend API
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: audit completion | Blocked By: task 14

  **Acceptance Criteria**:
  - [ ] Audit report contains a "Changed Lines" subsection for sections 29-38

  **QA Scenarios**:
  ```
  Scenario: Capture dashboard inventory evidence
    Tool: Bash
    Steps: (cd frontend && (ls -R app/pages 2>/dev/null || true) | grep -n "dashboard" || true) > .sisyphus/evidence/task-17-dashboard-pages.txt
    Expected: evidence file exists
    Evidence: .sisyphus/evidence/task-17-dashboard-pages.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 18. Audit Cluster D: Sections 39-46 (SEO/Studio/PWA/A11y/Testing/CI/Docs/Launch)

  **What to do**:
  - Scope: headings 39-46 in `openspec/changes/esperion-agency-web/tasks.md`.
  - Deterministic checks:
    - Workflows exist under `.github/workflows/`
    - Frontend checks run inside the running compose container (avoids host Node dependency):
      - `docker compose -f docker-compose.yml exec -T frontend npm ci`
      - `docker compose -f docker-compose.yml exec -T frontend npm run type-check`
      - `docker compose -f docker-compose.yml exec -T frontend npm run test:unit`
    - Backend tests run: `cd backend && cargo test`
  - Apply rubric and log changes.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multi-area verification
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: audit completion | Blocked By: task 14

  **Acceptance Criteria**:
  - [ ] Audit report contains a "Changed Lines" subsection for sections 39-46
  - [ ] Evidence files created:
    - `.sisyphus/evidence/task-18-workflows.txt`
    - `.sisyphus/evidence/task-18-frontend-npm-ci.txt`
    - `.sisyphus/evidence/task-18-frontend-typecheck.txt`
    - `.sisyphus/evidence/task-18-frontend-test-unit.txt`
    - `.sisyphus/evidence/task-18-backend-cargo-test.txt`

  **QA Scenarios**:
  ```
  Scenario: Inventory workflows
    Tool: Bash
    Steps: ls -la .github/workflows > .sisyphus/evidence/task-18-workflows.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-18-workflows.txt

  Scenario: Run frontend checks in docker container
    Tool: Bash
    Steps: |
      docker compose -f docker-compose.yml exec -T frontend npm ci > .sisyphus/evidence/task-18-frontend-npm-ci.txt 2>&1
      docker compose -f docker-compose.yml exec -T frontend npm run type-check > .sisyphus/evidence/task-18-frontend-typecheck.txt 2>&1
      docker compose -f docker-compose.yml exec -T frontend npm run test:unit > .sisyphus/evidence/task-18-frontend-test-unit.txt 2>&1
    Expected: all commands exit 0
    Evidence: .sisyphus/evidence/task-18-frontend-test-unit.txt

  Scenario: Run backend tests
    Tool: Bash
    Steps: cd backend && cargo test 2>&1 | tee ../.sisyphus/evidence/task-18-backend-cargo-test.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-18-backend-cargo-test.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

- [ ] 19. Finalize Audit Report + Checklist Integrity Check

  **What to do**:
  - Ensure `.sisyphus/audit-reports/task-status-audit.md` contains summary counts per section + a full changed-lines appendix.
  - Ensure `openspec/changes/esperion-agency-web/tasks.md` still uses only standard checkboxes.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: final report assembly
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: final verification | Blocked By: tasks 15-18

  **Acceptance Criteria**:
  - [ ] `grep -n "^- \[x\]" openspec/changes/esperion-agency-web/tasks.md | wc -l` succeeds
  - [ ] `grep -n "^- \[ \]" openspec/changes/esperion-agency-web/tasks.md | wc -l` succeeds

  **QA Scenarios**:
  ```
  Scenario: Checklist integrity
    Tool: Bash
    Steps: |
      grep -n "^- \[x\]" openspec/changes/esperion-agency-web/tasks.md | wc -l > .sisyphus/evidence/task-19-complete-count.txt
      grep -n "^- \[ \]" openspec/changes/esperion-agency-web/tasks.md | wc -l > .sisyphus/evidence/task-19-incomplete-count.txt
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-19-complete-count.txt
  ```

  **Commit**: NO | Message: n/a | Files: n/a

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Runtime QA (docker + smoke) - unspecified-high
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- Default: NO commits. If user requests commits later: atomic commits per wave, never include `.nuxt/`, `backend/target/`, or secrets.

## Success Criteria
- Dev compose healthy + smoke tests pass.
- `tasks.md` mismatches corrected with evidence.
- Audit report complete and cross-referenced.
