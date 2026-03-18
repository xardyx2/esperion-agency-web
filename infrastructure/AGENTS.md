# INFRASTRUCTURE GUIDE

## OVERVIEW

Kubernetes manifests, Docker Compose configurations, monitoring setup, and blue-green deployment infrastructure.

## STRUCTURE

```text
infrastructure/
├── k8s/                   # Kubernetes manifests
├── monitoring/            # Uptime Kuma configuration
├── docker-compose.prod.yml    # Production (blue-green)
├── docker-compose.staging.yml # Staging environment
└── README.md              # Infrastructure docs
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Production deployment | `docker-compose.prod.yml` | Blue-green strategy, Discord notifications |
| Staging environment | `docker-compose.staging.yml` | Has `SUREAL_PASS` typo — fix to `SURREAL_PASS` |
| Kubernetes | `k8s/` | K8s manifests for production |
| Monitoring | `monitoring/` | Uptime Kuma config |

## CONVENTIONS

- Use GitHub Actions secrets for credentials (not hardcoded)
- Blue-green deployment for zero-downtime production
- Discord webhook notifications for deploy status
- Separate staging/prod compose files with environment-specific configs

## ANTI-PATTERNS (THIS PROJECT)

- Never use `${{ secrets.* }}` syntax in Docker Compose — GitHub Actions-only
- Never commit secrets or API keys to version control
- Never trust staging compose without fixing `SUREAL_PASS` typo
- Never assume version key consistency — mixed `3.8` and omitted
- Never run production with default credentials (`root/root`)

## UNIQUE STYLES

- Blue-green production deployment with health checks
- Discord notifications for deploy success/failure
- Multi-platform Docker builds (linux/amd64)
- GitHub Container Registry (ghcr.io) for container images
- Lighthouse CI performance audits (non-blocking)
- Codecov integration for coverage reports

## DEPLOYMENT FLOW

```bash
# Staging (push to develop branch)
# → Triggers ci-cd.yml staging job
# → Deploys to staging environment

# Production (push to main branch)
# → Triggers ci-cd.yml production job
# → Blue-green swap with health checks
# → Discord notification on success/failure
# → Auto-rollback if production fails
```

## COMMANDS

```bash
# Start staging
docker-compose -f infrastructure/docker-compose.staging.yml up -d

# Start production (local test)
docker-compose -f infrastructure/docker-compose.prod.yml up -d

# View Kubernetes resources
kubectl apply -f infrastructure/k8s/ --dry-run=client

# Monitoring setup
docker-compose -f infrastructure/monitoring/docker-compose.yml up -d
```

## CRITICAL ISSUES TO FIX

| Issue | File | Severity |
|-------|------|----------|
| `SUREAL_PASS` typo | `docker-compose.staging.yml:97` | 🔴 High |
| `${{ secrets.* }}` syntax | Both prod/staging compose | 🔴 High |
| Hardcoded default credentials | `docker-compose.yml`, `staging.yml` | 🟠 Medium |
| Version key inconsistency | Mixed `3.8` and omitted | 🟡 Low |

## NOTES

- GitHub Actions syntax (`${{ secrets.* }}`) cannot be used in Docker Compose
- Use `.env` files or environment variable substitution instead
- Production compose uses blue-green but implementation unclear from files alone
- Lighthouse CI runs on PR only, non-blocking (`|| echo ...`)
- Workflow has `cancel-in-progress: true` — could cancel deployments mid-execution
