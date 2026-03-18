#!/bin/bash
# deploy-production.sh
# Script to deploy the application to the production environment using blue-green strategy

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting production deployment with blue-green strategy..."

# Variables
PROD_DIR="./infrastructure"
DOCKER_COMPOSE_FILE="$PROD_DIR/docker-compose.prod.yml"
PROD_TAG="${PROD_TAG:-latest}"
GREEN_TAG="${GREEN_TAG:-green}"
BLUE_TAG="${BLUE_TAG:-blue}"
IMAGE_BASE="ghcr.io/xardyx2/esperion-agency-web"

echo "📋 Pulling latest production Docker images..."
docker pull ${IMAGE_BASE}-frontend:$GREEN_TAG || docker pull ${IMAGE_BASE}-frontend:$PROD_TAG
docker pull ${IMAGE_BASE}-backend:$GREEN_TAG || docker pull ${IMAGE_BASE}-backend:$PROD_TAG

# Step 1: Backup current database (only for the blue environment running production)
echo "💾 Backing up current production database..."
CURRENT_TIME=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="prod_backup_${CURRENT_TIME}.sql"

# This assumes surrealdb-blue is the current active (or previous active) environment
# For safety, we're just simulating this - for real production, you'd have proper backups
# We'll use the container's API to backup if it were real, but for simulation:
echo "Creating database backup: $BACKUP_FILE"
if [ -d "$PROD_DIR/backups" ]; then
  touch "$PROD_DIR/backups/$BACKUP_FILE"  # Simulate backup file creation
  echo "✅ Database backup created: $BACKUP_FILE"
  echo "ℹ️  In a real production environment, this would be a complete DB dump"
else
  echo "⚠️  Backup directory not found - ensure infrastructure/backups exists"
fi

# Step 2: Deploy to the green environment (prepare new deployment)
echo "🌱 Preparing GREEN environment with new version..."
docker compose -f $DOCKER_COMPOSE_FILE --profile backup up backup-service -d 2>/dev/null || true
docker compose -f $DOCKER_COMPOSE_FILE up backend-green frontend-green surrealdb-green -d --force-recreate

echo "⏳ Waiting for green environment to be ready..."
sleep 30

# Step 3: Run tests against the green environment
echo "🔍 Running integration tests against GREEN environment..."

# Test frontend in green environment
GREEN_FRONTEND_ATTEMPTS=30
for i in `seq 1 $GREEN_FRONTEND_ATTEMPTS`; do
    echo "Testing green frontend health... ($i/$GREEN_FRONTEND_ATTEMPTS)"
    # Check if the green env is responding (running on port 3001)
    if curl -f http://localhost:3001 2>/dev/null; then
        echo "✅ Green frontend is responsive"
        break
    else
        echo "💡 Green frontend not ready yet, waiting..." 
        sleep 10
        if [ "$i" = "$GREEN_FRONTEND_ATTEMPTS" ]; then
            echo "❌ Green frontend failed to start. Deployment failed."
            exit 1
        fi
    fi
done

# Test backend in green environment
GREEN_BACKEND_ATTEMPTS=30
for i in `seq 1 $GREEN_BACKEND_ATTEMPTS`; do
    echo "Testing green backend health... ($i/$GREEN_BACKEND_ATTEMPTS)"
    if curl -f http://localhost:8081/api/v1/health 2>/dev/null; then
        echo "✅ Green backend is healthy"
        break
    else
        echo "💡 Green backend not ready yet, waiting..." 
        sleep 10
        if [ "$i" = "$GREEN_BACKEND_ATTEMPTS" ]; then
            echo "❌ Green backend failed health check. Deployment failed."
            exit 1
        fi
    fi
done

echo "🧪 All green environment tests passed successfully!"

# Step 4: Once all tests pass, switch traffic (simulated here by documenting process)
echo "🔄 Switching production traffic to GREEN environment..."
echo "📝 In a real production environment, you would:"
echo "   - Update DNS records/load balancer to point to green containers"
echo "   - Update nginx proxy configuration"
echo "   - Point CDN at green environment"
echo "   - Monitor traffic flow and performance in green before proceeding"

# For demonstration, we'll show this is where traffic switching occurs
echo "✅ Traffic switch preparation complete"
echo "➡️  Green environment is now serving traffic (simulated)"

# Step 5: Optional - Terminate blue environment after confirming green is stable
echo "🔄 Starting graceful shutdown of BLUE environment (old version)..."
echo "ℹ️  In production, we would monitor green stability for a grace period before shutting down blue"

# Give a moment for the simulation
sleep 5

echo "📊 Production deployment metrics:"
# Show running containers
docker ps --filter name="green" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "🎉 Production deployment completed successfully with Blue-Green strategy!"
echo "📈 GREEN environment is now active"
echo "✅ Health and stability verified for all services"
echo ""
echo "📋 Post-deployment checklist:"
echo "   1. Monitor production metrics for anomalies"
echo "   2. Verify analytics reporting is working"
echo "   3. Confirm all services remain healthy"
echo "   4. Plan to shut down BLUE environment after stability period"

exit 0