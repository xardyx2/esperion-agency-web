## Why

The local Docker stack is currently fragile for any machine that still has a pre-v3 `surreal-data` volume. The root `docker-compose.yml` now starts `surrealdb/surrealdb:v3.0.4`, but the persisted local data can still be storage version 1, which causes the database container to fail with `Expected: 3, Actual: 1`, breaks the primary 3-container development workflow, and leaves developers uncertain whether the stack failed or is still recovering.

The repo already contains broad SurrealDB v3 migration work, but the actual local recovery path is still fragmented across notes, backup artifacts, and partially validated scripts. Runtime evidence now shows an additional gap: after the database is recovered, the backend can spend nearly 30 minutes in a cold compile before `/health` becomes ready, so container-up status alone is not enough to prove the stack is healthy. We need a focused change now so a developer can either safely migrate an old local volume through the supported 1.x -> 2.x -> 3.x path or intentionally reset it without guesswork, silent data loss, or ambiguous readiness signals.

## What Changes

- Add a migration-aware local SurrealDB recovery workflow for legacy `surreal-data` volumes used by the root Docker Compose stack.
- Define the supported recovery decision tree: back up the old local volume, migrate through a temporary 2.x step, export in a v3-compatible format, import into a clean v3 data store, and verify the full 3-container stack.
- Document and automate a safe fallback reset path for developers who do not need to preserve local data.
- Update local Docker troubleshooting and verification guidance so startup, logs, and post-recovery checks are explicit for `frontend`, `backend`, and `database`.
- Add healthcheck-based startup and verification expectations so the local stack distinguishes database recovery success from backend cold-build delay.
- Capture the observed backend cold-build and memory-pressure behavior as a known local constraint, and explicitly split build-performance optimization into follow-up work instead of hiding it inside the recovery change.
- Tighten the repo's migration contract so local recovery reflects SurrealDB's official upgrade path instead of assuming a direct 1.x -> 3.x in-place upgrade.
- **BREAKING** Local recovery may replace the existing `surreal-data` volume after an explicit backup-and-reset choice, so the old volume contents are no longer assumed to be directly bootable under v3.

## Capabilities

### New Capabilities
- `surrealdb-local-recovery`: Defines how the local Docker stack detects, backs up, migrates, or resets an incompatible SurrealDB volume and returns the 3-container workflow to a healthy state.

### Modified Capabilities
- `local-docker-deployment`: Local startup and troubleshooting requirements need to include a supported recovery path when legacy SurrealDB data prevents the database container from starting.
- `docker-infrastructure`: Docker database recovery, verification, and troubleshooting requirements need to cover legacy volume backup, migration-aware startup, health validation, and readiness orchestration across the local stack.
- `surrealdb-v3`: The v3 runtime requirements need to reflect the supported 1.x -> 2.x -> 3.x migration path and remove any implication that old on-disk data can be mounted directly into a v3 instance.

## Impact

- Expected files and systems: `docker-compose.yml`, local recovery scripts under `scripts/`, migration/troubleshooting documentation such as `README.md`, and the local backup/recovery flow around `backups/` and the `surreal-data` volume.
- Runtime systems affected: local Docker Compose, SurrealDB storage migration workflow, backend startup readiness, and the verified reachability of the local frontend/backend/database stack.
- Dependencies and tooling: temporary use of a SurrealDB 2.x CLI/container during local recovery, plus SurrealDB 3.x import/export verification.
- Frontend rendering strategy is unchanged: public pages remain ISR-oriented where already configured and dashboard pages remain CSR-oriented; this change only restores the data/infrastructure path that those pages depend on.
- Esperion Design System is unaffected because this change does not alter Nuxt UI styling, semantic color tokens, or page-level presentation.

## Goals

- Make the root local Docker workflow recoverable when a legacy SurrealDB volume blocks the v3 database container.
- Preserve local data when requested through an explicit, documented migration path that matches official SurrealDB guidance.
- Provide a fast reset path for disposable local data without hiding the data-loss tradeoff.
- Re-establish a verifiable 3-container local stack with working database, backend, and frontend startup checks.
- Make the local stack's readiness contract explicit enough that long backend cold builds are observable and are not misclassified as failed SurrealDB recovery.

## Non-Goals

- Production migration scheduling or production maintenance-window execution.
- Frontend feature changes, dashboard workflow changes, or Esperion Design System updates.
- Re-architecting backend database access beyond what is needed to recover the local stack.
- Broad backup product features already covered by the separate `backup-restore` capability.

## Success Metrics

- A developer with an old v1-era `surreal-data` volume can follow one documented workflow and recover to a healthy local v3 stack without improvisation.
- A developer who does not need old local data can reset the database volume intentionally and get the full 3-container stack running again in one verified flow.
- Recovery documentation clearly states when data is preserved, when it is discarded, and which verification commands confirm success.
- Post-recovery verification confirms `database`, `backend`, and `frontend` all reach their expected running/healthy state for the local Docker workflow, using health-aware checks rather than raw container start order.
