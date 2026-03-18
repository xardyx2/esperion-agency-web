## Phase 1: Infrastructure Foundation (Days 1-3)

### 1.1 SurrealDB v3 Migration

- [x] 1.1.1 Backup current production database (v1.5.6)
- [x] 1.1.2 Create migration script: export v1.5 → surreal fix → export v3 → import v3
- [x] 1.1.3 Update docker-compose.yml with surrealdb/surrealdb:v3.0.4 image
- [x] 1.1.4 Change storage from file:/data/esperion.db to rocksdb:/data/esperion.db
- [x] 1.1.5 Update all SQL migrations: UPDATE → UPSERT
- [x] 1.1.6 Update SQL: DEFINE SCOPE → DEFINE ACCESS TYPE RECORD
- [x] 1.1.7 Update SQL: SEARCH ANALYZER → FULLTEXT ANALYZER
- [x] 1.1.8 Update all SurrealDB function calls to snake_case (string::ends_with, etc.)
- [x] 1.1.9 Test database migration on staging environment
- [x] 1.1.10 Verify all 13 API handlers work with v3

### 1.2 Local Recovery Tooling

- [x] 1.2.1 Create scripts/recover-local-surrealdb.sh (Linux/Mac)
- [x] 1.2.2 Create scripts/recover-local-surrealdb.ps1 (Windows)
- [x] 1.2.3 Implement preserve-data mode (v1→v2→v3 migration path)
- [x] 1.2.4 Implement reset mode (clean v3 start with backup)
- [x] 1.2.5 Add health checks for database container
- [x] 1.2.6 Update README.md with recovery documentation
- [x] 1.2.7 Test recovery scripts on fresh machine

### 1.3 Rust Toolchain Optimization

- [x] 1.3.1 Install lld linker in backend Dockerfile (Alpine: apk add lld)
- [x] 1.3.2 Add lld configuration to backend/Cargo.toml [profile.dev]
- [x] 1.3.3 Install cargo-chef in Dockerfile
- [x] 1.3.4 Create multi-stage Dockerfile: planner → builder → runtime
- [x] 1.3.5 Configure cargo-watch for hot reload compatibility
- [x] 1.3.6 Address 88 compiler warnings (dead code cleanup)
- [x] 1.3.7 Test rebuild times (target: 2x faster linking, 95% faster rebuilds)
- [x] 1.3.8 Update docker-compose.yml with new build context

### 1.4 Backend Stack Upgrades

- [x] 1.4.1 Update backend/Cargo.toml: axum 0.7.9 → 0.8.8
- [x] 1.4.2 Update backend/Cargo.toml: jsonwebtoken 9 → 10.3.0 (with rust_crypto feature)
- [x] 1.4.3 Update backend/Cargo.toml: tokio 1.42.0 → 1.50.0
- [x] 1.4.4 Update backend/Cargo.toml: tower-http 0.5.2 → 0.6.8
- [x] 1.4.5 Update backend/Cargo.toml: utoipa 4.2.3 → 5.4.0
- [x] 1.4.6 Regenerate backend/Cargo.lock
- [x] 1.4.7 Migrate Axum routes: "/users/:id" → "/users/{id}"
- [x] 1.4.8 Migrate Axum routes: "/files/*path" → "/files/{*path}"
- [x] 1.4.9 Remove async_trait macro usage (native async traits)
- [x] 1.4.10 Fix Option<Extractor> behavior for Axum 0.8
- [x] 1.4.11 Update all handler files in backend/src/handlers/
- [x] 1.4.12 Test all API endpoints with new versions

## Phase 2: Frontend Modernization (Days 4-6)

### 2.1 Nuxt Module Stack Upgrade

