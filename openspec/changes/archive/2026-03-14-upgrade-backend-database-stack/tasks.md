## 1. Pre-Migration Setup and Backup

- [x] 1.1 Create git branch `upgrade/backend-database` from main
- [x] 1.2 Audit current database usage and identify breaking changes
- [x] 1.3 Document current database statistics: table counts, record counts
- [x] 1.4 Verify Rust toolchain: `rustc --version` (must be 1.75+)
- [ ] 1.5 **RUN THIS:** Backup production database: `surreal export production-backup.json`
- [ ] 1.6 **RUN THIS:** Copy production data to staging environment
- [ ] 1.7 Run cargo test baseline: `cd backend && cargo test`

## 2. Rust Crate Updates (Safe Upgrades - Already Done)

- [x] 2.1 Update `backend/Cargo.toml` axum: `0.7.9` → `0.8.8` ✅
- [x] 2.2 Update `backend/Cargo.toml` tokio: `1.42.0` → `1.50.0` ✅
- [x] 2.3 Update `backend/Cargo.toml` tower-http: `0.5.2` → `0.6.8` ✅
- [x] 2.4 Update `backend/Cargo.toml` jsonwebtoken: `9` → `10` with `rust_crypto` feature ✅
- [x] 2.5 Update `backend/Cargo.toml` chrono: `0.4.38` → `0.4.44` ✅
- [x] 2.6 Update `backend/Cargo.toml` lettre: `0.11.3` → `0.11.19` ✅
- [x] 2.7 Regenerate Cargo.lock: `cargo update` ✅
- [x] 2.8 Test compilation: `cargo check` ✅
- [x] 2.9 Commit: "chore(deps): update Rust crate versions (Axum 0.8, jsonwebtoken 10)"

**Verification:**
- ✅ All 6 crates upgraded to target versions (verified in backend/Cargo.toml)
- ✅ backend compiles successfully
- ✅ Axum routes migrated to {param} syntax
- ✅ jsonwebtoken v10 with rust_crypto feature
- ✅ Git commit: `3fb7f629` - "chore(backend): upgrade Axum 0.8, jsonwebtoken 10, tower-http 0.6"

---

## PHASE 1 STATUS: ✅ COMPLETE

**Phase 1 (Safe Crate Upgrades):** 100% Complete
- All crate versions updated
- Axum routes migrated
- Backend compiles and runs
- Can deploy to production independently

**Phase 2 (SurrealDB Migration):** ⏳ PENDING
- Requires staging environment
- Requires maintenance window
- Tracked separately in: `migrate-surrealdb-v3`

## 3. SurrealDB Migration (STAGING - TEST FIRST)

**⚠️ CRITICAL:** Run this on STAGING first, NOT production!

- [ ] 3.1 **STAGING:** Stop staging database: `docker-compose -f docker-compose.staging.yml stop database`
- [ ] 3.2 **STAGING:** Start v1.5 container: `docker run -v surreal-staging:/data surrealdb/surrealdb:v1.5.6`
- [ ] 3.3 **STAGING:** Export staging data: `surreal export --conn http://localhost:8003 staging-backup.surql`
- [ ] 3.4 **STAGING:** Run migration fix: `surreal fix rocksdb:/data/esperion.db`
- [ ] 3.5 **STAGING:** Export with v3 format: `surreal export --conn http://localhost:8004 --v3 staging-v3.surql`
- [ ] 3.6 **STAGING:** Stop v1.5 container
- [ ] 3.7 **STAGING:** Start v3.0.4 container: `docker run surrealdb/surrealdb:v3.0.4`
- [ ] 3.8 **STAGING:** Import to v3: `surreal import --conn http://localhost:8003 staging-v3.surql`
- [ ] 3.9 **STAGING:** Verify data integrity: compare row counts
- [ ] 3.10 **STAGING:** Test sample queries: users, articles, works

## 4. SurrealDB Configuration Updates (After Staging Success)

