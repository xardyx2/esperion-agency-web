# MASTER PLAN: ESPERION AGENCY WEB
## Perbaikan Project → SEO Implementation → Content Marketing

**Tanggal**: 7 Maret 2026  
**Status**: Production Ready 95%  
**Timeline Total**: 3-4 Minggu  
**Target**: Website stabil & SEO-ready untuk market Jakarta

---

## 📋 EXECUTIVE SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT ROADMAP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   FASE 1: PROJECT FIXES (Week 1-2)          PRIORITY: CRITICAL │
│   ├─ Fix failing tests (unit & component)                      │
│   ├─ Implement proper CI/CD pipeline                           │
│   ├─ Setup staging environment                                 │
│   ├─ Bug fixes & stability improvements                        │
│   └─ Pre-production testing                                    │
│   🎯 Output: Project 100% stable, ready for production         │
│                                                                 │
│   FASE 2: SEO IMPLEMENTATION (Week 2-3)       PRIORITY: HIGH   │
│   ├─ Technical SEO (schema, meta, speed)                       │
│   ├─ 7 Artikel SEO-optimized                                   │
│   ├─ Local SEO (GMB, citations)                                │
│   ├─ Google Search Console setup                               │
│   └─ Indexing & rank tracking                                  │
│   🎯 Output: Website SEO-ready, content published              │
│                                                                 │
│   FASE 3: MONITORING & GROWTH (Ongoing)       PRIORITY: MEDIUM │
│   ├─ Weekly content publishing                                 │
│   ├─ Rank tracking & optimization                              │
│   ├─ Analytics & reporting                                     │
│   ├─ Competitor monitoring                                     │
│   └─ Continuous improvement                                    │
│   🎯 Output: Top 10 rankings, organic growth                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔴 FASE 1: PROJECT FIXES (Week 1-2)
**PRIORITY**: CRITICAL  
**GOAL**: Stabilkan project, fix semua issues, siap production

### 1.1 Testing Infrastructure (Days 1-3)

#### Current Issues
- ❌ Unit tests: FAILING (invalid imports)
- ❌ Component tests: FAILING (invalid imports)
- ❌ E2E tests: NOT IMPLEMENTED
- ❌ Performance tests: NOT IMPLEMENTED

#### Action Items

**Day 1: Fix Test Configuration**
```bash
# Tasks:
- [ ] Audit semua test files dengan invalid imports
- [ ] Fix TypeScript path aliases dalam tests
- [ ] Update vitest.config.ts untuk proper module resolution
- [ ] Setup test environment variables
- [ ] Create test utilities & mocks

# Files to fix:
- frontend/tests/components/SeoScoreDisplay.test.ts
- frontend/tests/stores/*.test.ts
- frontend/vitest.config.ts
```

**Day 2: Fix Unit Tests**
```bash
# Tasks:
- [ ] Fix auth store tests
- [ ] Fix user store tests
- [ ] Fix ui store tests
- [ ] Fix composables tests (useApi, useColorMode)
- [ ] Fix utility function tests

# Expected: All unit tests passing
# Coverage target: 70%+
```

**Day 3: Component & Integration Tests**
```bash
# Tasks:
- [ ] Fix SeoScoreDisplay component test
- [ ] Create tests for critical components
- [ ] Setup component testing utilities
- [ ] Add snapshot tests for UI components
- [ ] Test error boundaries

# Components to test:
- SeoScoreDisplay.vue
- LanguageSwitcher.vue
- Login form
- Article editor
```

**Deliverables:**
- ✅ All unit tests passing
- ✅ All component tests passing
- ✅ Test coverage report 70%+
- ✅ CI test job configured

---

### 1.2 E2E Testing dengan Playwright (Days 4-5)

#### Current Status
- ❌ Playwright: NOT IMPLEMENTED
- ❌ E2E tests: NOT FOUND

#### Action Items

