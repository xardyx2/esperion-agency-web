# Esperion Digital Agency Web

A modern full-stack web application for Esperion Digital Agency, built with Nuxt 4 (frontend) and Rust/Axum (backend).

## 🚀 Tech Stack

### Frontend
- **Nuxt 4** - Vue.js framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Esperion Design System** - Custom semantic colors

### Backend
- **Rust** - High-performance systems language
- **Axum** - Ergonomic web framework
- **SurrealDB** - Multi-model database
- **JWT + Argon2** - Secure authentication

## 📁 Project Structure

```
esperion-agency-web/
├── frontend/              # Nuxt 4 application
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

4. **Start SurrealDB**
```bash
surreal start --user root --pass root memory
```

5. **Set up environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env
```

6. **Run development servers**
```bash
# Frontend (port 3000)
cd frontend && npm run dev

# Backend (port 8080)
cd backend && cargo run
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/logout | Logout |
| POST | /api/v1/auth/refresh | Refresh token |

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
- Push notifications
- Background sync

## 🔒 Security

- JWT authentication with 7-day expiration
- Argon2 password hashing
- CORS protection
- Rate limiting (Phase 2)

## 📊 Progress

| Section | Status |
|---------|--------|
| Backend API | ✅ Complete |
| Public Pages | ✅ Complete |
| Dashboard Pages | ✅ Complete |
| SEO Scoring | ✅ Complete |
| PWA | ✅ Complete |
| Nuxt Studio | 🔄 In Progress |
| Documentation | 🔄 In Progress |
| CI/CD | ⏳ Pending |

## 📝 License

Copyright © 2024 Esperion Digital Agency. All rights reserved.