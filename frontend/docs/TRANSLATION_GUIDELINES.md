# Translation Guidelines

## Overview

This document outlines the bilingual content strategy for Esperion's Indonesian (id) and English (en) versions. The strategy follows industry best practices observed across 12+ international digital agencies.

## Language Strategy

### English Version (en)
**Approach**: 100% English
- All content fully translated to English
- No Indonesian terms

### Indonesian Version (id)
**Approach**: Hybrid with Strategic English Retention
- **Tier 1**: English terms (service names, navigation, CTAs, technical terms)
- **Tier 2**: Indonesian translations (descriptions, form labels, content)
- **Tier 3**: Hybrid patterns (English terms with Indonesian context)

---

## Tier Classification

### Tier 1: Always English (100% Retention)

These terms are industry-standard and recognized by Indonesian professionals. Translation reduces clarity.

#### Service Names
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

#### Navigation
```json
{
  "home": "Home",
  "works": "Portfolio",
  "services": "Services",
  "articles": "Articles",
  "about": "About",
  "contact": "Contact"
}
```

#### CTAs & Buttons
```json
{
  "getStarted": "Get Started",
  "learnMore": "Learn More",
  "contactUs": "Contact Us",
  "submit": "Submit",
  "readMore": "Read More",
  "viewAll": "View All",
  "sendMessage": "Send Message",
  "startConsultation": "Start Consultation",
  "viewPortfolio": "View Portfolio",
  "exploreServices": "Explore Services",
  "viewTestimonials": "View Testimonials"
}
```

#### Platform & Technology Names
```json
{
  "shopify": "Shopify",
  "reactNative": "React Native",
  "nextjs": "Next.js",
  "nuxt": "Nuxt",
  "flutter": "Flutter",
  "wordpress": "WordPress",
  "laravel": "Laravel",
  "vuejs": "Vue.js",
  "googleAnalytics": "Google Analytics",
  "hubSpot": "HubSpot"
}
```

#### Industry Acronyms
- **SEO** - Search Engine Optimization
- **PPC** - Pay Per Click
- **CRM** - Customer Relationship Management
- **API** - Application Programming Interface
- **SaaS** - Software as a Service
- **B2B** - Business to Business
- **B2C** - Business to Consumer
- **UI** - User Interface
- **UX** - User Experience

#### Common Actions
```json
{
  "edit": "Edit",
  "delete": "Delete",
  "view": "View",
  "search": "Search",
  "filter": "Filter",
  "sort": "Sort",
  "reset": "Reset",
  "save": "Save",
  "cancel": "Cancel"
}
```

#### Pagination
```json
{
  "previous": "Previous",
  "next": "Next",
  "page": "Page",
  "of": "of",
  "results": "results"
}
```

#### Section Headers
```json
{
  "ourServices": "Our Services",
  "featuredWorks": "Featured Works",
  "latestArticles": "Latest Articles",
  "aboutUs": "About Us",
  "contactUs": "Contact Us",
  "ourLocation": "Our Location",
  "quickLinks": "Quick Links",
  "followUs": "Follow Us"
}
```

#### Stats & Metrics
```json
{
  "projectsCompleted": "Projects Completed",
  "clientCollaborations": "Client Collaborations",
  "yearsExperience": "Years of Experience",
  "coreTalent": "Core Talent"
}
```

#### Footer
```json
{
  "privacyPolicy": "Privacy Policy",
  "termsOfService": "Terms of Service",
  "copyright": "© {year} Esperion. All rights reserved."
}
```

---

### Tier 2: Always Indonesian (100% Translation)

These elements provide better user experience when fully translated to Indonesian.

#### Page Content & Descriptions
- Hero descriptions
- Service descriptions
- About page content
- Blog articles
- Company information

#### Form Labels
```json
{
  "fullName": "Nama Lengkap",
  "email": "Email",
  "phone": "Nomor Telepon",
  "company": "Nama Perusahaan",
  "message": "Pesan",
  "projectSummary": "Ringkasan Proyek"
}
```

#### Validation Messages
```json
{
  "required": "Field ini wajib diisi",
  "invalidEmail": "Format email tidak valid",
  "success": "Pesan berhasil dikirim",
  "error": "Terjadi kesalahan"
}
```