**Day 4: Setup Playwright**
```bash
# Installation
npm install -D @playwright/test
npx playwright install

# Configuration
- [ ] Create playwright.config.ts
- [ ] Setup test environments (dev, staging)
- [ ] Configure parallel execution
- [ ] Setup test data fixtures
- [ ] Create auth setup untuk login sessions
```

**Day 5: Create E2E Tests**
```typescript
// Critical flows to test:
- [ ] Auth flow: Register → Login → Logout
- [ ] Article CRUD: Create → Edit → Publish → Delete
- [ ] Public pages: Home → Works → Services → Articles
- [ ] Contact form: Submit with reCAPTCHA
- [ ] Dashboard navigation: All menu items
- [ ] Multi-language: Switch ID ↔ EN
- [ ] Mobile responsiveness: All breakpoints
- [ ] SEO meta tags: Verify on all pages

// Test files to create:
e2e/
├── auth.spec.ts
├── articles.spec.ts
├── contact.spec.ts
├── public-pages.spec.ts
└── dashboard.spec.ts
```

**Deliverables:**
- ✅ Playwright configured
- ✅ 5+ E2E test suites
- ✅ CI E2E job passing
- ✅ Cross-browser testing (Chrome, Firefox, WebKit)

---

### 1.3 Performance Testing (Day 6)

#### Current Status
- ❌ Lighthouse: NOT IMPLEMENTED
- ❌ Load testing: NOT IMPLEMENTED
- ❌ Core Web Vitals: Need optimization

#### Action Items

**Lighthouse CI Setup**
```bash
# Install
npm install -D @lhci/cli

# Configuration
- [ ] Create lighthouserc.js
- [ ] Setup performance budgets
- [ ] Configure assertions (SEO, Accessibility, Performance)

# Targets:
Performance: > 90
Accessibility: > 95
Best Practices: > 90
SEO: > 95
```

**Load Testing dengan k6**
```javascript
// tests/load/
- [ ] api-load.js (API endpoints)
- [ ] auth-load.js (Authentication)
- [ ] contact-form-load.js (Form submission)
- [ ] articles-load.js (Content pages)

// Scenarios:
- Smoke test: 10 VU, 30s
- Load test: 50 VU, 5m
- Stress test: 200 VU, 10m
```

**Core Web Vitals Optimization**
```bash
# Targets:
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1

# Optimizations:
- [ ] Image optimization (WebP, lazy loading)
- [ ] Font optimization (preload, font-display: swap)
- [ ] Script optimization (defer non-critical)
- [ ] CSS optimization (critical CSS extraction)
- [ ] Caching strategy (ISR, browser cache)
```

**Deliverables:**
- ✅ Lighthouse CI configured
- ✅ Performance budget defined
- ✅ k6 load tests created
- ✅ Core Web Vitals optimized

---

### 1.4 CI/CD Pipeline (Days 7-10)

#### Current Status
- ❌ Staging: PLACEHOLDER only
- ❌ Production: PLACEHOLDER only
- ❌ Auto-rollback: PLACEHOLDER only

#### Action Items

**Day 7-8: GitHub Actions Workflow**
```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - [ ] Checkout code
      - [ ] Setup Node.js 20
      - [ ] Install dependencies
      - [ ] Run lint
      - [ ] Run unit tests
      - [ ] Run component tests
      - [ ] Upload coverage report

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - [ ] Checkout code
      - [ ] Setup Playwright
      - [ ] Run E2E tests
      - [ ] Upload test results

  lighthouse:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - [ ] Checkout code
      - [ ] Build production
      - [ ] Run Lighthouse CI
      - [ ] Upload results

  build:
    runs-on: ubuntu-latest
    needs: [test, e2e, lighthouse]
    steps:
      - [ ] Build frontend
      - [ ] Build backend
      - [ ] Create Docker images
      - [ ] Push to registry
```

