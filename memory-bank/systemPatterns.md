# System Patterns & Architecture Rules

## Project Structure

```
esperion-agency-web/
├── memory-bank/           # Memory Bank documentation
├── openspec/
│   ├── config.yaml        # OpenSpec configuration
│   ├── changes/
│   │   └── esperion-agency-web/
│   │       ├── proposal.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── specs/
│   └── specs/
├── frontend/              # Nuxt 4 application
│   └── app/              # Nuxt 4 app directory
│       ├── pages/
│       ├── components/
│       ├── layouts/
│       ├── composables/
│       ├── stores/
│       ├── utils/
│       └── types/
├── backend/              # Rust + Axum API
│   └── src/
│       ├── handlers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── db/
│       └── api/
└── infrastructure/       # Docker & deployment
    └── docker/
```

## Frontend Architecture Rules

### Nuxt 4 Conventions
- **MUST** use `app/` directory for all pages, components, layouts, composables
- **MUST** use Vue 3 Composition API with `<script setup lang="ts">`
- **MUST** use TypeScript with NO `any` type
- **MUST** follow Nuxt 4 file naming conventions

### Rendering Strategy
| Page Type | Strategy | Configuration |
|-----------|----------|---------------|
| Public pages | ISR | `routeRules: { '/**': { isr: 60 } }` |
| Dashboard pages | CSR | `routeRules: { '/dashboard/**': { ssr: false } }` |
| API routes | SSR | Default |

### Esperion Design System Rules
- **DILARANG** menggunakan hex hardcoded colors di template .vue
- **MUST** use semantic color classes from Tailwind config
- **MUST** apply 60-30-10 color distribution rule

```typescript
// ✅ CORRECT
<div class="bg-esperion-light-bg dark:bg-esperion-dark-bg">

// ❌ WRONG
<div class="bg-[#FAFCFF]">
```

### Copywriting Guidelines
- **Brand Voice:** Friendly & Approachable
- **Banner Slides:** 5 slides (Data, AI, Results, Partnership, Innovation)
- **Service USPs:** Editable statistics via dashboard
- **Local SEO:** Mention Jakarta, Depok, Bogor naturally

### Nuxt Studio Compatibility
- **MUST** mark editable regions with `data-editable` attributes
- **MUST** mark dynamic regions with `data-locked="true"` attributes
- **MUST** support draft mode with preview URL
- **MUST** sync content changes to SurrealDB

```vue
<!-- Editable region -->
<div data-editable="banner.title" data-type="text">
  {{ banner.title }}
</div>

<!-- Locked region (dynamic content) -->
<div data-locked="true">
  <ArticleList :articles="articles" />
</div>
```

### Component Patterns

```vue
<script setup lang="ts">
// Use defineProps with TypeScript
interface Props {
  title: string
  variant?: 'primary' | 'secondary'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

<template>
  <!-- Use semantic color classes -->
</template>
```

### Multi-language Architecture
- **URL Structure:** `/id/`, `/en/` prefix
- **Auto-detect:** IP-based locale detection
- **Translation:** Manual / Alibaba AI / Third-party API
- **Review Workflow:** AI translate → human review → publish
- **Translation Memory:** Save approved translations for reuse

### SEO Scoring System
- **Score Range:** 0-100 points
- **Breakdown:**
  - Content Quality: 35 points
  - On-Page SEO: 25 points
  - Readability: 15 points
  - Internal Linking: 10 points
  - Technical SEO: 10 points
  - Local SEO: 5 points
- **Threshold:** Default 75, configurable
- **Real-time:** Live scoring while editing

## Backend Architecture Rules

### Rust Project Structure
```
backend/src/
├── main.rs           # Application entry point, Axum router
├── lib.rs            # Library root
├── handlers/         # Request handlers
│   ├── auth.rs
│   ├── articles.rs
│   ├── works.rs
│   ├── services.rs
│   ├── clients.rs
│   └── contact.rs
├── models/           # Data models
│   ├── user.rs
│   ├── article.rs
│   ├── work.rs
│   ├── service.rs
│   ├── client.rs
│   └── contact.rs
├── routes/           # Route definitions
├── middleware/       # Auth, CORS, logging
├── db/               # Database operations
└── api/              # OpenAPI definitions
```

