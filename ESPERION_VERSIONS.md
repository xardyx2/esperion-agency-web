# Esperion Stack Versions

> **Single Source of Truth for all dependency versions**
> 
> Last Updated: 2026-03-18 by consolidated-march-10-17-platform-upgrade
> 
> ⚠️ **IMPORTANT:** After any dependency upgrade, update this file!

## Quick Verification Commands

```bash
# Frontend versions
cd frontend && bun pm ls | grep -E '@nuxt|nuxt|vue'

# Backend versions  
cd backend && cargo tree -p surrealdb -p axum -p tokio | head -10

# Docker versions
docker-compose config | grep image:
```

## Frontend Dependencies (Bun)

### Core Framework
| Package | Current Version | Latest (npm) | Source |
|---------|----------------|--------------|---------|
| nuxt | ^4.4.2 | 4.4.2 | package.json |
| vue | ^3.5.29 | 3.5.29 | package.json |
| vue-router | ^4.6.4 | 4.6.4 | package.json |

### Nuxt Modules
| Package | Current Version | Latest (npm) | Breaking Changes |
|---------|----------------|--------------|------------------|
| @nuxt/image | ^2.0.0 | 2.0.0 | ✅ Upgraded |
| @nuxt/ui | ^4.5.1 | 4.5.1 | ✅ Upgraded |
| @nuxt/eslint | ^1.15.2 | 1.15.2 | ✅ Upgraded |
| @nuxt/fonts | ^0.14.0 | 0.14.0 | ✅ Upgraded |
| @nuxtjs/i18n | ^10.2.3 | 10.2.3 | ✅ Upgraded |
| @nuxtjs/color-mode | ^4.0.0 | 4.0.0 | ✅ Upgraded |
| @nuxtjs/robots | ^5.7.1 | 5.7.1 | Current |
| @nuxtjs/sitemap | ^7.6.0 | 7.6.0 | Current |
| @pinia/nuxt | ^0.11.3 | 0.11.3 | Current |
| @vueuse/nuxt | ^13.9.0 | 14.2.1 | Minor |

### State Management
| Package | Current Version | Latest (npm) |
|---------|----------------|--------------|
| pinia | ^3.0.4 | 3.0.4 |
| pinia-plugin-persistedstate | ^4.7.1 | 4.7.1 |

### Build Tools
| Package | Current Version | Latest (npm) |
|---------|----------------|--------------|
| typescript | ^5.9.3 | 5.9.3 |
| vue-tsc | ^3.2.5 | 3.2.5 |

## Backend Dependencies (Rust/Cargo)

### Web Framework
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| axum | =0.8.8 | 0.8.8 | ✅ Upgraded |
| tower-http | =0.6.8 | 0.6.8 | ✅ Upgraded |
| tokio | =1.50.0 | 1.50.0 | ✅ Upgraded |

### Database
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| surrealdb | =3.0.4 | 3.0.4 | ✅ Upgraded |

### Authentication
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| jsonwebtoken | 10 | 10.3.0 | ✅ Upgraded |
| argon2 | 0.5 | 0.5.3 | None |

### Other Key Crates
| Crate | Current Version | Latest (crates.io) | Notes |
|-------|----------------|-------------------|-------|
| utoipa | =5.4.0 | 5.4.0 | ✅ Upgraded |
| utoipa-scalar | =0.1.0 | 0.1.0 | — |
| chrono | =0.4.44 | 0.4.44 | ✅ Upgraded |
| reqwest | =0.12.9 | 0.12.9 | — |
| image | 0.25 | 0.25 | — |
| lettre | =0.11.19 | 0.11.19 | ✅ Upgraded |

## Docker Images

| Service | Image | Current Tag | Port | Notes |
|---------|-------|-------------|------|-------|
| Frontend | Custom (Dockerfile.dev) | Bun 1.1+ | 3000 | Nuxt dev server |
| Backend | Custom (Dockerfile) | Rust nightly | 8081 | Axum API |
| Database | surrealdb/surrealdb | v3.0.4 | 8002 | RocksDB backend |

### Database Storage

