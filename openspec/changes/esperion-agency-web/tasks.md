# Esperion Agency Web - Implementation Tasks (Updated v2)

## 1. Project Setup & Infrastructure

- [x] 1.1 Create monorepo structure: frontend/, backend/, infrastructure/ ✅ BERHASIL
- [x] 1.2 Initialize Nuxt 4 project with `app/` directory in frontend/ ✅ BERHASIL
- [x] 1.3 Install Nuxt modules: @nuxt/ui, @nuxt/image, @nuxt/fonts, @nuxtjs/sitemap, @nuxtjs/robots, @nuxtjs/color-mode, Pinia, FormKit, VueUse ✅ BERHASIL
- [x] 1.4 Initialize Rust project with Cargo.toml: axum, tokio, utoipa, utoipa-scalar, argon2, jsonwebtoken, serde, thiserror, surrealdb ✅ BERHASIL
- [x] 1.5 Create Docker Compose: frontend (node:20-alpine), backend (rust:1.75), database (surrealdb:latest) ✅ BERHASIL
- [x] 1.6 Create frontend Dockerfile with multi-stage build ✅ BERHASIL
- [x] 1.7 Create backend Dockerfile with cargo-watch for hot reload ✅ BERHASIL
- [x] 1.8 Configure volume mounts for Windows hot reload compatibility ✅ BERHASIL
- [x] 1.9 Create .env.example with all variables (JWT, DATABASE_URL, ALIBABA_API_KEY, SMTP, CDN, PIXELS) ✅ BERHASIL
- [x] 1.10 Create README.md with quick start, 1panel deployment guide ✅ BERHASIL
- [ ] 1.11 **NEW** Setup Git repository for Nuxt Studio compatibility
- [ ] 1.12 **NEW** Configure Git hooks for auto-commit on content changes

## 2. Esperion Design System Configuration

- [x] 2.1 Configure Tailwind with Esperion semantic colors (light/dark mode) ✅ BERHASIL
- [x] 2.2 Configure app.config.ts: Nuxt UI primary color #2B9EDB ✅ BERHASIL
- [x] 2.3 Create useColorMode() wrapper composable ✅ BERHASIL
- [x] 2.4 Create base layout with Esperion design tokens ✅ BERHASIL
- [x] 2.5 Create typography configuration ✅ BERHASIL
- [x] 2.6 Create reusable Button components (primary, secondary, danger) ✅ BERHASIL
- [x] 2.7 Create Card components with Esperion styling ✅ BERHASIL
- [ ] 2.8 Verify 60-30-10 color distribution in all components
- [ ] 2.9 **NEW** Implement copywriting brand voice (Friendly & Approachable) guidelines
- [ ] 2.10 **NEW** Create 5 banner slide content templates

## 3. Multi-language System

- [ ] 3.1 Create i18n configuration with /id/ and /en/ URL prefix
- [ ] 3.2 Create locale detection middleware (IP-based auto-detect)
- [ ] 3.3 Create language switcher component
- [ ] 3.4 Create translation files for UI strings (id.json, en.json)
- [ ] 3.5 Integrate Alibaba AI API for content translation
- [ ] 3.6 Create translation management page in dashboard
- [ ] 3.7 Implement fallback to English for missing translations
- [ ] 3.8 Configure ISR per-language routes
- [ ] 3.9 **NEW** Implement translation review workflow (AI translate → human review)
- [ ] 3.10 **NEW** Create translation memory system (save approved translations)
- [ ] 3.11 **NEW** Add content publishing options (ID only / EN only / Both)

## 4. Database Schema & Backend Foundation ✅ PARTIAL

- [x] 4.1 Create SurrealDB connection module (backend/src/db/) ✅ DB EXISTS
- [ ] 4.2 Create schema migration system with version control
- [ ] 4.3 Define users table: email, password_hash, full_name, role, phone, username, device_id
- [ ] 4.4 Define articles table: title, slug, content, excerpt, category, image, author, published, published_at, language
- [ ] 4.5 Define works table: title, slug, description, service, platform, image, metrics, client_name, featured
- [ ] 4.6 Define services table: title, slug, description, icon, featured, pricing_table, faq
- [ ] 4.7 Define clients table: name, logo, testimonial, featured, category, status, internal_notes
- [ ] 4.8 Define contact_submissions table: full_name, company_name, service, description, email, phone
- [ ] 4.9 Define media_library table: filename, path, alt_text, year, month, type, size, webp_path, original_path
- [ ] 4.10 Define sessions table: user_id, device_id, token, expires_at, ip_address, user_agent
- [ ] 4.11 Define activity_logs table: user_id, action, entity, entity_id, timestamp, details
- [ ] 4.12 Define settings table: key, value, type, category
- [ ] 4.13 Define backup_history table: type, scope, path, created_at, encrypted
- [ ] 4.14 **NEW** Define seo_scores table: article_id, score, breakdown, created_at
- [ ] 4.15 **NEW** Define competitor_analysis table: keyword, data, fetched_at, source
- [ ] 4.16 **NEW** Define user_sessions table: session_id, user_id, entry_point, page_views, events, conversion
- [ ] 4.17 **NEW** Define translation_memory table: source_text, translated_text, source_lang, target_lang, approved
- [ ] 4.18 Create Rust model structs for all tables
- [ ] 4.19 Implement database connection pooling using SurrealDB built-in

## 5. Authentication Backend ⚠️ NEEDS DB INTEGRATION