- [x] 2.1.1 Update frontend/package.json: @nuxt/image 1.11.0 → 2.0.0
- [x] 2.1.2 Update frontend/package.json: @nuxt/ui 3.3.7 → 4.5.1
- [x] 2.1.3 Update frontend/package.json: @nuxt/eslint 0.7.6 → 1.15.2
- [x] 2.1.4 Update frontend/package.json: @nuxtjs/i18n 9.5.6 → 10.2.3
- [x] 2.1.5 Update frontend/package.json: @nuxtjs/color-mode 3.5.2 → 4.0.0
- [x] 2.1.6 Regenerate bun.lockb with Bun v1.1+
- [x] 2.1.7 Update nuxt.config.ts: remove i18n.lazy option
- [x] 2.1.8 Update nuxt.config.ts: remove i18n.bundle.optimizeTranslationDirective
- [x] 2.1.9 Update nuxt.config.ts: rename experimental.hmr → hmr for i18n
- [x] 2.1.10 Update nuxt.config.ts: remove colorMode.hid option
- [x] 2.1.11 Update nuxt.config.ts: remove colorMode.classSuffix
- [x] 2.1.12 Update app.config.ts: change uiPro key → ui

### 2.2 ESLint Flat Config Migration

- [x] 2.2.1 Create frontend/eslint.config.ts with flat config array
- [x] 2.2.2 Migrate rules from .eslintrc to eslint.config.ts
- [x] 2.2.3 Remove legacy .eslintrc file
- [x] 2.2.4 Remove legacy .eslintrc.cjs if exists
- [x] 2.2.5 Run ESLint and fix all errors (target: zero errors)
- [x] 2.2.6 Update CI/CD pipeline to use new ESLint config

### 2.3 Module Governance & Cleanup

- [x] 2.3.1 Audit all Nuxt modules in nuxt.config.ts
- [x] 2.3.2 Document keep/implement/remove decision for each module
- [x] 2.3.3 Remove @nuxt/content from dependencies (unused)
- [x] 2.3.4 Remove @formkit/auto-animate from dependencies (unused)
- [x] 2.3.5 Implement @nuxt/image: configure WebP with quality settings
- [x] 2.3.6 Add @nuxt/fonts: configure font optimization and preload
- [x] 2.3.7 Remove xs (320px) and xxl (1536px) screen sizes from image config
- [x] 2.3.8 Test all public pages after module cleanup

### 2.4 Docker Runtime & Dependency Sync

- [x] 2.4.1 Fix Bun dependency sync in frontend/Dockerfile.dev
- [x] 2.4.2 Ensure runtime dependencies match package.json
- [x] 2.4.3 Add missing Indonesian locale key: footer.cookieSettings
- [x] 2.4.4 Add missing English locale key if needed
- [x] 2.4.5 Fix @vee-validate/nuxt runtime visibility
- [x] 2.4.6 Document dependency verification workflow
- [x] 2.4.7 Test container rebuilds after dependency changes
- [x] 2.4.8 Verify all Nuxt modules load correctly in container

## Phase 3: Content & UX (Days 7-10)

### 3.1 Bilingual Content Strategy

- [x] 3.1.1 Update frontend/app/locales/id.json: service names in English
- [x] 3.1.2 Update frontend/app/locales/id.json: platform names in English
- [x] 3.1.3 Update frontend/app/locales/id.json: acronyms in English
- [x] 3.1.4 Update frontend/app/locales/id.json: navigation in English
- [x] 3.1.5 Update frontend/app/locales/id.json: CTAs in English
- [x] 3.1.6 Update frontend/app/locales/id.json: page content in Indonesian
- [x] 3.1.7 Update frontend/app/locales/id.json: form labels in Indonesian
- [x] 3.1.8 Update frontend/app/locales/id.json: validation messages in Indonesian
- [x] 3.1.9 Update frontend/app/locales/en.json: ensure 100% English
- [x] 3.1.10 Create BILINGUAL_STRATEGY.md documentation

### 3.2 Full Localization Implementation

- [x] 3.2.1 Update frontend/app/components/Navigation/MainNav.vue: remove hardcoded English
- [x] 3.2.2 Add i18n keys for navigation: t('nav.home'), t('nav.services'), etc.
- [x] 3.2.3 Update frontend/app/pages/index.vue: full i18n implementation
- [x] 3.2.4 Update frontend/app/pages/our-services.vue: full i18n implementation
- [x] 3.2.5 Update frontend/app/pages/articles.vue: full i18n implementation
- [x] 3.2.6 Update frontend/app/pages/about.vue: full i18n implementation
- [x] 3.2.7 Update frontend/app/pages/contact-us.vue: full i18n implementation
- [x] 3.2.8 Add localized SEO meta tags (title, description) for all pages
- [x] 3.2.9 Add Open Graph tags localization
- [x] 3.2.10 Verify hreflang tags are correct

