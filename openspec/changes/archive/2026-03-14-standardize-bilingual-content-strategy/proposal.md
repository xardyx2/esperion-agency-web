# Standardize Bilingual Content Strategy

## Context

The Esperion website currently serves two languages: Indonesian (id) as default and English (en) as secondary. Based on comprehensive research of 12+ international digital agencies and analysis of 5 Indonesian bilingual company websites, the current implementation has **inconsistencies** in language strategy:

**Current Issues Found:**
1. Service names are translated differently across contexts (Footer = English, Contact Form = Indonesian, Dashboard = Mixed)
2. "UI/UX Design" inconsistently appears as "UI/UX Design" vs "Desain UI/UX"
3. "Digital Marketing" appears as "Digital Marketing" vs "Pemasaran Digital"
4. No clear guidelines on which terms should remain in English vs be translated

## Problem Statement

Users switching between Indonesian and English experience **inconsistent terminology**, creating confusion about service offerings and reducing professional credibility. The lack of a standardized bilingual strategy leads to:
- Mixed signals about service names
- Inconsistent user experience across pages
- Reduced clarity for Indonesian users who expect certain English terms in professional contexts

## Goals

**Primary Goal:** Establish a clear, consistent bilingual content strategy where:
- **English version**: Full English (100%)
- **Indonesian version**: Hybrid approach with strategic English retention for technical/professional terms

**Specific Goals:**
1. Standardize service names across all contexts (footer, forms, filters, dashboard)
2. Define which terms remain in English vs get translated
3. Ensure CTAs and navigation follow industry best practices
4. Create documentation for future content additions

## Non-Goals

- No changes to English translations (already 100% English)
- No backend API changes
- No changes to website structure or routing
- No modifications to language switching mechanism
- No addition of new languages

## Success Metrics

1. **Consistency Score**: Service names match across footer, contact form, works filter, and dashboard (target: 100%)
2. **User Clarity**: Indonesian users can identify services without confusion
3. **Professional Alignment**: Strategy matches top Indonesian digital agencies (Easternboss, SEO Boost, etc.)
4. **Maintainability**: Clear guidelines prevent future inconsistencies

## Research Summary

### Indonesian Digital Agency Patterns (5 Sites Analyzed)

**100% English Retention:**
- Navigation menus: `Home`, `Services`, `Portfolio`, `Contact`
- CTA Buttons: `Get Started`, `Contact Us`, `Learn More`, `Book a Call`
- Service Names: `Web Development`, `UI/UX Design`, `Digital Marketing`, `SEO Services`
- Platform Names: `WordPress`, `Google Analytics`, `HubSpot`

**Fully Translated to Indonesian:**
- Page content and descriptions
- Form labels and placeholders
- Blog articles and educational content
- Company information and about pages

### International Agency Patterns (12 Sites Analyzed)

**Technical Terms Always in English:**
- Acronyms: SEO, PPC, CRM, API, SaaS, UI/UX
- Platform names: WordPress, Shopify, React, Next.js
- Certifications: ISO 9001, Google Partner
- Job titles: CEO, CTO, Head of [Department]

**Hybrid Approach Most Common:**
- Service categories in English with Indonesian descriptions
- "Digital Marketing" (English) + "Pemasaran digital untuk bisnis Anda" (Indonesian)

## Proposed Strategy

### English Version (en)
**Approach**: 100% English
- All content fully translated to English
- Service names: "Web Development", "Digital Marketing", "UI/UX Design"
- Navigation: "Home", "Services", "Portfolio", "Contact Us"
- CTAs: "Get Started", "Learn More", "Contact Us"

### Indonesian Version (id)  
**Approach**: Hybrid with Strategic English Retention

**KEEP IN ENGLISH:**
1. **Service Names** (Primary)
   - Web Development
   - Mobile App Development
   - UI/UX Design
   - Digital Marketing
   - E-Commerce Solutions
   - Digital Consulting

2. **Platform & Technology Names** (100%)
   - WordPress, Shopify, React Native, Next.js, Nuxt, Flutter, Laravel
   - Google Analytics, HubSpot, Facebook Ads

3. **Industry Acronyms** (100%)
   - SEO, PPC, CRM, API, SaaS, B2B, B2C

4. **Navigation & CTAs** (100%)
   - Home, Services, Portfolio, About, Contact
   - Get Started, Learn More, Contact Us, Submit

5. **Technical Terms** (100%)
   - Blog, Portfolio, Case Studies (optional: Studi Kasus)

**TRANSLATE TO INDONESIAN:**
1. **Page Content** - All descriptions, paragraphs, explanations
2. **Form Labels** - "Nama Lengkap", "Email", "Nomor Telepon"
3. **Validation Messages** - Error messages, success notifications
4. **SEO Meta** - Titles, descriptions, OG tags
5. **Blog Content** - Article titles and body content
6. **Company Information** - About pages, team descriptions

**HYBRID EXAMPLES:**
- "Jasa Web Development profesional untuk bisnis Anda"
- "Solusi Digital Marketing terintegrasi"
- "Tim UI/UX Design berpengalaman"

## Risks & Mitigations

**Risk 1: User Confusion from English Terms**
- *Mitigation*: Research shows Indonesian professionals expect these English terms; translation reduces clarity
- *Evidence*: 100% of Indonesian digital agencies studied use English service names

**Risk 2: SEO Impact from Mixed Language**
- *Mitigation*: Use hreflang tags properly; research shows users search in English for technical terms ("jasa SEO" not "jasa optimasi mesin pencari")

**Risk 3: Future Content Inconsistencies**
- *Mitigation*: Create and document clear guidelines (part of this change deliverables)

## Rollback Strategy

- Git revert of modified translation files
- Restore from backup of original id.json
- No database changes required

## Related Changes

- Previous: `fix-contact-map-embed-and-responsive-layout` (contact page layout)
- Future: Potential content expansion requiring these guidelines
