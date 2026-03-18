# SurrealDB 1.5 → 3.0 Migration Guide

> **CRITICAL:** This is a MAJOR version migration requiring database export/import. Read entirely before proceeding.

## Overview

| Aspect | Current | Target |
|--------|---------|--------|
| SurrealDB Version | 1.5.6 | 3.0.4 |
| Storage Engine | `file://` | `rocksdb://` |
| Rust Client | 1.5.0 | 2.6.3 (intermediate) → 3.0.4 |
| Breaking Changes | - | 40+ function renames, SQL syntax changes |

## Pre-Migration Checklist

### 1. Database Backup (CRITICAL)

```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Export current database
surreal export \
  --conn http://localhost:8002 \
  --user root \
  --pass root \
  --ns esperion \
  --db esperion_db \
  backups/$(date +%Y%m%d)/pre-migration-backup.surql

# Verify backup file size
ls -lh backups/$(date +%Y%m%d)/pre-migration-backup.surql
```

### 2. Document Current State

```bash
# Get table statistics
surreal sql --conn http://localhost:8002 --user root --pass root --ns esperion --db esperion_db \
  "INFO FOR DB;"

# Count records per table
surreal sql --conn http://localhost:8002 --user root --pass root --ns esperion --db esperion_db \
  "SELECT count() FROM users GROUP ALL;"
```

## Migration Steps

### Phase 1: Staging Environment Setup

```bash
# 1. Create staging docker-compose
# Copy docker-compose.yml to docker-compose.staging.yml
# Change volume name: surreal-data → surreal-staging

# 2. Start staging environment
docker-compose -f docker-compose.staging.yml up -d database

# 3. Import production backup to staging
surreal import \
  --conn http://localhost:8003 \
  --user root \
  --pass root \
  --ns esperion \
  --db esperion_db \
  backups/$(date +%Y%m%d)/pre-migration-backup.surql
```

### Phase 2: Database Migration Tool

```bash
# 1. Stop staging database
docker-compose -f docker-compose.staging.yml stop database

# 2. Run SurrealDB migration fix
# This converts from 1.x format to 2.x format
docker run --rm \
  -v surreal-staging:/data \
  surrealdb/surrealdb:v2.0.4 \
  fix rocksdb:/data/esperion.db

# 3. Start v2.0.4 container temporarily
docker run -d \
  --name surrealdb-v2-temp \
  -v surreal-staging:/data \
  -p 8004:8000 \
  surrealdb/surrealdb:v2.0.4 \
  start --user root --pass root rocksdb:/data/esperion.db

# 4. Export with v3 format
surreal export \
  --conn http://localhost:8004 \
  --user root \
  --pass root \
  --ns esperion \
  --db esperion_db \
  --v3 \
  backups/$(date +%Y%m%d)/staging-v3-export.surql

# 5. Stop v2 container
docker stop surrealdb-v2-temp && docker rm surrealdb-v2-temp
```

### Phase 3: Import to v3.0.4

```bash
# 1. Remove old data (v2 format not compatible with v3)
docker volume rm esperion-staging_surreal-staging

# 2. Start v3.0.4 container
docker run -d \
  --name surrealdb-v3 \
  -v surreal-staging:/data \
  -p 8003:8000 \
  surrealdb/surrealdb:v3.0.4 \
  start --user root --pass root rocksdb:/data/esperion.db

# 3. Import v3 format data
surreal import \
  --conn http://localhost:8003 \
  --user root \
  --pass root \
  --ns esperion \
  --db esperion_db \
  backups/$(date +%Y%m%d)/staging-v3-export.surql

# 4. Verify data integrity
surreal sql --conn http://localhost:8003 --user root --pass root --ns esperion --db esperion_db \
  "SELECT count() FROM users GROUP ALL;"
```

## SQL Schema Changes Required

### File 1: `backend/src/db/migrations/001_initial_schema.sql`

**Current (v1.5 compatible):**
```sql
DEFINE FIELD email ON users TYPE string ASSERT string::is_email($value);
```

**New (v3 compatible):**
```sql
DEFINE FIELD email ON users TYPE string ASSERT string::is_email($value);
-- Note: string::is_email is already snake_case, no change needed!
```

### File 2: `backend/src/db/schema.rs`

**Changes needed:**
```rust
// Line 18 - Already correct (snake_case)
DEFINE FIELD email ON users TYPE string ASSERT string::is_email($value);
```

**Note:** Our schema already uses `string::is_email` which is correct for v3! The migration is mainly about:
1. Storage engine change (`file://` → `rocksdb://`)
2. Database export/import process

## Rust Code Changes