**Day 9: Staging Environment**
```bash
# Setup staging server (VPS/Cloud)
- [ ] Provision staging VPS (2 core / 4GB RAM)
- [ ] Setup Docker Compose staging
- [ ] Configure environment variables
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Configure domain (staging.esperion.id)

# Auto-deploy:
- [ ] Deploy on every push to develop branch
- [ ] Database migration (automatic)
- [ ] Smoke tests post-deploy
- [ ] Notification (Discord/Slack)
```

**Day 10: Production Pipeline**
```bash
# Production deployment:
- [ ] Manual approval required
- [ ] Blue-green deployment
- [ ] Health checks
- [ ] Auto-rollback on failure
- [ ] Database backup pre-deploy

# 1Panel deployment:
- [ ] Create deployment script
- [ ] Configure 1Panel compose
- [ ] Environment management
- [ ] SSL auto-renewal

# Monitoring:
- [ ] Post-deploy smoke tests
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime alerts
```

**Deliverables:**
- ✅ Complete CI/CD pipeline
- ✅ Staging environment active
- ✅ Auto-deploy to staging
- ✅ Manual deploy to production
- ✅ Auto-rollback configured

---

### 1.5 Bug Fixes & Stabilization (Days 11-14)

#### Known Issues dari Audit

**Critical Bugs:**
- [ ] Auth logout: STUB (only TODO comment)
- [ ] Token refresh: MOCK (returns mock data)
- [ ] Session management: NOT IMPLEMENTED
- [ ] Rate limiting: NOT IMPLEMENTED

**Medium Priority:**
- [ ] Form validation edge cases
- [ ] Image upload error handling
- [ ] Mobile navigation glitches
- [ ] Dark mode flash on load

**Low Priority:**
- [ ] Minor UI inconsistencies
- [ ] Console warnings cleanup
- [ ] Unused code removal

**Action Items:**

**Day 11-12: Auth System Fixes**
```rust
// Backend fixes:
- [ ] Implement proper logout dengan token blacklisting
- [ ] Fix token refresh dengan proper rotation
- [ ] Add session management endpoints
- [ ] Implement device tracking
- [ ] Add rate limiting (per-endpoint + global)

// Frontend fixes:
- [ ] Fix auth store logout action
- [ ] Fix token refresh interceptor
- [ ] Add session expiry handling
- [ ] Fix auto-logout on 401
```

**Day 13: UI/UX Fixes**
```bash
# Mobile fixes:
- [ ] Fix navigation menu on mobile
- [ ] Fix touch targets (min 44px)
- [ ] Fix font sizes on small screens
- [ ] Fix horizontal scrolling issues

# Dark mode:
- [ ] Fix flash on page load
- [ ] Fix color contrast issues
- [ ] Add transition animations

# Forms:
- [ ] Fix validation error messages
- [ ] Add loading states
- [ ] Fix focus management
```

**Day 14: Final Testing & Polish**
```bash
# Comprehensive testing:
- [ ] Full regression testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility audit
- [ ] Security scan

# Documentation:
- [ ] Update API documentation
- [ ] Update deployment guide
- [ ] Create troubleshooting guide
```

**Deliverables:**
- ✅ All critical bugs fixed
- ✅ Auth system 100% functional
- ✅ Mobile experience optimized
- ✅ Project 100% stable
- ✅ Ready for production

---

## 🟢 FASE 2: SEO IMPLEMENTATION (Week 2-3)
**PRIORITY**: HIGH  
**GOAL**: Website SEO-ready, content published, indexed by Google

### 2.1 Technical SEO Foundation (Days 15-17)

#### 2.1.1 Schema.org Markup

**Day 15: Install & Configure**
```bash
# Installation
npm install -D @nuxtjs/schema-org

# Configuration (nuxt.config.ts)
modules: [
  '@nuxtjs/schema-org',
  // ... other modules
]

schemaOrg: {
  identity: {
    type: 'Organization',
    name: 'Esperion Digital Agency',
    url: 'https://esperion.id',
    logo: '/logo.png',
  }
}
```

