# Esperion Agency Web - Production Deployment

This directory contains all infrastructure configuration for the production deployment of the Esperion Agency Web application.

## Directory Structure

```
infrastructure/
├── k8s/                          # Kubernetes manifests for production
│   ├── namespace.yaml            # Defines the esperion namespace
│   ├── frontend-deployment.yaml  # Frontend deployment configuration
│   ├── backend-deployment.yaml   # Backend deployment configuration
│   ├── surrealdb-statefulset.yaml # SurrealDB statefulset for persistent storage
│   ├── services.yaml             # Service definitions for internal communication
│   └── ingress.yaml              # Ingress rule for external access
├── docker-compose.prod.yml       # Docker Compose for local production-like setup
└── monitoring/                   # Monitoring tools configuration
    └── uptime-kuma.yaml           # Uptime Kuma for service monitoring
```

## Production Deployment Instructions

### Option 1: Kubernetes Deployment

To deploy the full stack to Kubernetes, apply all manifests:

```bash
kubectl apply -f infrastructure/k8s/namespace.yaml
kubectl apply -f infrastructure/k8s/
```

### Option 2: Docker Compose Deployment

To run a local version mimicking production using Docker Compose:

```bash
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

## Required Secrets and Configuration

Before deploying, you need to set up the following secrets:

* `esperion-secrets`: Contains database credentials, API keys, and other sensitive information
* `esperion-config`: Application configurations like database URLs, email settings, etc.

## Important Notes

* **Security**: Never commit secrets or API keys to version control
* **Production**: Verify all configurations are set for production before deployment
* **Certificates**: TLS certificates will be issued by Let's Encrypt via cert-manager
* **Storage**: SurrealDB uses persistent volumes for data persistence
* **Scaling**: Default replica counts should be adjusted based on expected load