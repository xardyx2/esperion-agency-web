# Dependency Verification Workflow

This document describes the process for verifying Docker runtime dependencies match package.json.

## Quick Check Commands

### Check Frontend Dependencies

```bash
# From project root
cd frontend

# Verify bun.lock is in sync with package.json
bun install --frozen-lockfile --dry-run

# List installed versions
bun list --depth=0

# Check for outdated packages
bun outdated
```

### Check Backend Dependencies

```bash
# From project root
cd backend

# Verify Cargo.lock is in sync with Cargo.toml
cargo check

# List installed crates
cargo tree -p surrealdb -p axum -p tokio -p jsonwebtoken | head -15

# Check for outdated crates
cargo outdated
```

### Check Docker Images

```bash
# List all running images
docker-compose images

# Verify specific versions
docker-compose exec database surrealdb version
docker-compose exec backend cat /usr/local/cargo/Cargo.toml | head -20
docker-compose exec frontend cat package.json | grep '"nuxt"'
```

## Automated Verification

### Frontend (package.json scripts)

```json
{
  "scripts": {
    "version:check": "npm list --depth=0",
    "version:outdated": "npm outdated",
    "version:report": "npm list --depth=0 --long > ../version-report-frontend.txt",
    "versions:check": "cat package.json | grep -E '\"(nuxt|vue|@nuxt|pinia)' | grep -v 'dev\\|build\\|generate\\|preview\\|postinstall\\|type-check\\|environment' | head -20",
    "versions:frontend": "cat package.json | grep -E '^\\s*\"(@nuxt|nuxt|vue)' | head -20",
    "versions:backend": "cd ../backend && cargo tree -p surrealdb -p axum -p tokio -p jsonwebtoken | head -15",
    "versions:verify": "bun run versions:check && echo '---' && bun run versions:backend"
  }
}
```

### Usage

```bash
# Run from frontend directory
bun run versions:verify
```

## Troubleshooting

### Module Not Found Errors

If you see errors like `Cannot find module '@vee-validate/nuxt'`:

1. Check if module is in package.json
2. Run `bun install` to sync dependencies
3. Check if module is properly configured in nuxt.config.ts

### Container Rebuild Issues

If container fails to start:

```bash
# Force rebuild
docker-compose up -d --build frontend

# Clear volumes if needed
docker-compose down -v
docker volume rm esperion-frontend-node-modules

# Restart fresh
docker-compose up -d
```

### Dependency Sync Checklist

Before committing changes:

- [ ] package.json includes all required dependencies
- [ ] bun.lockb is regenerated and committed
- [ ] Cargo.toml versions match requirements
- [ ] Cargo.lock is regenerated and committed
- [ ] docker-compose.yml image tags are correct
- [ ] All Nuxt modules load without errors
- [ ] No runtime warnings about missing modules

## Common Issues

### @vee-validate/nuxt runtime visibility

**Solution**: Ensure @vee-validate/nuxt is in dependencies (not devDependencies) in package.json.

### Bun lockfile out of sync

**Solution**:
```bash
cd frontend
rm bun.lockb
bun install
```

### Container dependencies mismatch

**Solution**: The docker-entrypoint.sh automatically runs `bun install` on startup to sync dependencies.

## Related Files

- `frontend/package.json` - Frontend dependencies
- `frontend/bun.lockb` - Bun lockfile
- `backend/Cargo.toml` - Backend dependencies  
- `backend/Cargo.lock` - Cargo lockfile
- `docker-compose.yml` - Docker image versions
- `frontend/docker-entrypoint.sh` - Container startup script
