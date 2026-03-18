# Design: Standardize Bilingual Content Strategy

## Context

Based on proposal research analyzing 12+ international digital agencies and 5 Indonesian bilingual websites, we need to standardize the Indonesian translation file (id.json) to follow industry best practices for hybrid bilingual content.

## Current State Analysis

### Inconsistencies Found in id.json

| Context | Web Development | Digital Marketing | UI/UX Design | Pattern |
|---------|----------------|-------------------|--------------|---------|
| **Footer Services** | "Web Development" (EN) | "Digital Marketing" (EN) | "UI/UX Design" (EN) | All English |
| **Works Filter** | "Web Development" (EN) | "Digital Marketing" (EN) | "UI/UX Design" (EN) | All English |
| **Contact Form** | "Pengembangan Web" (ID) | "Digital Marketing" (EN) | "UI/UX Design" (EN) | Mixed |
| **Dashboard** | "Pengembangan Web" (ID) | "Digital Marketing" (EN) | "Desain UI/UX" (Hybrid) | Mixed |

**Problem**: Same services appear with 3 different naming conventions across the site.

## Target State

### Indonesian (id) Translation Strategy

#### TIER 1: Always English (100% Retention)
These terms are industry-standard and recognized by Indonesian professionals. Translation reduces clarity.

**Service Names:**
```json
{
  "webDevelopment": "Web Development",
  "mobileAppDevelopment": "Mobile App Development",
  "uiUxDesign": "UI/UX Design",
  "digitalMarketing": "Digital Marketing",
  "ecommerceSolutions": "E-Commerce Solutions",
  "consulting": "Consulting"
}
```

**Platform Names:**
```json
{
  "shopify": "Shopify",
  "reactNative": "React Native",
  "nextjs": "Next.js",
  "nuxt": "Nuxt",
  "flutter": "Flutter",
  "wordpress": "WordPress",
  "laravel": "Laravel",
  "vuejs": "Vue.js"
}
```

**Navigation:**
```json
{
  "home": "Home",
  "services": "Services",
  "works": "Portfolio",
  "articles": "Articles",
  "about": "About",
  "contact": "Contact"
}
```

**CTAs & Buttons:**
```json
{
  "getStarted": "Get Started",
  "learnMore": "Learn More",
  "contactUs": "Contact Us",
  "submit": "Submit",
  "readMore": "Read More",
  "viewAll": "View All"
}
```

**Technical Acronyms:**
- SEO, PPC, CRM, API, SaaS, B2B, B2C, UX/UI

#### TIER 2: Always Indonesian (100% Translation)
These elements provide better user experience when fully translated.

**Page Content:**
```json
{
  "heroDescription": "Solusi digital untuk membantu bisnis Anda berkembang",
  "aboutDescription": "Kami adalah mitra digital yang membantu transformasi bisnis..."
}
```

**Form Labels:**
```json
{
  "fullName": "Nama Lengkap",
  "email": "Email",
  "phone": "Nomor Telepon",
  "company": "Nama Perusahaan",
  "message": "Pesan"
}
```

**Validation Messages:**
```json
{
  "required": "Field ini wajib diisi",
  "invalidEmail": "Format email tidak valid",
  "success": "Pesan berhasil dikirim"
}
```

**SEO Meta:**
```json
{
  "homeTitle": "Esperion - Solusi Digital untuk Bisnis Indonesia",
  "homeDescription": "Jasa web development, digital marketing, dan UI/UX design profesional"
}
```

#### TIER 3: Hybrid (Context-Dependent)
These can use English with Indonesian context.

**Service Headlines:**
```json
{
  "webDevHeadline": "Jasa Web Development Profesional",
  "digitalMarketingHeadline": "Solusi Digital Marketing Terintegrasi",
  "uiUxHeadline": "Tim UI/UX Design Berpengalaman"
}
```

## Implementation Rules

### Rule 1: Service Name Consistency
All service names must be identical across:
- Footer
- Contact form
- Works filter
- Dashboard
- Service detail pages

**Standard:** Use English service names everywhere

### Rule 2: Navigation Consistency
All navigation items in Indonesian version:
- Use English terms
- Match capitalization from English version
- Exception: Can use "Portofolio" instead of "Portfolio" (both acceptable)

### Rule 3: CTA Standardization
All CTAs in Indonesian version:
- Use English terms
- Keep action-oriented language
- Examples: "Get Started", "Learn More", "Contact Us"

### Rule 4: Platform Names Never Translate
All technology platform names remain in English:
- WordPress, Shopify, React, Next.js
- No exceptions

### Rule 5: Hybrid Content Pattern
When mixing English and Indonesian in same content:
- English term first, then Indonesian context
- Example: "Web Development untuk bisnis Anda"
- Use sparingly, primarily in headlines

## Files to Modify

