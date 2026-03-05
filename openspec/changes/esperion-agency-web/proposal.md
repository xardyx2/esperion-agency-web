# Esperion Agency Web - Proposal (Updated v2)

## Why

Esperion Digital Agency membutuhkan platform all-in-one yang menggabungkan:
1. **Public Website** dengan SEO optimal, multi-language support, dan Nuxt Studio visual editing
2. **Dashboard Agency CMS** dengan AI-powered content creation, SEO scoring, dan advanced media management
3. **Dashboard Capital** untuk automated trading dari TradingView → Binance Futures

Platform ini harus mendukung workflow tim internal dengan role-based permissions, offline-first editing, enterprise analytics dengan custom journey tracking, dan integrasi enterprise (Google Analytics, ERPNext, SMTP, CDN, Pixels).

---

## What Changes

### Phase 1: Public Website + Dashboard Agency

**Public Website:**
- 6 halaman (Home, Our Works, Our Services, Articles, About Us, Contact Us) dengan ISR
- Multi-language support (/id/, /en/) dengan auto-detect locale + Alibaba AI translation
- SEO-complete: Meta tags, schema.org, dynamic sitemap, OG images, local SEO (Jakarta/Depok/Bogor)
- Dynamic content via dashboard (banners, stats, featured content)
- **Nuxt Studio compatible**: Visual editor untuk semua public pages dengan draft mode + preview URL

**Dashboard Agency:**
- Article Management dengan AI generator (SEO score 0-100), revision history, auto-save
- SEO Scoring Engine: Real-time scoring dengan competitor analysis
- Media Library terorganisir (Year/Month/Type) dengan WebP conversion
- Works/Portfolio/Services/Clients/Contact management
- Custom roles dengan granular permissions
- Google Analytics + GTM + Microsoft Clarity integration + charts
- Email notifications (SMTP built-in + 5 providers)
- Backup/Restore (Updraft-style: selective, scheduled)
- **Enterprise Analytics**: Custom journey tracking, pixel integrations (Meta/TikTok/LinkedIn)

**Dashboard Capital (Phase 2-ready):**
- TradingView webhook receiver dengan validation
- Binance Futures trading via WebSocket API
- Multi-robot support dengan auto capital allocation
- Advanced trailing stop (per-pair + portfolio-level)
- Real-time position tracking + PnL
- Trading journal (manual vs robot)

### Infrastructure & DevOps

- Docker Compose dengan hot reload (Nuxt HMR, cargo-watch)
- CI/CD: GitHub Actions + staging + auto rollback
- Monitoring: Uptime Kuma + Sentry + alerting (email, push, Google Chat, Discord)
- Testing: E2E (Playwright), visual regression, load testing + unit test per major task
- Backup: Auto-backup (daily/weekly/monthly) + one-click selective restore

---

## Capabilities

### New Capabilities

| Capability | Description |
|------------|-------------|
| **public-website** | ISR-rendered pages dengan multi-language (/id/, /en/), dynamic banners, SEO-complete (meta, schema.org, sitemap), Nuxt Studio compatible |
| **user-authentication** | JWT (7-day) + device tracking + session management + 2FA (optional) |
| **article-management** | CRUD + AI generator (Alibaba) + SEO score 0-100 + revision history + auto-save (1min/50chars) + offline mode + conflict resolution + competitor analysis |
| **media-library** | Centralized upload + WebP conversion + Year/Month/Type organization + alt text management + CDN integration |
| **contact-form** | reCAPTCHA v3 + email notifications + Google Chat webhook + auto-reply + CSV export/import |
| **portfolio-works** | CRUD + metrics (animated counters) + testimonials + featured toggle + manual pick |
| **service-catalog** | CRUD + pricing table (range format) + FAQ (general, SEO) |
| **client-showcase** | CRUD + categories + status + internal notes + counting animation + logo carousel (14 logos) |
| **user-management** | Custom roles (Admin, Editor, Author + custom) + granular permissions + activity log (global/per-user/per-role) |
| **analytics-dashboard** | Google Analytics 4 + GTM + Microsoft Clarity + custom journey tracking + pixel integrations (Meta/TikTok/LinkedIn) + enterprise-level reports |
| **email-system** | Built-in SMTP + 5 providers (SendGrid, Mailgun, SES, etc.) + template editor |
| **backup-restore** | Scheduled backup (daily/weekly/monthly) + selective restore + encryption (optional) |
| **monitoring-alerting** | Uptime Kuma + Sentry + multi-channel alerts (email, push, Google Chat, Discord) |
| **trading-capital** | TradingView webhook → Binance Futures + multi-robot + auto capital allocation + trailing stop (2-level) + trading journal |
| **docker-infrastructure** | Full stack containerization + hot reload + CI/CD + staging environment |
| **nuxt-studio** | Visual page editor untuk semua public pages + draft mode + preview URL + SurrealDB storage |
| **seo-scoring** | Real-time SEO score 0-100 + competitor analysis + improvement suggestions |
| **translation-system** | Manual/AI/Third-party translation + review workflow + translation memory |
| **copywriting-system** | Brand voice (Friendly & Approachable) + 5 banner slides + USP per service dengan editable statistics |