**Day 16: Implement Schema Types**
```typescript
// 1. Organization Schema (Homepage)
// 2. Article Schema (Blog posts)
// 3. BreadcrumbList Schema (All pages)
// 4. FAQPage Schema (Service pages)
// 5. LocalBusiness Schema

// Files to update:
- app/pages/index.vue
- app/pages/articles/[slug].vue
- app/pages/our-services/[slug].vue
- app/layouts/default.vue (breadcrumbs)
```

**Day 17: Meta Tags Optimization**
```typescript
// Update all pages dengan proper SEO meta

// Homepage:
useSeoMeta({
  title: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  description: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media, dan website development. Konsultasi GRATIS!',
  ogTitle: '...',
  ogDescription: '...',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  canonical: 'https://esperion.id/id'
})

// Article pages:
useSeoMeta({
  title: `${article.title} | Esperion Digital Agency`,
  description: article.excerpt,
  articleAuthor: article.author,
  articlePublishedTime: article.published_at,
  articleSection: article.category,
  ogType: 'article'
})
```

---

### 2.2 Content Creation Sprint (Days 18-22)

#### 2.2.1 7 Artikel SEO-Optimized

**Day 18: Artikel 1-2**
```markdown
Artikel 1: "Digital Agency Terbaik di Jakarta: Panduan Lengkap 2024"
- Target: "digital agency jakarta", "digital agency terbaik jakarta"
- Length: 2,000+ kata
- SEO Score Target: 85+
- Outline:
  1. Apa itu digital agency dan mengapa penting?
  2. 5 Kriteria memilih digital agency terbaik
  3. Perbandingan layanan agency di Jakarta
  4. Case study: Sukses dengan digital agency
  5. CTA: Free consultation

Artikel 2: "Jasa Digital Marketing: Strategi Ampuh untuk Bisnis Indonesia"
- Target: "jasa digital marketing", "strategi digital marketing"
- Length: 2,200+ kata
- SEO Score Target: 85+
```

**Day 19: Artikel 3-4**
```markdown
Artikel 3: "Jasa SEO Jakarta: Cara Ranking #1 di Google Indonesia"
- Target: "jasa seo jakarta"
- Include: Schema HowTo untuk checklist SEO
- SEO Score Target: 90+

Artikel 4: "Social Media Marketing Jakarta: Dominasi Instagram & TikTok"
- Target: "social media marketing jakarta"
- Include: Video embed placeholders
- SEO Score Target: 85+
```

**Day 20: Artikel 5**
```markdown
Artikel 5: "Website Development: Kenapa Perusahaan Jakarta Perlu Redesign?"
- Target: "website development jakarta"
- Include: Before/after screenshots
- SEO Score Target: 85+
```

**Day 21: Artikel 6-7**
```markdown
Artikel 6: "Digital Marketing Agency vs In-House: Mana Lebih Baik?"
- Target: "digital marketing agency"
- Include: Interactive comparison table
- SEO Score Target: 88+

Artikel 7: "Content Creation Agency: Produksi Konten Skala Besar"
- Target: "content creation agency"
- Include: Downloadable templates
- SEO Score Target: 85+
```

**Day 22: Content Review & Optimization**
```bash
# Tasks:
- [ ] Review all 7 articles
- [ ] Check SEO scores (target: 85+)
- [ ] Optimize internal linking
- [ ] Add images dengan alt text
- [ ] Final proofreading
```

---

### 2.3 Local SEO (Days 23-24)