### 3.3 Vue-Style Appearance Components

- [x] 3.3.1 Create Appearance dropdown component in MainNav.vue
- [x] 3.3.2 Add language switcher as dropdown menu item (ID/EN)
- [x] 3.3.3 Add dark mode toggle with system preference detection
- [x] 3.3.4 Add 0.3s CSS transition for theme changes
- [x] 3.3.5 Implement localStorage persistence for theme
- [x] 3.3.6 Implement localStorage persistence for language
- [x] 3.3.7 Remove language switcher from SiteFooter.vue
- [x] 3.3.8 Remove dark mode toggle from SiteFooter.vue
- [x] 3.3.9 Test appearance menu in both light and dark modes
- [x] 3.3.10 Test language switching from appearance menu

### 3.4 Contact Page & Responsive Layout Fixes

- [x] 3.4.1 Replace static map image with Google Maps embed on contact-us.vue
- [x] 3.4.2 Configure Google Maps iframe with proper API key
- [x] 3.4.3 Remove max-width constraints from contact-us.vue containers
- [x] 3.4.4 Remove max-width constraints from about.vue containers
- [x] 3.4.5 Remove max-width constraints from articles/[slug].vue containers
- [x] 3.4.6 Remove max-width constraints from our-services/[slug].vue containers
- [x] 3.4.7 Remove max-width constraints from our-works/[slug].vue containers
- [x] 3.4.8 Improve banner text readability with stronger gradients
- [x] 3.4.9 Add text shadows for better banner contrast
- [x] 3.4.10 Test responsive layout on mobile, tablet, desktop

## Phase 4: Features & Compliance (Days 11-14)

### 4.1 Analytics Consent Management

- [x] 4.1.1 Create frontend/app/components/CookieConsentBanner.vue
- [x] 4.1.2 Implement tiered consent UI (Essential, Analytics, Functional, Marketing)
- [x] 4.1.3 Create frontend/app/composables/useConsent.ts
- [x] 4.1.4 Implement localStorage consent persistence with 6-month expiration
- [x] 4.1.5 Add consent versioning to storage
- [x] 4.1.6 Refactor frontend/app/plugins/analytics.client.ts to check consent
- [x] 4.1.7 Implement dynamic tracker initialization based on consent
- [x] 4.1.8 Update backend analytics service to filter by consent tier
- [x] 4.1.9 Extend AnalyticsIntegrationSettings with consent_tiers field
- [x] 4.1.10 Add consent governance UI to dashboard/settings.vue

### 4.2 Article & Portfolio Detail Fixes

- [x] 4.2.1 Fix routing bug in frontend/app/pages/articles/[slug].vue
- [x] 4.2.2 Fix routing bug in frontend/app/pages/our-works/[slug].vue
- [x] 4.2.3 Update frontend/app/data/public-content.ts: add body_id field
- [x] 4.2.4 Update frontend/app/data/public-content.ts: add body_en field
- [x] 4.2.5 Update frontend/app/data/public-content.ts: add tags field
- [x] 4.2.6 Create frontend/content/articles/article-1.md through article-12.md
- [x] 4.2.7 Write 12 full articles (minimum 800 words each)
- [x] 4.2.8 Replace all esperion.id references with esperion.one
- [x] 4.2.9 Update frontend/app/composables/useSeoMeta.ts domain references
- [x] 4.2.10 Update frontend/app/composables/useLocalBusinessSchema.ts domain

### 4.3 AI-Friendly SEO Implementation

- [x] 4.3.1 Implement Speakable specification for articles
- [x] 4.3.2 Add article tags system for topical classification
- [x] 4.3.3 Add Wikidata entity linking to article content
- [x] 4.3.4 Enhance Article schema markup with AI-optimized properties
- [x] 4.3.5 Add citation/references structure to articles
- [x] 4.3.6 Implement atomic answer format for AI extraction
- [x] 4.3.7 Test with Google Rich Results Tool
- [x] 4.3.8 Validate schema markup for AI consumption

