# Esperion Frontend

Nuxt 3 application with TypeScript, Tailwind CSS, and Pinia state management.

## Tech Stack

- **Nuxt 3** - Vue.js framework with SSR/SSG
- **TypeScript** - Strict mode enabled
- **Tailwind CSS** - Esperion Design System
- **Pinia** - State management
- **@nuxtjs/i18n** - Multi-language support
- **FormKit** - Form handling
- **VueUse** - Composable utilities
- **Playwright** - E2E testing

## Directory Structure

```
frontend/
├── app/
│   ├── components/          # Vue components
│   │   ├── SeoScoreDisplay.vue
│   │   ├── LanguageSwitcher.vue
│   │   ├── AccessibilityToolbar.vue
│   │   └── ui/
│   │       ├── EsButton.vue
│   │       ├── EsCard.vue
│   │       ├── LanguageSwitcher.vue
│   │       └── LanguagePrompt.vue
│   ├── composables/         # Composable functions
│   │   ├── useApi.ts
│   │   ├── useAsyncData.ts
│   │   └── useSeoMeta.ts
│   ├── layouts/             # Layout components
│   │   ├── default.vue
│   │   └── dashboard.vue
│   ├── locales/             # i18n translations
│   │   ├── id.json
│   │   └── en.json
│   ├── pages/               # Page components (26 pages)
│   │   ├── index.vue
│   │   ├── about.vue
│   │   ├── articles.vue
│   │   ├── articles/[slug].vue
│   │   ├── our-works.vue
│   │   ├── our-works/[slug].vue
│   │   ├── our-services.vue
│   │   ├── our-services/[slug].vue
│   │   ├── contact-us.vue
│   │   ├── login.vue
│   │   ├── register.vue
│   │   ├── privacy-policy.vue
│   │   ├── terms-of-service.vue
│   │   ├── offline.vue
│   │   └── dashboard/
│   │       ├── index.vue
│   │       ├── articles.vue
│   │       ├── articles/new.vue
│   │       ├── works.vue
│   │       ├── works/new.vue
│   │       ├── media.vue
│   │       ├── services.vue
│   │       ├── clients.vue
│   │       ├── contact.vue
│   │       ├── users.vue
│   │       └── settings.vue
│   ├── stores/              # Pinia stores
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── ui.ts
│   └── types/               # TypeScript types
├── e2e/                     # Playwright E2E tests
│   ├── auth.spec.ts
│   ├── articles.spec.ts
│   ├── contact.spec.ts
│   ├── dashboard.spec.ts
│   ├── language.spec.ts
│   ├── public-pages.spec.ts
│   ├── fixtures.ts
│   └── global-setup.ts
├── tests/                   # Unit tests
│   └── stores/
│       ├── auth.test.ts
│       ├── user.test.ts
│       └── ui.test.ts
├── public/                  # Static assets
├── nuxt.config.ts           # Nuxt configuration
└── playwright.config.ts     # Playwright configuration
```

## Pinia Stores

### auth.ts - Authentication Store

Manages user authentication state and token management.

```typescript
// State
token: string | null
refreshToken: string | null
user: User | null
isAuthenticated: boolean
isLoading: boolean
error: string | null

// Actions
login(email: string, password: string)
register(data: RegisterData)
logout()
refreshTokenAction()
fetchCurrentUser()
initFromCookie()
```

### user.ts - User Store

Manages user profile and preferences.

```typescript
// State
profile: UserProfile | null
preferences: UserPreferences
isLoading: boolean

// Actions
fetchProfile()
updateProfile(data: ProfileUpdate)
updatePreferences(prefs: Preferences)
```

### ui.ts - UI Store

Manages global UI state.

```typescript
// State
theme: 'light' | 'dark'
sidebarOpen: boolean
notifications: Notification[]

// Actions
toggleTheme()
toggleSidebar()
addNotification(notification)
removeNotification(id)
```

## Components

### Public Components

| Component | Description |
|-----------|-------------|
| `SeoScoreDisplay.vue` | Displays SEO score with breakdown (0-100) |
| `LanguageSwitcher.vue` | Language switcher for /id/ and /en/ |
| `AccessibilityToolbar.vue` | Accessibility controls (font size, contrast) |

### UI Components

| Component | Description |
|-----------|-------------|
| `EsButton.vue` | Esperion-styled button (primary, secondary, danger) |
| `EsCard.vue` | Esperion-styled card with hover effects |
| `LanguagePrompt.vue` | Prompt for language selection |

## Pages

### Public Pages (ISR)

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with dynamic sections |
| About | `/about` | Company info and team |
| Articles | `/articles` | Article listing with filters |
| Article Detail | `/articles/[slug]` | Single article view |
| Our Works | `/our-works` | Portfolio listing |
| Work Detail | `/our-works/[slug]` | Single project view |
| Our Services | `/our-services` | Services listing |
| Service Detail | `/our-services/[slug]` | Service details |
| Contact Us | `/contact-us` | Contact form with reCAPTCHA |
| Login | `/login` | User login |
| Register | `/register` | User registration |

### Dashboard Pages (CSR)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard Home | `/dashboard` | Stats overview |
| Articles | `/dashboard/articles` | Article management |
| New Article | `/dashboard/articles/new` | Create/edit article |
| Works | `/dashboard/works` | Portfolio management |
| Media | `/dashboard/media` | Media library |
| Services | `/dashboard/services` | Service management |
| Clients | `/dashboard/clients` | Client management |
| Contact | `/dashboard/contact` | Contact submissions |
| Users | `/dashboard/users` | User management |
| Settings | `/dashboard/settings` | Site settings |

