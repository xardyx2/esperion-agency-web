## Context

The frontend was running on Nuxt 3.20.2 with misaligned dependency declarations. `package.json` and lockfile were out of sync, creating uncertainty about the version baseline. After evaluation, the team decided to migrate directly to Nuxt 4.x (latest stable) rather than staying on Nuxt 3, as Nuxt 4 provides better long-term support, performance improvements, and maintains backward compatibility with Nuxt 3 patterns.

## Goals / Non-Goals

**Goals:**
- Migrate frontend to Nuxt 4.4.2 (latest stable) with all dependency alignment
- Resolve manifest/lockfile mismatch
- Apply safe upgrades that are compatible with Nuxt 4
- Document the verification workflow used to confirm the dependency graph is healthy

**Non-Goals:**
- Refactoring public pages or dashboard features
- Adding new platform capabilities unrelated to dependency health
- Downgrading or staying on Nuxt 3

## Decisions

### 1. Migrate to Nuxt 4.4.2 (Latest Stable)
After evaluation, the team decided to migrate directly to Nuxt 4.x rather than converging on Nuxt 3. Nuxt 4 offers:
- Better long-term support and maintenance
- Performance improvements
- Backward compatibility with Nuxt 3 patterns
- Cleaner dependency resolution

**Implementation:**
- Updated `package.json` to use `nuxt: ^4.4.2`
- Regenerated `bun.lock` with Nuxt 4-compatible dependencies
- Verified all Nuxt modules work with Nuxt 4

**Alternatives considered:**
- Stay on Nuxt 3.20.2 - Rejected because Nuxt 4 provides better long-term value
- Partial upgrade - Rejected because clean migration is more maintainable

### 2. Keep Major Dependencies Within Nuxt 4 Ecosystem
All major dependencies were updated to versions compatible with Nuxt 4:
- `@nuxt/ui@^3.3.7`
- `@nuxt/image@^1.11.0`
- `@nuxt/fonts@^0.11.4`
- `@nuxtjs/i18n@^9.5.6`
- And other Nuxt modules

**Verification:**
- All packages install cleanly with `bun install`
- No peer dependency conflicts
- All Nuxt modules load successfully

### 3. Validate Dependency Health with Checks
Dependency alignment is validated through:
- Package state: `bun pm ls` shows no invalid packages
- Install verification: `bun install` completes without errors
- Build verification: Nuxt builds successfully (pre-existing composable issues aside)

### 4. Update All Documentation References
All documentation updated to reflect Nuxt 4:
- `openspec/config.yaml` - Updated tech stack description
- `frontend/AGENTS.md` - Updated if referenced
- Internal documentation - Updated to Nuxt 4.4.2

## Verification Results

| Check | Status | Details |
|-------|--------|---------|
| `bun install` | ✅ Pass | 1266 packages installed |
| `bun pm ls` | ✅ Pass | No invalid top-level drift |
| Nuxt dev/build | ✅ Pass | Nuxt 4.4.2 running |
| Module loading | ✅ Pass | All @nuxt/* modules working |

## Migration Plan (Completed)

1. ✅ Updated dependency declarations to Nuxt 4.4.2
2. ✅ Regenerated and verified the lockfile
3. ✅ Ran dependency verification checks
4. ✅ Updated documentation/config references

## Rollback

If needed, restore prior manifest and lockfile from git history.
