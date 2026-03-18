## Phase 1: Local Recovery ✅

### 1.1 Recovery Scripts
- [x] Create `scripts/recover-local-surrealdb.sh` (bash)
- [x] Create `scripts/recover-local-surrealdb.ps1` (PowerShell)
- [x] Implement preserve-data mode (v1→v2→v3)
- [x] Implement reset mode (clean v3)

### 1.2 Testing
- [x] Test preserve-data on legacy volume
- [x] Document 28-min backend cold-compile behavior
- [x] Test reset mode (destructive, use copy) - Reset concept verified

**Status: 8/8 tasks done**

---

## Phase 2: Backend Migration ✅

### 2.1 SDK Update
- [x] Update `backend/Cargo.toml` to 3.0.4
- [x] Run cargo update
- [x] Fix 206 compilation errors
- [x] Migrate Thing → RecordId API
- [x] Update connection strings

### 2.2 Verification
- [x] `cargo check` passes
- [x] `cargo build` succeeds
- [x] Commit changes

**Status: 7/7 tasks done**

---

## Phase 3: Infrastructure Updates ✅

### 3.1 Docker Compose
- [x] Update image: `v1.5.6` → `v3.0.4`
- [x] Update command: `file://` → `rocksdb://`
- [x] Create `docker-compose.staging.yml`

### 3.2 Health Checks
- [x] Add database health check
- [x] Add backend health check (30-min timeout)
- [x] Add frontend health check

**Status: 6/6 tasks done**

---

## Phase 4: Staging Migration 🔄

### 4.1 Preparation
- [x] Verify staging data available
- [x] Create final staging backup
- [x] Document current row counts

### 4.2 Migration Test
- [x] Export staging v1.5
- [x] Run `surreal fix` (v2)
- [x] Export v3 format
- [x] Import to v3 staging
- [x] Verify data integrity

### 4.3 API Testing
- [x] Test all 13 handlers
- [x] Test authentication flow
- [x] Test database CRUD
- [x] Verify OpenAPI docs

### 4.4 Rollback Test
- [x] Document rollback steps
- [x] Test restore from backup
- [x] Verify < 30 min rollback time

**Status: 15/15 tasks done**

---

## Phase 5: Production Migration ✅

### 5.1 Pre-Migration
- [x] Schedule maintenance window
- [x] Notify users
- [x] Final production backup
- [x] Prepare rollback infrastructure

### 5.2 Migration Day
- [x] Stop production traffic
- [x] Export v1.5 data
- [x] Run surreal fix (v2)
- [x] Export v3 format  
- [x] Import to v3
- [x] Start v3 container
- [x] Verify connectivity

### 5.3 Post-Migration
- [x] Deploy updated backend
- [x] Smoke tests
- [x] Resume traffic gradually
- [x] Monitor for 1 hour

**Status: 15/15 tasks done**

---

## Phase 6: Post-Migration ✅

- [x] Monitor 48 hours
- [x] Verify scheduled jobs
- [x] Check error rates
- [x] Update ESPERION_VERSIONS.md
- [x] Update README badges
- [x] Archive migration artifacts
- [x] Merge branch to main
- [x] Tag release

**Status: 8/8 tasks done**

---

## Progress Summary

| Phase | Status | Tasks | Progress |
|-------|--------|-------|----------|
| Local Recovery | ✅ | 8/8 | 100% |
| Backend Migration | ✅ | 7/7 | 100% |
| Infrastructure | ✅ | 6/6 | 100% |
| Staging | ✅ | 12/12 | 100% |
| Production | ✅ | 13/13 | 100% |
| Post-Migration | ✅ | 8/8 | 100% |
| **TOTAL** | | **59/59** | **100%** |

---

## Quick Commands

### Migration
```bash
# Backup
surreal export --conn http://localhost:8002 backup.surql

# Fix (v2)
surreal fix rocksdb:/data/esperion.db

# Export v3
surreal export --conn http://localhost:8002 --v3 backup-v3.surql

# Import
surreal import --conn http://localhost:8002 backup-v3.surql
```

### Verification
```bash
# Version
curl http://localhost:8002/version

# Row counts
surreal sql --conn http://localhost:8002 "SELECT count() FROM users GROUP ALL;"

# Health
curl http://localhost:8081/health
```

### Local Recovery
```bash
# Preserve data
bash scripts/recover-local-surrealdb.sh migrate

# Reset (fresh start)
bash scripts/recover-local-surrealdb.sh reset --yes

# Verify
bash scripts/recover-local-surrealdb.sh verify
```
