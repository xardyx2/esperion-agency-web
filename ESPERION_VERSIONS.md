# Esperion Stack Versions

> **Single Source of Truth for all dependency versions**
> 
> Last Updated: 2026-03-14 by Claude
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
| vue | ^3.5.29 | 3.5.30 | package.json |
| vue-router | ^4.6.4 | 5.0.3 | package.json |

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
| surrealdb | =1.5.0 | 3.0.4 | 2 major versions! |

### Authentication
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| jsonwebtoken | 10 | 10.3.0 | ✅ Upgraded |
| argon2 | 0.5 | 0.5.3 | None |

### Other Key Crates
| Crate | Current Version | Latest (crates.io) |
|-------|----------------|-------------------|
| utoipa | =4.2.3 | 5.4.0 |
| utoipa-scalar | =0.1.0 | 0.3.0 |
| chrono | =0.4.38 | 0.4.44 |
| reqwest | =0.12.9 | 0.13.2 |
| image | 0.25 | 0.25.10 |
| lettre | ^0.11.3 | 0.11.19 |

## Docker Images

| Service | Image | Current Tag | Latest |
|---------|-------|-------------|--------|
| Database | surrealdb/surrealdb | v1.5.6 | v3.0.4 |

## Update History

| Date | Author | Changes |
|------|--------|---------|
| 2026-03-14 | Claude | Initial version tracking setup |
| 2026-03-14 | Claude | ✓ Upgraded: @nuxt/image 2.0, @nuxt/ui 4.5, @nuxt/eslint 1.15, i18n 10, color-mode 4 |
| 2026-03-14 | Claude | ✓ Upgraded: Axum 0.8.8, jsonwebtoken 10, tower-http 0.6, tokio 1.50 |
| 2026-03-14 | Claude | 📋 Documented: SurrealDB 1.5 → 3.0 migration (ready for execution) |

## SurrealDB Migration Status

**Current:** SurrealDB 1.5.6  
**Target:** SurrealDB 3.0.4  
**Status:** 📋 Migration documented, ready for staging test

### Migration Artifacts
- [x] Migration Guide: `openspec/changes/upgrade-backend-database-stack/MIGRATION_GUIDE.md`
- [x] Task Checklist: `openspec/changes/upgrade-backend-database-stack/tasks.md`
- [x] Technical Spec: `openspec/changes/upgrade-backend-database-stack/specs/surrealdb-v3/spec.md`
- [ ] Staging migration tested
- [ ] Production migration completed

### Breaking Changes Handled
- Storage: `file://` → `rocksdb://`
- Connection string updated
- Migration tool: `surreal fix` → export --v3 → import
- Backup and rollback procedures documented

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
