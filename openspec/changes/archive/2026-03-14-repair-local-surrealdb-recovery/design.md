## Context

The root local Docker workflow is intended to be the fastest way to run Esperion end-to-end with exactly three services: `frontend`, `backend`, and `database`. That workflow is currently fragile because `docker-compose.yml` points the database service at `surrealdb/surrealdb:v3.0.4` with `rocksdb:/data/esperion.db`, while existing developer machines can still carry a `surreal-data` volume created under SurrealDB 1.x storage semantics. When that happens, the database exits with `Expected: 3, Actual: 1`, the local stack no longer satisfies the documented Docker startup path, and developers lose confidence in whether the failure is the volume itself, the application startup order, or both.

The repo already contains broad migration work in `openspec/changes/migrate-surrealdb-v3/`, backup artifacts under `backups/`, and a `scripts/migrate-production.sh` script. Those materials prove the team has already encountered the version mismatch, but they do not yet provide a safe, local, repeatable recovery flow. The official SurrealDB guidance also makes the current gap sharper: 1.x data cannot be mounted directly into a 3.x server. The supported path is 1.x -> 2.x via `surreal fix`, then 2.x -> 3.x via v3-compatible export/import.

Runtime evidence also changed the picture in an important way: after the preserve-data recovery flow migrated the local volume successfully, the database became healthy immediately and the frontend stayed healthy, but the backend spent roughly 28 minutes in a cold Rust compile before `/health` became ready. During that window, the stack looked partially broken even though recovery had fundamentally succeeded. That means the change must define readiness and verification semantics, not just database migration mechanics.

This change is therefore a cross-cutting local recovery design touching Docker Compose, recovery tooling, backup handling, documentation, and stack verification. It does not change Nuxt rendering behavior, the Esperion design system, or dashboard/public feature scope, but it does restore the infrastructure path those application layers depend on.

## Goals / Non-Goals

**Goals:**
- Provide a deterministic local recovery workflow for legacy `surreal-data` volumes that block the v3 database container.
- Preserve local developer data when requested by using the supported SurrealDB migration sequence instead of an unsupported direct boot.
- Provide an explicit reset path for disposable local data so developers can get back to a working stack quickly.
- Verify recovery at the stack level by checking database startup, backend readiness, and frontend response after the database issue is resolved.
- Keep recovery tooling aligned with Docker-based local development so developers do not need a separately installed SurrealDB CLI to execute the supported workflow.
- Make backend cold-build delay observable and non-ambiguous during post-recovery verification.

**Non-Goals:**
- Production migration scheduling, maintenance-window orchestration, or blue-green deployment changes.
- Frontend page rendering, design-system tokens, or ISR/CSR routing behavior.
- General backup product features already covered by `backup-restore`.
- Reworking backend database access patterns beyond what is necessary to restore the local v3 stack.

## Decisions

### Decision 1: Use an explicit local recovery entry point instead of automatic migration on compose startup
- The recovery workflow will be triggered intentionally through dedicated tooling/documentation, not as a side effect of `docker compose up`.
- Rationale: local recovery can be destructive, time-consuming, and branch based on whether data should be preserved. Automatic mutation during ordinary startup would hide risk and make failures harder to diagnose.
- Alternatives considered:
  - Auto-migrate during database container startup: rejected because it would mutate state implicitly and complicate rollback.
  - Leave recovery as manual docs only: rejected because the repo already contains fragmented instructions and inconsistent assumptions.

### Decision 2: Preserve-data recovery will be backup-first and operate on a working copy, not the only copy of the old volume
- Before any migration step, the workflow will snapshot the current local `surreal-data` contents into a timestamped backup outside the active volume.
- The 1.x -> 2.x `surreal fix` step will run against a working copy or explicitly backed-up source, not the only recoverable copy.
- Rationale: community reports show `surreal fix` can fail on some datasets, and the official guidance does not support direct 1.x -> 3.x startup. Backup-first is the only safe foundation.
- Alternatives considered:
  - In-place mutation of the active `surreal-data` volume: rejected because it risks permanent loss if the migration fails midway.
  - Treat direct v1 export/import into v3 as the primary workflow: rejected because it conflicts with the official staged upgrade guidance.

### Decision 3: Use containerized SurrealDB tooling for the recovery path
- The recovery workflow will use temporary SurrealDB containers/images for 2.x and 3.x migration commands rather than depending on a host-installed CLI.
- Rationale: the project already depends on Docker for the local stack, and containerized tooling keeps the migration version-pinned and reproducible across Windows, macOS, and Linux hosts.
- Alternatives considered:
  - Require developers to install SurrealDB binaries locally: rejected because it adds platform drift and makes version pinning harder.

### Decision 4: Separate the preserve-data migration path from the disposable-data reset path
- The workflow will support two explicit modes:
  - preserve local data via staged migration
  - discard old local data and recreate the volume cleanly
- Rationale: some developers need to retain local test data, while others only need the stack running again quickly. Forcing one path on all users makes the workflow slower or riskier than necessary.
- Alternatives considered:
  - Always migrate: rejected because it adds unnecessary complexity for disposable environments.
  - Always reset: rejected because it discards potentially useful local state and ignores the user's stated recovery goal.