- **Previous:** `file:/data/esperion.db` (SurrealDB 1.5.0)
- **Current:** `rocksdb:/data/esperion.db` (SurrealDB 3.0.4)

## Update History

| Date | Author | Changes |
|------|--------|---------|
| 2026-03-18 | consolidated-march-10-17-platform-upgrade | ✅ SurrealDB 1.5.0 → 3.0.4 with RocksDB |
| 2026-03-18 | consolidated-march-10-17-platform-upgrade | ✅ utoipa 4.2.3 → 5.4.0 |
| 2026-03-18 | consolidated-march-10-17-platform-upgrade | ✅ lettre 0.11.3 → 0.11.19 |
| 2026-03-18 | consolidated-march-10-17-platform-upgrade | ✅ chrono 0.4.38 → 0.4.44 |
| 2026-03-18 | consolidated-march-10-17-platform-upgrade | ✅ Added Docker images table with ports |
| 2026-03-14 | Claude | Initial version tracking setup |
| 2026-03-14 | Claude | ✓ Upgraded: @nuxt/image 2.0, @nuxt/ui 4.5, @nuxt/eslint 1.15, i18n 10, color-mode 4 |
| 2026-03-14 | Claude | ✓ Upgraded: Axum 0.8.8, jsonwebtoken 10, tower-http 0.6, tokio 1.50 |
| 2026-03-14 | Claude | 📋 Documented: SurrealDB 1.5 → 3.0 migration (ready for execution) |

## SurrealDB Migration Status

**Previous:** SurrealDB 1.5.0  
**Current:** SurrealDB 3.0.4 ✅  
**Status:** Migration completed

### Migration Completed
- [x] Storage backend: `file://` → `rocksdb://`
- [x] SQL syntax: `UPDATE` → `UPSERT`, `DEFINE SCOPE` → `DEFINE ACCESS TYPE RECORD`
- [x] Function names: `string::endsWith` → `string::ends_with` (snake_case)
- [x] Export v1.5 → surreal fix → export v3 → import workflow
- [x] All 13 API handlers verified with v3

## How to Update This File

### When to Update
Update this file **IMMEDIATELY** after:
- Running `bun install` or `npm install` for new packages
- Running `cargo add` or updating `Cargo.toml`
- Changing Docker image versions in `docker-compose.yml`
- Any dependency upgrade (major, minor, or patch)

### Update Steps
1. After upgrading dependencies, run verification commands above
2. Update the "Current Version" columns in tables
3. Check npm/crates.io for latest versions
4. Update "Last Updated" timestamp and author
5. Add entry to "Update History" table
6. Commit with message: "docs: update ESPERION_VERSIONS.md"

### Example: After @nuxt/ui Upgrade
```markdown
| Date | Author | Changes |
|------|--------|---------|
| 2026-03-14 | YourName | ✓ Upgraded: @nuxt/ui 4.5.1 → 4.6.0 |
```

### AI Assistant Workflow

When asking AI about versions or dependencies:

**Step 1:** AI reads this file first
**Step 2:** AI verifies with actual package files
**Step 3:** AI provides answer with citations

**Example Query:** "What version of Nuxt do we use?"

**Good AI Response:**
> "According to `ESPERION_VERSIONS.md` and verified in `frontend/package.json`:
> - You're using **Nuxt 4.4.2** (^4.4.2)
> - Latest available: 4.4.2
> - Status: ✅ Current
> 
> To verify: `cd frontend && cat package.json | grep nuxt`"

**Bad AI Response (DON'T DO THIS):**
> "You use Nuxt version 3.x" *(outdated training data)*

---

## Troubleshooting

### Issue: Script returns error
**Solution:** Make sure you're in the right directory:
```bash
cd frontend && bun run versions:check
```

### Issue: Versions don't match
**Solution:** Check which file is source of truth:
- Frontend: `frontend/package.json`
- Backend: `backend/Cargo.toml`
- Docker: `docker-compose.yml`

### Issue: Lock file out of sync
**Solution:** Reinstall dependencies:
```bash
# Frontend
cd frontend && rm -rf node_modules bun.lockb && bun install

# Backend
cd backend && rm -rf Cargo.lock && cargo build
```
