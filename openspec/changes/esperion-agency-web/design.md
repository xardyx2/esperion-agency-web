# Esperion Agency Web - Technical Design (Updated v2)

## Context

Esperion adalah platform all-in-one dengan tiga pilar utama:
1. **Public Website** - Company profile dengan SEO optimal, multi-language, Nuxt Studio visual editing, dan dynamic content
2. **Dashboard Agency** - CMS lengkap dengan AI content creation, SEO scoring (0-100), media management, dan enterprise analytics
3. **Dashboard Capital** - Automated trading system (TradingView → Binance Futures) - Phase 2

**Stakeholders:**
- Solo developer (95% AI-assisted development)
- Internal team (Admin, Editor, Author roles)
- External users (website visitors, trading signal users)

**Constraints:**
- Docker-first development dengan hot reload
- SurrealDB sebagai single database (no Redis)
- Multi-language dengan Alibaba AI translation
- Enterprise integrations (Google Analytics, ERPNext, SMTP, CDN, Pixels)
- VPS: 6 core / 12GB RAM / 100GB SSD

---

## Goals / Non-Goals

### Goals
- Public website dengan ISR rendering dan SEO score > 90
- Multi-language support (/id/, /en/) dengan auto-detect locale
- Dashboard Agency dengan AI article generator (SEO score 0-100)
- Auto-save system (1min idle + 50 chars checkpoint, max 25 checkpoints)
- Offline-first editing dengan conflict resolution (side-by-side view)
- Media library dengan WebP conversion + CDN integration
- Custom roles dengan granular permissions
- Trading system dengan WebSocket API + multi-robot support
- Advanced trailing stop (per-pair + portfolio-level)
- Backup/restore system (Updraft-style selective backup)
- CI/CD dengan GitHub Actions + staging + auto rollback
- Monitoring dengan Uptime Kuma + Sentry + multi-channel alerting
- **Nuxt Studio compatible**: Visual editor untuk semua public pages
- **SEO Scoring Engine**: Real-time scoring 0-100 dengan competitor analysis
- **Enterprise Analytics**: Custom journey tracking, pixel integrations
- **Translation System**: Manual/AI/Third-party dengan review workflow + translation memory
- **Copywriting System**: Brand voice Friendly & Approachable dengan 5 banner slides

### Non-Goals (Phase 2)
- Dashboard Capital full implementation
- White-label / rebranding features
- Video tutorials
- Webhook builder (Zapier-style)
- Plugin system for third-party extensions
- Multi-tenant support

---

## Decisions

### 1. Architecture: Monorepo dengan Modular Separation

**Decision:** Single repository dengan modular separation (public, agency, capital)

**Rationale:**
- Easier code sharing (types, utils, components)
- Single deployment pipeline
- Clear boundaries via module structure

**Structure:**
```
esperion-agency-web/
├── frontend/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── public/          # ISR pages (Nuxt Studio compatible)
│   │   │   ├── agency/          # CSR dashboard
│   │   │   └── capital/         # Trading dashboard (Phase 2)
│   │   ├── components/
│   │   ├── composables/
│   │   └── ...
├── backend/
│   └── src/
│       ├── handlers/
│       ├── models/
│       └── ...
└── infrastructure/
```

### 2. Rendering Strategy: Hybrid ISR + CSR

**Decision:**
- Public pages: ISR dengan revalidation 60 seconds
- Dashboard pages: CSR dengan WebSocket for real-time
- API routes: SSR default

**Nuxt routeRules:**
```typescript
export default defineNuxtConfig({
  routeRules: {
    // Public pages - ISR
    '/': { isr: 60 },
    '/id/**': { isr: 60 },
    '/en/**': { isr: 60 },
    '/our-works/**': { isr: 60 },
    '/our-services/**': { isr: 60 },
    '/articles/**': { isr: 60 },
    '/about': { isr: 60 },
    
    // Dashboard - CSR
    '/agency/**': { ssr: false },
    '/capital/**': { ssr: false },
    
    // API - SSR default
    '/api/**': { cors: true }
  }
})
```

### 3. Multi-language Architecture

**Decision:** URL prefix dengan auto-detect locale