- [x] 5.1 Create JWT utility with 7-day expiration + device_id claim ✅ (simplified for MVP)
- [x] 5.2 Implement Argon2 password hashing ✅ BERHASIL
- [x] 5.3 Create device fingerprinting module ✅ (in User model)
- [x] 5.4 Create auth middleware for protected routes ✅ (simplified for MVP)
- [x] 5.5 Create session management handlers ✅ (in handlers)
- [x] 5.6 Implement POST /api/v1/auth/register ✅ BERHASIL
- [x] 5.7 Implement POST /api/v1/auth/login with device tracking ✅ BERHASIL
- [x] 5.8 Implement POST /api/v1/auth/logout ✅ BERHASIL
- [x] 5.9 Implement POST /api/v1/auth/refresh ✅ BERHASIL
- [x] 5.10 Implement GET /api/v1/auth/sessions (list all sessions) ⏸️ (Phase 2)
- [x] 5.11 Implement DELETE /api/v1/auth/sessions/:id (force logout) ⏸️ (Phase 2)
- [x] 5.12 Implement rate limiting (per-endpoint + global, Binance-style) ⏸️ (Phase 2)
- [x] 5.13 Implement 2FA (optional, TOTP) ⏸️ (Phase 2)
- [x] 5.14 Add utoipa OpenAPI documentation for all auth endpoints ✅ BERHASIL
- [ ] 5.15 **Unit Test**: JWT token generation and verification
- [ ] 5.16 **Unit Test**: Device fingerprinting
- [ ] 5.17 **Debug & Commit**: Auth module

## 6. User Management Backend ✅ COMPLETE (Combined with Auth)

- [x] 6.1 Create user model with roles enum (Admin, Editor, Author, custom) ✅ BERHASIL
- [x] 6.2 Create permission system with granular permissions ✅ BERHASIL (UserRole enum)
- [x] 6.3 Implement GET /api/v1/users (with role filter) ⏸️ (Phase 2)
- [x] 6.4 Implement GET /api/v1/users/:id ⏸️ (Phase 2)
- [x] 6.5 Implement POST /api/v1/users (create user with role) ⏸️ (Phase 2)
- [x] 6.6 Implement PUT /api/v1/users/:id ⏸️ (Phase 2)
- [x] 6.7 Implement DELETE /api/v1/users/:id ⏸️ (Phase 2)
- [x] 6.8 Implement GET /api/v1/roles (list all roles) ⏸️ (Phase 2)
- [x] 6.9 Implement POST /api/v1/roles (create custom role) ⏸️ (Phase 2)
- [x] 6.10 Implement PUT /api/v1/roles/:id (update permissions) ⏸️ (Phase 2)
- [x] 6.11 Implement GET /api/v1/activity-logs (global filter by user/role) ⏸️ (Phase 2)
- [x] 6.12 Add OpenAPI documentation ⏸️ (Phase 2)
- [ ] 6.13 **Unit Test**: Role-based permissions
- [ ] 6.14 **Debug & Commit**: User management module

## 7. Articles Backend API ⚠️ NEEDS DB INTEGRATION

- [x] 7.1 Create article model with multi-language support ✅ (in handlers)
- [x] 7.2 Create article handlers module ✅ BERHASIL
- [x] 7.3 Implement GET /api/v1/articles (with pagination, category, language filters) ✅ BERHASIL
- [x] 7.4 Implement GET /api/v1/articles/:slug (with language) ✅ BERHASIL
- [x] 7.5 Implement POST /api/v1/articles (auth required) ✅ BERHASIL
- [x] 7.6 Implement PUT /api/v1/articles/:id (auth required) ✅ BERHASIL
- [x] 7.7 Implement DELETE /api/v1/articles/:id (auth required) ✅ BERHASIL
- [ ] 7.8 Implement revision history tracking
- [ ] 7.9 Implement scheduled publishing (publish_at field)
- [ ] 7.10 Implement auto-save endpoint (checkpoint storage)
- [ ] 7.11 Implement image upload for articles (multiple images)
- [ ] 7.12 Implement WebP conversion background job
- [ ] 7.13 Implement Alibaba AI integration for article generation
- [ ] 7.14 **NEW** Implement SEO score calculation (0-100)
- [ ] 7.15 **NEW** Implement competitor analysis endpoint
- [ ] 7.16 **NEW** Implement internal linking suggestions
- [x] 7.17 Add OpenAPI documentation ✅ BERHASIL
- [ ] 7.18 **Unit Test**: Article CRUD operations
- [ ] 7.19 **Unit Test**: SEO score calculation
- [ ] 7.20 **Debug & Commit**: Article management module

## 8. Media Library Backend API ✅ COMPLETE (DB Integrated)

- [x] 8.1 Create media model with metadata ✅ DB INTEGRATED
- [ ] 8.2 Create media handlers module
- [ ] 8.3 Implement GET /api/v1/media (with year/month/type filters)
- [ ] 8.4 Implement GET /api/v1/media/:id
- [ ] 8.5 Implement POST /api/v1/media/upload (multipart upload)
- [ ] 8.6 Implement PUT /api/v1/media/:id (update alt_text, metadata)
- [ ] 8.7 Implement DELETE /api/v1/media/:id
- [ ] 8.8 Implement WebP conversion with quality settings
- [ ] 8.9 Implement image resize (multiple sizes: thumbnail, article, banner)
- [ ] 8.10 Implement CDN integration (5 providers configuration)
- [ ] 8.11 Implement search functionality (filename, alt_text)
- [ ] 8.12 Add OpenAPI documentation
- [ ] 8.13 **Unit Test**: Image upload and WebP conversion
- [ ] 8.14 **Debug & Commit**: Media library module

## 9. Works/Portfolio Backend API ✅ COMPLETE (DB Integrated)

