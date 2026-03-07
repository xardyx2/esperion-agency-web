# Cline Memory Sync - Esperion Agency Web

## Project Overview
**Name:** Esperion Agency Web  
**OpenSpec Change:** `esperion-agency-web`  
**Schema:** spec-driven  
**Created:** 2026-03-05

## Current Status (Verified by Sisyphus)

### ✅ Completed (52% - 277/530 tasks)
- Infrastructure: 16/17 tasks
- Database connection & schema
- Backend APIs (Articles, Works, Services, Clients)
- Frontend pages (all public & dashboard pages)
- SEO Scoring, Nuxt Studio, PWA, Accessibility
- CI/CD pipeline (GitHub Actions)

### ❌ Critical Issues Found
1. **Pinia Stores MISSING** - Frontend/auth broken
2. **Auth Logout** - Only TODO stub
3. **Token Refresh** - Returns mock data
4. **reCAPTCHA** - Disabled
5. **Multi-language** - Not started (11 tasks)
6. **Testing** - Mostly fake claims (18% real)

## OpenSpec Structure
```
openspec/changes/esperion-agency-web/
├── .openspec.yaml          # spec-driven config
├── proposal.md             # Business case
├── design.md               # Technical architecture
├── specs/                  # Feature specs
│   ├── user-authentication/spec.md
│   ├── public-website/spec.md
│   ├── article-management/spec.md
│   ├── contact-form/spec.md
│   ├── client-showcase/spec.md
│   ├── service-catalog/spec.md
│   ├── portfolio-works/spec.md
│   └── docker-infrastructure/spec.md
└── tasks.md                # 761 tasks
```

## Working Plan (4 Phases)

### Phase 1: Security (Week 1)
- Implement Pinia stores
- Fix auth logout
- Fix token refresh
- Enable reCAPTCHA

### Phase 2: Multi-Language (Week 2)
- i18n configuration
- Language switcher
- Translation API

### Phase 3: Testing (Week 3)
- Playwright E2E
- k6 load testing
- Fix unit tests

### Phase 4: Features (Week 4)
- Email system
- DB migrations
- WebP conversion

## Key Files
- Backend: `backend/src/handlers/` - Axum handlers
- Frontend: `frontend/app/` - Nuxt 4 app directory
- Database: SurrealDB 3.x
- Tests: `frontend/tests/`, `backend/tests/`

## Tools Available
- Node.js v24.13.1
- Rust/Cargo
- Docker
- npm, bun

## Verification Reports
- `.sisyphus/audit-reports/TASK-VERIFICATION-REPORT-2026-03-07.md`
- `.sisyphus/plans/openspec-work-plan.md`

## Next Actions
1. Deploy agents for Phase 1 (Security)
2. Fix critical vulnerabilities
3. Implement missing features
4. Add proper testing

---
*Last synced: 2026-03-07 by Sisyphus*