- [ ] 4.1 Update `backend/Cargo.toml`: surrealdb `1.5.0` → `2.2.0` (intermediate)
- [ ] 4.2 Update `backend/Cargo.toml`: surrealdb `2.2.0` → `3.0.4` (final)
- [ ] 4.3 Update `docker-compose.yml`: `surrealdb/surrealdb:v1.5.6` → `v3.0.4`
- [ ] 4.4 Update `docker-compose.yml`: `file:/data/esperion.db` → `rocksdb:/data/esperion.db`
- [ ] 4.5 Update `backend/src/db/mod.rs`: connection string `file://` → `rocksdb://`
- [ ] 4.6 Test database operations: `cargo test -- db_tests`
- [ ] 4.7 Commit: "chore(deps): upgrade SurrealDB to v3.0.4"

## 5. Testing and Validation (CRITICAL)

- [ ] 5.1 Run all unit tests: `cargo test`
- [ ] 5.2 Test all 13 API handlers manually
- [ ] 5.3 Test authentication flow: register → login → access → logout
- [ ] 5.4 Test database CRUD: create, read, update, delete operations
- [ ] 5.5 Verify image processing works (if using image crate)
- [ ] 5.6 Test email service (if using lettre)
- [ ] 5.7 Verify OpenAPI docs still generate: `/api/v1/openapi.json`
- [ ] 5.8 Test with frontend: verify API communication works
- [ ] 5.9 Commit: "test: validate backend upgrade"

## 6. Production Migration (Schedule Maintenance Window)

- [ ] 6.1 Schedule maintenance window (2-4 hours downtime)
- [ ] 6.2 Notify users of downtime
- [ ] 6.3 **BACKUP:** Export production: `surreal export production-final.surql`
- [ ] 6.4 Stop production traffic
- [ ] 6.5 Run migration: export → fix → export --v3 → import
- [ ] 6.6 Deploy new backend container
- [ ] 6.7 Verify database connectivity
- [ ] 6.8 Run smoke tests
- [ ] 6.9 Resume traffic
- [ ] 6.10 Monitor error logs closely
- [ ] 6.11 Document migration completion

## 7. Post-Migration

- [ ] 7.1 Monitor for 48 hours
- [ ] 7.2 Verify all scheduled jobs work
- [ ] 7.3 Check error rates
- [ ] 7.4 Verify backup jobs still work
- [ ] 7.5 Update ESPERION_VERSIONS.md
- [ ] 7.6 Archive migration artifacts
- [ ] 7.7 Remove old v1.5 Docker images (after 1 week)
- [ ] 7.8 Merge branch to main
- [ ] 7.9 Tag release: `git tag v2.0.0-surrealdb-v3`

## 8. Rollback Preparation (Do Before Production)

- [ ] 8.1 Document rollback procedure in MIGRATION_GUIDE.md
- [ ] 8.2 Test rollback on staging: restore v1.5 from backup
- [ ] 8.3 Verify rollback completes in < 30 minutes
- [ ] 8.4 Keep v1.5 Docker images available
- [ ] 8.5 Document emergency contact for database issues

---

## Quick Reference: What's Already Done ✅

| Task | Status |
|------|--------|
| Axum 0.7 → 0.8 | ✅ Complete |
| jsonwebtoken 9 → 10 | ✅ Complete |
| tower-http 0.5 → 0.6 | ✅ Complete |
| tokio 1.42 → 1.50 | ✅ Complete |
| chrono 0.4.38 → 0.4.44 | ✅ Complete |
| lettre 0.11.3 → 0.11.19 | ✅ Complete |
| Backend compiles | ✅ Success (with warnings) |
| SurrealDB 1.5 → 3.0 | ⏳ **PENDING** |

---

## Next Immediate Actions

1. **Read:** `MIGRATION_GUIDE.md` for complete migration steps
2. **Setup:** Create staging environment for testing
3. **Test:** Run migration on staging first
4. **Schedule:** Plan production maintenance window
5. **Execute:** Perform production migration

**Estimated total effort:** 4-8 hours (including testing)