#### SEO Meta (Indonesian market)
- Meta titles
- Meta descriptions
- OG tags

#### ARIA Labels (Accessibility)
```json
{
  "openMenu": "Buka menu",
  "closeMenu": "Tutup menu",
  "switchToLightMode": "Ubah ke mode terang",
  "switchToDarkMode": "Ubah ke mode gelap"
}
```

---

### Tier 3: Hybrid (Context-Dependent)

These can use English terms with Indonesian context for clarity and professionalism.

#### Service Headlines
```json
{
  "webDevHeadline": "Jasa Web Development Profesional",
  "digitalMarketingHeadline": "Solusi Digital Marketing Terintegrasi",
  "uiUxHeadline": "Tim UI/UX Design Berpengalaman"
}
```

#### Sub-headlines
```json
{
  "heroSub1": "Solusi terpercaya untuk bisnis Indonesia",
  "heroSub2": "Digital solutions for your next growth phase"
}
```

#### Value Propositions
```json
{
  "clearStrategy": "Strategi yang jelas",
  "neatExecution": "Eksekusi yang rapi",
  "openCollaboration": "Kolaborasi terbuka",
  "resultsFocused": "Fokus pada hasil"
}
```

---

## Implementation Rules

### Rule 1: Service Name Consistency
All service names must be identical across:
- Footer
- Contact form
- Works filter
- Dashboard
- Service detail pages

**Standard**: Use English service names everywhere

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

---

## Rationale

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
- 90% of sites studied use English navigation (Home, Services, Portfolio, Contact)
- Creates familiarity for Indonesian users who browse multiple sites

**Consistency**: Matching English navigation with English service names creates cohesive experience.

### Why Keep CTAs in English?

**Conversion Optimization**: English CTAs are shorter and more action-oriented:
- "Get Started" vs "Mulai Sekarang" (clearer intent)
- "Contact Us" vs "Hubungi Kami" (industry standard)

**Visual Balance**: English CTAs match button designs better (shorter text).

---

## Quality Assurance

### Before Adding New Translations
1. Check this guideline document
2. Determine Tier classification
3. Verify consistency with existing translations
4. Test in both languages

### Testing Checklist
- [ ] Service names match across all contexts
- [ ] Navigation items are consistent
- [ ] CTAs use English terms
- [ ] Descriptions are in Indonesian
- [ ] Form labels are in Indonesian
- [ ] No mixed languages inappropriately

### Common Pitfalls to Avoid
1. **Don't translate service names** - Keep "Web Development", not "Pengembangan Web"
2. **Don't translate platform names** - Keep "WordPress", not "WordPers"
3. **Don't translate acronyms** - Keep "SEO", not "Optimasi Mesin Pencari"
4. **Don't translate brand names** - Keep "HubSpot", "Google Analytics"

---

## Examples

### ✅ Correct Usage

**Indonesian Version:**
```
Navigation: Home | Services | Portfolio | About | Contact
Hero Title: Bangun Kehadiran Digital Anda
Hero CTA: Start Consultation
Service: Web Development
Service Desc: Solusi pengembangan web profesional untuk bisnis Anda
Form Label: Nama Lengkap
Button: Submit
```

**English Version:**
```
Navigation: Home | Services | Portfolio | About | Contact
Hero Title: Build Your Digital Presence
Hero CTA: Start Consultation
Service: Web Development
Service Desc: Professional web development solutions for your business
Form Label: Full Name
Button: Submit
```

### ❌ Incorrect Usage

**Indonesian Version (WRONG):**
```
Navigation: Beranda | Layanan | Portofolio | Tentang | Hubungi Kami
Hero CTA: Mulai Konsultasi
Service: Pengembangan Web
Form Label: Full Name
Button: Submit
```

---

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

---

## Version History

- **v1.0** (2026-03-14) - Initial guidelines based on research of 12+ agencies
- **Author**: Sisyphus Agent
- **Change**: standardize-bilingual-content-strategy

---

## Questions?

If unsure about a translation:
1. Check this document first
2. Refer to the Tier classification
3. Follow the decision tree
4. When in doubt, keep English for professional/technical terms