### Modified Capabilities

<!-- Tidak ada modified capabilities - ini adalah project baru -->

---

## Impact

### Frontend
| Aspect | Details |
|--------|---------|
| Framework | Nuxt 4 dengan `app/` directory structure |
| Rendering | ISR (public) / CSR (dashboard) |
| Language | TypeScript strict mode (NO `any`) |
| UI Library | Nuxt UI + custom components (free, brand-aligned) |
| Styling | TailwindCSS dengan Esperion semantic colors |
| State | Pinia (light logic) + WebSocket store (real-time) |
| Animations | VueUse (counting) + Vue Carousel (sliders) |
| Forms | FormKit + custom validators + multi-step wizards |
| Charts | Chart.js + custom wrappers (hedge fund style) |
| PWA | Enabled dengan offline support |
| Accessibility | WCAG 2.1 AA + keyboard nav + screen reader |
| Multi-language | /id/, /en/ prefix + auto-detect + Alibaba AI translation |
| Visual Editing | Nuxt Studio compatible + draft mode + preview URL |

### Backend
| Aspect | Details |
|--------|---------|
| Language | Rust (latest stable) |
| Framework | Axum + Tokio runtime |
| API Docs | utoipa + utoipa-scalar (OpenAPI) |
| Auth | JWT (7-day) + Argon2 hashing + device tracking |
| Rate Limiting | Per-endpoint + global (Binance-style) |
| API Versioning | v1, v2+ dengan backward compatibility |
| Security | CSP, HSTS, API signature, audit logging |
| Logging | Structured JSON + Sentry (free tier) |
| Caching | SurrealDB-based (configurable via dashboard) |
| Job Queue | SurrealDB-based (no Redis) |
| Background Jobs | Notifications, backup, image processing, reports |
| Scheduled Jobs | Cron for auto-publish, daily reports, competitor analysis (weekly) |

### Database
| Aspect | Details |
|--------|---------|
| System | SurrealDB 3.x dengan Rust SDK |
| Schema | Strict schema (DEFINE TABLE, DEFINE FIELD) |
| Migration | Version control for schema changes |
| Connection | Built-in pooling (no external Redis) |
| Caching | Built-in caching with configurable TTL |
| Content Storage | All content (including Nuxt Studio edits) in SurrealDB |

### Infrastructure
| Aspect | Details |
|--------|---------|
| Containers | Docker + Docker Compose (3 services) |
| Development | Hot reload (Nuxt HMR, cargo-watch) |
| Production | S3-compatible storage + CDN (5 providers) |
| CI/CD | GitHub Actions + staging + auto rollback |
| Monitoring | Uptime Kuma + performance monitoring (free) |
| Backup | Auto-backup (daily/weekly/monthly) + selective restore |
| Scalability | Horizontal scaling + load balancer support |
| VPS Spec | 6 core / 12GB RAM / 100GB SSD (enterprise level) |

### External Integrations
| Integration | Purpose |
|-------------|---------|
| Google Analytics 4 | Dashboard stats + user behavior |
| Google Tag Manager | Custom events tracking |
| Microsoft Clarity | Heatmaps + session recordings |
| Alibaba AI | Article generation + translation |
| Binance API | Futures trading (WebSocket + REST) |
| TradingView | Webhook alerts for trading signals |
| SMTP Providers | Email notifications (built-in + 5 third-party) |
| Google Chat | Contact form notifications |
| Telegram/Discord | Trading notifications |
| ERPNext/NextERP | Data sync compatibility |
| Uptime Kuma | Uptime monitoring |
| Sentry | Error tracking |
| Meta Pixel | Conversion tracking |
| TikTok Pixel | Conversion tracking |
| LinkedIn Pixel | Conversion tracking |
| Google Search Console | SEO performance |
| Ubersuggest | Competitor analysis (3 searches/day free) |

