# CI/CD Pipeline Configuration

This project implements a comprehensive Continuous Integration and Deployment pipeline with GitHub Actions that includes linting, testing, building, and deployment stages with automated rollback capabilities.

## 🗂️ File Structure

```
.github/
└── workflows/
    └── ci-cd.yml          # Main CI/CD pipeline workflow

infrastructure/
├── docker-compose.staging.yml  # Staging environment configuration
├── docker-compose.prod.yml     # Production blue-green deployment
├── secrets.md                  # Secrets management documentation
└── backups/                    # Database backup files

scripts/
├── deploy-staging.sh      # Staging deployment script
├── deploy-production.sh   # Production deployment script
└── rollback.sh           # Automated rollback script
```

## 🚀 Workflow Overview

### Job Dependencies
- **Lint** → Runs concurrently at the beginning
- **Unit Tests** ← (Needs: Lint)
- **Component Tests** ← (Needs: Lint)
- **E2E Tests** ← (Needs: Lint + Unit Tests)
- **Performance** ← (Needs: Unit Tests + Component Tests) *(PR only)*
- **Build** ← (Needs: E2E Tests + Performance)
- **Deploy Staging** ← (Needs: Build) *(Only on develop)*
- **Deploy Production** ← (Needs: Build) *(Only on main)*
- **Rollback** ← (Needs: Deploy Production Failure)

## ✅ Jobs Included

### 1. Linting
- **Technology:** ESLint, Prettier, rustfmt, clippy
- **Scope:** Both frontend and backend
- **Purpose:** Code quality and style enforcement

### 2. Testing Suite
- **Unit Tests:** Vitest for frontend logic and utilities
- **Component Tests:** Vitest for frontend component behavior
- **E2E Tests:** Playwright for end-to-end functionality
- **Performance:** Lighthouse CI on PRs

### 3. Building
- **Docker Images:** Builds and pushes tagged images to GHCR
- **Platforms:** linux/amd64
- **Tags:** Branch-based, SHA-based, latest
- **Caching:** Uses GitHub Actions cache for faster builds

### 4. Deployment Strategies

#### Staging Environment
- **Trigger:** Push to `develop` branch
- **Strategy:** Direct deployment to staging
- **Auto-deploy:** Enabled
- **Post-checks:** Container health and service availability

#### Production Environment
- **Trigger:** Push to `main` branch (requires manual approval)
- **Strategy:** Blue-Green deployment
- **Safety:**
  - Database backup before deployment
  - Health checks on new environment
  - Traffic switching upon successful validation
- **Rollback:** Auto-triggered on deployment failure

## 🔐 Secrets Management

Required GitHub Secrets:

- `DISCORD_WEBHOOK`: Notification webhook URL
- `PRODUCTION_JWT_SECRET`: Production JWT signing secret
- `DB_ROOT_USER`: Database root user
- `DB_ROOT_PASSWORD`: Database root password
- `DB_USER`: Application DB user
- `DB_PASSWORD`: Application DB password
- `SMTP_HOST`: Email service hostname
- `SMTP_PORT`: Email service port
- `SMTP_USER`: Email service username
- `SMTP_PASS`: Email service password
- `CONTACT_EMAIL`: Default contact recipient

## 🚢 Deployment Process

### Blue-Green Deployment Steps:
1. **Backup**: Database backup of current production
2. **Prepare Green**: Deploy new version to green environment
3. **Test**: Run comprehensive validation on green
4. **Traffic Switch**: Route traffic from blue to green
5. **Cleanup**: Shut down old blue environment
6. **Monitoring**: Track green environment stability

### Rollback Process:
1. **Detection**: Monitors health checks and deployment failures
2. **Trigger**: Auto-activates on any critical failure
3. **Restore**: Switch traffic back to stable blue environment
4. **Notification**: Alert team of rollback occurrence

## 📣 Notifications

- **Discord Integration**: Real-time deployment and rollback notifications
- **Status Reports**: Success/failure indicators per environment
- **Health Monitoring**: Automated alert when services fail

## 🏗️ Infrastructure Configuration

### Staging Environment (`docker-compose.staging.yml`)
- Single blue environment deployment
- Tag-based image selection
- Health endpoints enabled
- Environment-specific configuration

### Production Environment (`docker-compose.prod.yml`)
- Blue-Green strategy implementation
- Independent networking
- Database backup volume
- Separate health monitoring

## 🛡️ Security Measures

- No hardcoded secrets in configuration files
- Container scanning via workflow
- Encrypted secrets transmission
- Restricted network access
- Health and security checks integrated

## 👷 Commands for Local Testing

```bash
# Run all tests locally
npm run test
npm run test:e2e

# Run linting
npm run lint

# Test build process
npm run build
```

## 🔁 Concurrency Handling

Concurrent deployments are prevented per branch to avoid conflicts during deployment operations.

---

The CI/CD pipeline is designed for reliability, safety, and continuous improvement of the application delivery process.