# Draft: Evidence-Based Task Audit + Docker Deploy Stabilization

## Requirements (confirmed)
- Add an overall audit to determine which tasks are truly done vs "done but broken" vs not done.
- If tasks are marked done in `openspec/changes/esperion-agency-web/tasks.md` but evidence shows they are not done, update the task status accordingly.
- Deploy via Docker until the stack is running normally (health checks passing / pages load / API reachable).
- Use many agents in parallel to maximize precision.

## Technical Decisions
- Use `openspec/changes/esperion-agency-web/tasks.md` as the canonical checklist, but keep it parseable for OpenSpec (standard `- [x]` / `- [ ]`).
- Represent tri-state status as:
  - `DONE`: `- [x]` and passes verification
  - `BROKEN`: `- [x]` but append ASCII tag `BROKEN:` and record details in the audit report
  - `PENDING/PARTIAL`: `- [ ]` with inline `Partial:` annotation when useful
- Default deployment validation target: local dev Docker Compose (`docker-compose.yml`).

## Research Findings
- `openspec/changes/esperion-agency-web/tasks.md` currently uses standard checkboxes and includes some "Partial" annotations inline.
- `docker-compose.yml` defines `frontend` (3000), `backend` (host 8081 -> 8080), `database` (host 8002 -> 8000) with DB healthcheck only.
- `infrastructure/docker-compose.prod.yml` contains GitHub Actions-style secret interpolation (e.g. `${{ secrets.PRODUCTION_JWT_SECRET }}`) which is not valid for local `docker compose`.
- Repo working tree is heavily dirty (many modified + many untracked files), including backend/ frontend/ compose/ OpenSpec artifacts.
- `cargo check` currently fails with compile errors in:
  - `backend/src/main.rs` (Router state + axum serve + OpenAPI router types)
  - `backend/src/api/mod.rs` (register_openapi Router type loses state)
  - `backend/src/handlers/translation.rs` (wrong error type + uses `user.user_id` instead of claims)
  - `backend/src/handlers/articles.rs` (typo `except_id`)
  - `backend/src/handlers/email.rs` (generic router bounds)
  - `backend/src/services/email.rs` (lettre async transport usage)

## Open Questions
- Which deployment target is the priority for "deploy docker": local dev only, local production-like compose, or a remote server (1panel) / actual production?

## Scope Boundaries
- INCLUDE: evidence-based audit across the full tasks list; update task statuses where mismatched; define and run a docker-based verification checklist.
- EXCLUDE (unless explicitly requested): refactors unrelated to making tests/build/compose pass; redesigning architecture; force-pushing git history.
