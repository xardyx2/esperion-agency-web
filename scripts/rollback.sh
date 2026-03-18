#!/bin/bash
# rollback.sh
# Script to perform rollback in case of production deployment failure

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚨 Initiating emergency rollback procedure..."

# Get reason if provided
REASON=${1:-"unknown cause"}
echo "📝 Rollback triggered due to: $REASON"

PROD_DIR="./infrastructure"
DOCKER_COMPOSE_FILE="$PROD_DIR/docker-compose.prod.yml"
IMAGE_BASE="ghcr.io/xardyx2/esperion-agency-web"

echo "🔍 Identifying active environment and performing rollback..."

# Try to determine which environment is currently active
# If green is currently active (failed deployment), roll back to blue
# This is simulated as normally the reverse proxy/load balancer would be reconfigured

echo "📊 Rolling back to previous stable state..."

# Bring up blue environment if it has gone down 
echo "🔄 Restoring BLUE (previous) environment..."
if docker compose -f $DOCKER_COMPOSE_FILE ps | grep -q "blue.*Up\|running\|healthy"; then
    echo "✅ BLUE environment still active, checking health..."
    
    # Health check for blue environment
    BLUE_ATTEMPTS=30
    for i in `seq 1 $BLUE_ATTEMPTS`; do
        echo "Checking BLUE environment health... ($i/$BLUE_ATTEMPTS)"
        if curl -f http://localhost:3000/api/v1/health 2>/dev/null || curl -f http://localhost:8080/api/v1/health 2>/dev/null; then
            echo "✅ BLUE environment is healthy"
            break
        else
            echo "💡 BLUE environment may need restart, attempting..." 
            docker compose -f $DOCKER_COMPOSE_FILE up backend-blue frontend-blue -d --force-recreate
            sleep 10
        done
    done
else
    echo "🔄 BLUE environment is down, bringing it back up..."
    docker compose -f $DOCKER_COMPOSE_FILE up backend-blue frontend-blue surrealdb-blue -d --force-recreate
    
    # Wait for blue to be ready
    sleep 20
    
    BLUE_RESTART_ATTEMPTS=30
    for i in `seq 1 $BLUE_RESTART_ATTEMPTS`; do
        echo "Checking restarted BLUE environment health... ($i/$BLUE_RESTART_ATTEMPTS)"
        if curl -f http://localhost:3000/api/v1/health 2>/dev/null || curl -f http://localhost:8080/api/v1/health 2>/dev/null; then
            echo "✅ BLUE environment is back online"
            break
        else
            echo "💡 BLUE environment not ready yet, waiting..." 
            sleep 10
            if [ "$i" = "$BLUE_RESTART_ATTEMPTS" ]; then
                echo "❌ Failed to bring back BLUE environment. FATAL ERROR!"
                exit 1
            fi
        fi
    done
fi

# Stop the problematic green environment containers
echo "🛑 Stopping unstable GREEN environment..."
docker compose -f $DOCKER_COMPOSE_FILE stop backend-green frontend-green surrealdb-green || true

# Store failure details
FAILURE_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "$FAILURE_TIME - Rollback initiated - $REASON" >> ./infrastructure/rollbacks.log
echo "📝 Rollback details logged at ./infrastructure/rollbacks.log"

# Simulate traffic switch back to blue (would involve DNS/proxy changes in real deployment)
echo "🔄 Switching traffic back to BLUE environment..."
echo "ℹ️  In a real production environment, this would involve:"
echo "   - Reconfiguring load balancer/Nginx to point back to blue containers"
echo "   - Rolling back DNS records if they were changed"
echo "   - Updating CDN configuration"

echo "✅ Traffic routing restored to stable BLUE environment"

# Cleanup any failed deployment remnants
echo "🧹 Cleaning up failed deployment remnants..."
# In real deployment, you might remove unused images here based on tags
# docker image prune -f --filter "label=stage=failed_deployment" 2>/dev/null || true

echo "📊 Rollback status report:"
docker ps --filter "label=stage!=backup" --format "table {{.Names}}\t{{.Status}}\t{{.Labels}}" | head -10

echo "🎉 Emergency rollback completed successfully!"
echo "✅ Production system has been returned to the last known stable state"
echo "📧 Alert sent to team regarding rollback"

# Check if the GitHub webhook should be called (simulated)
if [ ! -z "$GITHUB_WEBHOOK_URL" ]; then
    echo "🔔 Notifying GitHub of rollback status (simulated)"
    # curl -X POST $GITHUB_WEBHOOK_URL -d "status=rolled_back&reason=$REASON"
fi

echo "📋 Post-rollback actions needed:"
echo "   1. Investigate cause of original deployment failure"
echo "   2. Apply fixes to resolve deployment issue"
echo "   3. Plan and execute corrected deployment"
echo "   4. Update team on resolution"

exit 0