**URL Structure:**
- `/id/home`, `/id/articles/slug`
- `/en/home`, `/en/articles/slug`

**Translation Strategy:**
- Manual translation untuk UI strings
- Alibaba AI API untuk content translation
- Fallback to English if translation missing
- Translation review workflow: AI translate → human review → publish
- Translation memory: Save approved translations for reuse

### 4. State Management: Pinia + WebSocket Store

**Decision:**
- Pinia untuk light state (user preferences, UI state)
- Dedicated WebSocket store untuk real-time data
- Heavy logic di backend (Rust)

**Stores:**
```typescript
// stores/auth.ts - JWT + user info
// stores/ui.ts - Theme, sidebar, preferences
// stores/websocket.ts - Real-time prices, positions
// stores/articles.ts - Article state with offline support
```

### 5. Auto-save & Offline System

**Decision:** Dual-trigger auto-save dengan conflict resolution

**Mechanism:**
```
┌─────────────────────────────────────────────────────────────┐
│  AUTO-SAVE FLOW                                             │
├─────────────────────────────────────────────────────────────┤
│  User typing ──→ 50 chars checkpoint ──→ LocalStorage       │
│                    (max 25 checkpoints)                     │
│                                                             │
│  User idle 1min ──→ Save to LocalStorage                   │
│                                                             │
│  Online detected ──→ Sync to cloud                         │
│                                                             │
│  Conflict detected ──→ Show side-by-side view              │
│    ┌─────────────┐         ┌─────────────┐                 │
│    │   Local     │   OR    │    Cloud    │                 │
│    └─────────────┘         └─────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 6. AI Integration: Alibaba Cloud

**Decision:** Alibaba AI untuk article generation dan translation

**Use Cases:**
- Generate article dari focus keyword + brief
- Translate content (ID ↔ EN)
- SEO score calculation (0-100)
- Competitor analysis

**API Key:** `sk-sp-83766abe865e4c14af18ae9a918c7d8b`

### 7. Image Processing Pipeline

**Decision:** Automatic WebP conversion dengan quality settings

**Flow:**
```
Upload → Compress → WebP conversion → Keep original
           ↓
    Multiple sizes (thumbnail, article, banner)
           ↓
    CDN upload (optional) / Local storage
```

**Settings (configurable via dashboard):**
- WebP quality: 60-100% (default 80%)
- Resize options: Auto / Manual
- Keep original: Yes (for restore/reprocess)

### 8. Database: SurrealDB-First Architecture

**Decision:** Maximize SurrealDB built-in features (no Redis)

**Features Used:**
- Built-in connection pooling
- Built-in caching with configurable TTL
- Built-in full-text search
- Built-in authentication (future)
- All content storage (including Nuxt Studio edits)

**Schema Migration:**
```sql
-- Version control via migrations table
DEFINE TABLE migrations SCHEMAFULL;
DEFINE FIELD version ON migrations TYPE string;
DEFINE FIELD applied_at ON migrations TYPE datetime DEFAULT time::now();
```

### 9. Authentication: JWT + Device Tracking

**Decision:**
- JWT expiration: 7 days
- Refresh token: 30 days
- Device fingerprinting: Required
- Session management: View all sessions, force logout

**Token Structure:**
```typescript
interface JwtPayload {
  sub: string;          // User ID
  email: string;
  role: string;
  device_id: string;    // Fingerprint
  iat: number;
  exp: number;          // 7 days
}
```

### 10. Trading System Architecture

**Decision:** WebSocket-first dengan REST fallback

**Flow:**
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  TradingView │────▶│  Esperion    │────▶│   Binance    │
│   Webhook    │     │  Webhook     │     │  WebSocket   │
│              │     │  Receiver    │     │  API         │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Risk       │
                     │   Manager    │
                     │ (trailing,   │
                     │  position)   │
                     └──────────────┘
```

**Trailing Stop (2-Level):**
1. Per-pair: Individual SL/TP
2. Portfolio-level: Based on total floating profit (e.g., 5% → trail at 4%)

### 11. Multi-Robot Capital Allocation

**Decision:** Performance-based auto allocation