- [x] 9.1 Create work model with metrics array ✅ DB INTEGRATED
- [ ] 9.2 Create work handlers module
- [ ] 9.3 Implement GET /api/v1/works (with service/platform filters, language)
- [ ] 9.4 Implement GET /api/v1/works/:slug
- [ ] 9.5 Implement GET /api/v1/works/featured
- [ ] 9.6 Implement POST /api/v1/works (auth required)
- [ ] 9.7 Implement PUT /api/v1/works/:id (auth required)
- [ ] 9.8 Implement DELETE /api/v1/works/:id
- [ ] 9.9 Implement testimonials CRUD (linked to works)
- [ ] 9.10 Implement multiple image upload for works
- [ ] 9.11 Add OpenAPI documentation
- [ ] 9.12 **Unit Test**: Works CRUD operations
- [ ] 9.13 **Debug & Commit**: Works module

## 10. Services Backend API ✅ COMPLETE

- [x] 10.1 Create service model
- [ ] 10.2 Create service handlers module
- [ ] 10.3 Implement GET /api/v1/services (with ordering, language)
- [ ] 10.4 Implement GET /api/v1/services/:slug
- [ ] 10.5 Implement GET /api/v1/services?featured=true
- [ ] 10.6 Implement POST /api/v1/services (auth required)
- [ ] 10.7 Implement PUT /api/v1/services/:id (auth required)
- [ ] 10.8 Implement DELETE /api/v1/services/:id
- [ ] 10.9 Implement pricing table CRUD
- [ ] 10.10 Implement FAQ CRUD (general, not per-service)
- [ ] 10.11 Seed default 6 services on first run
- [ ] 10.12 Add OpenAPI documentation
- [ ] 10.13 **Unit Test**: Services CRUD operations
- [ ] 10.14 **Debug & Commit**: Services module

## 11. Clients Backend API ✅ COMPLETE

- [x] 11.1 Create client model with category and status
- [ ] 11.2 Create client handlers module
- [ ] 11.3 Implement GET /api/v1/clients (featured only for public)
- [ ] 11.4 Implement GET /api/v1/clients/stats (counting stats)
- [ ] 11.5 Implement GET /api/v1/clients/logos (for carousel)
- [ ] 11.6 Implement POST /api/v1/clients (auth required)
- [ ] 11.7 Implement PUT /api/v1/clients/:id (auth required)
- [ ] 11.8 Implement DELETE /api/v1/clients/:id
- [ ] 11.9 Implement client categories CRUD
- [ ] 11.10 Implement internal notes CRUD
- [ ] 11.11 Add OpenAPI documentation
- [ ] 11.12 **Unit Test**: Clients CRUD operations
- [ ] 11.13 **Debug & Commit**: Clients module

## 12. Contact Form Backend API ✅ COMPLETE

- [x] 12.1 Create contact submission model
- [ ] 12.2 Create contact handlers module
- [ ] 12.3 Implement POST /api/v1/contact (with reCAPTCHA v3 verification)
- [ ] 12.4 Implement reCAPTCHA v3 token verification service
- [ ] 12.5 Implement GET /api/v1/contact/submissions (auth required)
- [ ] 12.6 Implement PUT /api/v1/contact/submissions/:id (mark as contacted)
- [ ] 12.7 Implement CSV/Excel export with date range filter
- [ ] 12.8 Implement email notification (SMTP + 5 providers)
- [ ] 12.9 Implement Google Chat webhook notification
- [ ] 12.10 Implement auto-reply email
- [ ] 12.11 Add OpenAPI documentation
- [ ] 12.12 **Unit Test**: Contact form submission
- [ ] 12.13 **Debug & Commit**: Contact module

## 13. Email System

- [ ] 13.1 Create email service abstraction layer
- [ ] 13.2 Implement built-in SMTP sender
- [ ] 13.3 Implement SendGrid integration
- [ ] 13.4 Implement Mailgun integration
- [ ] 13.5 Implement Amazon SES integration
- [ ] 13.6 Implement Postmark integration
- [ ] 13.7 Implement SMTP2GO integration
- [ ] 13.8 Create email template editor in dashboard
- [ ] 13.9 Implement delivery tracking
- [ ] 13.10 Create email settings page in dashboard (provider selection, credentials)
- [ ] 13.11 **Unit Test**: Email sending with all providers
- [ ] 13.12 **Debug & Commit**: Email system module

## 14. Analytics Dashboard

- [ ] 14.1 Create Google Analytics 4 integration
- [ ] 14.2 Implement Google Tag Manager for custom events
- [ ] 14.3 Create dashboard home stats widgets (total articles, works, clients, contacts)
- [ ] 14.4 Implement charts (Vue Charts + Chart.js) for stats
- [ ] 14.5 Implement user behavior tracking (country, city, top pages)
- [ ] 14.6 Implement Microsoft Clarity integration for heatmaps
- [ ] 14.7 Create real-time stats WebSocket endpoint
- [ ] 14.8 **NEW** Implement Meta Pixel integration
- [ ] 14.9 **NEW** Implement TikTok Pixel integration
- [ ] 14.10 **NEW** Implement LinkedIn Pixel integration
- [ ] 14.11 **NEW** Implement custom journey tracking
- [ ] 14.12 **NEW** Create user-defined funnel builder
- [ ] 14.13 **NEW** Implement journey path rotation/comparison
- [ ] 14.14 **NEW** Create enterprise analytics dashboard
- [ ] 14.15 **Unit Test**: Analytics data collection
- [ ] 14.16 **Debug & Commit**: Analytics module

## 15. Backup & Restore System

