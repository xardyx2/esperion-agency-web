## Context

The Esperion platform has accumulated 14 separate change proposals over March 10-17, 2026, covering infrastructure, backend, frontend, content, and compliance domains. These changes have interdependencies and potential conflicts that require a unified approach. The current state includes:

- **Database**: SurrealDB 1.5.0 running with legacy file:// storage
- **Backend**: Axum 0.7.9 with jsonwebtoken 9, ~28 minute cold builds
- **Frontend**: Nuxt 3 with mixed module versions, some deprecated configurations
- **Content**: Mixed-language approach hurting SEO (English nav + Indonesian content)
- **Analytics**: No consent mechanism despite multiple third-party trackers
- **Local Dev**: Fragile Docker stack with legacy database volume issues

This design consolidates all 14 proposals into a phased implementation that respects dependencies and minimizes risk.

## Goals / Non-Goals

**Goals:**
1. Complete SurrealDB v3 migration with zero data loss and working local recovery
2. Achieve 10x faster Rust rebuilds via cargo-chef + lld linker
3. Upgrade all Nuxt modules to v4 ecosystem with breaking changes handled
4. Establish consistent bilingual strategy with full localization
5. Fix routing bugs and modernize appearance components
6. Implement GDPR/PDP-compliant analytics consent management
7. AI-friendly SEO schema with 28-36% citation rate improvement
8. Centralized version tracking and AI context documentation

**Non-Goals:**
1. No schema redesign (keep existing tables/fields)
2. No new features beyond version upgrades and listed capabilities
3. No backend API contract changes (endpoints remain same)
4. No major UI design changes (preserve Esperion Design System)
5. No production deployment topology changes
6. No automatic version updates (manual documentation)

## Decisions

### DECISION 1: Phased Implementation with Strict Dependencies
**Rationale**: Some changes have hard dependencies. Database migration must complete before backend can use v3 features. Backend API stability must be verified before frontend upgrades that depend on it.

**Phases:**
- Phase 1: Infrastructure (SurrealDB v3, Rust toolchain, Backend upgrades)
- Phase 2: Frontend Modernization (Nuxt modules, Docker sync)
- Phase 3: Content & UX (Bilingual, Localization, Components)
- Phase 4: Features & Compliance (Analytics, AI SEO, Security)

**Alternative Considered**: Parallel implementation - REJECTED due to tight coupling between layers.

### DECISION 2: SurrealDB Migration via Export/Fix/Import
**Rationale**: SurrealDB does not support direct 1.x→3.x upgrade. The official path is v1→v2 (fix)→v3.

**Migration Path:**
```
v1.5.6 ──export──► v2.x (surreal fix) ──export──► v3.0.4
```

**Alternative Considered**: In-place upgrade - REJECTED (not supported by SurrealDB, would corrupt data).

### DECISION 3: cargo-chef + lld for Rust Optimization
**Rationale**: cargo-chef provides Docker layer caching for dependencies (95% faster rebuilds), while lld provides 2x faster linking. Together they address the 28-minute cold build problem.

**Dockerfile Structure:**
```dockerfile
# Stage 1: Planner - captures dependency recipe
FROM rust:alpine AS planner
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Stage 2: Builder - cached dependency build
FROM rust:alpine AS builder
RUN apk add lld
RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release
```