**Algorithm:**
```
1. Get last 30 trades per robot
2. Calculate: Winrate, PnL, Profit Factor, MDD, Sharpe
3. Score each robot
4. Distribute capital based on score
5. Allow manual override
```

### 12. Backup System: Updraft-Style

**Decision:** Selective backup dengan schedule

**Options:**
- Backup scope: Database / Files / All
- Schedule: Daily / Weekly / Monthly
- Retention: Configurable (default 30 days)
- Restore: One-click selective restore
- Encryption: Optional

### 13. Email System: Multi-Provider

**Decision:** Built-in SMTP + 5 third-party providers

**Providers:**
1. Built-in server SMTP (default)
2. SendGrid
3. Mailgun
4. Amazon SES
5. Postmark
6. SMTP2GO

**Features:**
- Template editor
- Auto-reply configuration
- Delivery tracking

### 14. Monitoring Stack

**Decision:** Free-tier optimized stack

| Tool | Purpose | Cost |
|------|---------|------|
| Uptime Kuma | Uptime monitoring | Free |
| Sentry | Error tracking | Free tier |
| Google Chat | Alerts | Free |
| Telegram | Alerts | Free |
| Discord | Alerts | Free |
| Email | Alerts | Built-in |

### 15. CI/CD Pipeline

**Decision:** GitHub Actions dengan staging

**Pipeline:**
```
Push → Tests → Build → Deploy Staging → Manual Approval → Deploy Production
                                    ↓
                            Auto rollback on failure
```

**Environments:**
- Development (local)
- Staging (auto-deploy on push)
- Production (manual approval)

### 16. SEO Scoring Mechanism (0-100)

**Decision:** Real-time scoring dengan 6 categories

**Breakdown:**
```
┌─────────────────────────────────────────────────────────────┐
│  SEO SCORE CALCULATION (100 points total)                   │
├─────────────────────────────────────────────────────────────┤
│  1. CONTENT QUALITY (35 points)                             │
│     • Word count (800-1200): 10 points                      │
│     • Keyword density (1-2%): 10 points                     │
│     • Keyword in first 100 words: 5 points                  │
│     • Headings (H1, H2, H3) structure: 10 points            │
│                                                             │
│  2. ON-PAGE SEO (25 points)                                 │
│     • Meta title (50-60 chars): 5 points                    │
│     • Meta description (150-160 chars): 5 points            │
│     • Focus keyword in title: 5 points                      │
│     • Focus keyword in meta description: 5 points           │
│     • Image alt text (all images): 5 points                 │
│                                                             │
│  3. READABILITY (15 points)                                 │
│     • Short paragraphs (max 3-4 lines): 5 points            │
│     • Transition words (30%+): 5 points                     │
│     • Sentence length (max 20 words avg): 5 points          │
│                                                             │
│  4. INTERNAL LINKING (10 points)                            │
│     • Internal links (2-5 links): 5 points                  │
│     • Outbound links (1-3 authoritative): 5 points          │
│                                                             │
│  5. TECHNICAL SEO (10 points)                               │
│     • URL slug (short, keyword): 5 points                   │
│     • No special characters in URL: 5 points                │
│                                                             │
│  6. LOCAL SEO (5 points)                                    │
│     • Mention Jakarta/Depok/Bogor: 3 points                 │
│     • "Esperion" mention: 2 points                          │
└─────────────────────────────────────────────────────────────┘

Score Interpretation:
0-59:   Poor (Red) - Major improvements needed
60-74:  Fair (Orange) - Good start, needs work
75-89:  Good (Yellow) - Minor improvements possible
90-100: Excellent (Green) - Ready to publish
```

**Competitor Analysis:**
- Weekly auto-fetch using free tools (Google Search, Ubersuggest 3 searches/day)
- Store historical data for comparison
- AI-generated improvement suggestions (manual approve)

### 17. Analytics Architecture (Enterprise Level)

**Decision:** Multi-layer analytics stack