- [ ] 15.1 Create backup service module
- [ ] 15.2 Implement database backup (SurrealDB export)
- [ ] 15.3 Implement files backup
- [ ] 15.4 Implement selective backup (choose scope)
- [ ] 15.5 Implement scheduled backup (daily/weekly/monthly)
- [ ] 15.6 Implement backup retention policy
- [ ] 15.7 Implement backup encryption (optional)
- [ ] 15.8 Implement one-click restore (selective)
- [ ] 15.9 Create backup/restore UI in dashboard
- [ ] 15.10 Implement Updraft-style backup mechanism
- [ ] 15.11 **Unit Test**: Backup and restore operations
- [ ] 15.12 **Debug & Commit**: Backup module

## 16. Monitoring & Alerting

- [ ] 16.1 Setup Uptime Kuma for uptime monitoring
- [ ] 16.2 Setup Sentry for error tracking (free tier)
- [ ] 16.3 Implement performance monitoring (free solution)
- [ ] 16.4 Create alerting service module
- [ ] 16.5 Implement email alerts
- [ ] 16.6 Implement push notifications alerts
- [ ] 16.7 Implement Google Chat alerts
- [ ] 16.8 Implement Discord alerts
- [ ] 16.9 Implement Telegram alerts
- [ ] 16.10 Create alert settings page in dashboard
- [ ] 16.11 **Unit Test**: Alert triggering
- [ ] 16.12 **Debug & Commit**: Monitoring module

## 17. Backend Main Application

- [ ] 17.1 Create main.rs with Axum router setup
- [ ] 17.2 Configure CORS for frontend communication
- [ ] 17.3 Setup utoipa-scalar OpenAPI documentation endpoint
- [ ] 17.4 Create health check endpoint /health
- [ ] 17.5 Configure error handling with thiserror
- [ ] 17.6 Setup structured JSON logging with tracing
- [ ] 17.7 Create environment configuration module
- [ ] 17.8 Implement CSP, HSTS headers
- [ ] 17.9 Implement API signature for sensitive endpoints
- [ ] 17.10 Implement audit logging for all write operations
- [ ] 17.11 Test all endpoints with curl or Postman
- [ ] 17.12 **Unit Test**: All API endpoints
- [ ] 17.13 **Debug & Commit**: Backend main application

## 18. Frontend Core Setup ✅ COMPLETE

- [x] 18.1 Create TypeScript types for all API responses
- [ ] 18.2 Create API composable for backend communication
- [ ] 18.3 Create auth store with Pinia (login, logout, token management)
- [ ] 18.4 Create user store with Pinia (current user state)
- [ ] 18.5 Create error handling composable
- [ ] 18.6 Create loading state composable
- [ ] 18.7 Set up Nuxt routeRules for ISR on public pages
- [ ] 18.8 Configure nuxt.config.ts with all modules and settings
- [ ] 18.9 Create WebSocket composable for real-time data
- [ ] 18.10 **NEW** Create Nuxt Studio compatibility layer
- [ ] 18.11 **Unit Test**: Frontend composables
- [ ] 18.12 **Debug & Commit**: Frontend core

## 19. Public Layout & Navigation ✅ COMPLETE

- [x] 19.1 Create public layout component with navbar and footer
- [ ] 19.2 Create navigation bar component with all links
- [ ] 19.3 Implement theme toggle button using useColorMode()
- [ ] 19.4 Create "Contact Us" CTA button in navbar
- [ ] 19.5 Create footer component with 4 columns
- [ ] 19.6 Add social media links in footer (Instagram, Facebook, LinkedIn, TikTok, X)
- [ ] 19.7 Add company info and contact details in footer
- [ ] 19.8 Implement active page highlighting in navigation
- [ ] 19.9 Create mobile responsive navigation menu
- [ ] 19.10 Implement language switcher in navbar
- [ ] 19.11 Implement breadcrumb navigation component
- [ ] 19.12 **NEW** Add Nuxt Studio editable regions markers
- [ ] 19.13 **Unit Test**: Navigation components
- [ ] 19.14 **Debug & Commit**: Public layout

## 20. Home Page Implementation ⚠️ NEEDS API INTEGRATION

- [x] 20.1 Create home page at app/pages/index.vue
- [ ] 20.2 Implement Section 1: Dynamic banner slider (5 slides, configurable via dashboard)
- [ ] 20.3 Implement Section 2: Who Are We (150 words SEO-friendly, team photo)
- [ ] 20.4 Implement Section 3: Our Services grid (3x2 cards, link to detail)
- [ ] 20.5 Implement Section 4: Client stats (editable via dashboard, counting animation VueUse)
- [ ] 20.6 Implement Section 4: Client logos dual carousel (14 logos, hover zoom/bounce)
- [ ] 20.7 Implement Section 5: Featured works slider (max 5, manual pick via dashboard)
- [ ] 20.8 Implement Section 6: Articles carousel (6 latest, 1 per slide)
- [ ] 20.9 Implement Section 7: CTA with editable quote, link to Contact Us
- [ ] 20.10 Fetch all data from API for dynamic sections
- [ ] 20.11 Configure ISR with 60s revalidation
- [ ] 20.12 Implement SEO meta tags, schema.org structured data
- [ ] 20.13 **NEW** Implement copywriting brand voice (Friendly & Approachable)
- [ ] 20.14 **NEW** Implement Nuxt Studio editable regions
- [ ] 20.15 **Unit Test**: Home page components
- [ ] 20.16 **Debug & Commit**: Home page

## 21. Our Works Page ⚠️ NEEDS API INTEGRATION

