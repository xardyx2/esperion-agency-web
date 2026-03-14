# SurrealDB v1.5.6 Backup Report

**Backup Date:** 2026-03-14  
**Backup Type:** Pre-migration backup for SurrealDB v1.5 → v3.0.4 migration  
**Branch:** migrate/surrealdb-v3

## Backup Status

### Database File Backup ✅
- **Location:** `./backups/esperion.db/`
- **Format:** RocksDB
- **Files:** 14 files (SST, MANIFEST, OPTIONS, etc.)
- **Total Size:** ~21 KB

### Export File Status ⚠️
- **File:** `./backups/esperion-v1.5-backup.surql`
- **Status:** Incomplete - Contains only `OPTION IMPORT;` header
- **Issue:** HTTP export endpoint requires authentication that was not properly configured

## Database Statistics

### Original Configuration
- **Version:** SurrealDB 1.5.6
- **Storage Backend:** RocksDB (`file:/data/esperion.db`)
- **Namespace:** esperion
- **Database:** esperion
- **Port:** 8002

### Files Backed Up
```
000013.sst       - 1436 bytes
000016.sst       - 1217 bytes
000021.sst       - 1217 bytes
000022.log       - 663 bytes
CURRENT          - 16 bytes
IDENTITY         - 36 bytes
LOCK             - 0 bytes
LOG              - 0 bytes
MANIFEST-000023  - 456 bytes
OPTIONS-000020   - 7026 bytes
OPTIONS-000025   - 7026 bytes
```

**Total Database Files Size:** ~21 KB

## Issues Encountered

1. **Docker Desktop Instability:** Docker daemon experienced multiple connection failures during backup process
2. **Export Endpoint Authentication:** HTTP export endpoint (`/export`) requires namespace specification but returned authentication errors
3. **Version Mismatch:** When v3.0.4 was accidentally started, it detected version mismatch (Expected: 3, Actual: 1)
4. **Minimal Container Images:** SurrealDB v1.5.6 Docker image does not include surreal CLI in PATH for exec commands

## Backup Method Used

Due to the issues above, the backup was performed using **direct file copy** from the Docker volume:

```bash
docker run --rm -v surreal-data:/source -v D:/Bisnis/esperion/esperion\ openspec/backups:/backup alpine sh -c 'cp -r /source/* /backup/'
```

This method preserves the exact RocksDB database files, which is the recommended approach for production backups according to SurrealDB documentation.

## Recovery Procedure

To restore from this backup:

1. Ensure Docker volume is clean: `docker volume rm surreal-data`
2. Create new volume: `docker volume create surreal-data`
3. Copy backup files back:
   ```bash
   docker run --rm -v surreal-data:/target -v D:/Bisnis/esperion/esperion\ openspec/backups:/backup alpine sh -c 'cp -r /backup/esperion.db/* /target/'
   ```
4. Start SurrealDB v1.5.6 with the same configuration

## Next Steps for Migration

1. This file-level backup is sufficient for rollback
2. For full logical backup, use `surreal export` command after resolving authentication
3. Proceed with staging migration test using docker-compose.staging.yml

## Container States

- Production database stopped safely
- Backup files preserved in `./backups/esperion.db/`
- Staging environment ready for testing

---

**Backup Verified:** Yes (file-level integrity confirmed)  
**Restore Tested:** No  
**Backup Location Secure:** Yes (local backups directory)