**Stack:**
```
┌─────────────────────────────────────────────────────────────┐
│  ANALYTICS STACK                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Google Analytics 4 + GTM                          │
│  - Page views, events, user journey                         │
│  - Conversion tracking                                      │
│  - UTM parameter tracking                                   │
│                                                             │
│  Layer 2: Microsoft Clarity                                 │
│  - Heatmaps                                                 │
│  - Session recordings                                       │
│                                                             │
│  Layer 3: SurrealDB Custom Tracking                         │
│  - Detailed user journey storage                            │
│  - Custom funnel tracking                                   │
│  - Event data with full context                             │
│                                                             │
│  Layer 4: Pixel Integrations                                │
│  - Meta Pixel (Facebook/Instagram)                          │
│  - TikTok Pixel                                             │
│  - LinkedIn Pixel                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Custom Journey Tracking:**
```
User can define custom funnels:
Path A: Home > Service > Contact US > Submit Form
Path B: Artikel > Service > Contact US > Submit Form

Features:
- Create/edit/rotate journey paths
- Compare conversion rates per path
- Identify improvement opportunities
- Full user journey visualization
```

**Data Storage in SurrealDB:**
```typescript
interface UserSession {
  session_id: string;
  user_id?: string;
  entry_point: {
    source: 'google' | 'direct' | 'social' | 'referral';
    landing_page: string;
    timestamp: Date;
    utm?: UTMParams;
  };
  page_views: Array<{
    url: string;
    title: string;
    time_on_page: number;
    scroll_depth: number;
  }>;
  events: Array<{
    type: 'click' | 'submit' | 'download' | 'video_play';
    element: string;
    timestamp: Date;
    page_url: string;
  }>;
  conversion?: {
    goal: string;
    value: number;
    attribution_path: string[];
  };
  exit_point: {
    url: string;
    timestamp: Date;
  };
}
```

### 18. Nuxt Studio Integration

**Decision:** Visual editor compatible untuk semua public pages

**Scope:** All public pages (Home, About, Services, Works, Articles, Contact)

**Storage:** SurrealDB (unified with dashboard content)

**Features:**
- Click-to-edit on live page
- Drag-and-drop sections
- Real-time preview
- Draft mode with preview URL
- Direct publish after approval
- Media upload to SurrealDB media library

**Implementation:**
```typescript
// Editable regions marked with data attributes
<div data-editable="banner.title" data-type="text">
  {{ banner.title }}
</div>

// Locked regions (dynamic content from dashboard)
<div data-locked="true">
  <ArticleList :articles="articles" />
</div>
```

**Workflow:**
```
Edit → Save Draft → Preview URL → Approve → Publish
                                    ↓
                            Sync to SurrealDB
```

### 19. Copywriting System

**Decision:** Brand voice Friendly & Approachable dengan structured content

**Banner Slides (5):**
1. "Data-Driven Digital Strategies yang Meningkatkan ROI hingga 300%"
2. "Powered by AI, Managed by Humans"
3. "30+ Campaigns, 10+ Happy Clients, Countless Success Stories"
4. "More Than an Agency – Your Digital Partner"
5. "The Future of Digital is Here"

**Service USPs (Editable via Dashboard):**
| Service | USP | Statistik |
|---------|-----|-----------|
| Digital Advertising | "Ads yang Right Target, Right Time" | "Average ROAS 4.5x" |
| Marketplace Marketing | "Dominasi Shopee & Tokopedia" | "Naik 150% dalam 3 bulan" |
| Social Media Marketing | "Engagement Bukan Sekedar Likes" | "Average engagement 5.2%" |
| SEO | "Ranking #1 untuk Keyword Kompetitif" | "90% client halaman 1 dalam 90 hari" |
| Consultant | "Strategi yang Actionable" | "Client implement 80%+ recommendation" |
| Web & Mobile Dev | "Fast, Beautiful, Conversion-Optimized" | "Load time < 2s, bounce rate turun 40%" |

### 20. Translation System

**Decision:** Three-tier translation dengan review workflow

**Tiers:**
1. **Manual**: User translates sendiri (100% accuracy)
2. **Alibaba AI**: Auto-translate dengan API (~85-90% accuracy)
3. **Third-Party API**: DeepL/Google Translate (~90-95% accuracy, paid)

**Workflow:**
```
Content Created (ID)
       ↓
Translation Method Selection
       ↓
If AI Selected:
Auto-translate → Translation Memory Check
       ↓