**Day 23: Google My Business Setup**
```bash
# GMB Optimization Checklist:
- [ ] Claim & verify GMB listing
- [ ] Complete all business information
- [ ] Add Jakarta keywords in description
- [ ] Upload 10+ high-quality photos
- [ ] Service areas: Jakarta, Tangerang, Bekasi
- [ ] Add products/services
- [ ] Enable messaging
- [ ] Add Q&A section

# Weekly tasks:
- [ ] Post updates (articles, promos)
- [ ] Respond to reviews (24 jam target)
```

**Day 24: Local Citations**
```bash
# Priority directories:
1. Google My Business
2. Yelp Indonesia
3. Facebook Business
4. LinkedIn Company
5. Indonesia Business Directory
6. Jakarta Business Center
7. Tribun Jual Beli
8. OLX Business

# NAP Consistency:
Name: Esperion Digital Agency
Address: [Jakarta Address]
Phone: +62-[xxx]-[xxxx]-[xxxx]
(Identical across all platforms)
```

---

### 2.4 Google Search Console & Indexing (Days 25-26)

**Day 25: GSC Setup**
```bash
# Setup tasks:
- [ ] Verify website ownership (DNS/HTML file)
- [ ] Submit sitemap.xml
- [ ] Configure international targeting (Indonesia)
- [ ] Setup URL parameters
- [ ] Configure crawl rate

# Monitoring:
- [ ] Check indexing status
- [ ] Review coverage report
- [ ] Fix crawl errors
- [ ] Submit individual URLs
```

**Day 26: Rank Tracking Setup**
```bash
# Tools:
- [ ] Setup Google Search Console (free)
- [ ] Setup Ubersuggest (free tier)
- [ ] Setup Google Analytics 4
- [ ] Setup rank tracking spreadsheet

# Keywords to track (15 keywords):
Tier 1: digital agency jakarta, agency digital marketing, jasa digital marketing
Tier 2: jasa seo jakarta, jasa iklan google, social media marketing jakarta
Tier 3: digital agency terbaik jakarta, strategi digital marketing 2024
```

---

## 🟡 FASE 3: MONITORING & GROWTH (Ongoing)
**PRIORITY**: MEDIUM  
**GOAL**: Maintain rankings, continuous improvement, organic growth

### 3.1 Content Calendar (Weekly)

```markdown
## Weekly Publishing Schedule

Week 4+: Publish 2-3 artikel per minggu

Content Pillars:
1. Digital Marketing Tips (40%)
2. SEO Guides (30%)
3. Case Studies (20%)
4. Industry News (10%)

Monthly Themes:
- Month 1: Foundation (SEO basics)
- Month 2: Social Media Marketing
- Month 3: Content Marketing
- Month 4: Paid Advertising
- Month 5: Analytics & Reporting
- Month 6: Advanced Strategies
```

### 3.2 Monitoring Dashboard

```bash
# Weekly checks:
- [ ] Google Search Console performance
- [ ] Rank tracking update
- [ ] Organic traffic analysis
- [ ] Competitor monitoring
- [ ] Content performance review

# Monthly reports:
- [ ] SEO performance report
- [ ] Content audit
- [ ] Backlink analysis
- [ ] Technical SEO audit
- [ ] Strategy adjustment
```

### 3.3 Success Metrics

```markdown
## Week 1 Targets (SEO Launch)
- ✅ 7 artikel published (SEO score 85+)
- ✅ Google indexing dalam 48 jam
- ✅ Schema.org implemented
- ✅ GMB optimization complete

## Month 1 Targets
- 🎯 Top 10 ranking untuk 3+ keywords
- 🎯 Organic traffic increase 25%
- 🎯 5+ leads dari organic search

## Month 3 Targets
- 🎯 Top 5 ranking untuk "digital agency jakarta"
- 🎯 Organic traffic increase 50%
- 🎯 20+ qualified leads per bulan
- 🎯 Page 1 untuk 10+ keywords

## Month 6 Targets
- 🎯 #1 ranking untuk "digital agency jakarta"
- 🎯 Dominasi page 1 untuk service keywords
- 🎯 50+ qualified leads per bulan
- 🎯 100% organic growth YoY
```

