# Full Localization Specification (SEO 2026)

## Overview

This specification defines the complete localization strategy for Esperion's public website, ensuring full language consistency per locale following SEO 2026 best practices.

## Requirements

### Core Requirements

#### REQ-1: Full Indonesian for Indonesian Locale
- **ID**: All content in `/id/**` pages MUST be in Indonesian
- **Scope**: Navigation, headings, body text, CTAs, meta tags, forms
- **Exception**: Brand names, technical terms without common Indonesian equivalent
- **SEO Impact**: Matches Indonesian user search intent

#### REQ-2: Full English for English Locale
- **EN**: All content in `/en/**` pages MUST be in English
- **Scope**: Navigation, headings, body text, CTAs, meta tags, forms
- **Exception**: Proper nouns, Indonesian place names
- **SEO Impact**: Matches international/English-speaking user intent

#### REQ-3: No Mixed Language Within Locale
- **Rule**: Single page MUST NOT mix languages
- **Anti-Pattern**: English nav + Indonesian content
- **Pattern**: All elements match selected locale
- **SEO Impact**: Clear language signals to search engines

#### REQ-4: Translation Key Standardization
- **Format**: `category.subcategory.key` (e.g., `nav.home`, `home.hero.slide1`)
- **Naming**: camelCase for all keys
- **Structure**: Grouped by feature/page
- **Consistency**: Same keys in both `id.json` and `en.json`

### Technical Requirements

#### REQ-5: i18n Implementation
- **Framework**: @nuxtjs/i18n v9+
- **Strategy**: Prefix-based (`/id/`, `/en/`)
- **Keys**: Use `t('key')` function throughout
- **Fallback**: English as fallback for missing translations

#### REQ-6: Meta Tag Localization
- **Title Tags**: `< 60 characters, localized per locale`
- **Meta Descriptions**: `< 160 characters, localized per locale`
- **Open Graph**: All `og:*` tags localized
- **Twitter Cards**: All `twitter:*` tags localized
- **Schema.org**: `inLanguage` property set correctly

#### REQ-7: URL Structure
- **Indonesian**: `/id/layanan-kami`, `/id/tentang-kami`
- **English**: `/en/our-services`, `/en/about-us`
- **Service Slugs**: Keep English (technical standard)
  - `/id/our-services/web-development` (acceptable)
  - Rationale: Technical terms, shorter URLs, industry standard

#### REQ-8: hreflang Tags
- **Maintain**: Existing hreflang implementation
- **Format**:
  ```html
  <link rel="alternate" hreflang="id" href="https://esperion.id/id/..." />
  <link rel="alternate" hreflang="en" href="https://esperion.id/en/..." />
  <link rel="alternate" hreflang="x-default" href="https://esperion.id/en/..." />
  ```
- **SEO Impact**: Tells Google about language variants

## Content Guidelines

### Indonesian Locale (`/id/**`)

#### Tone & Style
- **Formal but approachable**: Professional yet friendly
- **Use "Kami" and "Anda"**: Clear speaker/listener distinction
- **Active voice**: "Kami membantu bisnis Anda" (not "Bisnis Anda dibantu")
- **Local context**: Indonesian business culture, examples, currency (Rp)

#### Keywords to Target
```
Primary:
- "jasa pembuatan website Jakarta"
- "digital marketing agency Indonesia"
- "optimasi SEO website"
- "pembuatan aplikasi mobile"

Secondary:
- "harga pembuatan website"
- "jasa SEO terpercaya"
- "desain website profesional"
- "digital marketing untuk UMKM"
```

#### Content Examples
```json
{
  "nav": {
    "home": "Beranda",
    "services": "Layanan",
    "about": "Tentang Kami"
  },
  "home": {
    "hero": {
      "slide1": "Bangun Kehadiran Digital Anda",
      "slide1Sub": "Solusi terpercaya untuk bisnis Indonesia"
    },
    "cta": {
      "text": "Siap Mengembangkan Bisnis Digital Anda?",
      "button": "Konsultasi Gratis"
    }
  },
  "seo": {
    "home": {
      "title": "Jasa Digital Marketing Terbaik di Jakarta - Esperion",
      "description": "Temukan layanan digital terlengkap dari Esperion Agency. Web development, SEO, dan marketing digital profesional untuk bisnis Indonesia."
    }
  }
}
```

### English Locale (`/en/**`)

#### Tone & Style
- **Professional & direct**: Clear value proposition
- **Use "We" and "You"**: Conversational but professional
- **Active voice**: "We help your business grow"
- **International context**: Global business standards, currency (USD)

#### Keywords to Target
```
Primary:
- "web development services Indonesia"
- "digital marketing agency Jakarta"
- "SEO optimization services"
- "custom mobile app development"

Secondary:
- "website development cost Indonesia"
- "best SEO agency Jakarta"
- "professional web design services"
- "digital marketing for startups"
```

