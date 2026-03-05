# Esperion Agency Web

Esperion adalah platform all-in-one yang menggabungkan company profile website dengan dashboard CMS terintegrasi untuk mengelola konten secara mandiri.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Rust 1.75+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd esperion-agency-web
```

2. **Copy environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Access applications**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Backend API Docs: http://localhost:8080/scalar
- SurrealDB: http://localhost:8000

### Manual Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
cargo watch -x run
```

## 📁 Project Structure

```
esperion-agency-web/
├── frontend/              # Nuxt 4 application
│   ├── app/              # Nuxt 4 app directory
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── layouts/      # Layout components
│   │   ├── composables/  # Vue composables
│   │   ├── stores/       # Pinia stores
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript types
│   ├── nuxt.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── backend/              # Rust + Axum API
│   ├── src/
│   │   ├── handlers/     # Request handlers
│   │   ├── models/       # Data models
│   │   ├── routes/       # Route definitions
│   │   ├── middleware/   # Auth & CORS middleware
│   │   ├── db/           # Database operations
│   │   └── api/          # OpenAPI definitions
│   ├── Cargo.toml
│   └── Dockerfile
├── infrastructure/       # Docker & deployment
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **Framework:** Nuxt 4 with Vue 3 Composition API
- **UI Library:** Nuxt UI
- **Styling:** TailwindCSS with Esperion Design System
- **State:** Pinia
- **Animations:** VueUse
- **Forms:** FormKit

### Backend
- **Language:** Rust
- **Framework:** Axum
- **Database:** SurrealDB 3.x
- **Auth:** JWT + Argon2
- **API Docs:** utoipa + utoipa-scalar

### Infrastructure
- **Containers:** Docker + Docker Compose
- **Hot Reload:** Nuxt HMR + cargo-watch

## 📋 Features

### Public Website
- 6 pages with ISR (Home, Our Works, Our Services, Articles, About Us, Contact Us)
- Multi-language support (ID/EN)
- SEO optimized with schema.org
- Dynamic content via dashboard

### Dashboard Agency
- Article Management with AI generator
- Media Library with WebP conversion
- Works/Services/Clients management
- Custom roles & permissions
- Google Analytics integration
- Email notifications

### Dashboard Capital (Phase 2)
- TradingView webhook → Binance Futures
- Multi-robot trading
- Advanced trailing stop

## 🔐 Environment Variables

See `.env.example` for all required variables:

| Variable | Description | Default |
|----------|-------------|---------|
| JWT_SECRET | JWT signing key | (required) |
| DATABASE_URL | SurrealDB connection | ws://localhost:8000 |
| NUXT_RECAPTCHA_SITE_KEY | reCAPTCHA site key | (optional) |
| ALIBABA_AI_API_KEY | Alibaba AI API key | (provided) |
| SMTP_HOST | SMTP server host | (optional) |

## 📖 Documentation

- [API Documentation](http://localhost:8080/scalar)
- [OpenSpec Tasks](openspec/changes/esperion-agency-web/tasks.md)
- [Design Document](openspec/changes/esperion-agency-web/design.md)

## 🚀 Deployment

### 1panel Deployment

1. Install 1panel on your server
2. Create new application in 1panel
3. Select Docker Compose deployment
4. Upload docker-compose.yml
5. Configure environment variables
6. Deploy

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
cargo build --release

# Docker
docker-compose -f docker-compose.yml up -d
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
cargo test

# E2E tests
npm run test:e2e
```

## 📝 Development Workflow

1. Create feature branch
2. Implement changes
3. Run tests
4. Commit with conventional commits
5. Create pull request

## 🤝 Contributing

See our contributing guidelines for more information.

## 📄 License

MIT License

## 📞 Support

For support, email support@esperion.com or open an issue.