### Code Quality Rules
- **MUST** use proper error handling with `thiserror` or `anyhow`
- **MUST NOT** use `.unwrap()` in production code
- **MUST** use `async/await` with Tokio runtime
- **MUST** implement `serde` for all serializable structs

### API Response Pattern

```rust
#[derive(serde::Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
```

### API Versioning
- **Pattern:** `/api/v1/`, `/api/v2/`
- **Requirement:** Backward compatibility required
- **Rate Limiting:** Per-endpoint + global (Binance-style)

## Database Patterns

### SurrealDB Schema Rules
- **MUST** use `DEFINE TABLE SCHEMAFULL` for all tables
- **MUST** use `DEFINE FIELD` with type assertions
- **MUST** use Rust structs that map to SurrealDB tables

### Table Naming Convention
- Table names: `plural_snake_case` (e.g., `users`, `articles`)
- Field names: `snake_case`
- Record IDs: `table:id`

### Core Tables (17+)
1. `users` - User accounts with device tracking
2. `articles` - Articles with multi-language support
3. `works` - Portfolio works
4. `services` - Service catalog
5. `clients` - Client logos & testimonials
6. `contact_submissions` - Contact form submissions
7. `media_library` - Media files with organization
8. `sessions` - User sessions with device info
9. `activity_logs` - Activity audit log
10. `settings` - Site settings
11. `backup_history` - Backup records
12. `seo_scores` - SEO score history
13. `competitor_analysis` - Competitor data
14. `user_sessions` - Analytics session data
15. `translation_memory` - Translation cache
16. `migrations` - Schema migration tracking

## Authentication Patterns

### JWT Token Structure
```typescript
interface JwtPayload {
  sub: string;      // User ID
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  device_id: string;    // Fingerprint
  iat: number;      // Issued at
  exp: number;      // Expiration (7 days)
}
```

### Token Storage
- Access token: Memory (Pinia store)
- Refresh token: HttpOnly cookie or secure localStorage
- Session tracking: SurrealDB sessions table

### Device Tracking
- **MUST** fingerprint device on login
- **MUST** track IP address and user agent
- **MUST** allow session management (view all, force logout)

## Analytics Patterns

### Analytics Stack
```
Layer 1: Google Analytics 4 + GTM
  - Page views, events, user journey
  - Conversion tracking
  - UTM parameter tracking

Layer 2: Microsoft Clarity
  - Heatmaps
  - Session recordings

Layer 3: SurrealDB Custom Tracking
  - Detailed user journey storage
  - Custom funnel tracking
  - Event data with full context

Layer 4: Pixel Integrations
  - Meta Pixel (Facebook/Instagram)
  - TikTok Pixel
  - LinkedIn Pixel
```

### Custom Journey Tracking
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

### User-Defined Funnels
- Users can create custom journey paths
- Example: `Home > Service > Contact US > Submit Form`
- Can edit/rotate paths to compare performance
- Conversion rates displayed per path

## Docker Patterns

### Service Configuration
| Service | Image | Ports | Volumes |
|---------|-------|-------|---------|
| frontend | node:20-alpine | 3000 | ./frontend:/app |
| backend | rust:1.75 | 8080 | ./backend:/app |
| database | surrealdb:latest | 8000 | surreal-data:/data |

### Hot Reload Requirements
- Frontend: Nuxt HMR must work through Docker volume
- Backend: cargo-watch for auto-recompile
- Database: Persistent volume for data

## Testing Patterns

### Frontend Testing (Vitest)
- Unit tests for composables
- Component tests for critical components
- E2E tests for critical flows (Playwright)

### Backend Testing
- Integration tests for API endpoints
- Unit tests for business logic
- Load testing (k6)

### Workflow
Per major task:
1. Implement
2. Unit Test
3. Debugging
4. Git Commit

## Documentation Patterns

### Code Comments
- Use JSDoc for TypeScript
- Use rustdoc for Rust code
- Document complex business logic

### Memory Bank Updates
Update Memory Bank when:
- Completing an OpenSpec section
- Making architectural decisions
- Encountering complex bugs or workarounds
- Discovering new patterns

## Security & Compliance Patterns

### Headers
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)

### API Security
- API signature for sensitive endpoints
- Audit logging for all write operations

### Privacy
- Cookie consent banner (granular options)
- IP anonymization for GDPR
- Data export feature (GDPR right to export)

### Authentication
- 2FA (optional, TOTP)
- Rate limiting (per-endpoint + global)
- Device fingerprinting