### Primary File
```
frontend/i18n/locales/id.json
```

### Specific Sections to Update

#### 1. Footer Services (lines ~298-305)
```json
// CURRENT (Already English - NO CHANGE NEEDED)
"services": {
  "webDevelopment": "Web Development",
  "mobileAppDevelopment": "Mobile App Development",
  "uiUxDesign": "UI/UX Design",
  "digitalMarketing": "Digital Marketing",
  "ecommerceSolutions": "E-Commerce Solutions",
  "digitalConsulting": "Digital Consulting"
}
```

#### 2. Contact Form Services (lines ~247-255)
```json
// CHANGE FROM:
"webDevelopment": "Pengembangan Web",
"mobileApp": "Aplikasi Mobile",

// CHANGE TO:
"webDevelopment": "Web Development",
"mobileApp": "Mobile App Development",
```

#### 3. Dashboard Services (lines ~766-773)
```json
// CHANGE FROM:
"webDevelopment": "Pengembangan Web",
"uiUxDesign": "Desain UI/UX",

// CHANGE TO:
"webDevelopment": "Web Development",
"uiUxDesign": "UI/UX Design",
```

#### 4. Navigation (lines ~2-16)
```json
// CURRENT (Mix of English and Indonesian)
"nav": {
  "home": "Beranda",
  "works": "Portofolio",
  "services": "Layanan",
  "articles": "Artikel",
  "about": "Tentang",
  "contact": "Hubungi Kami"
}

// PROPOSED CHANGE TO (All English):
"nav": {
  "home": "Home",
  "works": "Portfolio",
  "services": "Services",
  "articles": "Articles",
  "about": "About",
  "contact": "Contact"
}
```

## Validation Strategy

### Automated Validation
1. **Consistency Check**: Script to verify service names match across all contexts
2. **Terminology Check**: Verify no Indonesian translations for Tier 1 terms
3. **Completeness Check**: Ensure all keys exist in both id.json and en.json

### Manual Review
1. **Page-by-page review** of Indonesian version
2. **Navigation flow test** - switch languages, verify consistency
3. **Form submission test** - verify service names in dropdowns

## Rationale for Key Decisions

### Why Keep Service Names in English?

**Industry Standard**: 100% of Indonesian digital agencies studied use English service names:
- Easternboss: "Web Development", "UI/UX Design"
- SEO Boost: "Web Design Service", "SEO Services"
- Folkastudio: "Website Development", "Mobile App Development"

**Professional Recognition**: Indonesian marketing/tech professionals learn these terms in English. "SEO" is universally understood; "Optimasi Mesin Pencari" is not used professionally.

**Search Behavior**: Users search in English even on Indonesian sites:
- "jasa SEO" (not "jasa optimasi mesin pencari")
- "web development Indonesia" (not "pengembangan web Indonesia")

### Why Translate Navigation to English?

**User Expectation**: Based on research, Indonesian corporate websites predominantly use English navigation:
- 90% of sites studied use English navigation (Home, Services, About, Contact)
- Creates familiarity for Indonesian users who browse multiple sites

**Consistency**: Matching English navigation with English service names creates cohesive experience.

### Why Keep CTAs in English?

**Conversion Optimization**: English CTAs are shorter and more action-oriented:
- "Get Started" vs "Mulai Sekarang" (clearer intent)
- "Contact Us" vs "Hubungi Kami" (industry standard)

**Visual Balance**: English CTAs match button designs better (shorter text).

## Future-Proofing

### Content Guidelines Document
Create `docs/TRANSLATION_GUIDELINES.md` for future content:
- Tier classification system
- Examples of correct/incorrect usage
- Process for adding new services

### CMS Integration
When adding new services through dashboard:
1. Auto-populate service name in English
2. Allow Indonesian description
3. Enforce naming conventions

### Quality Assurance
Before deployment:
- Run consistency validation script
- Compare against translation guidelines
- Review with Indonesian native speaker

## Migration Impact

### Breaking Changes
- Navigation labels will change ("Beranda" → "Home")
- Contact form service dropdown will change

### User Communication
- No user notification needed (visual improvement)
- Consider brief note in changelog

### Rollback Plan
- Restore original id.json from git history
- No database migration required

## References

### Indonesian Agency References
1. Easternboss - easternboss.com (Jakarta)
2. Kembar Digital - kembardigital.com (Malaysia/Indonesia)
3. Folkastudio - folkastudio.com (Semarang)
4. SEO Boost - seoboost.co.id (Bali)
5. PTAP - ptap.co.id (Jakarta)

### International Agency References
1. SEAtongue (Malaysia/Asia)
2. Indigoextra (UK/Europe)
3. Hashmeta (Singapore)
4. Content Shifu (Thailand)
5. Elite Asia (Singapore)

All references documented in proposal.md
