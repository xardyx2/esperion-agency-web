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
| nuxt | ^3.20.2 / ^4.4.2 | 4.4.2 | package.json |
| vue | ^3.5.29 | 3.5.30 | package.json |
| vue-router | ^4.6.4 | 5.0.3 | package.json |

### Nuxt Modules
| Package | Current Version | Latest (npm) | Breaking Changes |
|---------|----------------|--------------|------------------|
| @nuxt/image | ^1.11.0 | 2.0.0 | xs/xxl removed |
| @nuxt/ui | ^3.3.7 | 4.5.1 | uiPro→ui key |
| @nuxt/eslint | ^0.7.6 | 1.15.2 | flat config only |
| @nuxt/fonts | ^0.11.1 | 0.14.0 | None |
| @nuxtjs/i18n | ^9.5.6 | 10.2.3 | lazy option removed |
| @nuxtjs/color-mode | ^3.5.2 | 4.0.0 | hid removed |
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
| axum | =0.7.9 | 0.8.8 | :id→{id} syntax |
| tower-http | =0.5.2 | 0.6.8 | None |
| tokio | =1.42.0 | 1.50.0 | None |

### Database
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| surrealdb | =1.5.0 | 3.0.4 | 2 major versions! |

### Authentication
| Crate | Current Version | Latest (crates.io) | Breaking Changes |
|-------|----------------|-------------------|------------------|
| jsonwebtoken | 9 | 10.3.0 | crypto backend req |
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

## How to Update This File

1. After upgrading dependencies, run verification commands above
2. Update the "Current Version" columns
3. Check npm/crates.io for latest versions
4. Update "Last Updated" timestamp
5. Add entry to "Update History"
6. Commit with message: "docs: update ESPERION_VERSIONS.md"
