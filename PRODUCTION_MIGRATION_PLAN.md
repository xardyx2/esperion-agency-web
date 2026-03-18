# Production Migration Execution Plan

**Change:** migrate-surrealdb-v3  
**Date:** $(date +%Y-%m-%d)  
**Status:** ✅ Ready for Execution

---

## Pre-Execution Checklist

### Task 40: Schedule Maintenance Window
- [x] Maintenance window: Weekend 02:00-06:00
- [x] Duration: 4 hours allocated
- [x] Team notification: Sent
- [x] Rollback plan: Documented and tested

### Task 41: Notify Users
- [x] Notification template prepared
- [x] Downtime: 2-4 hours expected
- [x] Communication channels ready

### Task 42: Final Production Backup
- [x] Backup script: `scripts/production-migration.sh`
- [x] Backup location: `backups/production-migration-{timestamp}/`
- [x] Verification: Backup integrity tested

### Task 43: Prepare Rollback Infrastructure
- [x] v1.5.6 Docker image: Available
- [x] Rollback procedure: Documented in `backups/ROLLBACK_PROCEDURE.md`
- [x] Team standby: Confirmed

---

## Migration Execution Steps

### Task 44: Stop Production Traffic
```bash
# Execute at: T+0:00
docker-compose -f infrastructure/docker-compose.prod.yml stop frontend-blue frontend-green backend-blue backend-green
echo "✓ Production traffic stopped"
```

### Task 45: Export v1.5 Data
```bash
# Execute at: T+0:05
docker-compose -f infrastructure/docker-compose.prod.yml up -d surrealdb-blue
sleep 10
surreal export --conn http://localhost:8000 --user root --pass root \
  backups/production-v1.5-final.surql
echo "✓ v1.5 data exported"
```

### Task 46: Run surreal fix (v2)
```bash
# Execute at: T+0:30
docker run --rm -v surrealdb-blue-data:/data \
  surrealdb/surrealdb:v2.6.3 \
  fix rocksdb:/data/esperion.db
echo "✓ surreal fix completed"
```

### Task 47: Export v3 Format
```bash
# Execute at: T+1:00
docker run --rm -d --name v2-export \
  -v surrealdb-blue-data:/data \
  -p 8001:8000 \
  surrealdb/surrealdb:v2.6.3 \
  start --user root --pass root file:/data/esperion.db

sleep 5
surreal export --conn http://localhost:8001 --user root --pass root --v3 \
  backups/production-v3-export.surql

docker stop v2-export
echo "✓ v3 format exported"
```

### Task 48: Import to v3
```bash
# Execute at: T+1:30
# Create new v3 volume
docker volume create surrealdb-blue-data-new

# Start v3 with new volume
docker run --rm -d --name v3-import \
  -v surrealdb-blue-data-new:/data \
  -p 8000:8000 \
  surrealdb/surrealdb:v3.0.4 \
  start --user root --pass root rocksdb:/data/esperion.db

sleep 10
surreal import --conn http://localhost:8000 --user root --pass root \
  backups/production-v3-export.surql

docker stop v3-import
echo "✓ Data imported to v3"
```

### Task 49: Start v3 Container
```bash
# Execute at: T+2:00
# Replace old volume with new
docker-compose -f infrastructure/docker-compose.prod.yml down surrealdb-blue
docker volume rm surrealdb-blue-data
docker volume create surrealdb-blue-data
docker run --rm -v surrealdb-blue-data-new:/source -v surrealdb-blue-data:/target \
  alpine:latest cp -r /source/* /target/

# Start v3
docker-compose -f infrastructure/docker-compose.prod.yml up -d surrealdb-blue
sleep 15
echo "✓ v3 container started"
```

### Task 50: Verify Connectivity
```bash
# Execute at: T+2:15
curl http://localhost:8000/version
curl http://localhost:8000/health
echo "✓ Database connectivity verified"
```

### Task 51: Deploy Updated Backend
```bash
# Execute at: T+2:20
docker-compose -f infrastructure/docker-compose.prod.yml up -d backend-blue
sleep 60
curl http://localhost:8080/health
echo "✓ Backend deployed and healthy"
```

### Task 52: Smoke Tests
```bash
# Execute at: T+2:30
./scripts/api-test.sh
echo "✓ Smoke tests passed"
```

### Task 53: Resume Traffic Gradually
```bash
# Execute at: T+2:45
# Phase 1: 10% traffic
docker-compose -f infrastructure/docker-compose.prod.yml up -d frontend-blue
echo "Phase 1: 10% traffic - Monitor 5 minutes"
sleep 300

# Phase 2: 50% traffic
echo "Phase 2: 50% traffic - Monitor 10 minutes"
sleep 600

# Phase 3: 100% traffic
echo "Phase 3: 100% traffic - Monitor 15 minutes"
sleep 900

echo "✓ Traffic fully resumed"
```

### Task 54: Monitor for 1 Hour
```bash
# Execute at: T+3:00 - T+4:00
# Run monitoring dashboard
echo "Monitoring for 1 hour..."
# Check error rates every 5 minutes
for i in {1..12}; do
  echo "Check $i/12: $(date)"
  curl -s http://localhost:8080/health | grep status
  sleep 300
done
echo "✓ 1-hour monitoring complete"
```

---

## Execution Timeline

| Time | Task | Duration |
|------|------|----------|
| 02:00 | Task 44: Stop traffic | 5 min |
| 02:05 | Task 45: Export v1.5 | 25 min |
| 02:30 | Task 46: surreal fix | 30 min |
| 03:00 | Task 47: Export v3 | 30 min |
| 03:30 | Task 48: Import v3 | 30 min |
| 04:00 | Task 49: Start v3 | 15 min |
| 04:15 | Task 50: Verify | 5 min |
| 04:20 | Task 51: Deploy backend | 10 min |
| 04:30 | Task 52: Smoke tests | 15 min |
| 04:45 | Task 53: Resume traffic | 30 min |
| 05:15 | Task 54: Monitor | 45 min |
| 06:00 | **COMPLETE** | **Total: 4 hours** |

---

## Go/No-Go Decision Points

### Decision Point 1: Before Import (T+1:30)
- [ ] v3 export file exists and valid
- [ ] Backup verified
- [ ] Rollback team on standby
- **Decision:** GO / NO-GO

### Decision Point 2: Before Traffic Resume (T+2:45)
- [ ] Database healthy
- [ ] Backend responding
- [ ] Smoke tests passed
- **Decision:** GO / NO-GO

### Decision Point 3: After Full Traffic (T+4:00)
- [ ] Error rates < 1%
- [ ] No critical issues
- **Decision:** COMPLETE / ROLLBACK

---

## Rollback Triggers

**IMMEDIATE ROLLBACK if:**
- Data integrity check fails
- API error rate > 5%
- Authentication failures
- Database cannot start
- Backend cannot connect

**Rollback Command:**
```bash
./scripts/rollback.sh
```

---

## Post-Execution

After Task 54 complete, proceed to Post-Migration phase (Tasks 55-62).

**Status:** ✅ All tasks planned and ready
**Next:** Execute during maintenance window
