#!/bin/bash
# deploy-staging.sh
# Script to deploy the application to the staging environment

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting deployment to staging environment..."

# Variables
STAGING_DIR="./infrastructure"
DOCKER_COMPOSE_FILE="$STAGING_DIR/docker-compose.staging.yml"
STAGING_TAG="${STAGING_TAG:-develop}"
IMAGE_BASE="ghcr.io/xardyx2/esperion-agency-web"

echo "📋 Pulling latest Docker images..."
docker pull ${IMAGE_BASE}-frontend:$STAGING_TAG || docker pull ${IMAGE_BASE}-frontend:develop
docker pull ${IMAGE_BASE}-backend:$STAGING_TAG || docker pull ${IMAGE_BASE}-backend:develop

echo "🔄 Stopping current staging containers..."
docker compose -f $DOCKER_COMPOSE_FILE down --remove-orphans || true

echo "📦 Starting staging services..."
docker compose -f $DOCKER_COMPOSE_FILE up -d --force-recreate

echo "⏳ Waiting for services to start..."
sleep 20

echo "🔍 Running post-deployment health checks..."

# Health check for frontend
FRONTEND_ATTEMPTS=30
for i in `seq 1 $FRONTEND_ATTEMPTS`; do
    echo "Checking frontend health... ($i/$FRONTEND_ATTEMPTS)"
    if docker compose -f $DOCKER_COMPOSE_FILE exec frontend-staging curl -f http://localhost:3000/_health || curl -f http://localhost:3000/_health 2>/dev/null; then
        echo "✅ Frontend is healthy"
        break
    else
        echo "💡 Frontend not ready yet, waiting..." 
        sleep 10
        if [ "$i" = "$FRONTEND_ATTEMPTS" ]; then
            echo "❌ Frontend failed health check. Deployment failed."
            exit 1
        fi
    fi
done

# Health check for backend
BACKEND_ATTEMPTS=30
for i in `seq 1 $BACKEND_ATTEMPTS`; do
    echo "Checking backend health... ($i/$BACKEND_ATTEMPTS)"
    if docker compose -f $DOCKER_COMPOSE_FILE exec backend-staging curl -f http://localhost:8080/api/v1/health || curl -f http://localhost:8080/api/v1/health 2>/dev/null; then
        echo "✅ Backend is healthy"
        break
    else
        echo "💡 Backend not ready yet, waiting..." 
        sleep 10
        if [ "$i" = "$BACKEND_ATTEMPTS" ]; then
            echo "❌ Backend failed health check. Deployment failed."
            exit 1
        fi
    fi
done

echo "✅ All services are healthy"
echo "📊 Collecting deployment metrics..."
docker ps --filter "label=stage=staging" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "🎉 Staging deployment completed successfully!"
echo "🌐 Your staging environment is running at http://localhost:3000"

exit 0