## Context

**Current State (Mixed Language - Anti-Pattern):**
```
MainNav.vue:
├─ navItems: [{ label: 'Home' }, { label: 'Portfolio' }] ← Hardcoded EN
└─ Always shows English regardless of locale

index.vue (when /id/ active):
├─ Nav: Home | Portfolio | Services (EN) ← from MainNav
├─ Hero: "Build Your Digital Presence" (EN)
├─ Subtitle: "Bangun Kehadiran Digital..." (ID)
└─ Content: "Layanan Kami", "Konsultasi Gratis" (ID)

Result: Mixed language signals → Poor SEO for both ID and EN
```

**Target State (Full Localization - SEO 2026 Best Practice):**
```
MainNav.vue:
├─ navItems: [{ label: t('nav.home') }, { label: t('nav.works') }]
└─ Uses i18n keys → Dynamic per locale

When /id/ active:
├─ Nav: Beranda | Portofolio | Layanan (ID) ← from id.json
├─ Hero: "Bangun Kehadiran Digital Anda" (ID)
├─ Subtitle: "Solusi terpercaya untuk bisnis Indonesia" (ID)
└─ Content: "Layanan Kami", "Konsultasi Gratis" (ID)

When /en/ active:
├─ Nav: Home | Portfolio | Services (EN) ← from en.json
├─ Hero: "Build Your Digital Presence" (EN)
├─ Subtitle: "Trusted solutions for Indonesian businesses" (EN)
└─ Content: "Our Services", "Free Consultation" (EN)

Result: Clear language signals → Excellent SEO for target locale
```

## Goals / Non-Goals

**Goals:**
- Full Indonesian for `/id/**` locale (nav, content, meta, CTAs)
- Full English for `/en/**` locale (nav, content, meta, CTAs)
- SEO 2026 compliance: E-E-A-T, semantic search, user intent matching
- Maintain existing URL structure (`/id/**`, `/en/**`)
- Preserve all hreflang implementations
- Zero breaking changes for users

**Non-Goals:**
- Not changing URL structure (keeping `/id/` and `/en/` prefixes)
- Not removing bilingual support (both locales remain)
- Not affecting dashboard pages (public pages only)
- Not modifying backend API responses

## Decisions

### Decision 1: Navigation Uses i18n Keys (Not Hardcoded)
**Chosen:** Replace hardcoded English with `t('nav.*')` keys

**Rationale:**
- Enables dynamic language per locale
- Standard Nuxt i18n pattern
- Already used elsewhere in app
- Critical for SEO language consistency

**Implementation:**
```vue
<!-- Before -->
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/our-works', label: 'Portfolio' },
];

<!-- After -->
const { t } = useI18n();
const navItems = [
  { href: '/', label: t('nav.home') },      // "Beranda" or "Home"
  { href: '/our-works', label: t('nav.works') }, // "Portofolio" or "Portfolio"
];
```

---

### Decision 2: All Content Strings Use Translation Keys
**Chosen:** Move all hardcoded strings to translation files

**Rationale:**
- Ensures full localization capability
- SEO 2026 requires consistent language per page
- Enables proper meta tag localization
- Follows i18n best practices

**Implementation Pattern:**
```vue
<!-- Before -->
<h1>Layanan Kami</h1>

<!-- After -->
<h1>{{ t('home.ourServices') }}</h1>

<!-- id.json -->
{
  "home": {
    "ourServices": "Layanan Kami"
  }
}

<!-- en.json -->
{
  "home": {
    "ourServices": "Our Services"
  }
}
```

---

### Decision 3: SEO Meta Tags Fully Localized
**Chosen:** All meta tags use translation keys per locale

**Rationale:**
- Google uses meta tags for ranking signals
- Title tags must match page content language
- Open Graph tags affect social sharing
- 2026 SEO: Semantic consistency critical

