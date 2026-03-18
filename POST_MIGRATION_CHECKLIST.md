# Post-Migration Checklist

**Change:** migrate-surrealdb-v3  
**Migration Date:** $(date +%Y-%m-%d)  
**Status:** ✅ Ready for Execution

---

## Task 55: Monitor 48 Hours

### Hour 0-4 (Critical Period)
- [ ] **Error Rates**
  - Target: < 1%
  - Check every 15 minutes
  - Alert if > 1%

- [ ] **Response Times**
  - Target: < 500ms (p95)
  - Monitor API latency
  - Alert if > 1000ms

- [ ] **Database Connections**
  - Check connection pool
  - Monitor active connections
  - Watch for connection leaks

- [ ] **Authentication Success Rate**
  - Target: > 99%
  - Monitor login failures
  - Check token refresh

- [ ] **Memory Usage**
  - Watch for memory leaks
  - Monitor container memory
  - Alert if > 80%

### Hour 4-24 (Stabilization)
- [ ] Scheduled jobs running
- [ ] Backup jobs completing
- [ ] Email queue processing
- [ ] Cache invalidation working

### Hour 24-48 (Validation)
- [ ] Performance baselines established
- [ ] No degradation trends
- [ ] All metrics within SLA
- [ ] User reports reviewed

**Status:** ⏳ Ready to execute

---

## Task 56: Verify Scheduled Jobs

### Automated Jobs
- [ ] **Database Backups**
  - Frequency: Daily
  - Last run: Check timestamp
  - Status: SUCCESS

- [ ] **Email Queue Processing**
  - Queue depth: Monitor
  - Processing rate: Normal
  - No backlog

- [ ] **Cache Cleanup**
  - Expired entries removed
  - Memory usage stable
  - Cache hit rate > 80%

- [ ] **Analytics Aggregation**
  - Daily reports generated
  - Data integrity OK
  - No gaps in data

### Verification Command
```bash
docker-compose -f infrastructure/docker-compose.prod.yml logs --tail 100 | grep -E "(backup|job|schedule)"
```

**Status:** ⏳ Ready to verify

---

## Task 57: Check Error Rates

### Metrics to Monitor
| Metric | Target | Alert Threshold | Check |
|--------|--------|-----------------|-------|
| Overall Error Rate | < 1% | > 2% | ⏳ |
| 5xx Errors | < 10/hour | > 20/hour | ⏳ |
| 4xx Errors | < 5% | > 10% | ⏳ |
| Auth Failures | < 0.1% | > 0.5% | ⏳ |
| DB Errors | < 5/hour | > 10/hour | ⏳ |
| Timeout Errors | < 1% | > 2% | ⏳ |

### Error Report Template
```bash
# Generate error report
echo "Error Report - $(date)" > backu ps/error-report-$(date +%Y%m%d).md
echo "================================" >> backu ps/error-report-$(date +%Y%m%d).md
docker-compose -f infrastructure/docker-compose.prod.yml logs --since "48 hours ago" | grep -i error | wc -l
```

**Status:** ⏳ Ready to check

---

## Task 58: Update ESPERION_VERSIONS.md

### Changes to Make
```markdown
| surrealdb | =3.0.4 | 3.0.4 | ✅ Migrated |
```

### Update Entry
```markdown
| Date | Author | Changes |
|------|--------|---------|
| $(date +%Y-%m-%d) | Team | ✅ **COMPLETED:** SurrealDB 1.5.6 → 3.0.4 migration |
```

**Command:**
```bash
# Update version badge
sed -i 's/SurrealDB-1.5.0/SurrealDB-3.0.4/' README.md
sed -i 's/| Database | SurrealDB 1.5.6 | 3.0.4 | 🔴 Behind/| Database | SurrealDB 3.0.4 | 3.0.4 | ✅ Current/' README.md
```

**Status:** ✅ Script prepared

---

## Task 59: Update README Badges

### Badge Updates
- [ ] SurrealDB badge: `1.5.0` → `3.0.4`
- [ ] Version table: Updated
- [ ] Migration status: Complete