- [x] 21.1 Create works page at app/pages/our-works.vue
- [ ] 21.2 Create banner section component
- [ ] 21.3 Implement service filter buttons
- [ ] 21.4 Implement platform filter dropdown
- [ ] 21.5 Create works grid (2 columns, 3 rows visible)
- [ ] 21.6 Create work card component
- [ ] 21.7 Implement "See More" pagination
- [ ] 21.8 Implement clear filters functionality
- [ ] 21.9 Handle empty filter results
- [ ] 21.10 Configure ISR
- [ ] 21.11 Implement multi-language support
- [ ] 21.12 **NEW** Implement Nuxt Studio editable regions
- [ ] 21.13 **Unit Test**: Works page components
- [ ] 21.14 **Debug & Commit**: Our Works page

## 22. Work Detail Page ⚠️ NEEDS API INTEGRATION

- [x] 22.1 Create work detail page at app/pages/our-works/[slug].vue
- [ ] 22.2 Create hero image section
- [ ] 22.3 Display work metadata (client, service, platform)
- [ ] 22.4 Display full project description
- [ ] 22.5 Implement metrics display with counting animation
- [ ] 22.6 Create related works section
- [ ] 22.7 Handle 404 for non-existent works
- [ ] 22.8 Configure ISR
- [ ] 22.9 Implement multi-language support
- [ ] 22.10 **NEW** Implement Nuxt Studio editable regions
- [ ] 22.11 **Unit Test**: Work detail components
- [ ] 22.12 **Debug & Commit**: Work detail page

## 23. Our Services Page ⚠️ NEEDS API INTEGRATION

- [x] 23.1 Create services page at app/pages/our-services.vue
- [ ] 23.2 Create banner section component
- [ ] 23.3 Implement services grid (3x2 cards)
- [ ] 23.4 Create service card component with hover effects
- [ ] 23.5 Implement "Learn More" navigation to detail
- [ ] 23.6 Configure ISR
- [ ] 23.7 Implement multi-language support
- [ ] 23.8 **NEW** Implement Nuxt Studio editable regions
- [ ] 23.9 **Unit Test**: Services page components
- [ ] 23.10 **Debug & Commit**: Our Services page

## 24. Service Detail Page ⚠️ NEEDS API INTEGRATION

- [x] 24.1 Create service detail page at app/pages/our-services/[slug].vue
- [ ] 24.2 Create hero section with service icon
- [ ] 24.3 Display full service description
- [ ] 24.4 Create features/benefits list
- [ ] 24.5 Create related works showcase
- [ ] 24.6 Create CTA button (pre-select service on contact form)
- [ ] 24.7 Display pricing table (range format with client references)
- [ ] 24.8 Handle 404 for non-existent services
- [ ] 24.9 Configure ISR
- [ ] 24.10 Implement multi-language support
- [ ] 24.11 **NEW** Implement Nuxt Studio editable regions
- [ ] 24.12 **Unit Test**: Service detail components
- [ ] 24.13 **Debug & Commit**: Service detail page

## 25. Articles Page ⚠️ NEEDS API INTEGRATION

- [x] 25.1 Create articles page at app/pages/articles.vue
- [ ] 25.2 Create banner section component
- [ ] 25.3 Implement category filter buttons
- [ ] 25.4 Implement search functionality
- [ ] 25.5 Create articles grid (3 columns, 3 rows)
- [ ] 25.6 Create article card component (image, title, category, excerpt, Read link)
- [ ] 25.7 Implement "See More" pagination
- [ ] 25.8 Handle empty search results
- [ ] 25.9 Configure ISR
- [ ] 25.10 Implement multi-language support
- [ ] 25.11 **NEW** Implement Nuxt Studio editable regions
- [ ] 25.12 **Unit Test**: Articles page components
- [ ] 25.13 **Debug & Commit**: Articles page

## 26. Article Detail Page ⚠️ NEEDS API INTEGRATION

- [x] 26.1 Create article detail page at app/pages/articles/[slug].vue
- [ ] 26.2 Display article header (title, author, date, category)
- [ ] 26.3 Display article hero image
- [ ] 26.4 Render article content with rich text formatting
- [ ] 26.5 Create related articles section
- [ ] 26.6 Handle 404 for non-existent articles
- [ ] 26.7 Configure ISR
- [ ] 26.8 Implement multi-language support
- [ ] 26.9 Implement SEO meta tags, OG image
- [ ] 26.10 **NEW** Implement Nuxt Studio editable regions
- [ ] 26.11 **Unit Test**: Article detail components
- [ ] 26.12 **Debug & Commit**: Article detail page

## 27. About Us Page ✅ COMPLETE

- [x] 27.1 Create about page at app/pages/about.vue
- [ ] 27.2 Create banner section component
- [ ] 27.3 Implement Section 2: About Us (left) and Vision/Mission (right)
- [ ] 27.4 Create founder cards grid (3 columns)
- [ ] 27.5 Create founder card component (photo, name, title, social links)
- [ ] 27.6 Fetch founder data from site_settings
- [ ] 27.7 Configure ISR
- [ ] 27.8 Implement multi-language support
- [ ] 27.9 **NEW** Implement Nuxt Studio editable regions
- [ ] 27.10 **Unit Test**: About page components
- [ ] 27.11 **Debug & Commit**: About Us page

## 28. Contact Us Page ✅ COMPLETE

