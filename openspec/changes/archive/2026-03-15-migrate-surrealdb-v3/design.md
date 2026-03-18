## Context

**Current State:**
- SurrealDB 1.5.6 with `file://` storage (deprecated)
- Rust SDK 1.5.0
- Local dev broken for legacy volumes (`Expected: 3, Actual: 1`)
- Backend cold-compile: ~28 min (causes false health check failures)

**Target State:**
- SurrealDB 3.0.4 with `rocksdb://` storage
- Rust SDK 3.0.4  
- Working local recovery tooling
- Health-aware orchestration

---

## Decisions

### Migration Strategy

**Decision 1: Direct v1→v3 Migration**
```
v1.5.6 ──► v2 (temp fix) ──► v3.0.4
         │                    ▲
         └── Not a target ────┘
```

**Why:**
- v2 is temporary step only (data format conversion)
- v2 can't run production (SDK incompatibility)
- No benefit staying at v2

**Rejected:** Staged rollback (v3→v2→v1)
- SurrealDB doesn't support downgrade
- Adds complexity without value
- Backup restore is faster and safer

---

### Rollback Strategy

**Decision 2: Backup-Only Rollback**

**Process:**
```
If migration fails:
  1. Stop v3 container
  2. Restore v1 backup  
  3. Start v1.5 container
  4. Done (< 30 min)
```

**Why:**
- Simple, tested, reliable
- No data transformation needed
- Fast recovery time

**Rejected:** Downgrade conversion
- Not supported by SurrealDB
- Risky and untested
- No tooling available

---

### Local Recovery

**Decision 3: Two Recovery Modes**

| Mode | Use Case | Duration | Data |
|------|----------|----------|------|
| **Preserve** | Keep local data | ~30 min | Migrated |
| **Reset** | Fresh start | ~5 min | Lost |

**Why explicit choice?**
- Prevents accidental data loss
- Clear expectations
- Faster path when data doesn't matter

---

### Health Checks

**Decision 4: Cold-Build-Aware Verification**

**Problem:** Backend takes 28 min to compile, health checks fail immediately

**Solution:**
```yaml
# docker-compose.yml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
    interval: 30s
    timeout: 10s
    retries: 60  # 30 min timeout
    start_period: 60s
```

**Why:** Distinguishes "building" from "broken"

---

## Migration Plan

### Phase 1: Local Recovery (Days 1-2)
```
✅ Create recovery scripts (bash + PowerShell)
✅ Test preserve-data flow
✅ Test reset flow
✅ Document recovery process
✅ Update README.md
```

### Phase 2: Staging Migration (Days 3-5)
```
□ Export staging v1.5 data
□ Run surreal fix (v2)
□ Export v3 format
□ Import to v3 staging
□ Test all 13 API handlers
□ Verify data integrity
□ Test rollback procedure
```

### Phase 3: Production Migration (Day 6)
**Maintenance Window: 2-4 hours**

```
Hour 0:  Final backup, stop traffic
Hour 1:  Export v1.5 → surreal fix → Export v3
Hour 2:  Import to v3, start container
Hour 3:  Smoke tests, gradual traffic
Hour 4:  Monitor, done
```

### Phase 4: Validation (Days 7-8)
```
□ Monitor error rates
□ Verify scheduled jobs
□ Check performance
□ Update documentation
□ Archive migration artifacts
```

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss | Low | Critical | Full backup, staging test |
| Extended downtime | Medium | High | 4-hour window, tested rollback |
| Backend compile timeout | Medium | Medium | 30-min health check budget |
| Local recovery fails | Low | Low | Reset fallback available |
| SDK incompatibility | Low | High | Tested on staging |

---

## Open Questions

1. **Staging data:** Do we have production-like data for testing?
2. **Maintenance window:** Weekend 02:00-06:00 OK?
3. **Backup storage:** 3x current DB size available?
4. **Team availability:** Who's on-call?

---

## Key Files

| File | Purpose |
|------|---------|
| `scripts/recover-local-surrealdb.sh` | Local recovery (Unix) |
| `scripts/recover-local-surrealdb.ps1` | Local recovery (Windows) |
| `docker-compose.yml` | Production stack |
| `docker-compose.staging.yml` | Staging stack |
| `backend/src/db/mod.rs` | Connection config |
