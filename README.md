# Esperion Digital Agency Web

A modern full-stack web application for Esperion Digital Agency, built with Nuxt 3 (frontend) and Rust/Axum (backend).

> **Current Status:** 548/622 tasks complete | Last Updated: 2026-03-08

## 📦 Version Badges

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4.2-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5.29-4FC08D?logo=vue.js)](https://vuejs.org)
[![SurrealDB](https://img.shields.io/badge/SurrealDB-1.5.0-FF00A0?logo=surrealdb)](https://surrealdb.com)
[![Rust](https://img.shields.io/badge/Rust-1.75+-000000?logo=rust)](https://rust-lang.org)
[![Bun](https://img.shields.io/badge/Bun-1.1+-000000?logo=bun)](https://bun.sh)

### Current Stack Versions

| Component | Current | Latest Available | Status |
|-----------|---------|------------------|--------|
| **Frontend** | Nuxt 4.4.2 | 4.4.2 | ✅ Current |
| **Backend** | Rust 0.1.0 | - | ✅ Internal |
| **Database** | SurrealDB 1.5.6 | 3.0.4 | 🔴 Behind |
| **Runtime** | Bun 1.1+ | Latest | ✅ Current |

📋 **[View Complete Version Registry →](./ESPERION_VERSIONS.md)**

### Quick Version Check

```bash
# Check all versions at once
bun run versions:check

# Frontend only
cd frontend && bun pm ls | grep -E '@nuxt|nuxt'

# Backend only
cd backend && cargo tree -p surrealdb -p axum

# View full version documentation
cat ESPERION_VERSIONS.md
```

> 💡 **Tip:** See [ESPERION_VERSIONS.md](./ESPERION_VERSIONS.md) for complete dependency matrix and update history.

## 🚀 Tech Stack

### Frontend
- **Nuxt 3** - Vue.js framework with SSR/SSG
- **TypeScript** - Type-safe development (strict mode)
- **Tailwind CSS** - Utility-first styling
- **Esperion Design System** - Custom semantic colors
- **Pinia** - State management (auth, user, ui stores)
- **@nuxtjs/i18n** - Multi-language support (/id/, /en/)
- **FormKit** - Form validation
- **VueUse** - Composable utilities

### Backend
- **Rust** - High-performance systems language
- **Axum** - Ergonomic web framework
- **SurrealDB** - Multi-model database with migrations
- **JWT + Argon2** - Secure authentication (15min access, 30d refresh)
- **utoipa** - OpenAPI documentation
- **lettre** - Email services (6 providers)

## 📁 Project Structure

```
esperion-agency-web/
├── frontend/              # Nuxt 3 application
│   ├── app/
│   │   ├── components/   # Vue components
│   │   ├── composables/  # Composable functions
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── nuxt.config.ts    # Nuxt configuration
├── backend/              # Rust application
│   └── src/
│       ├── handlers/     # API handlers
│       ├── models/       # Data models
│       ├── db/           # Database module
│       └── main.rs       # Entry point
└── openspec/             # OpenSpec specifications
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- Rust 1.75+
- SurrealDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/xardyx2/esperion-agency-web.git
cd esperion-agency-web
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd backend
cargo build
```

4. **Start the local Docker development stack**
```bash
docker compose up --build -d
```

This starts exactly three containers:
- frontend (Nuxt 3) at `http://localhost:3000`
- backend (Rust/Axum) at `http://localhost:8081`
- database (SurrealDB 1.5.6) at `localhost:8002`

The database uses the named Docker volume `surreal-data` with `file:/data/esperion.db`, so local data persists across container restarts.

If you run the backend directly on the host instead of Docker, use `backend/.env` or `backend/.env.example` with `DB_PORT=8002` to connect to the Dockerized database.

5. **Set up environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env
```

6. **Alternative host-only development workflow**
```bash
# Frontend (port 3000)
cd frontend && npm run dev

# Backend (port 8080 on host, talking to DB on 8002)
cd backend && cargo run
```

For the full OpenSpec-aligned local stack, prefer Docker Compose so frontend, backend, and database all run together.
On Docker Desktop hosts, the frontend and backend development containers are configured for polling-based file watching so host edits trigger reloads reliably.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login (returns access + refresh tokens) |
| POST | /api/v1/auth/logout | Logout (blacklists refresh token) |
| POST | /api/v1/auth/refresh | Refresh access token |
| GET | /api/v1/auth/sessions | List user sessions (protected) |
| DELETE | /api/v1/auth/sessions/:id | Force logout session (protected) |

### Articles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/articles | List articles |
| GET | /api/v1/articles/:slug | Get article |
| POST | /api/v1/articles | Create article |
| PUT | /api/v1/articles/:id | Update article |
| DELETE | /api/v1/articles/:id | Delete article |

### Works
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/works | List works |
| GET | /api/v1/works/featured | Featured works |
| POST | /api/v1/works | Create work |
| PUT | /api/v1/works/:id | Update work |
| DELETE | /api/v1/works/:id | Delete work |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/services | List services |
| POST | /api/v1/services | Create service |
| PUT | /api/v1/services/:id | Update service |
| DELETE | /api/v1/services/:id | Delete service |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/clients | List clients |
| GET | /api/v1/clients/stats | Client statistics |
| GET | /api/v1/clients/logos | Client logos |
| POST | /api/v1/clients | Create client |
| PUT | /api/v1/clients/:id | Update client |
| DELETE | /api/v1/clients/:id | Delete client |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/contact | Submit contact form |
| GET | /api/v1/contact/submissions | List submissions |
| GET | /api/v1/contact/stats | Submission statistics |

### SEO
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/seo/calculate | Calculate SEO score |
| GET | /api/v1/seo/:article_id | Get SEO score |
| GET | /api/v1/seo/competitor/:keyword | Competitor analysis |

## 📱 PWA Features

- Offline support with service worker
- Install prompt for mobile devices
- Background sync
- Cache strategies for static assets

## 🌍 Multi-Language

- URL prefix strategy: `/id/` (Indonesian), `/en/` (English)
- Browser language auto-detection
- Alibaba AI translation integration
- Translation cache for performance

## 📝 Recent Features (2026-03-07)

### Authentication System
- ✅ Secure logout with token blacklisting
- ✅ Refresh token rotation
- ✅ Session management (view all sessions, force logout)
- ✅ Device tracking

### Email System
- ✅ Multi-provider support (SMTP, SendGrid, Mailgun, SES, Postmark, SMTP2GO)
- ✅ Contact form notifications
- ✅ Auto-reply emails

### Image Processing
- ✅ WebP conversion with quality settings
- ✅ Thumbnail generation (150x150, 300x300, 600x600, 1200x1200)
- ✅ Original file preservation

### Database
- ✅ Migration system with version control
- ✅ Rollback support
- ✅ Checksum validation

### Testing
- ✅ Playwright E2E (8 test suites)
- ✅ k6 load testing (200 concurrent users)
- ✅ Backend unit tests

## 🧪 Testing

### E2E Testing (Playwright)
```bash
cd frontend
npx playwright test
```
Coverage: Authentication, Articles, Contact, Dashboard, Language, Public Pages

### Load Testing (k6)
```bash
cd tests/load
k6 run auth-load.js      # Auth endpoints (0→200 users)
k6 run api-load.js       # API endpoints
k6 run contact-form-load.js
```

## 🏗️ Infrastructure

### Docker Compose
```bash
docker compose up --build -d
```

### Kubernetes
```bash
kubectl apply -f infrastructure/k8s/
```

### Monitoring
- Uptime Kuma for uptime monitoring
- Sentry for error tracking (free tier)

## 📁 Key Directories

```
esperion-agency-web/
├── frontend/
│   ├── app/
│   │   ├── components/    # Vue components (7 components)
│   │   ├── composables/   # Composable functions
│   │   ├── layouts/       # Layout components
│   │   ├── locales/       # i18n translations (id.json, en.json)
│   │   ├── pages/         # Page components (26 pages)
│   │   ├── stores/        # Pinia stores (auth, user, ui)
│   │   └── types/         # TypeScript types
│   ├── e2e/               # Playwright E2E tests
│   └── nuxt.config.ts
├── backend/
│   └── src/
│       ├── handlers/      # API handlers (13 modules)
│       ├── services/      # Business logic (email, translation, image)
│       ├── models/        # Data models
│       ├── db/            # Database module + migrations
│       └── main.rs
├── tests/
│   └── load/              # k6 load tests
├── infrastructure/
│   ├── k8s/               # Kubernetes manifests
│   ├── monitoring/        # Uptime Kuma config
│   └── docker-compose.prod.yml
└── openspec/              # OpenSpec specifications
```

## 📊 Progress

| Section | Status | Completion |
|---------|--------|------------|
| Backend API | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| Database Migrations | ✅ Complete | 100% |
| Authentication | ✅ Complete | 100% |
| Email System | ✅ Complete | 100% |
| Translation API | ✅ Complete | 100% |
| Image Processing | ✅ Complete | 100% |
| Public Pages | ✅ Complete | 100% |
| Dashboard Pages | ✅ Complete | 100% |
| Multi-language (i18n) | ✅ Complete | 100% |
| SEO Scoring | ✅ Complete | 100% |
| PWA | ✅ Complete | 100% |
| Pinia Stores | ✅ Complete | 100% |
| Nuxt Studio | ✅ Complete | 100% |
| Playwright E2E | ✅ Complete | 100% |
| k6 Load Testing | ✅ Complete | 100% |
| Kubernetes Manifests | ✅ Complete | 100% |
| Documentation | 🔄 In Progress | 90% |
| CI/CD Pipeline | 🔄 In Progress | 80% |
| Analytics Dashboard | ⏳ Phase 2 | 0% |
| Backup System | ⏳ Phase 2 | 0% |

**Overall: 548/622 tasks complete**

## 📝 License

Copyright © 2024 Esperion Digital Agency. All rights reserved.
