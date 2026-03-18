# Design: Improve SEO Localization

**Change:** improve-seo-localization  
**Status:** Design Complete  
**Date:** 2026-03-10

---

## Overview

This change implements a hybrid localization strategy to improve both UX and SEO performance. The key insight is that **metadata structure differs by language**: English provides concise, keyword-rich metadata for search engines, while Indonesian descriptions provide natural, context-rich content for local users.

### Goals

1. **SEO**: Improve meta tags for social sharing and search indexing
2. **Localization**: Implement mixed-language strategy (English for headings, Indonesian for descriptions)
3. **Cleanup**: Remove legacy locale files that cause confusion and bloat
4. **Consistency**: Fix placeholder keys that show code-like text

---

## Hybrid Localization Strategy

### Rules

| Element Type | Language | Rationale |
|--------------|----------|-----------|
| Page Titles | English | Search engines prioritize first 50-60 characters; English terms have higher search volume globally |
| Headings (H1-H3) | English | Scannability for international readers; technical terms are often English |
| Meta Descriptions | Indonesian | Natural language improves CTR for local users |
| Menu Items | Mixed | Standard navigation items remain English; unique terms use Indonesian |
| Button CTAs | Indonesian | Action-oriented text performs better in native language |
| Form Labels | Mixed | Technical terms English, action labels Indonesian |
| Footer Links | Mixed | "Tentang" (About), "Artikel" (Articles), "Hubungi" (Contact) |

### Examples

#### Home Page

```json
// BEFORE (inconsistent)
{
  "home.title": "Home",
  "home.description": "Welcome to our website"
}

// AFTER (hybrid strategy)
{
  "home.title": "Esperion - Web Development & Digital Marketing Agency",
  "home.description": "Jasa pembuatan website profesional dengan tim ahli. Kami membantu bisnis Anda tumbuh melalui solusi digital terbaik.",
  "home.services.subtitle": "Our Services" // English heading
}
```

#### Services Page

```json
// BEFORE (incomplete)
{
  "services.webDevelopment.title": "Web Development",
  "services.webDevelopment.description": "We build websites"
}

// AFTER (SEO-optimized)
{
  "services.webDevelopment.title": "Web Development",
  "services.webDevelopment.description": "Jasa pembuatan website profesional dengan teknologi terkini. Responsive design, CMS integration, dan e-commerce solutions.",
  "services.webDevelopment.cta": "Pelajari Detailnya"
}
```

---

## Translation Keys Requiring Fixes

### Current Placeholder Keys

| Key | Type | Current Value | Recommended Fix |
|-----|------|---------------|-----------------|
| `home.clientLogos.placeholder` | Placeholder | "Client Logo Here" | Remove or use icon placeholder |
| `home.clientLogos.namePlaceholder` | Placeholder | "Client Name" | Remove or use dynamic data |
| `contact.map.placeholder` | Placeholder | "Map Not Available" | Link to Google Maps with proper API |
| `footer.contact.addressPending` | Pending | "Address Pending" | Use actual Esperion address |
| `about.founders.title` | Incomplete | "Founders" | "Tim Pendiri" (Indonesian heading) |
| `about.founders.description` | Incomplete | "Our founders" | Full Indonesian description |

### Keys Needing SEO Enhancement

| Key | Structure | Enhanced Version |
|-----|-----------|------------------|
| `seo.home.title` | `<title>` tag | "Esperion - Web Development & Digital Marketing Agency" |
| `seo.home.description` | `<meta name="description">` | "Jasa pembuatan website profesional dengan tim ahli. Solusi digital terbaik untuk bisnis Anda." |
| `seo.home.image` | Open Graph | "/og-home.jpg" |
| `seo.services.title` | `<title>` tag | "Our Services - Esperion Digital Agency" |
| `seo.services.description` | `<meta name="description">` | "Web development, UI/UX design, digital marketing, and SEO services." |
| `seo.blog.title` | `<title>` tag | "Esperion Blog - Tech insights & digital trends" |
| `seo.blog.description` | `<meta name="description">` | "Artikel-artikel terkini tentang teknologi web, digital marketing, dan development trends." |

---

## SEO Meta Tag Improvements

### Current State

The current implementation likely has:
- Missing or incomplete Open Graph tags
- No Twitter Card meta tags
- Generic or duplicate meta descriptions
- No canonical URLs
- Missing schema.org structured data

### Target State

#### Home Page Meta Tags

```vue
<!-- Expected in pages/index.vue -->
<defineOgImage('home')>
<meta property="og:title" content="Esperion - Web Development & Digital Marketing Agency">
<meta property="og:description" content="Jasa pembuatan website profesional dengan tim ahli. Solusi digital terbaik untuk bisnis Anda.">
<meta property="og:image" content="https://esperion.com/og-home.jpg">
<meta property="og:type" content="website">
<meta property="og:locale" content="id_ID">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Esperion Agency">
<meta name="twitter:description" content="Jasa pembuatan website profesional dengan tim ahli.">
<meta name="twitter:image" content="https://esperion.com/og-home.jpg">
<link rel="canonical" href="https://esperion.com/">
```

