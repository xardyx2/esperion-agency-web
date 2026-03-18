## Why

Over the past week (March 10-17, 2026), 14 separate changes were proposed and archived addressing critical gaps in the Esperion platform. These changes span infrastructure (SurrealDB v3 migration), backend optimization (Rust toolchain), frontend modernization (Nuxt modules v4), user experience (bilingual strategy, Vue-style components), and compliance (analytics consent). Rather than implementing these as fragmented efforts, this consolidated change synthesizes all 14 proposals into a unified platform upgrade that eliminates conflicts, respects dependencies, and delivers maximum value.

**Critical Issues Being Addressed:**
- SurrealDB 1.5.0 is 2 major versions behind (v3.0.4 current), blocking security patches and performance improvements
- Nuxt module stack has significant version drift with breaking changes pending (@nuxt/image v2, @nuxt/ui v4)
- Rust cold builds take ~28 minutes without optimization (cargo-chef, lld linker)
- Mixed-language content strategy hurts SEO and user trust
- No consent management for analytics (GDPR/PDP compliance risk)
- Frontend components scattered and not following Vue.js best practices
- Article/portfolio detail pages have routing/rendering bugs
- Local development stack is fragile with legacy database volumes

## What Changes

### Phase 1: Infrastructure Foundation (Must Complete First)