### 4.4 Nuxt Modules Integration

- [x] 4.4.1 Implement shared form validation for login.vue
- [x] 4.4.2 Implement shared form validation for register.vue
- [x] 4.4.3 Implement shared form validation for contact-us.vue
- [x] 4.4.4 Create Scalar API reference page consuming /api/v1/openapi.json
- [x] 4.4.5 Set up Nuxt MCP server endpoint
- [x] 4.4.6 Create MCP tools for project operations
- [x] 4.4.7 Create MCP resources for project data
- [x] 4.4.8 Update nuxt.config.ts: change ISR to SWR for public pages
- [x] 4.4.9 Configure SWR with 60s stale time
- [x] 4.4.10 Test form validation across all pages

### 4.5 Security Hardening

- [x] 4.5.1 Evaluate @nuxt/security module for v4 compatibility
- [x] 4.5.2 Configure security headers in nuxt.config.ts
- [x] 4.5.3 Define CSP policy for Nuxt-served pages
- [x] 4.5.4 Coordinate CSP with Axum CORS configuration
- [x] 4.5.5 Ensure auth cookies work with new security headers
- [x] 4.5.6 Verify analytics scripts work with CSP
- [x] 4.5.7 Test embeds (Google Maps) with CSP
- [x] 4.5.8 Add security verification tests

### 4.6 Version Tracking & Documentation

- [x] 4.6.1 Create ESPERION_VERSIONS.md with dependency matrix
- [x] 4.6.2 Add frontend dependency versions table
- [x] 4.6.3 Add backend crate versions table
- [x] 4.6.4 Add Docker image versions table
- [x] 4.6.5 Update README.md with version badges section
- [x] 4.6.6 Add quick version check commands to README.md
- [x] 4.6.7 Create .ai-context.md with AI interaction guidelines
- [x] 4.6.8 Add version check scripts to frontend/package.json
- [x] 4.6.9 Document "check files first" culture for AI assistants
- [x] 4.6.10 Update all documentation with new stack versions

## Verification & Testing

### 5.1 Integration Testing

- [x] 5.1.1 Run full Docker Compose stack test
- [x] 5.1.2 Test all 13 API handlers with v3 database
- [x] 5.1.3 Test authentication flow (register, login, refresh, logout)
- [x] 5.1.4 Test database CRUD operations
- [x] 5.1.5 Test i18n language switching
- [x] 5.1.6 Test dark/light mode transitions
- [x] 5.1.7 Test analytics consent flow
- [x] 5.1.8 Test article detail page routing
- [x] 5.1.9 Test contact form with validation
- [x] 5.1.10 Test responsive layouts across devices

### 5.2 Performance Verification

- [x] 5.2.1 Verify Rust build time improvement (target: 10x faster)
- [x] 5.2.2 Verify linking time improvement (target: 2x faster)
- [x] 5.2.3 Test frontend build with zero ESLint errors
- [x] 5.2.4 Verify WebP image optimization
- [x] 5.2.5 Test font loading optimization
- [x] 5.2.6 Run Lighthouse performance audit
- [x] 5.2.7 Verify Core Web Vitals scores

### 5.3 SEO & Compliance Verification

- [x] 5.3.1 Run Google Rich Results Test for Article schema
- [x] 5.3.2 Test SEO meta tags in both languages
- [x] 5.3.3 Verify hreflang implementation
- [x] 5.3.4 Test consent banner GDPR compliance
- [x] 5.3.5 Test consent banner PDP (Indonesian) compliance
- [x] 5.3.6 Verify CSP headers don't break functionality
- [x] 5.3.7 Test security headers with securityheaders.com

### 5.4 Rollback Preparation

- [x] 5.4.1 Verify database backup is restorable
- [x] 5.4.2 Document rollback procedure
- [x] 5.4.3 Test rollback to v1.5 in staging
- [x] 5.4.4 Create git tags for pre-migration state
- [x] 5.4.5 Document emergency contact procedures
- [x] 5.4.6 Verify Docker volume snapshots work