#### Content Examples
```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About Us"
  },
  "home": {
    "hero": {
      "slide1": "Build Your Digital Presence",
      "slide1Sub": "Trusted solutions for Indonesian market"
    },
    "cta": {
      "text": "Ready to Grow Your Digital Business?",
      "button": "Free Consultation"
    }
  },
  "seo": {
    "home": {
      "title": "Best Digital Marketing Services in Jakarta - Esperion",
      "description": "Comprehensive digital services from Esperion Agency. Web development, SEO, and digital marketing for businesses in Indonesia."
    }
  }
}
```

## Translation File Structure

### File Organization
```
frontend/app/locales/
├── id.json          # Full Indonesian translations
├── en.json          # Full English translations
└── README.md        # Translation guidelines
```

### Key Structure
```json
{
  "nav": {
    "home": "...",
    "works": "...",
    "services": "...",
    "articles": "...",
    "about": "...",
    "contact": "..."
  },
  "common": {
    "loading": "...",
    "readMore": "...",
    "learnMore": "..."
  },
  "home": {
    "hero": {
      "slide1": "...",
      "slide1Sub": "...",
      "slide2": "...",
      "slide2Sub": "..."
    },
    "whoAreWe": "...",
    "ourServices": "...",
    "cta": {
      "text": "...",
      "button": "..."
    }
  },
  "seo": {
    "home": {
      "title": "...",
      "description": "...",
      "ogTitle": "...",
      "ogDescription": "..."
    },
    "services": { ... },
    "articles": { ... }
  },
  "footer": {
    "company": "...",
    "services": "...",
    "contact": "..."
  },
  "forms": { ... },
  "validation": { ... }
}
```

## SEO 2026 Compliance

### E-E-A-T Signals

#### Experience
- **Indonesian locale**: Demonstrates local market knowledge
- **English locale**: Demonstrates international expertise
- **Implementation**: Local examples, case studies, cultural references

#### Expertise
- **Indonesian locale**: Industry-specific Indonesian terminology
- **English locale**: International industry standards
- **Implementation**: Technical accuracy in both languages

#### Authoritativeness
- **Both locales**: Consistent branding, professional tone
- **Implementation**: Author bios, credentials, certifications

#### Trustworthiness
- **Both locales**: Clear contact info, transparent pricing
- **Implementation**: Testimonials, case studies, security badges

### Semantic Search Optimization

#### Content Clusters
```
Indonesian Cluster:
├─ Pillar: "Digital Marketing Indonesia"
├─ Cluster: "SEO Jakarta", "SEM Indonesia", "Social Media Marketing"
└─ Supporting: "Tips SEO", "Case Study", "Best Practices"

English Cluster:
├─ Pillar: "Digital Marketing Services Indonesia"
├─ Cluster: "SEO Services Jakarta", "PPC Management", "Content Marketing"
└─ Supporting: "SEO Guide", "Case Studies", "Industry Insights"
```

#### User Intent Matching
```
Informational Intent:
- ID: "cara optimasi website", "panduan SEO"
- EN: "how to optimize website", "SEO guide"

Commercial Intent:
- ID: "jasa SEO terbaik", "harga pembuatan website"
- EN: "best SEO services", "website development cost"

Navigational Intent:
- ID: "Esperion Indonesia", "kontak Esperion"
- EN: "Esperion Agency", "contact Esperion"
```

### Core Web Vitals Impact

#### Language Consistency → Better Engagement
- Clear language = lower bounce rate
- Expected content = longer time on page
- Cultural relevance = higher conversion rat

## ADDED Requirements

### Requirement: Active Locale Files SHALL Include Referenced Footer Settings Keys
The active locale files used by the frontend i18n runtime SHALL define all footer settings keys referenced by runtime-rendered components.

#### Scenario: Footer cookie settings key exists in Indonesian locale
- **WHEN** the frontend renders the footer under the Indonesian locale
- **THEN** the active Indonesian locale file SHALL provide a `footer.cookieSettings` translation key
- **AND** the runtime SHALL NOT emit a missing-key warning for that key

#### Scenario: Footer cookie settings key exists in English locale
- **WHEN** the frontend renders the footer under the English locale
- **THEN** the active English locale file SHALL provide a `footer.cookieSettings` translation key

### Requirement: Runtime Locale Source SHALL Be Unambiguous
The frontend localization setup SHALL make it clear which locale tree is authoritative for runtime translation keys.

#### Scenario: Duplicate locale trees do not cause runtime drift
- **WHEN** the repository contains multiple locale directories
- **THEN** the runtime configuration and maintenance workflow SHALL identify the authoritative locale source used by Nuxt
- **AND** newly added translation keys SHALL be maintained in that authoritative source
