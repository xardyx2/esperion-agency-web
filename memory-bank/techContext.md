# Technical Context

## Tech Stack Overview

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Nuxt | 4.x | Application framework |
| Vue | 3.x | UI framework |
| TypeScript | latest | Type safety |
| TailwindCSS | latest | Styling |
| Nuxt UI | latest | Component library |
| Pinia | latest | State management |
| VueUse | latest | Composables |
| FormKit | latest | Form handling |
| Vue Carousel | latest | Slider components |
| Chart.js | latest | Analytics charts |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Rust | 1.75+ | Programming language |
| Axum | latest | Web framework |
| Tokio | latest | Async runtime |
| utoipa | latest | OpenAPI documentation |
| utoipa-scalar | latest | OpenAPI UI |
| argon2 | latest | Password hashing |
| jsonwebtoken | latest | JWT handling |
| serde | latest | Serialization |
| thiserror | latest | Error handling |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| SurrealDB | 3.x | Multi-model database |
| surrealdb (Rust SDK) | latest | Database client |

### Infrastructure
| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | latest | Containerization |
| Docker Compose | latest | Orchestration |
| Node.js | 20.x | Frontend runtime |

### Analytics & Tracking
| Technology | Version | Purpose |
|------------|---------|---------|
| Google Analytics 4 | latest | User analytics |
| Google Tag Manager | latest | Event tracking |
| Microsoft Clarity | latest | Heatmaps, recordings |
| Meta Pixel | latest | Conversion tracking |
| TikTok Pixel | latest | Conversion tracking |
| LinkedIn Pixel | latest | Conversion tracking |

### External Services
| Service | Purpose | Status |
|---------|---------|--------|
| Alibaba Cloud AI | Article generation + translation | ✅ API Key provided |
| Google reCAPTCHA v3 | Form protection | ⏳ Setup needed |
| SMTP Provider | Email notifications | ⏳ Choose from 5 providers |
| CDN Provider | Image delivery | ⏳ Choose from 5 providers |

## Nuxt Modules

```json
{
  "@nuxt/ui": "latest",
  "@nuxt/devtools": "latest",
  "@nuxt/image": "latest",
  "@nuxt/fonts": "latest",
  "@nuxtjs/sitemap": "latest",
  "@nuxtjs/robots": "latest",
  "@nuxt/eslint": "latest",
  "@nuxt/scripts": "latest",
  "@formkit/auto-animate/nuxt": "latest",
  "@nuxt/test-utils/module": "latest",
  "@nuxtjs/a11y": "latest",
  "nuxt-hints": "latest",
  "@nuxtjs/color-mode": "latest",
  "@pinia/nuxt": "latest"
}
```