## Multi-Language (i18n)

### Overview

Esperion uses full localization per locale for SEO 2026 compliance. All pages display content entirely in the selected language (Indonesian or English), ensuring:
- Clear language signals for search engines
- Consistent user experience per locale
- Proper E-E-A-T signals for both languages

### Configuration

```typescript
// nuxt.config.ts
i18n: {
  locales: [
    { code: 'id', name: 'Indonesian', file: 'id.json' },
    { code: 'en', name: 'English', file: 'en.json' }
  ],
  defaultLocale: 'id',
  strategy: 'prefix',
  detectBrowserLanguage: {
    useCookie: true,
    fallbackLocale: 'id'
  }
}
```

### URL Structure

- Indonesian: `/id/` prefix (default)
- English: `/en/` prefix
- Example: `/id/artikel` vs `/en/articles`

### Usage in Vue Components

```vue
<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  ogTitle: t('seo.home.ogTitle'),
  ogDescription: t('seo.home.ogDescription')
});
</script>

<template>
  <h1>{{ t('home.hero.slide1Title') }}</h1>
  <p>{{ t('home.hero.slide1Desc') }}</p>
  <NuxtLink :to="localePath('/contact-us')">
    {{ t('home.hero.slide1Cta') }}
  </NuxtLink>
</template>
```

### Translation Key Naming Convention

Keys follow a hierarchical structure: `namespace.section.element`

| Pattern | Example | Description |
|---------|---------|-------------|
| `nav.*` | `nav.home`, `nav.works` | Navigation labels |
| `home.*` | `home.hero.slide1Title` | Home page content |
| `services.*` | `services.banner.title` | Services page |
| `articles.*` | `articles.filters.allCategories` | Articles page |
| `works.*` | `works.detail.featuredProject` | Portfolio pages |
| `contact.*` | `contact.form.submitButton` | Contact page |
| `about.*` | `about.visionMission.title` | About page |
| `dashboard.*` | `dashboard.articles.title` | Dashboard pages |
| `auth.*` | `auth.login.title`, `auth.register.title` | Auth pages |
| `common.*` | `common.loading`, `common.error` | Shared strings |
| `seo.*` | `seo.home.title`, `seo.services.ogTitle` | Meta tags |
| `offline.*` | `offline.title`, `offline.tryAgain` | Offline page |

### Adding New Translations

1. **Identify the namespace** - Choose the appropriate section (e.g., `home`, `services`, `dashboard`)
2. **Add keys to both locale files**:
   ```json
   // id.json
   {
     "namespace": {
       "newKey": "Teks bahasa Indonesia"
     }
   }
   
   // en.json
   {
     "namespace": {
       "newKey": "English text"
     }
   }
   ```
3. **Use in Vue component**:
   ```vue
   {{ t('namespace.newKey') }}
   ```
4. **For SEO meta tags**, always use translation keys:
   ```typescript
   useSeoMeta({
     title: t('seo.pageName.title'),
     description: t('seo.pageName.description')
   });
   ```

### Best Practices

1. **Always use `t()` for text** - Never hardcode strings in templates
2. **Both locale files must match** - Every key in `id.json` must exist in `en.json`
3. **Use `localePath()` for links** - Ensures correct locale prefix
4. **SEO meta tags are localized** - Title, description, OG tags all use `t()`
5. **Breadcrumb schema uses `t()`** - For consistent language in structured data

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Frontend runs on port 3000.

### Docker Development

From the repository root:

```bash
docker compose up --build -d
```

The Docker-based frontend runs at `http://localhost:3000` and calls the local backend at `http://localhost:8081`.

### Build

```bash
npm run build
```

### Generate (SSG)

```bash
npm run generate
```

## Testing

### Unit Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
# Install browsers
npx playwright install

# Run tests
npx playwright test

# Run specific test
npx playwright test auth.spec.ts

# Run with UI
npx playwright test --ui
```

### Test Coverage

| Suite | File | Coverage |
|-------|------|----------|
| Authentication | `auth.spec.ts` | Login, register, logout |
| Articles | `articles.spec.ts` | CRUD operations |
| Contact | `contact.spec.ts` | Form submission |
| Dashboard | `dashboard.spec.ts` | Dashboard functionality |
| Language | `language.spec.ts` | i18n switching |
| Public Pages | `public-pages.spec.ts` | All public pages |

## Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
NUXT_PUBLIC_API_BASE=http://localhost:8081/api/v1
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
NUXT_PUBLIC_GA4_MEASUREMENT_ID=your-ga-measurement-id
NUXT_CLARITY_PROJECT_ID=your-clarity-project-id
```

## PWA

PWA is configured for offline support:

- Service worker for caching
- Install prompt on mobile
- Offline fallback page

## SEO

### Meta Tags

All pages include:
- Title
- Description
- OG image
- Canonical URL
- Schema.org structured data

### ISR Configuration

Public pages use ISR with 60-second revalidation:

```typescript
// nuxt.config.ts
routeRules: {
  '/': { isr: 60 },
  '/articles': { isr: 60 },
  '/our-works': { isr: 60 },
  '/our-services': { isr: 60 },
  '/about': { isr: 3600 },
  '/contact-us': { isr: false }
}
```

## License

Copyright (c) 2024 Esperion Digital Agency