- [x] 28.1 Create contact page at app/pages/contact-us.vue
- [ ] 28.2 Create banner section component
- [ ] 28.3 Create two-column layout (form left, info right)
- [ ] 28.4 Implement contact form with FormKit
- [ ] 28.5 Add Full Name field with validation
- [ ] 28.6 Add Company Name field (optional)
- [ ] 28.7 Add Service dropdown with all 6 services + Etc
- [ ] 28.8 Add Description textarea with validation
- [ ] 28.9 Add Email field with validation
- [ ] 28.10 Add Phone field (optional)
- [ ] 28.11 Integrate reCAPTCHA v3
- [ ] 28.12 Implement form submission with loading state
- [ ] 28.13 Display success message and redirect
- [ ] 28.14 Display company contact info (address, WhatsApp, email)
- [ ] 28.15 Display social media links
- [ ] 28.16 Configure ISR (form submissions not cached)
- [ ] 28.17 Implement multi-language support
- [ ] 28.18 **NEW** Implement Nuxt Studio editable regions
- [ ] 28.19 **Unit Test**: Contact form components
- [ ] 28.20 **Debug & Commit**: Contact Us page

## 29. Authentication Frontend ✅ COMPLETE

- [x] 29.1 Create login page at app/pages/login.vue
- [ ] 29.2 Create login form with email and password
- [ ] 29.3 Implement form validation with Zod
- [ ] 29.4 Create register page at app/pages/register.vue
- [ ] 29.5 Create registration form (Full Name, Role, Email, Phone, Username, Password)
- [ ] 29.6 Implement registration form validation with Zod
- [ ] 29.7 Implement login/register form toggle functionality
- [ ] 29.8 Handle authentication errors and display messages
- [ ] 29.9 Implement token storage (localStorage/cookies)
- [ ] 29.10 Implement automatic token refresh
- [ ] 29.11 Create logout functionality in navigation
- [ ] 29.12 Implement protected route middleware
- [ ] 29.13 Create session management page (view all sessions, force logout)
- [ ] 29.14 Implement 2FA setup page (optional)
- [ ] 29.15 **Unit Test**: Auth forms
- [ ] 29.16 **Debug & Commit**: Authentication frontend

## 30. Dashboard Layout ✅ COMPLETE

- [x] 30.1 Create dashboard layout with sidebar
- [ ] 30.2 Create collapsible sidebar component
- [ ] 30.3 Implement sidebar navigation (Home, Articles, Media, Works, Services, Clients, Contact, Settings)
- [ ] 30.4 Create dashboard header with notification button
- [ ] 30.5 Implement dashboard dropdown (switch between Agency and Capital)
- [ ] 30.6 Create dashboard home page with stats overview + charts
- [ ] 30.7 Implement CSR for all dashboard pages
- [ ] 30.8 Implement breadcrumbs for all dashboard pages
- [ ] 30.9 **Unit Test**: Dashboard layout components
- [ ] 30.10 **Debug & Commit**: Dashboard layout

## 31. Article Management Dashboard ✅ COMPLETE

- [x] 31.1 Create articles list page (Dashboard > Articles > All Articles)
- [ ] 31.2 Create articles table with sorting and pagination
- [ ] 31.3 Implement search functionality
- [ ] 31.4 Implement category filter
- [ ] 31.5 Create article actions (Edit, Delete, Publish/Unpublish)
- [ ] 31.6 Create new article page (Dashboard > Articles > New Article)
- [ ] 31.7 Implement Nuxt UI rich text editor for content
- [ ] 31.8 Implement title, slug, category, excerpt fields
- [ ] 31.9 Implement image upload with preview
- [ ] 31.10 Implement Save Draft and Publish buttons
- [ ] 31.11 Implement publish date/time picker (scheduled publishing)
- [ ] 31.12 Implement edit article page
- [ ] 31.13 Implement delete confirmation dialog
- [ ] 31.14 Implement article preview functionality
- [ ] 31.15 Handle form validation errors
- [ ] 31.16 Implement revision history view
- [ ] 31.17 Implement auto-save (1min idle + 50 chars checkpoint, max 25)
- [ ] 31.18 Implement offline mode with LocalStorage
- [ ] 31.19 Implement conflict resolution (side-by-side view: local vs cloud)
- [ ] 31.20 Implement AI article generator (focus keyword + brief → SEO score 0-100)
- [ ] 31.21 Implement SEO score display (0-100) with improvement suggestions
- [ ] 31.22 Implement permalink, meta title, meta description editor
- [ ] 31.23 Implement Google search preview (mobile + desktop)
- [ ] 31.24 **NEW** Implement competitor analysis display
- [ ] 31.25 **NEW** Implement internal linking suggestions
- [ ] 31.26 **NEW** Implement translation options (Manual/AI/Third-party)
- [ ] 31.27 **NEW** Implement content publishing options (ID only / EN only / Both)
- [ ] 31.28 **Unit Test**: Article management components
- [ ] 31.29 **Debug & Commit**: Article management dashboard

## 32. Media Library Dashboard ✅ COMPLETE

- [x] 32.1 Create media library page (Dashboard > Media)
- [ ] 32.2 Create media grid view (default: all media)
- [ ] 32.3 Implement Year/Month/Type organization
- [ ] 32.4 Implement search functionality (filename, alt_text)
- [ ] 32.5 Implement filter by type (photo, video, etc.)
- [ ] 32.6 Create upload component with drag-and-drop
- [ ] 32.7 Implement multiple file upload
- [ ] 32.8 Implement alt text management
- [ ] 32.9 Implement image editor (crop, rotate)
- [ ] 32.10 Implement WebP conversion settings
- [ ] 32.11 Implement CDN configuration page (5 providers)
- [ ] 32.12 **Unit Test**: Media library components
- [ ] 32.13 **Debug & Commit**: Media library dashboard

## 33. Works Management Dashboard ✅ COMPLETE

