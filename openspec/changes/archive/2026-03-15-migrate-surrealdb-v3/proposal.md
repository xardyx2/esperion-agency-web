## Why

SurrealDB 1.5.0 is **2 major versions behind** the current 3.0.4 release, blocking access to critical security patches and performance improvements. Migration is mandatory before 1.x reaches end-of-life.

**The Problem:**
- Local development is broken: machines with legacy `surreal-data` volumes see `Expected: 3, Actual: 1` errors
- Backend cold-compile takes ~28 minutes, making health checks fail falsely
- No clear recovery path for developers

**The Solution:**
A unified migration that handles both production upgrade and local development recovery with minimal complexity.

---

## What Changes

### 1. Production Database Migration
```
v1.5.6 ──export──► v2.x (surreal fix) ──export──► v3.0.4
```

**Changes:**
- Docker image: `v1.5.6` → `v3.0.4`
- Storage: `file:/data/esperion.db` → `rocksdb:/data/esperion.db`
- Rust SDK: `1.5.0` → `3.0.4`

### 2. Local Recovery Tooling
```
Legacy Volume ──► Backup ──► Migrate/Reset ──► Working v3
```

**Tools:**
- `scripts/recover-local-surrealdb.sh` (preserve-data + reset modes)
- `scripts/recover-local-surrealdb.ps1` (Windows support)

### 3. Health-Aware Orchestration
- Docker health checks for all 3 services
- Cold-build-aware backend readiness
- Clear verification signals

---

## Capabilities

| Capability | Type | Description |
|------------|------|-------------|
| `surrealdb-v3` | NEW | Full v3.0.4 support with rocksdb backend |
| `surrealdb-local-recovery` | NEW | Local dev volume recovery tooling |
| `database-migration` | NEW | Production migration automation |
| `docker-infrastructure` | MODIFIED | Health checks + recovery integration |

---

## Impact

### Modified Files
| File | Change |
|------|--------|
| `docker-compose.yml` | v3.0.4 image, rocksdb command |
| `backend/Cargo.toml` | SDK 3.0.4 |
| `backend/src/**/*.rs` | RecordId migration (28 files) |
| `scripts/recover-*` | NEW recovery scripts |
| `README.md` | Recovery documentation |

### Migration Requirements
**Production:** Export → surreal fix → Export v3 → Import (2-4 hours)

**Local:** Backup → Migrate or Reset → Verify (15-45 min)

---

## Goals

1. ✅ Zero data loss migration
2. ✅ Fix broken local development
3. ✅ Clear recovery path for developers
4. ✅ Health-aware stack verification
5. ✅ Tested rollback procedure

## Non-Goals

1. ❌ Schema redesign
2. ❌ New features (GraphQL, etc)
3. ❌ Frontend changes
4. ❌ API contract changes
5. ❌ Build optimization (separate change)

---

## Success Metrics

- [ ] 100% data integrity post-migration
- [ ] All 13 API handlers working
- [ ] Local recovery works in < 45 min
- [ ] Staging test passed
- [ ] Rollback tested & documented

---

## Strategy

### Migration Approach: Direct v1→v3
**Why not staged rollback to v2?**
- SurrealDB doesn't support downgrade (v3→v2 impossible)
- v2 is only a temporary fix step, not a target
- Rollback = restore v1 backup (fast, tested, reliable)

### Local Recovery: Two Modes
```
┌─────────────────┐     ┌──────────────┐
│  Legacy Volume  │────►│   Backup     │
└─────────────────┘     └──────────────┘
                               │
           ┌───────────────────┴───────────────────┐
           │                                       │
           ▼                                       ▼
┌─────────────────────┐              ┌──────────────────┐
│  Preserve-Data      │              │  Reset           │
│  (v1→v2→v3)         │              │  (clean start)   │
│  ~30 min            │              │  ~5 min          │
└─────────────────────┘              └──────────────────┘
```

### Rollback Strategy
- **Before migration:** Full backup created
- **If fails:** Restore backup → Restart v1.5 container (< 30 min)
- **No intermediate steps:** Direct restore to last known good state

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Local Recovery | 1-2 days | Scripts, docs, testing |
| Staging Test | 2-3 days | Full migration test |
| Production | 1 day | Maintenance window |
| Validation | 2 days | Monitoring, verification |

**Total: 1 week**