### Decision 5: Keep local recovery separate from `scripts/migrate-production.sh`
- The local recovery flow will use dedicated tooling and documentation instead of extending the current production migration script as-is.
- Rationale: `scripts/migrate-production.sh` assumes production naming and a broader deployment flow; it is not shaped around root local Compose recovery, old developer volumes, or explicit reset decisions.
- Alternatives considered:
  - Reuse the production script directly: rejected because its assumptions and naming do not match the local stack and it currently reflects a broader migration path than the local recovery problem requires.

### Decision 6: Recovery is only complete when all three local services are verified again
- The workflow will not stop at a database-only success signal. It must revalidate database startup, backend readiness, and frontend response.
- Rationale: the user's actual failure is a broken 3-container development environment, not just a stopped database container.
- Alternatives considered:
  - Verify only the database service: rejected because backend and frontend can still fail after database migration or reset.

### Decision 7: Use readiness signals and health-aware orchestration instead of container start order
- Local stack verification will rely on explicit service readiness signals, not merely `docker compose ps` showing that containers are up.
- The database should expose a readiness-oriented probe, and the backend should only be treated as ready once `/health` responds successfully.
- In the current backend architecture, `/health` is acceptable for local readiness because the server does not bind and listen until `init_with_migrations()` completes successfully.
- Rationale: current runtime evidence shows that a container can be running while the service is still unavailable, especially during long backend cold builds.
- Alternatives considered:
  - Continue using `depends_on: service_started` and short curl checks: rejected because it creates false negatives during long build windows.
  - Treat frontend HTTP success as a proxy for full-stack readiness: rejected because the frontend can respond while the backend is still unavailable.

### Decision 8: Treat backend build performance as an explicit follow-up, not part of the recovery fix
- This change will document the observed backend cold-build behavior and resource pressure, but it will not absorb Docker/Rust build optimization work into the SurrealDB recovery scope.
- Rationale: the root issue discovered in logs is observability and readiness ambiguity after recovery, not a new SurrealDB migration error. Mixing build-performance work into this change would blur ownership and make the change harder to finish.
- Alternatives considered:
  - Expand the change to optimize Rust build speed immediately: rejected because it is a separate problem class with different success criteria.
  - Ignore the build constraint entirely: rejected because it directly affects whether recovery verification is trustworthy.

### Decision 9: Resolve the recovery-tooling open questions with observed runtime evidence
- Pin the intermediate repair image to `surrealdb/surrealdb:v2.6.3`, because that tag successfully handled `surreal fix` and `export --v3` in the current repository.
- Keep the PowerShell wrapper in scope because the repo is actively being operated from Windows paths.
- Define the reset path as a clean database volume that relies on normal backend migrations to recreate the required baseline, rather than introducing ad hoc seeding behavior into the recovery flow.
- Include Docker health checks in this change because the runtime evidence shows they are necessary to express the recovery contract accurately.

## Risks / Trade-offs

- [`surreal fix` can fail on some datasets] -> Take a snapshot before mutation, operate on a working copy, and keep a documented reset fallback.
- [The recovery flow needs extra time and disk space] -> Require timestamped backups, temporary export artifacts, and cleanup guidance for intermediate files/volumes.
- [Windows and shell differences can confuse local execution] -> Keep the core workflow Docker-driven and decide whether to add a PowerShell wrapper in addition to Bash-oriented tooling.
- [Existing repo docs/specs disagree about migration details] -> Update recovery specs and local Docker docs together so the new change becomes the authoritative local path.
- [A successful database migration may still leave application issues] -> Make backend/frontend verification part of the success contract, not a separate optional step.
- [Backend cold builds can exceed naive health timeouts] -> Define explicit readiness budgets and health-aware startup sequencing so verification can distinguish a slow build from a failed recovery.
- [Database debug logging can hide important signals in noisy websocket ping output] -> Treat log classification as part of the recovery runbook and consider quieter default local log levels as follow-up work.

## Migration Plan

### Implementation rollout
1. Add a dedicated local recovery entry point and documentation for legacy SurrealDB volumes.
2. Back up the current local `surreal-data` volume into a timestamped location outside the live volume path.
3. For preserve-data recovery:
   - stop the root stack
   - prepare a working copy of the legacy data
   - run a pinned SurrealDB 2.x `surreal fix` step on that working copy
   - start a temporary 2.x instance from the repaired data
   - generate a v3-compatible export
   - import that export into a clean v3 target volume
   - bring the root Compose stack back up on the clean v3 volume
4. For reset recovery:
   - confirm the developer accepts local data loss
   - recreate `surreal-data`
   - start the root Compose stack against the clean v3 volume
   - allow backend migrations to recreate the expected local baseline
5. Verify the local stack in sequence:
   - database readiness endpoint and version
   - backend `/health` with a cold-build-aware timeout budget
   - frontend HTTP response once backend is healthy
6. Classify post-recovery logs into blocking failures, expected startup noise, and non-blocking warnings.
7. Document cleanup guidance for backup artifacts, temporary working volumes, and any intermediate exports.

### Rollback strategy
- The original backup remains the rollback anchor and is not overwritten by the migration attempt.
- If preserve-data recovery fails, the workflow can stop without destroying the source backup, allowing retry, forensic inspection, or manual extraction with a version-matched temporary container.
- If the developer only needs a working local stack, the reset path remains available even after a failed preserve-data attempt.

## Open Questions

- Should SurrealDB local development default to a quieter log level than `debug` once readiness health checks are in place, so websocket ping noise stops dominating the logs?
- Should the future backend build-performance follow-up standardize a higher local memory baseline, or reduce compile pressure so recovery verification completes faster on constrained machines?