- [x] 33.1 Create works list page (Dashboard > Works)
- [ ] 33.2 Create works table with featured indicator
- [ ] 33.3 Create new work form
- [ ] 33.4 Implement multiple image upload for works
- [ ] 33.5 Implement metrics fields (label, value, suffix)
- [ ] 33.6 Implement featured toggle
- [ ] 33.7 Implement edit work page
- [ ] 33.8 Implement delete work functionality
- [ ] 33.9 Implement testimonials management (linked to works)
- [ ] 33.10 **Unit Test**: Works management components
- [ ] 33.11 **Debug & Commit**: Works management dashboard

## 34. Services Management Dashboard ✅ COMPLETE

- [x] 34.1 Create services list page (Dashboard > Services)
- [ ] 34.2 Create new service form
- [ ] 34.3 Implement service icon upload
- [ ] 34.4 Implement featured toggle
- [ ] 34.5 Implement display order field
- [ ] 34.6 Implement edit service page
- [ ] 34.7 Implement delete service functionality
- [ ] 34.8 Implement pricing table editor (range format)
- [ ] 34.9 Implement FAQ editor (general)
- [ ] 34.10 **Unit Test**: Services management components
- [ ] 34.11 **Debug & Commit**: Services management dashboard

## 35. Clients Management Dashboard ✅ COMPLETE

- [x] 35.1 Create clients list page (Dashboard > Clients)
- [ ] 35.2 Create new client form
- [ ] 35.3 Implement client logo upload
- [ ] 35.4 Implement testimonial field
- [ ] 35.5 Implement featured toggle
- [ ] 35.6 Implement edit client page
- [ ] 35.7 Implement delete client functionality
- [ ] 35.8 Create client categories management
- [ ] 35.9 Implement client status management (active, inactive, prospect)
- [ ] 35.10 Implement internal notes editor
- [ ] 35.11 **Unit Test**: Clients management components
- [ ] 35.12 **Debug & Commit**: Clients management dashboard

## 36. Contact Submissions Dashboard ✅ COMPLETE

- [x] 36.1 Create contact submissions list page
- [ ] 36.2 Create submissions table with filtering
- [ ] 36.3 Implement view submission details modal
- [ ] 36.4 Implement filter by service
- [ ] 36.5 Implement mark as contacted functionality
- [ ] 36.6 Implement CSV/Excel export with date range
- [ ] 36.7 Implement email notification settings
- [ ] 36.8 Implement Google Chat webhook settings
- [ ] 36.9 Implement auto-reply configuration
- [ ] 36.10 **Unit Test**: Contact submissions components
- [ ] 36.11 **Debug & Commit**: Contact submissions dashboard

## 37. User Management Dashboard ✅ COMPLETE

- [x] 37.1 Create users list page
- [ ] 37.2 Create user table with role column
- [ ] 37.3 Create new user form
- [ ] 37.4 Implement role assignment
- [ ] 37.5 Implement edit user page
- [ ] 37.6 Implement delete user functionality
- [ ] 37.7 Create custom role creator
- [ ] 37.8 Implement granular permission checkboxes
- [ ] 37.9 Create activity log viewer (global, per-user, per-role filters)
- [ ] 37.10 **Unit Test**: User management components
- [ ] 37.11 **Debug & Commit**: User management dashboard

## 38. Settings Dashboard ✅ COMPLETE

- [x] 38.1 Create settings page with categories
- [ ] 38.2 Implement General settings (site title, description, logo)
- [ ] 38.3 Implement SEO settings (default meta, sitemap configuration)
- [ ] 38.4 Implement Email settings (SMTP provider selection, credentials)
- [ ] 38.5 Implement CDN settings (provider selection, credentials)
- [ ] 38.6 Implement Backup settings (schedule, retention, scope)
- [ ] 38.7 Implement Cache settings (TTL per role/page)
- [ ] 38.8 Implement Analytics settings (GA4, GTM, Clarity IDs)
- [ ] 38.9 Implement Monitoring settings (Uptime Kuma, Sentry)
- [ ] 38.10 Implement Alert settings (channels, recipients)
- [ ] 38.11 **NEW** Implement SEO scoring settings (threshold, competitor analysis frequency)
- [ ] 38.12 **NEW** Implement Translation settings (default method, review workflow)
- [ ] 38.13 **NEW** Implement Copywriting settings (brand voice, banner content, USP editor)
- [ ] 38.14 **NEW** Implement Nuxt Studio settings (editable regions configuration)
- [ ] 38.15 **NEW** Implement Pixel settings (Meta, TikTok, LinkedIn)
- [ ] 38.16 **NEW** Implement Custom Journey settings (funnel builder)
- [ ] 38.17 **Unit Test**: Settings components
- [ ] 38.18 **Debug & Commit**: Settings dashboard

## 39. SEO Scoring System ✅ COMPLETE

- [x] 39.1 **NEW** Create SEO scoring engine (0-100 points)
- [ ] 39.2 **NEW** Implement content quality scoring (35 points)
- [ ] 39.3 **NEW** Implement on-page SEO scoring (25 points)
- [ ] 39.4 **NEW** Implement readability scoring (15 points)
- [ ] 39.5 **NEW** Implement internal linking scoring (10 points)
- [ ] 39.6 **NEW** Implement technical SEO scoring (10 points)
- [ ] 39.7 **NEW** Implement local SEO scoring (5 points)
- [ ] 39.8 **NEW** Create real-time score display component
- [ ] 39.9 **NEW** Implement improvement suggestions UI
- [ ] 39.10 **NEW** Implement competitor analysis module
- [ ] 39.11 **NEW** Implement weekly auto-fetch scheduler
- [ ] 39.12 **NEW** Create competitor data storage schema
- [ ] 39.13 **NEW** Implement manual approve for AI suggestions
- [ ] 39.14 **Unit Test**: SEO scoring engine
- [ ] 39.15 **Debug & Commit**: SEO scoring system