## Rust Dependencies (Cargo.toml)

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
utoipa = { version = "4", features = ["axum_extras"] }
utoipa-scalar = "0.1"
argon2 = "0.5"
jsonwebtoken = "9"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "1"
anyhow = "1"
surrealdb = "2"
tower-http = { version = "0.5", features = ["cors"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
```

## Docker Configuration

### Services

#### Frontend Service
```yaml
frontend:
  image: node:20-alpine
  working_dir: /app
  volumes:
    - ../frontend:/app
    - /app/node_modules
  ports:
    - "3000:3000"
  command: npm run dev
  environment:
    - NODE_ENV=development
    - NUXT_PUBLIC_API_BASE=http://localhost:8080
```

#### Backend Service
```yaml
backend:
  image: rust:1.75
  working_dir: /app
  volumes:
    - ../backend:/app
  ports:
    - "8080:8080"
  command: cargo watch -x run
  environment:
    - DATABASE_URL=ws://database:8000
    - RUST_LOG=debug
```

#### Database Service
```yaml
database:
  image: surrealdb/surrealdb:latest
  volumes:
    - surreal-data:/data
  ports:
    - "8000:8000"
  command: start --log debug --user root --pass root /data
```

## Environment Variables

### Frontend (.env)
```bash
NODE_ENV=development
NUXT_PUBLIC_API_BASE=http://localhost:8080
NUXT_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
NUXT_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NUXT_CLARITY_PROJECT_ID=xxxxxx
NUXT_META_PIXEL_ID=xxxxxxxxx
NUXT_TIKTOK_PIXEL_ID=xxxxxxxxx
NUXT_LINKEDIN_PIXEL_ID=xxxxxxxxx
```

### Backend (.env)
```bash
DATABASE_URL=ws://localhost:8000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
RUST_LOG=debug
ALIBABA_AI_API_KEY=sk-sp-83766abe865e4c14af18ae9a918c7d8b
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
```

### Docker Compose (.env)
```bash
SURREAL_USER=root
SURREAL_PASS=root
```

## Directory Structure Details

### Frontend (Nuxt 4)
```
frontend/
├── app/
│   ├── pages/
│   │   ├── public/              # ISR pages (Nuxt Studio compatible)
│   │   │   ├── index.vue        # Home page
│   │   │   ├── our-works.vue
│   │   │   ├── our-services.vue
│   │   │   ├── articles.vue
│   │   │   ├── about.vue
│   │   │   └── contact-us.vue
│   │   ├── agency/              # CSR dashboard
│   │   │   ├── index.vue
│   │   │   ├── articles/
│   │   │   ├── works/
│   │   │   ├── services/
│   │   │   ├── clients/
│   │   │   └── settings/
│   │   └── capital/             # Trading dashboard (Phase 2)
│   ├── components/
│   │   ├── public/              # Public website components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── shared/              # Shared components
│   │   └── ui/                  # Base UI components
│   ├── layouts/
│   │   ├── default.vue          # Public layout
│   │   └── dashboard.vue        # Dashboard layout
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useImageUpload.ts
│   │   ├── useCountAnimation.ts
│   │   └── useSEO scoring.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── articles.ts
│   │   └── analytics.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── formatters.ts
│   └── types/
│       ├── api.ts
│       ├── article.ts
│       ├── work.ts
│       └── user.ts
├── public/
├── server/
├── nuxt.config.ts
├── tailwind.config.ts
├── app.config.ts
├── tsconfig.json
└── package.json
```

### Backend (Rust)
```
backend/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── handlers/
│   │   ├── mod.rs
│   │   ├── auth.rs
│   │   ├── articles.rs
│   │   ├── works.rs
│   │   ├── services.rs
│   │   ├── clients.rs
│   │   └── contact.rs
│   ├── models/
│   │   ├── mod.rs
│   │   ├── user.rs
│   │   ├── article.rs
│   │   ├── work.rs
│   │   ├── service.rs
│   │   ├── client.rs
│   │   └── contact.rs
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── auth.rs
│   │   ├── articles.rs
│   │   ├── works.rs
│   │   ├── services.rs
│   │   ├── clients.rs
│   │   └── contact.rs
│   ├── middleware/
│   │   ├── mod.rs
│   │   ├── auth.rs
│   │   └── cors.rs
│   ├── db/
│   │   ├── mod.rs
│   │   ├── connection.rs
│   │   └── schema.rs
│   └── api/
│       ├── mod.rs
│       └── openapi.rs
├── Cargo.toml
└── .env
```

## API Endpoints Summary

### Authentication
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh
- GET /api/v1/auth/sessions
- DELETE /api/v1/auth/sessions/:id

### Articles
- GET /api/v1/articles
- GET /api/v1/articles/:slug
- POST /api/v1/articles
- PUT /api/v1/articles/:id
- DELETE /api/v1/articles/:id
- POST /api/v1/articles/:id/seo-score

### Works
- GET /api/v1/works
- GET /api/v1/works/:slug
- GET /api/v1/works/featured
- POST /api/v1/works
- PUT /api/v1/works/:id
- DELETE /api/v1/works/:id

### Services
- GET /api/v1/services
- GET /api/v1/services/:slug
- POST /api/v1/services
- PUT /api/v1/services/:id
- DELETE /api/v1/services/:id

### Clients
- GET /api/v1/clients
- GET /api/v1/clients/stats
- GET /api/v1/clients/logos
- POST /api/v1/clients
- PUT /api/v1/clients/:id
- DELETE /api/v1/clients/:id

### Contact
- POST /api/v1/contact
- GET /api/v1/contact/submissions
- PUT /api/v1/contact/submissions/:id

### Media
- GET /api/v1/media
- POST /api/v1/media/upload
- PUT /api/v1/media/:id
- DELETE /api/v1/media/:id

### Analytics
- GET /api/v1/analytics/sessions
- GET /api/v1/analytics/events
- POST /api/v1/analytics/track
- GET /api/v1/analytics/funnels
- POST /api/v1/analytics/funnels

### SEO
- GET /api/v1/seo/score/:article_id
- POST /api/v1/seo/analyze
- GET /api/v1/seo/competitors
- POST /api/v1/seo/competitors/fetch

### Translation
- POST /api/v1/translation/translate
- GET /api/v1/translation/memory
- POST /api/v1/translation/memory

## Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
```

### Backend
```bash
cd backend
cargo build          # Build
cargo run            # Run
cargo watch -x run   # Run with hot reload
cargo test           # Run tests
cargo clippy         # Run linter
```

### Docker
```bash
docker-compose up              # Start all services
docker-compose up -d           # Start in background
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose restart         # Restart services
```

## External Integrations

### Google reCAPTCHA v3
- Site Key: Required for frontend
- Secret Key: Required for backend
- Setup: https://www.google.com/recaptcha/admin

### Google Analytics 4
- Measurement ID: G-XXXXXXXXXX
- Setup: https://analytics.google.com/

### Microsoft Clarity
- Project ID: Required
- Setup: https://clarity.microsoft.com/

### Meta Pixel
- Pixel ID: Required
- Setup: https://www.facebook.com/events_manager/

### TikTok Pixel
- Pixel ID: Required
- Setup: https://ads.tiktok.com/

### LinkedIn Pixel
- Insight Tag: Required
- Setup: https://www.linkedin.com/campaigns/

### Alibaba Cloud AI
- API Key: sk-sp-83766abe865e4c14af18ae9a918c7d8b
- Purpose: Article generation + translation
- Setup: https://www.alibabacloud.com/

### Binance API (Phase 2)
- API Key: Required for Dashboard Capital
- API Secret: Required for Dashboard Capital
- Setup: https://www.binance.com/en/my/settings/api-management

## Health Check Endpoints

- Frontend: GET / (returns HTML)
- Backend: GET /health (returns JSON status)
- Database: SurrealDB status endpoint

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.5s |
| Lighthouse Score | > 90 |
| API Response Time | < 100ms |
| Database Query Time | < 50ms |
| SEO Score Average | 75+ for all published content |
| Analytics Data Accuracy | 95%+ tracking accuracy |

## VPS Specifications

| Resource | Specification |
|----------|---------------|
| CPU | 6 cores |
| RAM | 12GB |
| SSD | 100GB |
| Target | Enterprise level analytics |

## Copywriting Configuration

### Brand Voice
- **Tone:** Friendly & Approachable
- **Style:** Data + AI focused
- **Local SEO:** Jakarta, Depok, Bogor mentions

### Banner Slides (5)
1. "Data-Driven Digital Strategies yang Meningkatkan ROI hingga 300%"
2. "Powered by AI, Managed by Humans"
3. "30+ Campaigns, 10+ Happy Clients, Countless Success Stories"
4. "More Than an Agency – Your Digital Partner"
5. "The Future of Digital is Here"

### Service USPs (Editable via Dashboard)
| Service | USP | Statistik |
|---------|-----|-----------|
| Digital Advertising | "Ads yang Right Target, Right Time" | "Average ROAS 4.5x" |
| Marketplace Marketing | "Dominasi Shopee & Tokopedia" | "Naik 150% dalam 3 bulan" |
| Social Media Marketing | "Engagement Bukan Sekedar Likes" | "Average engagement 5.2%" |
| SEO | "Ranking #1 untuk Keyword Kompetitif" | "90% client halaman 1 dalam 90 hari" |
| Consultant | "Strategi yang Actionable" | "Client implement 80%+ recommendation" |
| Web & Mobile Dev | "Fast, Beautiful, Conversion-Optimized" | "Load time < 2s, bounce rate turun 40%" |