**Alternative Considered**: sccache - REJECTED (more complex, doesn't provide same Docker layer benefits).

### DECISION 4: Flat ESLint Config Migration
**Rationale**: ESLint v9+ requires flat config format. This is a breaking change that must be done as part of the Nuxt module upgrade.

**Migration:**
- Remove: `.eslintrc`, `.eslintrc.cjs`
- Create: `eslint.config.ts` with flat config array

**Alternative Considered**: Stay on ESLint v8 - REJECTED (blocks Nuxt module upgrades, security patches).

### DECISION 5: Hybrid Bilingual Strategy for Indonesian
**Rationale**: Research shows Indonesian digital agencies retain English for service names and technical terms while translating content. This maintains professional credibility while improving comprehension.

**Strategy:**
- **KEEP English**: Service names, acronyms, platforms, navigation, CTAs
- **TRANSLATE**: Page content, form labels, validation messages, blog articles

**Example**: "Jasa Web Development profesional untuk bisnis Anda"

**Alternative Considered**: 100% Indonesian - REJECTED (reduces clarity for professional terms).

### DECISION 6: Tiered Consent for Analytics
**Rationale**: GDPR and Indonesian PDP require explicit consent. Four tiers provide granularity while maintaining essential functionality.

**Tiers:**
1. Essential (always on) - site functionality
2. Analytics (default on) - GA4, anonymized data
3. Functional (default off) - Clarity, GTM
4. Marketing (default off) - Meta Pixel, TikTok, LinkedIn

**Alternative Considered**: Binary accept/reject - REJECTED (too restrictive, hurts analytics adoption).

### DECISION 7: SWR over ISR for Public Pages
**Rationale**: Stale-While-Revalidate provides better balance between performance and freshness than pure ISR for content that updates periodically.

**Rendering Strategy:**
- Public pages: SWR (60s stale, background refresh)
- Dashboard: CSR (client-side only)

**Alternative Considered**: Full SSR - REJECTED (higher server load, slower response times).

### DECISION 8: AI-Friendly Schema with Speakable Specification
**Rationale**: 2026 SEO requires AI-optimized content. Speakable specification allows voice assistants to extract key sections, entity linking provides topical context.

**Schema Features:**
- Article schema with speakable specification
- Tags system for topical classification
- Wikidata entity linking
- Citation/references for credibility

**Alternative Considered**: Traditional SEO only - REJECTED (misses AI citation opportunity).

## Risks / Trade-offs

**RISK 1: Database Migration Complexity**
- Risk: Migration fails, data corruption
- Mitigation: Full backup before migration, tested rollback procedure, staging validation

**RISK 2: Nuxt Module Breaking Changes**
- Risk: UI components break, build failures
- Mitigation: Component-by-component testing, regression suite, design system preservation

**RISK 3: Extended Downtime During Migration**
- Risk: Production unavailable during database migration
- Mitigation: Maintenance window planning, read-only mode, rollback capability

**RISK 4: Consent Banner Impact on Analytics**
- Risk: 30-50% analytics data loss from opt-outs
- Mitigation: Essential tier allows basic tracking, gradual rollout, A/B testing

**RISK 5: Bilingual Strategy Confusion**
- Risk: Users confused by mixed language
- Mitigation: Research-backed approach (100% of Indo agencies use this pattern), clear documentation

**RISK 6: Local Development Disruption**
- Risk: Developers blocked during upgrades
- Mitigation: Recovery scripts, clear documentation, migration guide

**TRADE-OFF 1: Migration Time vs. Safety**
- Direct 1→3 migration would be faster but unsupported
- 1→2→3 path is safer but takes longer
- **Decision**: Safety first with official migration path

**TRADE-OFF 2: Feature Completeness vs. Speed**
- Could implement fewer features faster
- Full consolidation provides complete platform upgrade
- **Decision**: Complete all 14 consolidated items for comprehensive upgrade

**TRADE-OFF 3: Modern Modules vs. Stability**
- Latest Nuxt modules have breaking changes
- Older modules are stable but deprecated
- **Decision**: Upgrade with comprehensive testing

## Migration Plan

### Pre-Migration (Day 0)
1. **Backup**: Full production database export
2. **Staging**: Mirror production environment
3. **Communication**: Notify team of maintenance window
4. **Rollback Plan**: Document restore procedures

### Phase 1: Infrastructure (Days 1-3)
**Day 1: SurrealDB Migration**
```bash
# 1. Export v1.5 data
surreal export backup-v1.json

# 2. Run fix for v2 compatibility
surreal fix rocksdb:mydata

# 3. Export with v3 compatibility
surreal export --v3 backup-v3.json

# 4. Deploy v3.0.4 container
# 5. Import to v3
surreal import backup-v3.json
```

**Day 2: Rust Toolchain**
- Update Dockerfile with cargo-chef stages
- Install lld linker in Alpine image
- Cleanup compiler warnings
- Test rebuild times

**Day 3: Backend Upgrades**
- Update Cargo.toml versions
- Migrate Axum routes (:id → {id})
- Configure jsonwebtoken crypto backend
- Test all 13 API handlers

**Verification**: All API tests pass, database queries work

### Phase 2: Frontend Modernization (Days 4-6)
**Day 4: Nuxt Modules**
- Update package.json versions
- Migrate ESLint to flat config
- Update nuxt.config.ts (i18n, colorMode)
- Change uiPro→ui in app.config.ts

**Day 5: Module Governance**
- Audit module usage
- Implement @nuxt/image WebP
- Add @nuxt/fonts optimization
- Remove unused modules

**Day 6: Docker Sync**
- Fix Bun dependency sync
- Add missing locale keys
- Test container rebuilds
- Verify runtime dependencies

**Verification**: Zero ESLint errors, build succeeds

### Phase 3: Content & UX (Days 7-10)
**Day 7: Bilingual Strategy**
- Update id.json with hybrid approach
- Update en.json with full English
- Document translation guidelines

**Day 8: Localization**
- Remove hardcoded English from MainNav
- Update all page content
- Implement localized SEO meta

**Day 9: Appearance Components**
- Create Appearance dropdown in MainNav
- Implement language switcher
- Add dark mode toggle with transitions
- Remove toggles from SiteFooter

**Day 10: Contact & Responsive**
- Add Google Maps embed
- Remove max-width constraints
- Improve banner contrast
- Test all public pages

**Verification**: Content renders correctly in both languages

### Phase 4: Features (Days 11-14)
**Day 11: Analytics Consent**
- Create CookieConsentBanner component
- Implement consent storage
- Add consent-aware API filtering

**Day 12: Article Fixes**
- Fix routing/rendering bug
- Add article body fields
- Create 12 article contents
- Fix domain references

**Day 13: AI SEO & Forms**
- Implement Speakable specification
- Add tags system
- Create shared form validation
- Add Scalar API reference

**Day 14: Security & Tracking**
- Configure CSP headers
- Add security hardening
- Create ESPERION_VERSIONS.md
- Document AI context

**Verification**: All features working, tests pass

### Post-Migration (Day 15)
1. **Monitoring**: Watch for errors in production
2. **Performance**: Verify build times improved
3. **SEO**: Check Rich Results Test
4. **Documentation**: Update README with new versions

### Rollback Strategy
**Database:**
- Restore v1.5 backup → Restart v1.5 container (< 30 min)

**Code:**
- Git revert to pre-migration commit
- Revert package.json + lockfile
- Rebuild containers

**Emergency Contact:**
- Escalation path for critical issues
- 24-hour monitoring window

## Open Questions

1. **Q**: Should we keep SurrealDB 2.x CLI container during migration phase for recovery purposes?
   **Status**: Recommended - include in docker-compose.migrate.yml

2. **Q**: Which jsonwebtoken crypto backend to use (aws_lc_rs vs rust_crypto)?
   **Status**: Use rust_crypto for better compatibility with Alpine Linux

3. **Q**: Should we implement gradual consent banner rollout or full deployment?
   **Status**: Full deployment with pre-set preferences (Analytics on by default)

4. **Q**: How to handle content creation for 12 articles - AI-generated or manual?
   **Status**: AI-assisted with human review for quality

5. **Q**: Which Nuxt security module to use (@nuxt/security vs manual headers)?
   **Status**: Evaluate @nuxt/security for v4 compatibility first

6. **Q**: Should MCP server be included in this change or separate?
   **Status**: Include basic MCP scaffolding, expand in follow-up

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Phase 1                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SurrealDB v3 │  │ Rust Toolchain│  │ Backend API  │      │
│  │  Migration   │──│ Optimization │──│   Upgrade    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Phase 2                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Nuxt Modules │  │   Module     │  │   Docker     │      │
│  │   v4 Stack   │──│  Governance  │──│    Sync      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Phase 3                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Bilingual   │  │  Full i18n   │  │   Content    │      │
│  │   Strategy   │──│Localization  │──│    Fixes     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Phase 4                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Analytics  │  │   Article    │  │  Security &  │      │
│  │   Consent    │──│   AI SEO     │──│   Tracking   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications Summary

**SurrealDB v3 Changes:**
```sql
-- OLD
UPDATE user SET name = "John" WHERE id = user:1;
DEFINE SCOPE auth SESSION 24h;

-- NEW
UPSERT user SET name = "John" WHERE id = user:1;
DEFINE ACCESS auth ON DATABASE TYPE RECORD;
```

**Axum 0.8 Route Migration:**
```rust
// OLD
.route("/users/:id", get(handler))
.route("/files/*path", get(catch_all))

// NEW
.route("/users/{id}", get(handler))
.route("/files/{*path}", get(catch_all))
```

**Nuxt Config Updates:**
```typescript
// OLD
export default defineNuxtConfig({
  i18n: {
    lazy: true,
    bundle: { optimizeTranslationDirective: true }
  },
  colorMode: { classSuffix: '' }
})

// NEW
export default defineNuxtConfig({
  i18n: {
    // lazy is now default, remove explicit option
    // bundle.optimizeTranslationDirective removed
  },
  colorMode: { } // classSuffix no longer needed
})
```

**Cargo.toml Linker Config:**
```toml
[profile.dev]
linker = "lld"

[dependencies]
jsonwebtoken = { version = "10", features = ["rust_crypto"] }
```