---

## 📊 RESOURCE ALLOCATION

### Week 1-2: Project Fixes
| Resource | Tasks | Days |
|----------|-------|------|
| Agent 1 | Fix unit tests | 2 |
| Agent 2 | Fix component tests | 2 |
| Agent 3 | Setup Playwright E2E | 2 |
| Agent 4 | CI/CD pipeline | 4 |
| Agent 5 | Bug fixes | 3 |

### Week 2-3: SEO Implementation
| Resource | Tasks | Days |
|----------|-------|------|
| Agent 1 | Technical SEO | 3 |
| Agent 2 | Content creation (4 artikel) | 4 |
| Agent 3 | Content creation (3 artikel) | 3 |
| Agent 4 | Local SEO & GMB | 2 |
| Agent 5 | GSC & monitoring | 2 |

### Week 4+: Ongoing
| Resource | Tasks | Frequency |
|----------|-------|-----------|
| Content Writer | 2-3 artikel/minggu | Weekly |
| SEO Specialist | Monitoring & optimization | Weekly |
| Developer | Technical maintenance | As needed |

---

## 🎯 DECISION POINTS

### Decision 1: Start Implementation?
**Options:**
- **A**: Deploy agents untuk Fase 1 (Project Fixes)
- **B**: Deploy agents untuk Fase 2 (SEO) - SKIP fixes
- **C**: Deploy agents untuk semua fase (parallel)
- **D**: Review & modify plan dulu

**Rekomendasi**: Pilih **A** - Fix project dulu untuk foundation yang kuat.

### Decision 2: Content Creation Approach
**Options:**
- **AI-Assisted**: Gunakan Alibaba AI untuk draft, human edit
- **Human-Only**: 100% manual writing
- **Hybrid**: AI untuk research, human untuk writing

**Rekomendasi**: Pilih **Hybrid** - Balance quality & speed.

### Decision 3: Deployment Strategy
**Options:**
- **Big Bang**: Launch semua sekaligus
- **Phased**: Staging dulu, then production
- **Canary**: Gradual rollout

**Rekomendasi**: Pilih **Phased** - Minimal risk, maximal control.

---

## 📁 DELIVERABLES

### Dokumen:
1. ✅ `.sisyphus/MASTER-PLAN-2026-03-07.md` (ini)
2. ✅ `.sisyphus/SEO-STRATEGY-2026-03-07.md`
3. ✅ `.sisyphus/RINGKASAN-LENGKAP-SEO-2026-03-07.md`
4. ✅ `openspec/changes/esperion-agency-web/proposal.md` (updated)

### Code:
- [ ] Fixed test suite
- [ ] CI/CD pipeline
- [ ] SEO implementation
- [ ] 7 artikel SEO-optimized
- [ ] Monitoring setup

### Infrastructure:
- [ ] Staging environment
- [ ] Production deployment
- [ ] Monitoring tools
- [ ] Backup system

---

## 🚀 NEXT ACTION

**Anda perlu memutuskan:**

### Option A: Mulai Fase 1 (Project Fixes)
Saya deploy 5 agents parallel untuk:
- Fix testing infrastructure
- Setup CI/CD pipeline
- Fix critical bugs
- Stabilize project

**Timeline**: 2 minggu  
**Output**: Project 100% stable

### Option B: Mulai Fase 2 (SEO)
Saya deploy agents untuk SEO implementation (asumsi project sudah stable).

**Timeline**: 1-2 minggu  
**Output**: Website SEO-ready

### Option C: Mulai Semua Fase
Deploy semua agents sekaligus (parallel execution).

**Timeline**: 2-3 minggu  
**Output**: Complete solution

### Option D: Review & Modify
Diskusikan plan lebih lanjut, modify sesuai kebutuhan.

---

**Pilihan Anda?** (A/B/C/D)