#### Services Page Meta Tags

```vue
<!-- Expected in pages/services/index.vue -->
<meta property="og:title" content="Our Services - Esperion Digital Agency">
<meta property="og:description" content="Comprehensive digital solutions: Web Development, UI/UX Design, SEO, and Digital Marketing.">
<meta property="og:image" content="https://esperion.com/og-services.jpg">
```

### Implementation Plan

1. **Create `app/composables/useSeoMeta()`** - reusable composable for SEO tags
2. **Update page layouts** - add OG tags to default layout
3. **Implement page-specific metadata** - each page defines its own SEO data
4. **Add schema.org structured data** - JSON-LD for Organization, WebPage

---

## File Deletion List

### Legacy Locale Files

| File | Reason for Removal |
|------|-------------------|
| `frontend/i18n/locales/en.json` | Legacy file, replaced by `frontend/app/locales/en.json` |
| `frontend/i18n/locales/id.json` | Legacy file, replaced by `frontend/app/locales/id.json` |
| `frontend/app/i18n/en.json` | Duplicate/legacy file |
| `frontend/app/i18n/id.json` | Duplicate/legacy file |

### Migration Steps

```bash
# 1. Verify all keys are present in new files
grep -r "t('home" frontend/app/
grep -r "home.title" frontend/app/locales/en.json frontend/app/locales/id.json

# 2. Remove legacy files
rm frontend/i18n/locales/en.json
rm frontend/i18n/locales/id.json
rm frontend/app/i18n/en.json
rm frontend/app/i18n/id.json

# 3. Check no imports reference legacy paths
grep -r "i18n/locales" frontend/
grep -r "app/i18n" frontend/ --exclude="*.json"
```

---

## Translation File Structure

### New `frontend/app/locales/en.json` Structure

```json
{
  "home": {
    "title": "Esperion - Web Development & Digital Marketing Agency",
    "subtitle": "Digital Solutions for Growing Businesses",
    "description": "Professional web development and digital marketing services",
    "clientLogos": {
      "title": "Trusted by 100+ Companies",
      "placeholder": null
    }
  },
  "services": {
    "title": "Our Services",
    "webDevelopment": {
      "title": "Web Development",
      "description": "Professional website development with modern technologies",
      "cta": "Learn More"
    }
  },
  "seo": {
    "home": {
      "title": "Esperion - Web Development & Digital Marketing Agency",
      "description": "Professional website development with professional team. Best digital solutions for your business.",
      "image": "/og-home.jpg"
    }
  }
}
```

### New `frontend/app/locales/id.json` Structure

```json
{
  "home": {
    "title": "Esperion - Jasa Pengembangan Web & Marketing Digital",
    "subtitle": "Solusi Digital untuk Pertumbuhan Bisnis",
    "description": "Jasa pengembangan web dan marketing digital profesional",
    "clientLogos": {
      "title": "Dipercaya oleh 100+ Perusahaan",
      "placeholder": null
    }
  },
  "services": {
    "title": "Layanan Kami",
    "webDevelopment": {
      "title": "Pengembangan Web",
      "description": "Jasa pembuatan website profesional dengan teknologi terkini",
      "cta": "Pelajari Detailnya"
    }
  },
  "menu": {
    "home": "Home",
    "services": "Services",
    "articles": "Artikel",
    "about": "Tentang",
    "contact": "Hubungi"
  }
}
```

---

## Testing Checklist

- [ ] All legacy files removed without breaking imports
- [ ] Hybrid locale files contain all required keys
- [ ] SEO meta tags render correctly on each page
- [ ] Open Graph tags work for Facebook/LinkedIn sharing
- [ ] Twitter Card tags work for Twitter sharing
- [ ] No console errors from missing translations
- [ ] English locale serves as fallback for missing keys
- [ ] Indonesian locale provides local content for descriptions

---

## Related Files

### Active Locale Files
- `frontend/app/locales/en.json`
- `frontend/app/locales/id.json`

### pages/ Needing SEO Updates
- `frontend/app/pages/index.vue`
- `frontend/app/pages/services/index.vue`
- `frontend/app/pages/about/index.vue`
- `frontend/app/pages/blog/index.vue`

### Components Using Translations
- `frontend/app/components/home/ClientLogos.vue`
- `frontend/app/components/home/Hero.vue`
- `frontend/app/components/contact/Map.vue`
- `frontend/app/components/Footer.vue`

---

## References

- [Vue I18n Best Practices](https://i18n.vuejs.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Structured Data](https://schema.org/)