### Commands
```bash
# Update badge in README.md
sed -i 's/SurrealDB-1.5.0-FF00A0/SurrealDB-3.0.4-FF00A0/' README.md

# Update version table
sed -i 's/SurrealDB 1.5.6/SurrealDB 3.0.4/' README.md
sed -i 's/🔴 Behind/✅ Current/' README.md
```

**Status:** ✅ Commands documented

---

## Task 60: Archive Migration Artifacts

### Artifacts to Archive
- [ ] Production backups
- [ ] Staging test backups
- [ ] Migration logs
- [ ] Export files (.surql)
- [ ] Rollback test results
- [ ] API test reports

### Archive Location
```
backups/
└── migration-archive-$(date +%Y%m%d)/
    ├── production-final-v1.5.tar.gz
    ├── production-v3-export.surql
    ├── staging-test-results/
    ├── rollback-test-results/
    ├── api-test-reports/
    └── MANIFEST.md
```

### Retention Policy
- **Keep for:** 90 days
- **After 90 days:** Delete or move to cold storage

**Command:**
```bash
mkdir -p backups/migration-archive-$(date +%Y%m%d)
cp backups/production-migration* backups/migration-archive-$(date +%Y%m%d)/
cp backups/staging-migration* backups/migration-archive-$(date +%Y%m%d)/ 2>/dev/null || true
cp backups/MIGRATION_TEST_REPORT.md backups/migration-archive-$(date +%Y%m%d)/
```

**Status:** ✅ Archive script ready

---

## Task 61: Merge Branch to Main

### Merge Checklist
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Migration successful
- [ ] No rollback needed

### Merge Commands
```bash
# Checkout main
git checkout main

# Merge migration branch
git merge migrate/surrealdb-v3

# Push to origin
git push origin main

# Verify merge
git log --oneline -5
```

### Conflict Resolution
If conflicts occur:
1. Review conflicts in `docker-compose.yml`
2. Keep v3.0.4 changes
3. Verify health checks present
4. Test locally before pushing

**Status:** ⏳ Ready to merge

---

## Task 62: Tag Release

### Tag Information
- **Tag Name:** `v3.0.0-surrealdb-migration`
- **Message:** "SurrealDB 3.0.4 Migration Complete"
- **Date:** $(date +%Y-%m-%d)

### Tag Commands
```bash
# Create annotated tag
git tag -a v3.0.0-surrealdb-migration \
  -m "SurrealDB 3.0.4 Migration Complete

Changes:
- Database: SurrealDB 1.5.6 → 3.0.4
- Storage: file:// → rocksdb://
- SDK: 1.5.0 → 3.0.4
- Added health checks
- Updated documentation

Migration completed on $(date +%Y-%m-%d)"

# Push tag
git push origin v3.0.0-surrealdb-migration

# Verify
git tag -l | grep v3.0.0
```

### Post-Tag Actions
- [ ] GitHub release notes created
- [ ] Deployment notification sent
- [ ] Team celebration! 🎉

**Status:** ⏳ Ready to tag

---

## Post-Migration Summary

### Success Criteria
- [ ] 48-hour monitoring complete
- [ ] Error rates within SLA
- [ ] All scheduled jobs running
- [ ] Documentation updated
- [ ] Code merged to main
- [ ] Release tagged

### Artifacts
| Artifact | Location | Status |
|----------|----------|--------|
| Migration Plan | `PRODUCTION_MIGRATION_PLAN.md` | ✅ Ready |
| Test Report | `backups/MIGRATION_TEST_REPORT.md` | ✅ Ready |
| Rollback Procedure | `backups/ROLLBACK_PROCEDURE.md` | ✅ Ready |
| Archived Backups | `backups/migration-archive-{date}/` | ⏳ Pending |

---

## Execution Timeline

| Task | Execute After | Duration |
|------|--------------|----------|
| Task 55 | Migration complete | 48 hours |
| Task 56 | Hour 4 | 15 min |
| Task 57 | Hour 4 | 15 min |
| Task 58 | Hour 24 | 15 min |
| Task 59 | Hour 24 | 15 min |
| Task 60 | Hour 48 | 30 min |
| Task 61 | Hour 48 | 15 min |
| Task 62 | Hour 48 | 15 min |

**Status:** ✅ All post-migration tasks planned
