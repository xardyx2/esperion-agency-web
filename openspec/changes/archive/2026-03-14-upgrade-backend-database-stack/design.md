## Context

The Esperion backend currently operates on SurrealDB 1.5.0, which is two major versions behind the current stable release. The database uses strict schema definitions with DEFINE TABLE and DEFINE FIELD statements, and maintains data persistence via file-based storage. Unlike typical package upgrades, SurrealDB 1.x to 3.x requires a full data migration using the surreal CLI tools—an export/fix/import workflow—rather than an in-place upgrade. This complexity, combined with breaking SQL syntax changes and the critical nature of production data, necessitates a carefully orchestrated migration plan with comprehensive backup and rollback procedures.

## Goals / Non-Goals

**Goals:**
1. Migrate SurrealDB from 1.5.0 to 3.0.4 with zero data loss
2. Update all SQL queries to v3 compatible syntax (UPSERT, new function names)
3. Upgrade Axum to 0.8 with new route syntax
4. Migrate jsonwebtoken to v10 with crypto backend selection
5. Maintain full API backward compatibility

**Non-Goals:**
1. Database schema redesign or new tables
2. New API endpoints or features
3. Frontend changes
4. Authentication flow changes (JWT behavior stays same)
5. Performance optimization (focus is compatibility)

## Decisions

### Decision: Use Export/Import Migration (Not In-Place)
**Rationale:** SurrealDB 1.x to 3.x cannot be upgraded in-place. The export/fix/import workflow is the only officially supported migration path and ensures data integrity by creating intermediate backups at each step.

### Decision: Migrate Database Before Axum
**Rationale:** Database changes (SQL syntax, function names) are independent of Axum route changes. Upgrading DB first isolates migration complexity from API routing changes, allowing focused testing of each component.

### Decision: Use rocksdb:// Storage Backend
**Rationale:** SurrealDB 3.x deprecates file:// storage in favor of rocksdb:// (stable, proven) or surrealkv:// (newer). RocksDB provides the stability needed for production while maintaining compatibility with migration tooling.

### Decision: Upgrade Rust Toolchain First
**Rationale:** jsonwebtoken v10 requires Rust 1.85+. Updating the toolchain first ensures all crates compile with the new compiler, avoiding mid-migration compilation failures.

### Decision: Test Migration on Staging Before Production
**Rationale:** Database migration has irreversible aspects. Testing the complete export/fix/import cycle on a staging environment with production-like data validates the process and exposes edge cases before touching production data.

### Decision: Maintain Dual-Version Docker Images
**Rationale:** Keeping both v1.5.6 and v3.0.4 images available enables rapid rollback if migration fails. Docker volume snapshots provide additional safety net.

## Risks / Trade-offs

**[Data loss during migration]** → Full database export before migration, maintain v1.5 backup volume, test restore procedure

**[SQL queries break after syntax changes]** → Audit all SQL files for UPDATE→UPSERT, function renames; test each handler individually

**[Axum route syntax causes API failures]** → Update all routes atomically, run comprehensive API test suite before deployment

**[Authentication breaks with jsonwebtoken v10]** → Test auth flow separately on staging, verify token generation/validation, test all protected endpoints

**[Migration tool fails mid-process]** → Keep v1.5 Docker volume untouched, document rollback procedure, practice rollback on staging

**[Performance degradation after upgrade]** → Benchmark key queries before/after, monitor query execution times, have rollback plan ready

**[Docker image compatibility issues]** → Use explicit version tags (v3.0.4, not latest), clear all caches with --no-cache

**[Extended downtime during migration]** → Calculate data size for export/import timing, plan maintenance window, communicate downtime to users

## Migration Plan

### Phase 0: Pre-Migration Setup
1. Create dedicated migration branch: `git checkout -b upgrade/backend-database`
2. Update Rust toolchain: `rustup update` (ensure 1.85+)
3. Pull production database backup for staging testing
4. Set up staging environment with production data

### Phase 1: Rust Toolchain & Crate Updates
1. Verify Rust version: `rustc --version` (must be 1.85+)
2. Update `backend/Cargo.toml` with new crate versions
3. Update `backend/Cargo.lock`: `cargo update`
4. Test compilation: `cargo check` (expect errors from Axum routes)
5. Commit: "chore(deps): update Rust crate versions"

### Phase 2: SurrealDB Migration (Staging)
1. Export v1.5 data: `surreal export backup-v15.json`
2. Run migration fix: `surreal fix rocksdb:/data/esperion.db`
3. Export v3 format: `surreal export --v3 backup-v3.json`
4. Deploy v3.0.4 container
5. Import to v3: `surreal import backup-v3.json`
6. Verify data integrity: row counts, sample records

### Phase 3: SQL Syntax Updates
1. Update all `UPDATE` → `UPSERT` where create-or-update needed
2. Update function names: `endsWith` → `ends_with`, etc.
3. Remove `<future>` usage, replace with computed fields if needed
4. Update connection strings: `file://` → `rocksdb://`
5. Test queries: `cargo test`
6. Commit: "fix(db): update SQL for SurrealDB v3"

### Phase 4: Axum Route Migration
1. Update route syntax: `:id` → `{id}`, `*path` → `{*path}`
2. Remove `async_trait` macro where not needed
3. Fix `Option<Extractor>` if affected
4. Test compilation: `cargo build`
5. Run API tests: `cargo test`
6. Commit: "fix(routes): migrate Axum to 0.8 syntax"

### Phase 5: jsonwebtoken Migration
1. Add crypto backend feature: `features = ["aws_lc_rs"]`
2. Test authentication: register, login, refresh, logout
3. Verify token validation
4. Commit: "fix(auth): migrate jsonwebtoken to v10"

### Phase 6: Docker & Integration
1. Update `docker-compose.yml`: SurrealDB image v3.0.4
2. Update volume paths if needed
3. Test full stack: `docker-compose up --build`
4. Run integration tests
5. Commit: "chore(docker): update SurrealDB to v3.0.4"

### Phase 7: Production Migration
1. Schedule maintenance window
2. Backup production: `surreal export production-backup.json`
3. Execute migration: export → fix → export --v3 → import
4. Deploy new backend container
5. Run smoke tests
6. Monitor error logs

### Rollback Strategy
**If migration fails at any point:**
```bash
# Stop v3 containers
docker-compose stop backend database

# Restore v1.5 database
docker run -v surreal-data-v15:/data surrealdb/surrealdb:v1.5.6 start file:/data/esperion.db

# Revert backend code
git checkout main -- backend/

# Restart with v1.5
docker-compose up -d
```

## Open Questions

1. What is the current production database size? (affects migration time)
2. Are there any stored `<future>` queries that need manual conversion?
3. Does the application use any deprecated functions beyond the common 40+?
4. What is the acceptable maintenance window duration?
5. Is there a staging environment with production-like data for testing?