**1. SurrealDB v3 Migration with Local Recovery** [CRITICAL BREAKING]
- Upgrade SurrealDB 1.5.0 → 3.0.4 with rocksdb storage backend
- Migrate SQL syntax (UPDATE→UPSERT, file://→rocksdb://, DEFINE SCOPE→DEFINE ACCESS)
- Update 40+ renamed functions (string::endsWith→string::ends_with, etc.)
- Provide local recovery tooling for legacy surreal-data volumes
- Database export → surreal fix → v3 export → import workflow

**2. Rust Toolchain Optimization**
- Integrate lld linker (2x faster linking, Alpine-compatible)
- Implement cargo-chef for Docker layer caching (95% faster rebuilds)
- Configure cargo-watch with optimized pipeline
- Cleanup 88 compiler warnings
- Update backend Dockerfile with multi-stage chef build

**3. Backend Stack Upgrades** [BREAKING]
- Axum 0.7.9 → 0.8.8 (route syntax: `/users/:id` → `/users/{id}`)
- jsonwebtoken 9 → 10.3.0 (choose crypto backend: aws_lc_rs or rust_crypto)
- Safe updates: tokio 1.42→1.50, tower-http 0.5→0.6, utoipa 4.2→5.4

### Phase 2: Frontend Modernization (Depends on Phase 1)

**4. Nuxt Module Stack Upgrade** [BREAKING]
- @nuxt/image 1.11.0 → 2.0.0 (IPX v3, remove xs/xxl screen sizes)
- @nuxt/ui 3.3.7 → 4.5.1 (125+ unified components, uiPro→ui config key)
- @nuxt/eslint 0.7.6 → 1.15.2 (flat config format, ESLint v9+)
- @nuxtjs/i18n 9.5.6 → 10.2.3 (Vue I18n v11, remove lazy option)
- @nuxtjs/color-mode 3.5.2 → 4.0.0 (remove hid/classSuffix options)

**5. Nuxt Module Governance & Cleanup**
- Audit all configured modules against actual usage
- Implement underutilized modules: @nuxt/image (WebP), @nuxt/fonts (optimization)
- Remove unused: @nuxt/content, @formkit/auto-animate
- Align root and frontend package.json dependencies

**6. Docker Runtime & Dependency Sync**
- Fix Bun dependency synchronization in frontend container
- Resolve @vee-validate/nuxt runtime visibility issues
- Add missing Indonesian locale keys (footer.cookieSettings)
- Document dependency verification workflow

### Phase 3: User Experience & Content (Depends on Phase 2)

**7. Standardized Bilingual Content Strategy**
- Indonesian version: Hybrid approach (English service names + Indonesian content)
- English version: 100% English throughout
- Keep in English: Service names (Web Development, UI/UX Design), acronyms (SEO, API), navigation
- Translate to Indonesian: Page content, form labels, validation messages, blog articles
- Update all translation files (id.json, en.json) for consistency

**8. Full Localization Implementation**
- Remove hardcoded English from MainNav.vue
- Use i18n keys for all navigation labels
- Localize all page content (index, services, articles, about, contact)
- Localized SEO meta tags (title, description, OG tags)
- Implement hreflang tags properly for SEO

**9. Vue-Style Appearance Components**
- Replace scattered footer toggles with unified header "Appearance" dropdown
- Language switcher as dropdown menu item (ID/EN)
- Dark mode toggle with 0.3s CSS transitions and system preference detection
- localStorage persistence for theme preferences

**10. Contact Page & Responsive Layout Fixes**
- Embed interactive Google Maps iframe replacing static image
- Remove max-width constraints for full desktop viewport utilization
- Improve banner text readability with gradients and shadows
- Apply responsive fixes across contact, about, articles, services, works pages

### Phase 4: Features & Compliance (Can Parallelize with Phase 3)

**11. Analytics Consent Management**
- Cookie consent banner with tiered options (Essential, Analytics, Functional, Marketing)
- Consent-aware public config API filtering trackers by user preference
- Consent persistence in localStorage with 6-month expiration
- Refactor analytics plugin to check consent before initialization

**12. Article & Portfolio Detail Fixes + AI SEO**
- Fix routing/rendering bug where detail pages show list content
- Add article body fields (body_id, body_en) to content structure
- Create 12 full article contents (min 800 words each)
- Fix domain references: esperion.id → esperion.one
- Implement AI-friendly SEO: Speakable specification, tags system, entity linking
- Enhanced Article schema for AI citation (28-36% higher citation rate)

**13. Nuxt Modules Integration (Validation + API Docs + MCP)**
- Shared form validation for login, register, contact using Nuxt-native module
- Scalar API reference page consuming backend OpenAPI at /api/v1/openapi.json
- Nuxt MCP server endpoint with project-scoped tools and prompts
- Update public rendering from ISR to SWR where appropriate

**14. Nuxt Security Hardening**
- Security headers and CSP posture for Nuxt-served pages
- Coordinate with Axum CORS and auth cookie configurations
- Audit overlap with third-party scripts and embeds
- Ensure analytics and auth flows remain functional

**15. Version Tracking & AI Context**
- Create ESPERION_VERSIONS.md as single source of truth
- Add version check scripts to package.json
- Update README.md with version badges
- Document AI interaction guidelines (.ai-context.md)

## Capabilities

### New Capabilities

**Infrastructure & Backend:**
- `surrealdb-v3-migration`: Complete v1.5→v3.0.4 database upgrade with migration tooling
- `surrealdb-local-recovery`: Legacy volume detection, backup, and recovery scripts
- `rust-toolchain-optimization`: cargo-chef + lld linker + cargo-watch integration
- `backend-stack-upgrade`: Axum 0.8 + jsonwebtoken 10 + dependency updates

**Frontend Modernization:**
- `nuxt-modules-v4`: @nuxt/image v2, @nuxt/ui v4, @nuxt/eslint v1 migration
- `nuxt-module-governance`: Module audit, implementation, and cleanup process
- `frontend-dependency-sync`: Docker runtime dependency alignment
- `vue-style-appearance`: Unified header appearance menu with language/theme toggles

**Content & UX:**
- `bilingual-content-strategy`: Hybrid ID/EN content standardization
- `full-localization`: Complete i18n implementation for navigation and content
- `contact-page-enhancement`: Interactive map, responsive layout improvements
- `article-detail-fix`: Routing fix + AI-friendly SEO schema
- `form-validation-shared`: Reusable validation layer for public/dashboard forms

**Compliance & Features:**
- `analytics-consent-management`: Tiered consent banner + preference storage
- `api-reference-ui`: Scalar API docs from backend OpenAPI
- `ai-assistant-mcp`: Nuxt MCP server with project tools
- `nuxt-security-hardening`: CSP, security headers, frontend protections
- `version-tracking`: Centralized version documentation

### Modified Capabilities

- `database-queries`: Update all SQL for v3 compatibility (syntax changes)
- `api-routes`: Axum 0.8 route syntax migration
- `authentication`: jsonwebtoken v10 crypto backend selection
- `i18n-config`: Remove deprecated options (lazy, bundle.optimizeTranslationDirective)
- `eslint-config`: Migrate to flat config format
- `color-mode-config`: Simplified configuration without hid/classSuffix
- `public-website`: SWR rendering strategy, WebP images, optimized fonts
- `analytics-dashboard`: Consent governance settings
- `user-authentication`: Security hardening compatibility
- `documentation`: Version badges and tracking integration

## Impact

### Critical Breaking Changes

**Database (SurrealDB v3):**
- SQL syntax changes: UPDATE→UPSERT, file://→rocksdb://, DEFINE SCOPE→DEFINE ACCESS
- 40+ function renames (snake_case convention)
- Storage backend migration required
- Full database export/import cycle needed

**Backend (Axum 0.8):**
- Route parameter syntax: `:id` → `{id}`, `*path` → `{*path}`
- Remove async_trait macro (native async traits)
- Optional<Extractor> behavior change

**Authentication (jsonwebtoken 10):**
- Must explicitly choose crypto backend feature
- Pem decoding requires use_pem feature
- MSRV: Rust 1.85.0

**Frontend (Nuxt Modules):**
- @nuxt/image: Remove xs/xxl screen sizes
- @nuxt/ui: uiPro→ui config key change
- @nuxt/eslint: .eslintrc → eslint.config.ts (flat config)
- @nuxtjs/i18n: Remove lazy option (now default)
- @nuxtjs/color-mode: Remove hid/classSuffix options

### Files Modified

**Database & Infrastructure:**
- `docker-compose.yml` - SurrealDB v3.0.4 image, rocksdb command
- `backend/src/db/migrations/*.sql` - SQL syntax v3 compatibility
- `backend/src/**/*.rs` - RecordId migration, query updates
- `scripts/recover-local-surrealdb.*` - NEW recovery scripts
- `backend/Dockerfile` - Multi-stage cargo-chef + lld build

**Backend:**
- `backend/Cargo.toml` - Crate version updates, lld config
- `backend/src/main.rs` - Axum 0.8 route definitions
- `backend/src/handlers/*.rs` - Route-specific code updates

**Frontend:**
- `frontend/package.json` - Module version updates
- `package.json` (root) - Remove duplicate deps
- `bun.lockb` - Regenerate with Bun
- `nuxt.config.ts` - i18n, colorMode, rendering rules
- `app.config.ts` - uiPro→ui key change
- `eslint.config.ts` - NEW flat config
- `.eslintrc*` - REMOVED legacy config
- `frontend/app/locales/id.json` - Full Indonesian translations
- `frontend/app/locales/en.json` - Full English translations
- `frontend/app/data/public-content.ts` - Article body fields, tags

**Components & Pages:**
- `frontend/app/components/Navigation/MainNav.vue` - Appearance dropdown
- `frontend/app/components/Footer/SiteFooter.vue` - Remove toggles
- `frontend/app/pages/contact-us.vue` - Maps embed, responsive fixes
- `frontend/app/pages/articles/[slug].vue` - Routing fix, AI schema
- `frontend/app/pages/our-works/[slug].vue` - Routing fix
- Multiple public pages - Full localization

**New Files:**
- `ESPERION_VERSIONS.md` - Version registry
- `.ai-context.md` - AI interaction guidelines
- `frontend/content/articles/*.md` - 12 article contents
- `frontend/server/mcp/` - MCP server implementation
- `frontend/app/composables/useConsent.ts` - Consent management
- `frontend/app/components/CookieConsentBanner.vue` - Consent UI

### Dependencies

**New Tools:**
- SurrealDB 2.x CLI (temporary for migration)
- cargo-chef (Docker caching)
- lld linker (Alpine package)

**Updated Major Versions:**
- surrealdb: 1.5.0 → 3.0.4
- axum: 0.7.9 → 0.8.8
- jsonwebtoken: 9 → 10.3.0
- @nuxt/image: 1.11.0 → 2.0.0
- @nuxt/ui: 3.3.7 → 4.5.1
- @nuxt/eslint: 0.7.6 → 1.15.2
- @nuxtjs/i18n: 9.5.6 → 10.2.3
- @nuxtjs/color-mode: 3.5.2 → 4.0.0

**Removed:**
- @nuxt/content (unused)
- @formkit/auto-animate (unused)
- .eslintrc legacy configs

### Migration Requirements

**Database (CRITICAL):**
1. Full backup of production database
2. Export from v1.5.x
3. Run `surreal fix` for 2.x compatibility
4. Export with --v3 flag
5. Import into fresh v3.0.4 instance
6. Verify all 13 API handlers

**Local Development:**
- Legacy surreal-data volumes must be backed up and migrated
- Recovery scripts provided for both preserve-data and reset modes
- Health checks updated for cold-build awareness

**Rollback Strategy:**
- Database: Restore v1.5 backup → Restart v1.5 container (< 30 min)
- Code: Git revert to pre-migration commit
- Frontend: Revert package.json + lockfile

## Goals

1. **Infrastructure**: Complete SurrealDB v3 migration with zero data loss and working local recovery
2. **Performance**: Achieve 10x faster Rust rebuilds via cargo-chef + lld
3. **Modernization**: Upgrade all Nuxt modules to v4 ecosystem with breaking changes handled
4. **Content**: Establish consistent bilingual strategy with full localization
5. **UX**: Fix routing bugs, add interactive map, modernize appearance components
6. **Compliance**: Implement GDPR/PDP-compliant analytics consent management
7. **SEO**: AI-friendly schema markup with 28-36% citation rate improvement
8. **Documentation**: Centralized version tracking and AI context guidelines

## Non-Goals

1. No schema redesign (keep existing tables/fields)
2. No new features beyond version upgrades and listed capabilities
3. No backend API contract changes (endpoints remain same)
4. No major UI design changes (preserve Esperion Design System)
5. No production deployment topology changes
6. No automatic version updates (manual documentation only)

## Success Metrics

- [ ] Database migration: 100% data integrity, all 13 API handlers working
- [ ] Local recovery: Developer can recover from legacy volume in < 45 min
- [ ] Rust builds: 2x faster linking, 95% faster rebuilds on code-only changes
- [ ] Nuxt modules: Zero ESLint errors with new flat config
- [ ] Localization: Service names 100% consistent across footer, forms, filters
- [ ] SEO: Google Rich Results Test passing for Article schema
- [ ] Analytics: Consent banner functional, tiered preferences respected
- [ ] Routing: Detail pages render correctly after navigation from list pages
- [ ] Security: CSP headers configured without breaking analytics/auth

## Implementation Priority

**Phase 1 (Foundation - Days 1-3):**
1. SurrealDB v3 migration with local recovery tooling
2. Rust toolchain optimization (cargo-chef + lld)
3. Backend stack upgrades (Axum 0.8, jsonwebtoken 10)

**Phase 2 (Modernization - Days 4-6):**
4. Nuxt module stack upgrade v4
5. Module governance and cleanup
6. Docker runtime sync

**Phase 3 (Content & UX - Days 7-10):**
7. Bilingual content strategy
8. Full localization implementation
9. Vue-style appearance components
10. Contact page enhancements

**Phase 4 (Features - Days 11-14):**
11. Analytics consent management
12. Article/portfolio fixes + AI SEO
13. Shared form validation + API docs + MCP
14. Security hardening
15. Version tracking