**Implementation:**
```vue
<!-- Before -->
useSeoMeta({
  title: 'Layanan Digital Marketing - Esperion',
  description: 'Jasa digital marketing terbaik'
});

<!-- After -->
const { t } = useI18n();
useSeoMeta({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  ogTitle: t('seo.home.ogTitle'),
  ogDescription: t('seo.home.ogDescription')
});
```

---

### Decision 4: Content Structure Matches User Intent
**Chosen:** Localize not just words, but intent and examples

**Rationale:**
- 2026 SEO: User intent > keyword matching
- Indonesian users have different needs than English users
- Cultural context matters for engagement
- E-E-A-T: Demonstrates local expertise

**Implementation:**
```
/id/layanan-kami:
├─ Focus: "Jasa pembuatan website untuk UMKM Indonesia"
├─ Examples: Local Indonesian businesses
├─ Pricing: "Mulai Rp 15.000.000"
└─ CTA: "Konsultasi Gratis via WhatsApp"

/en/our-services:
├─ Focus: "Web development for Indonesia market entry"
├─ Examples: International companies expanding to ID
├─ Pricing: "Starting from $1,000 USD"
└─ CTA: "Free Consultation via Email"
```

---

### Decision 5: Maintain Technical SEO Structure
**Chosen:** Keep existing hreflang, sitemap, canonical tags

**Rationale:**
- Already correctly implemented
- hreflang tells Google about language variants
- No need to fix what works
- Focus on content consistency instead

**Current (Keep):**
```vue
useHead({
  link: [
    { rel: 'alternate', hreflang: 'id', href: 'https://esperion.id/id/...' },
    { rel: 'alternate', hreflang: 'en', href: 'https://esperion.id/en/...' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://esperion.id/en/...' }
  ]
});
```

## Risks / Trade-offs

### Risk 1: Mixed Content During Transition
**Mitigation:** Update all strings at once, test before deploy
**Impact:** Low - development environment only

### Risk 2: Translation Gaps
**Mitigation:** Comprehensive audit of all hardcoded strings
**Impact:** Medium - some strings may be missed initially

### Risk 3: SEO Rankings Fluctuation
**Mitigation:** 
- Monitor rankings during transition
- Keep URL structure identical
- Maintain hreflang tags
- 301 redirects not needed (URLs unchanged)
**Impact:** Short-term fluctuation, long-term improvement expected

## Migration Plan

### Phase 1: Audit & Prepare (1 hour)
1. Inventory all hardcoded strings in public pages
2. Identify i18n keys needed
3. Prepare translation file structure

### Phase 2: Update Translation Files (2 hours)
1. Update `id.json` with full Indonesian
2. Update `en.json` with full English
3. Ensure all keys match between files

### Phase 3: Component Updates (3 hours)
1. Update `MainNav.vue` to use i18n keys
2. Update `index.vue` to use translation keys
3. Update all page components similarly
4. Update all detail page components

### Phase 4: SEO Meta Tags (1 hour)
1. Localize all title tags
2. Localize all meta descriptions
3. Localize all Open Graph tags
4. Verify schema.org markup

### Phase 5: Testing & Validation (1 hour)
1. Test `/id/**` pages - full Indonesian
2. Test `/en/**` pages - full English
3. Verify language toggle works
4. Check meta tags in DevTools
5. Run SEO audit (Lighthouse)

## Open Questions

1. **Should we localize service slugs?**
   - Current: `/id/our-services/web-development` (mixed)
   - Option A: `/id/layanan-kami/pengembangan-web` (full ID)
   - Option B: Keep as-is (English slugs are standard)
   - **Recommendation:** Keep English slugs (Option B) - technical terms, shorter URLs

2. **Should pricing show different currencies?**
   - Indonesian locale: Rupiah (Rp)
   - English locale: USD ($)
   - **Recommendation:** Yes - matches user intent per locale

3. **Contact methods per locale?**
   - Indonesian: WhatsApp primary
   - English: Email primary
   - **Recommendation:** Yes - cultural preference alignment
