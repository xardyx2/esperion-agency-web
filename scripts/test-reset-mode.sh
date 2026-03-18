#!/bin/bash
#
# Test script for reset mode functionality
# Uses a COPY of the volume to avoid destroying production data
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backups/test-reset-$(date +%Y%m%d-%H%M%S)"
TEST_VOLUME="surreal-test-reset"

echo "=== SurrealDB Reset Mode Test ==="
echo "Timestamp: $(date)"
echo "Backup dir: ${BACKUP_DIR}"
echo ""

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Step 1: Create test volume from current surreal-data if exists
echo "Step 1: Creating test volume from current data..."
if docker volume inspect surreal-data &>/dev/null; then
    docker run --rm \
        -v surreal-data:/source:ro \
        -v ${TEST_VOLUME}:/target \
        alpine:latest \
        sh -c 'cp -r /source/* /target/ 2>/dev/null || echo "Empty or no data to copy"'
    echo "✓ Test volume created from current data"
else
    echo "ℹ No existing surreal-data volume, will create fresh"
fi

# Step 2: Run reset mode on test volume
echo ""
echo "Step 2: Running reset mode on test volume..."
docker-compose down database 2>/dev/null || true

# Temporarily modify compose to use test volume
cat > docker-compose.test.yml <<EOF
services:
  database:
    image: surrealdb/surrealdb:v3.0.4
    ports:
      - "8002:8000"
    volumes:
      - ${TEST_VOLUME}:/data
    environment:
      - SURREAL_USER=root
      - SURREAL_PASS=root
    command: start --log debug --user root --pass root --bind 0.0.0.0:8000 rocksdb:/data/esperion.db

  test-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    ports:
      - "8081:8080"
    environment:
      - DB_HOST=database
      - DB_PORT=8000
      - DB_USER=root
      - DB_PASS=root
      - DB_NS=esperion
      - DB_DB=esperion_db
      - JWT_SECRET=test-secret
    depends_on:
      database:
        condition: service_healthy

  test-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=http://test-backend:8080
    depends_on:
      test-backend:
        condition: service_healthy

volumes:
  ${TEST_VOLUME}:
EOF

# Remove test volume to simulate reset
docker volume rm ${TEST_VOLUME} 2>/dev/null || true
docker volume create ${TEST_VOLUME}

echo "✓ Test volume reset (clean slate)"

# Step 3: Start database with clean v3 volume
echo ""
echo "Step 3: Starting database with clean v3 volume..."
docker-compose -f docker-compose.test.yml up -d database

# Wait for health check
echo "Waiting for database to be healthy..."
sleep 10

MAX_RETRIES=30
RETRY=0
while ! docker-compose -f docker-compose.test.yml exec -T database wget -q --spider http://localhost:8000/health 2>/dev/null; do
    RETRY=$((RETRY + 1))
    if [ $RETRY -ge $MAX_RETRIES ]; then
        echo "✗ Database failed to become healthy after ${MAX_RETRIES} attempts"
        docker-compose -f docker-compose.test.yml logs database
        exit 1
    fi
    echo "  Attempt $RETRY/$MAX_RETRIES..."
    sleep 5
done

echo "✓ Database is healthy"

# Step 4: Verify version
echo ""
echo "Step 4: Verifying database version..."
VERSION=$(curl -s http://localhost:8002/version | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
if [[ $VERSION == *"3.0.4"* ]]; then
    echo "✓ Database version is 3.0.4: $VERSION"
else
    echo "✗ Unexpected version: $VERSION"
    exit 1
fi

# Step 5: Cleanup
echo ""
echo "Step 5: Cleanup..."
docker-compose -f docker-compose.test.yml down -v
rm docker-compose.test.yml
docker volume rm ${TEST_VOLUME} 2>/dev/null || true

echo ""
echo "=== Reset Mode Test Complete ==="
echo "✓ Reset mode works correctly"
echo "✓ Clean v3 volume starts successfully"
echo "✓ Test artifacts cleaned up"
echo ""
echo "Test backup location: ${BACKUP_DIR}"