Review Workflow (requires human approval)
       ↓
Approve → Publish (ID + EN)
Or Edit → Re-save to Translation Memory
```

---

## Risks / Trade-offs

### Risk 1: SurrealDB Maturity
**Risk:** SurrealDB 3.x masih relatif baru, mungkin ada breaking changes.

**Mitigation:**
- Pin specific version di Docker Compose
- Regular backups dengan offsite storage
- Abstrak database layer untuk easier migration

### Risk 2: Complexity of Trading System
**Risk:** Trading system dengan multi-robot dan advanced trailing stop sangat kompleks.

**Mitigation:**
- Start dengan single robot, single pair
- Paper trading mode wajib sebelum live
- Extensive testing dengan historical data

### Risk 3: Offline Conflict Resolution
**Risk:** Conflict resolution bisa confusing untuk users.

**Mitigation:**
- Clear UI dengan side-by-side comparison
- Preview changes sebelum apply
- Audit log untuk semua conflicts

### Risk 4: AI Translation Quality
**Risk:** Alibaba AI translation mungkin tidak akurat untuk technical content.

**Mitigation:**
- Manual review workflow untuk translated content
- Fallback to English if translation quality low
- User feedback mechanism untuk translation quality

### Risk 5: Performance dengan Multi-language ISR
**Risk:** ISR dengan multi-language bisa meningkatkan build time.

**Mitigation:**
- Incremental regeneration (not full rebuild)
- CDN caching untuk static assets
- Lazy loading untuk non-critical content

### Risk 6: VPS Resource Constraints
**Risk:** Enterprise analytics dengan custom journey tracking bisa memberatkan VPS 6 core/12GB.

**Mitigation:**
- Implement data retention policies (auto-purge old sessions)
- Use sampling for high-traffic periods
- Optimize SurrealDB queries dengan proper indexing
- Monitor resource usage dan scale jika needed

---

## Migration Plan

### Phase 1: Foundation (Weeks 1-4)
1. Setup monorepo structure
2. Configure Docker Compose dengan hot reload
3. Initialize SurrealDB dengan schema migrations
4. Setup authentication system
5. Initialize Nuxt 4 dengan ISR configuration

### Phase 2: Public Website (Weeks 5-8)
1. Implement multi-language system
2. Build public pages dengan Esperion Design System
3. Implement SEO (meta, schema.org, sitemap)
4. Integrate Google Analytics + Tag Manager
5. Setup Microsoft Clarity for heatmaps
6. Implement Nuxt Studio compatibility

### Phase 3: Dashboard Agency Core (Weeks 9-14)
1. Build dashboard layout dengan sidebar
2. Implement article management dengan AI generator
3. Implement auto-save + offline mode
4. Build media library dengan WebP conversion
5. Implement custom roles + permissions
6. Implement SEO scoring engine

### Phase 4: Dashboard Agency Advanced (Weeks 15-18)
1. Google Analytics integration
2. Email system dengan multi-provider
3. Backup/restore system
4. Monitoring + alerting setup
5. CI/CD pipeline configuration
6. Enterprise analytics dengan custom journey tracking
7. Pixel integrations (Meta/TikTok/LinkedIn)

### Phase 5: Dashboard Capital (Phase 2)
1. TradingView webhook receiver
2. Binance WebSocket integration
3. Multi-robot system
4. Advanced trailing stop
5. Trading journal + analytics

### Phase 6: Testing & Launch (Weeks 19-20)
1. E2E testing (Playwright)
2. Visual regression testing
3. Load testing
4. Security audit
5. Soft launch (internal only)
6. Public launch

---

## Open Questions

1. **CDN Provider Selection:** Mana dari 5 provider yang akan jadi default?
2. **SMTP Default:** Provider mana untuk default email notifications?
3. **Trading Pairs Initial:** Pair apa saja yang akan di-support pertama kali?
4. **Robot Count Limit:** Berapa maksimal robot yang akan di-support? (target: 10+)
5. **Backup Retention:** Berapa hari retention default? (target: 30 days)
6. **Competitor Analysis Tools:** Which free tools to prioritize for weekly auto-fetch?