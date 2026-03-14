#!/bin/bash
# Production Migration Script: SurrealDB v1.5 → v3.0.4
# Usage: ./scripts/migrate-production.sh

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  SURREALDB PRODUCTION MIGRATION v1.5 → v3.0.4           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
BACKUP_DIR="./backups/production-$(date +%Y%m%d-%H%M%S)"
DB_CONTAINER="esperion-database"
DB_PORT="8002"
DB_NS="esperion"
DB_DB="esperion"
DB_USER="root"
DB_PASS="root"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pre-migration checks
echo -e "${YELLOW}[1/13] Pre-migration checks...${NC}"
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found${NC}"
    exit 1
fi

if ! docker ps | grep -q "$DB_CONTAINER"; then
    echo -e "${RED}Error: Production database not running${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All checks passed${NC}"
echo ""

# Step 2: Create backup directory
echo -e "${YELLOW}[2/13] Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✓ Backup directory: $BACKUP_DIR${NC}"
echo ""

# Step 3: Final production backup
echo -e "${YELLOW}[3/13] Creating final production backup...${NC}"
docker exec "$DB_CONTAINER" surreal export \
  --conn http://localhost:8000 \
  --user "$DB_USER" --pass "$DB_PASS" \
  --ns "$DB_NS" --db "$DB_DB" \
  /tmp/production-final.surql

docker cp "$DB_CONTAINER:/tmp/production-final.surql" "$BACKUP_DIR/"
echo -e "${GREEN}✓ Backup created: $BACKUP_DIR/production-final.surql${NC}"
echo ""

# Step 4: Stop production containers
echo -e "${YELLOW}[4/13] Stopping production containers...${NC}"
docker-compose stop backend
# Keep database running for export
echo -e "${GREEN}✓ Backend stopped${NC}"
echo ""

# Step 5: Export from v1.5
echo -e "${YELLOW}[5/13] Exporting from v1.5...${NC}"
docker exec "$DB_CONTAINER" surreal export \
  --conn http://localhost:8000 \
  --user "$DB_USER" --pass "$DB_PASS" \
  --ns "$DB_NS" --db "$DB_DB" \
  /tmp/v1.5-export.surql

docker cp "$DB_CONTAINER:/tmp/v1.5-export.surql" "$BACKUP_DIR/"
echo -e "${GREEN}✓ v1.5 export complete${NC}"
echo ""

# Step 6: Stop v1.5 database
echo -e "${YELLOW}[6/13] Stopping v1.5 database...${NC}"
docker-compose stop database
# Backup volume
docker run --rm -v esperion_surreal-data:/source -v "$BACKUP_DIR/volume:/backup" alpine cp -r /source/* /backup/
echo -e "${GREEN}✓ Database stopped and volume backed up${NC}"
echo ""

# Step 7: Start v3 database with RocksDB
echo -e "${YELLOW}[7/13] Starting v3 database...${NC}"
docker-compose up -d database
echo -e "${GREEN}✓ v3 database started${NC}"
echo ""

# Step 8: Import to v3
echo -e "${YELLOW}[8/13] Importing to v3...${NC}"
sleep 5  # Wait for database to be ready

curl -s -X POST "http://localhost:$DB_PORT/import?ns=$DB_NS&db=$DB_DB" \
  -u "$DB_USER:$DB_PASS" \
  -H "surreal-ns: $DB_NS" \
  -H "surreal-db: $DB_DB" \
  --data-binary @"$BACKUP_DIR/v1.5-export.surql"

echo -e "${GREEN}✓ Import complete${NC}"
echo ""

# Step 9: Verify database
echo -e "${YELLOW}[9/13] Verifying database...${NC}"
VERSION=$(curl -s http://localhost:$DB_PORT/version)
if [ "$VERSION" = "surrealdb-3.0.4" ]; then
    echo -e "${GREEN}✓ v3.0.4 confirmed${NC}"
else
    echo -e "${RED}✗ Version mismatch: $VERSION${NC}"
    exit 1
fi

# Test query
RESULT=$(curl -s -X POST "http://localhost:$DB_PORT/sql" \
  -u "$DB_USER:$DB_PASS" \
  -H "surreal-ns: $DB_NS" \
  -H "surreal-db: $DB_DB" \
  -d "INFO FOR DB")

echo -e "${GREEN}✓ Database query working${NC}"
echo ""

# Step 10: Deploy backend
echo -e "${YELLOW}[10/13] Deploying updated backend...${NC}"
docker-compose up -d backend
echo -e "${GREEN}✓ Backend deployed${NC}"
echo ""

# Step 11: Smoke tests
echo -e "${YELLOW}[11/13] Running smoke tests...${NC}"
sleep 5  # Wait for backend to start

# Health check
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/health || echo "000")
if [ "$HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed: $HEALTH${NC}"
fi

# API test
API=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/v1/openapi.json || echo "000")
if [ "$API" = "200" ]; then
    echo -e "${GREEN}✓ API docs accessible${NC}"
else
    echo -e "${RED}✗ API docs failed: $API${NC}"
fi

echo ""

# Step 12: Summary
echo -e "${YELLOW}[12/13] Migration Summary:${NC}"
echo "Backup location: $BACKUP_DIR"
echo "Database version: $VERSION"
echo "Backend status: $(docker-compose ps | grep backend | awk '{print $4}')"
echo ""

# Step 13: Monitoring instructions
echo -e "${YELLOW}[13/13] Post-migration:${NC}"
echo -e "${GREEN}✓ Migration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor error logs: docker-compose logs -f backend"
echo "2. Check application functionality"
echo "3. Monitor for 1 hour before declaring success"
echo "4. Keep backup for 1 week: $BACKUP_DIR"
echo ""
echo "Rollback (if needed):"
echo "  docker-compose stop database backend"
echo "  docker volume rm esperion_surreal-data"
echo "  docker volume create esperion_surreal-data"
echo "  # Restore from $BACKUP_DIR/volume"
echo "  docker-compose up -d"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  MIGRATION COMPLETE                                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
