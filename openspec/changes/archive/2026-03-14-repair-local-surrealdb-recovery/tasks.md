## 1. Recovery Workflow Groundwork

- [x] 1.1 Audit `docker-compose.yml`, `scripts/migrate-production.sh`, `backups/`, and relevant env templates to lock the exact local volume name, service names, namespace/database defaults, and recovery assumptions. Acceptance: the local recovery workflow has one verified set of constants for the root 3-container stack.
- [x] 1.2 Choose and pin the temporary SurrealDB helper versions needed for recovery (2.x for `surreal fix`, 3.0.3+ tooling for v3-compatible export/import) and record them in the local recovery workflow. Acceptance: the recovery path no longer depends on floating `latest` tags or undocumented version choices.
- [x] 1.3 Define the timestamped backup and intermediate artifact layout under `backups/` for local recovery. Acceptance: preserve-data recovery has a consistent place for source snapshots, working copies, and v3-compatible export artifacts.

## 2. Local Recovery Tooling

- [x] 2.1 Add a dedicated local recovery entry point under `scripts/` for the root Docker stack (and a Windows-friendly wrapper if this change decides to ship one). Acceptance: the entry point clearly supports preserve-data and reset modes without reusing production-only assumptions.
- [x] 2.2 Implement the preserve-data flow in the local recovery tooling: snapshot the current `surreal-data` volume, prepare a working copy, run a 2.x `surreal fix` step, start a temporary 2.x instance, generate a v3-compatible export, and import into a clean v3 target volume. Acceptance: failure at any stage preserves the original backup and reports the failing stage.
- [x] 2.3 Implement the disposable-data reset flow in the local recovery tooling so `surreal-data` is only recreated after an explicit reset choice. Acceptance: the flow warns about data loss and starts the root v3 database service on a clean volume afterward.
- [x] 2.4 Add clear operator output for backup location, current stage, next verification steps, and rollback/reset guidance. Acceptance: a developer can tell from the tooling output what happened and what to do next without opening the script.

## 3. Local Docker Documentation Alignment

- [x] 3.1 Update `README.md` and any Docker-specific local workflow docs to explain the `Expected: 3, Actual: 1` failure, when to choose migrate vs reset, and what each choice means for local data retention. Acceptance: the recovery decision tree is documented in one clear local-Docker path.
- [x] 3.2 Document the post-recovery checks for the full stack: `docker compose ps`, database startup/version confirmation, backend `/health`, and frontend HTTP response. Acceptance: the docs specify expected success signals for `database`, `backend`, and `frontend`.
- [x] 3.3 Fix or remove local troubleshooting text that still implies a legacy volume can be mounted directly into the v3 container. Acceptance: local Docker docs and comments match the supported staged recovery path.

## 4. Validation And Closure

- [x] 4.1 Test the preserve-data workflow against a copied legacy dataset from `backups/esperion.db/` or the current failing local volume. Acceptance: the root `database` service starts on v3 without the storage-version mismatch after the migration path completes.
- [ ] 4.2 Test the reset workflow from the same local stack. Acceptance: recreating `surreal-data` yields a bootable v3 database service in the root Compose stack. Safe test approach: use a dedicated test volume or copied legacy dataset instead of the active recovered volume.
- [x] 4.3 After each recovery path, verify the full local stack by checking database runtime, backend health, frontend response, and recent logs for blocking errors. Acceptance: all three local services are confirmed usable again.
- [x] 4.4 Record any remaining follow-ups discovered during validation (for example health-check additions or wrapper gaps) in the change notes/docs before implementation closes. Acceptance: unresolved work is explicit rather than left implicit.

## Validation Notes

- The preserve-data recovery flow successfully migrated the live local volume and restored the root `database` service on SurrealDB `3.0.4`.
- The backend container spent about 28 minutes in a cold compile before `/health` became ready; this was a readiness delay, not a second database-migration failure.
- The reset flow was implemented but not executed against the active root volume in this session because it is intentionally destructive to current local database contents.
- Recreating the Docker volume manually during migration produced a non-blocking Docker Compose warning about the volume not being created by Compose labels; the recovered v3 database still started successfully.
- The frontend stayed healthy during the database recovery work and continued returning the expected HTTP redirect response.

## 5. Readiness And Resilience Hardening

- [ ] 5.1 Add Docker Compose health checks for the local `database`, `backend`, and `frontend` services, and gate backend startup on database readiness instead of `service_started`. Acceptance: the local stack exposes explicit readiness signals during recovery and normal startup, with a cold-build-aware health budget for the backend.
- [ ] 5.2 Update the recovery verification flow so it checks database readiness, backend `/health`, and frontend reachability with a cold-build-aware timeout budget and clearer stage reporting. Acceptance: verification distinguishes database recovery success from downstream startup delay and reports which stage is still pending or blocked.
- [ ] 5.3 Update local Docker troubleshooting docs to explain the observed backend cold-build window, current memory-pressure behavior, and how to interpret non-blocking warnings versus true failures. Acceptance: operators can follow one runbook without misreading delayed readiness as migration failure, and the docs include concrete log patterns for compile-in-progress, OOM risk, and actual recovery failure.
- [ ] 5.4 Record a separate follow-up change for backend Docker build-performance optimization so compile-time and memory-tuning work does not stay hidden inside the SurrealDB recovery backlog. Acceptance: readiness hardening and build optimization have separate scopes, and this change references the follow-up explicitly.