### Cargo.toml Updates

```toml
[dependencies]
# Database
surrealdb = "=2.2.0"  # Step 1: Upgrade to 2.x first
# Then after migration: surrealdb = "=3.0.4"
```

### Connection String Update

**File:** `backend/src/db/mod.rs` (or wherever connection is established)

```rust
// OLD (v1.5)
let db = Surreal::new::<File>("file:/data/esperion.db").await?;

// NEW (v2/v3)
let db = Surreal::new::<RocksDb>("rocksdb:/data/esperion.db").await?;
```

## Docker Compose Changes

### docker-compose.yml

```yaml
# OLD
database:
  image: surrealdb/surrealdb:v1.5.6
  command: start --log debug --user root --pass root --bind 0.0.0.0:8000 file:/data/esperion.db

# NEW
database:
  image: surrealdb/surrealdb:v3.0.4
  command: start --log debug --user root --pass root --bind 0.0.0.0:8000 rocksdb:/data/esperion.db
```

## Testing Checklist

### Database Operations
- [ ] Users: CREATE, READ, UPDATE, DELETE
- [ ] Articles: CREATE, READ, UPDATE, DELETE
- [ ] Works: CREATE, READ, UPDATE, DELETE
- [ ] Services: CREATE, READ, UPDATE, DELETE
- [ ] Clients: CREATE, READ, UPDATE, DELETE
- [ ] Contact submissions: CREATE, READ
- [ ] Sessions: CREATE, READ, DELETE
- [ ] Token blacklist: CREATE, READ
- [ ] Media library: CREATE, READ, UPDATE, DELETE
- [ ] Activity logs: CREATE, READ
- [ ] Translation cache: CREATE, READ, UPDATE
- [ ] Analytics events: CREATE, READ

### Authentication Flow
- [ ] User registration
- [ ] User login
- [ ] Token refresh
- [ ] User logout
- [ ] Session management
- [ ] Password hashing (Argon2)

### API Endpoints
- [ ] All 13 handler modules respond correctly
- [ ] OpenAPI docs generate: `/api/v1/openapi.json`
- [ ] Health check: `/health`

## Rollback Procedure

If migration fails:

```bash
# 1. Stop new containers
docker-compose down

# 2. Restore volume from backup
docker volume rm esperion_surreal-data
docker volume create esperion_surreal-data

# 3. Start v1.5.6 with backup
docker run --rm \
  -v esperion_surreal-data:/data \
  -v $(pwd)/backups/$(date +%Y%m%d):/backup \
  surrealdb/surrealdb:v1.5.6 \
  start --user root --pass root file:/data/esperion.db

# 4. Import backup
surreal import \
  --conn http://localhost:8002 \
  --user root --pass root \
  --ns esperion \
  --db esperion_db \
  backups/$(date +%Y%m%d)/pre-migration-backup.surql

# 5. Revert docker-compose.yml to v1.5.6
docker-compose up -d
```

## Common Issues & Solutions

### Issue 1: "Cannot open database file"
**Cause:** v3 cannot read v1.5 file format directly
**Solution:** Must use migration tool: `surreal fix` → export → import

### Issue 2: "rocksdb path not found"
**Cause:** rocksdb requires specific path format
**Solution:** Use `rocksdb:/data/esperion.db` not `file:/data/esperion.db`

### Issue 3: Data loss after migration
**Cause:** Import failed silently
**Solution:** Always verify row counts after import

### Issue 4: Authentication errors
**Cause:** v3 has auth enabled by default
**Solution:** Use `--unauthenticated` flag for development or provide credentials

## Timeline Estimate

| Phase | Duration | Downtime Required |
|-------|----------|-------------------|
| Backup | 10-30 min | No |
| Staging migration | 1-2 hours | No |
| Production migration | 2-4 hours | Yes |
| Testing | 1-2 hours | No |
| **Total** | **4-8 hours** | **2-4 hours** |

## Production Migration Schedule

1. **T-24h:** Notify users of maintenance window
2. **T-2h:** Final backup
3. **T-0:** Stop production traffic
4. **T+10min:** Start migration
5. **T+2h:** Migration complete, start testing
6. **T+3h:** Resume traffic (if tests pass)
7. **T+24h:** Monitor closely

## Sign-off

- [ ] Database backup verified
- [ ] Staging migration successful
- [ ] All tests pass on staging
- [ ] Rollback procedure tested
- [ ] Maintenance window scheduled
- [ ] Team notified
- [ ] Production migration complete
- [ ] Post-migration monitoring passed

---

**Last Updated:** 2026-03-14  
**Migration Lead:** _______________  
**Approval:** _______________