### Security & Compliance
| Aspect | Details |
|--------|---------|
| Authentication | JWT + device tracking + session management + 2FA (optional) |
| Authorization | Role-based (Admin, Editor, Author, custom) + granular permissions |
| Form Protection | reCAPTCHA v3 |
| Headers | CSP, HSTS |
| API Security | API signature for sensitive endpoints |
| Audit | Audit logging for all write operations |
| Legal | Cookie consent banner (granular) + privacy policy generator |
| GDPR | IP anonymization + data export feature |

### Copywriting & Content
| Aspect | Details |
|--------|---------|
| Brand Voice | Friendly & Approachable |
| Banner Slides | 5 slides: Data, AI, Results, Partnership, Innovation |
| Service USPs | Per service dengan statistik (editable via dashboard) |
| Translation | Manual / Alibaba AI / Third-party API |
| Translation Review | AI translate → human review → publish |
| Translation Memory | Save approved translations for reuse |
| Content Publishing | ID only / EN only / Both options |
| Local SEO | Jakarta, Depok, Bogor mentions + LocalBusiness schema |
| Google My Business | Optimization guide included |

### SEO Scoring System
| Aspect | Details |
|--------|---------|
| Score Range | 0-100 points |
| Breakdown | Content (35) + On-Page (25) + Readability (15) + Internal Linking (10) + Technical (10) + Local (5) |
| Competitor Analysis | Weekly auto-fetch (free tools only) |
| AI Suggestions | Manual approve per suggestion |
| Score Threshold | Default 75, configurable |
| Real-time Update | Live scoring while editing |

### Analytics System (Enterprise Level)
| Aspect | Details |
|--------|---------|
| Stack | GA4 + GTM + Microsoft Clarity + SurrealDB custom tracking + Pixels |
| Privacy | Cookie consent banner + IP anonymization |
| Level | Enterprise (optimized for 6 core/12GB/100GB VPS) |
| Competitor Analysis | Weekly with historical data storage |
| Custom Journey Tracking | User-defined funnels (editable/rotatable paths) |
| Event Tracking | Button clicks, CTA clicks, form submissions |
| Entry Point Tracking | Source, landing page, UTM parameters |
| Article Analytics | Views, average time on page |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Public Page Load Time | < 2s (ISR) |
| Lighthouse SEO Score | > 90 |
| Dashboard Interactivity | < 100ms API response |
| Article Auto-save | 1min idle + 50 chars |
| Offline Sync Success | 100% with conflict resolution |
| Image Optimization | WebP + 80% quality default |
| Backup Success Rate | 99.9% |
| Uptime | 99.9% (Uptime Kuma monitoring) |
| Trading Execution | < 100ms webhook → Binance |
| Multi-language Coverage | 100% content translated (ID/EN) |
| SEO Score Average | 75+ for all published content |
| Analytics Data Accuracy | 95%+ tracking accuracy |

---

## Out of Scope (Phase 2)

- Dashboard Capital full implementation (trading features)
- White-label / rebranding
- Video tutorials
- Webhook builder (Zapier-style)
- Plugin system for third-party extensions
- Multi-tenant support

---

## OpenSpec Reference

- **Change Name:** `esperion-agency-web`
- **Location:** `openspec/changes/esperion-agency-web/`
- **Schema:** spec-driven
- **Artifacts:** proposal.md, design.md, specs/**, tasks.md

---

## Development Workflow

### Per Major Task
1. Implement task
2. Unit test
3. Debugging
4. Git commit
5. Continue to next task

### Testing Requirements
- Vitest for frontend unit testing
- Playwright for E2E testing
- Visual regression testing
- Load testing (k6)
- Backend integration tests

### Documentation
- API documentation with utoipa-scalar
- API changelog
- Sandbox environment for API testing
- User documentation (help center)
- Developer documentation (internal wiki)
- Setup guides (reCAPTCHA, CDN, SMTP, Google My Business)