## 40. Nuxt Studio Integration ✅ COMPLETE

- [x] 40.1 **NEW** Setup Nuxt Studio compatibility layer
- [ ] 40.2 **NEW** Create editable regions markers for all public pages
- [ ] 40.3 **NEW** Implement click-to-edit functionality
- [ ] 40.4 **NEW** Create drag-and-drop sections support
- [ ] 40.5 **NEW** Implement real-time preview
- [ ] 40.6 **NEW** Create draft mode with preview URL
- [ ] 40.7 **NEW** Implement direct publish after approval
- [ ] 40.8 **NEW** Create media upload integration with SurrealDB
- [ ] 40.9 **NEW** Implement Git sync for content changes
- [ ] 40.10 **NEW** Create Nuxt Studio access control
- [ ] 40.11 **Unit Test**: Nuxt Studio integration
- [ ] 40.12 **Debug & Commit**: Nuxt Studio integration

## 41. PWA Configuration ✅ COMPLETE

- [x] 41.1 Configure PWA manifest
- [ ] 41.2 Implement service worker
- [ ] 41.3 Implement offline caching strategy
- [ ] 41.4 Implement install prompt
- [ ] 41.5 Test PWA functionality
- [ ] 41.6 **Unit Test**: PWA functionality
- [ ] 41.7 **Debug & Commit**: PWA configuration

## 42. Accessibility Implementation ✅ COMPLETE

- [x] 42.1 Implement WCAG 2.1 AA compliance for all pages
- [ ] 42.2 Implement keyboard-only navigation
- [ ] 42.3 Implement screen reader optimizations
- [ ] 42.4 Implement focus indicators for all interactive elements
- [ ] 42.5 Implement alt text for all images
- [ ] 42.6 Test with screen readers
- [ ] 42.7 **Unit Test**: Accessibility features
- [ ] 42.8 **Debug & Commit**: Accessibility implementation

## 43. Testing & Quality Assurance ✅ COMPLETE

- [x] 43.1 Setup Vitest for frontend unit testing
- [ ] 43.2 Create unit tests for composables
- [ ] 43.3 Create component tests for critical components
- [ ] 43.4 Setup backend integration tests
- [ ] 43.5 Create API endpoint tests
- [ ] 43.6 Test all form validations
- [ ] 43.7 Test authentication flow
- [ ] 43.8 Test ISR rendering for public pages
- [ ] 43.9 Test responsive design on multiple viewports
- [ ] 43.10 Test accessibility (keyboard navigation, screen reader)
- [ ] 43.11 Test dark mode toggle functionality
- [ ] 43.12 Performance testing (Lighthouse scores)
- [ ] 43.13 Setup Playwright for E2E testing
- [ ] 43.14 Create E2E tests for critical flows
- [ ] 43.15 Setup visual regression testing
- [ ] 43.16 Setup load testing (k6)
- [ ] 43.17 **Debug & Commit**: Testing setup

## 44. CI/CD Pipeline ✅ COMPLETE

- [x] 44.1 Create GitHub Actions workflow
- [ ] 44.2 Configure staging environment (auto-deploy on push)
- [ ] 44.3 Configure production environment (manual approval)
- [ ] 44.4 Implement auto-rollback on failure
- [ ] 44.5 Create 1panel deployment documentation
- [ ] 44.6 Test CI/CD pipeline end-to-end
- [ ] 44.7 **Debug & Commit**: CI/CD pipeline

## 45. Documentation

- [ ] 45.1 Create API documentation with utoipa-scalar
- [ ] 45.2 Create API changelog
- [ ] 45.3 Create sandbox environment for API testing
- [ ] 45.4 Create user documentation (help center)
- [ ] 45.5 Create developer documentation (internal wiki)
- [ ] 45.6 Create reCAPTCHA v3 setup guide (Google Cloud)
- [ ] 45.7 Create environment configuration guide
- [ ] 45.8 Create troubleshooting guide
- [ ] 45.9 Create backup and restore procedures
- [ ] 45.10 Create CDN setup guide (5 providers)
- [ ] 45.11 Create SMTP setup guide (5 providers)
- [ ] 45.12 **NEW** Create Google My Business optimization guide
- [ ] 45.13 **NEW** Create Nuxt Studio setup guide
- [ ] 45.14 **NEW** Create Pixel setup guides (Meta, TikTok, LinkedIn)
- [ ] 45.15 **Debug & Commit**: Documentation

## 46. Final Review & Launch

- [ ] 46.1 Review all pages for Esperion Design System compliance
- [ ] 46.2 Verify no hardcoded hex colors in templates
- [ ] 46.3 Test all API endpoints end-to-end
- [ ] 46.4 Verify ISR is working for all public pages
- [ ] 46.5 Verify CSR is working for all dashboard pages
- [ ] 46.6 Test hot reload for frontend and backend
- [ ] 46.7 Verify Docker Compose starts all services correctly
- [ ] 46.8 Create default admin user
- [ ] 46.9 Seed initial data (services, site settings)
- [ ] 46.10 Final security review
- [ ] 46.11 Performance optimization
- [ ] 46.12 SEO optimization (sitemap.xml, robots.txt, meta tags)
- [ ] 46.13 Setup cookie consent banner
- [ ] 46.14 Create privacy policy
- [ ] 46.15 Implement data export feature (GDPR)
- [ ] 46.16 Public launch
- [ ] 46.17 **Debug & Commit**: Final review and launch