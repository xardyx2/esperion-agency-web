# Specifications: Fix Articles & Portfolio + AI-Friendly SEO

## Overview

This change addresses critical routing issues and enhances the article system with AI-friendly SEO features to make content citable by AI systems.

**Domain**: esperion.one (corrected from esperion.id)

---

## Functional Requirements

### FR-001: Article Detail Routing Fix
**Priority**: Critical
**Description**: Detail page harus merender konten lengkap setelah navigasi dari list page

**Acceptance Criteria**:
- [ ] Klik "Baca Selengkapnya" di `/id/articles` navigate ke `/id/articles/[slug]` dengan konten lengkap
- [ ] URL berubah dan konten berubah secara bersamaan
- [ ] Tidak ada hydration mismatch error
- [ ] Works untuk kedua locale (id dan en)

### FR-002: Article Body Content
**Priority**: Critical
**Description**: Artikel harus punya konten lengkap, bukan hanya excerpt

**Acceptance Criteria**:
- [ ] Data model punya field `body_id` (Bahasa Indonesia)
- [ ] Data model punya field `body_en` (Bahasa Inggris) - optional
- [ ] Min 800 kata per artikel
- [ ] Konten terstruktur dengan heading hierarchy
- [ ] 12 artikel lengkap tersedia

### FR-003: Tags System
**Priority**: High
**Description**: Implementasi sistem tags untuk articles

**Acceptance Criteria**:
- [ ] Setiap artikel punya array `tags` (string[])
- [ ] Tags ditampilkan di UI (badge/component)
- [ ] Tags bisa diklik untuk filter (optional untuk MVP)
- [ ] Tags included di schema markup

### FR-004: AI-Friendly Schema
**Priority**: High
**Description**: Enhanced Article schema optimized untuk AI consumption

**Acceptance Criteria**:
- [ ] SpeakableSpecification implemented
- [ ] Entity mentions dengan sameAs ke Wikidata
- [ ] Complete author schema dengan credentials
- [ ] Publisher schema lengkap
- [ ] ArticleBody berisi konten lengkap (bukan excerpt)
- [ ] WordCount dynamic (bukan hardcoded)

### FR-005: Portfolio Detail Fix
**Priority**: High
**Description**: Pastikan portfolio detail juga berfungsi dengan baik

**Acceptance Criteria**:
- [ ] Klik portfolio item navigate ke detail page
- [ ] Detail page render konten lengkap
- [ ] Gallery images tampil correctly

### FR-006: Domain Correction
**Priority**: High
**Description**: Replace semua esperion.id dengan esperion.one

**Acceptance Criteria**:
- [ ] Zero references to esperion.id di codebase
- [ ] All URLs in schema menggunakan esperion.one
- [ ] OG images URLs corrected
- [ ] Canonical URLs corrected

---

## Non-Functional Requirements

### NFR-001: Performance
- Detail page load time < 2s
- ISR revalidation tetap berfungsi

### NFR-002: SEO
- Google Rich Results Test passing untuk Article
- Schema.org validation passing
- Zero structured data errors di Search Console

### NFR-003: Accessibility
- Speakable content properly marked
- Semantic HTML structure
- WCAG 2.1 AA compliant

### NFR-004: AI-Friendly
- Content extractable oleh AI systems
- Clear entity relationships
- Atomic answer format

---

### FR-007: IP-Based Currency Detection
**Priority**: Medium  
**Description**: Sistem mendeteksi lokasi user dari IP dan menampilkan harga dalam IDR untuk Indonesia, USD untuk internasional

**Acceptance Criteria**:
- [ ] Deteksi lokasi dari IP menggunakan ipapi.co atau service serupa
- [ ] Tampilkan IDR (Rupiah) untuk user dari Indonesia
- [ ] Tampilkan USD untuk user dari luar Indonesia
- [ ] Exchange rate: 1 USD = 15,500 IDR (configurable)
- [ ] Loading state saat deteksi berlangsung
- [ ] Fallback ke USD jika deteksi gagal
- [ ] Terapkan di halaman services (list & detail)
- [ ] Format currency sesuai locale (IDR: Rp 15.500.000, USD: $1,000)

---

## Data Model

### Currency Interface

### Article Interface (Enhanced)

```typescript
interface PublicArticle {
  id: number
  slug_id: string              // e.g., "digital-marketing-trends-2024"
  slug_en?: string             // e.g., "digital-marketing-trends-2024"
  
  // Content
  title: string                // Display title
  excerpt_id: string           // Short description (150-160 chars)
  excerpt_en?: string          // English excerpt
  body_id: string              // Full content (min 800 words)
  body_en?: string             // English content (optional)
  
  // Metadata
  category: string             // e.g., "Marketing", "Design"
  tags: string[]               // e.g., ["SEO", "AI", "2026"]
  image: string                // Featured image path
  author: string               // Author name
  authorId?: string            // Author slug for URL
  published_at: string         // ISO 8601 date
  read_time: number            // Minutes to read
  wordCount: number            // Actual word count
  
  // AI/SEO
  entities?: Entity[]          // Linked entities (Wikidata)
  citations?: Citation[]       // External references
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  
  // Speakable sections
  speakableSelectors?: string[] // CSS selectors for speakable content
}

interface Entity {
  name: string
  type: 'Thing' | 'Person' | 'Organization' | 'Place'
  sameAs: string               // Wikidata URL
  description?: string
}

interface Citation {
  title: string
  url: string
  author?: string
  datePublished?: string
}
```

### Tag System

```typescript
interface Tag {
  id: string
  name_id: string              // Indonesian name
  name_en?: string             // English name
  slug: string
  description?: string
  color?: string               // For UI badge
}

// Available tags for articles
const AVAILABLE_TAGS = [
  'SEO', 'AI', 'Digital Marketing', 'Web Development',
  'Design', 'Branding', 'Content Strategy', 'Social Media',
  'E-commerce', 'Analytics', 'UX/UI', 'Mobile App',
  '2026', 'Trends', 'Tutorial', 'Case Study'
]
```

---

## Schema Requirements

### AI-Optimized Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": ["Article", "BlogPosting"],
  "@id": "https://esperion.one/id/articles/{slug}",
  
  "headline": "{title}",
  "alternativeHeadline": "{excerpt}",
  "description": "{excerpt}",
  "articleBody": "{full content}",
  "wordCount": {actual count},
  "articleSection": "{category}",
  "keywords": ["{tag1}", "{tag2}"],
  
  "author": {
    "@type": "Person",
    "@id": "https://esperion.one/authors/{author-slug}",
    "name": "{author name}",
    "url": "https://esperion.one/id/experts/{author-slug}",
    "sameAs": ["{linkedin}", "{twitter}"]
  },
  
  "publisher": {
    "@type": "Organization",
    "@id": "https://esperion.one/#organization",
    "name": "Esperion Digital Agency",
    "legalName": "PT Esperion Teknologi Digital",
    "url": "https://esperion.one",
    "logo": {
      "@type": "ImageObject",
      "url": "https://esperion.one/logo.png",
      "width": 600,
      "height": 60
    },
    "sameAs": [
      "https://www.linkedin.com/company/esperion",
      "https://www.instagram.com/esperion.id"
    ]
  },
  
  "datePublished": "{ISO date}",
  "dateModified": "{ISO date}",
  
  "image": {
    "@type": "ImageObject",
    "url": "https://esperion.one{image}",
    "width": 1200,
    "height": 630
  },
  
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [
      ".article-title",
      ".article-summary",
      ".key-points"
    ]
  },
  
  "mentions": [
    {
      "@type": "Thing",
      "name": "{entity name}",
      "sameAs": "https://www.wikidata.org/wiki/{id}"
    }
  ],
  
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://esperion.one/id/articles/{slug}"
  },
  
  "isAccessibleForFree": true,
  "inLanguage": "id"
}
```

### Required Schema Properties untuk AI

| Property | Priority | Purpose |
|----------|----------|---------|
| `@id` | Critical | Persistent entity identifier |
| `speakable` | High | Voice/AI assistant extraction |
| `mentions` | High | Entity linking untuk context |
| `keywords` | High | Topical classification |
| `wordCount` | Medium | Content depth signal |
| `citation` | Medium | Credibility & references |
| `dateModified` | High | Freshness signal |

---

## Content Structure Standards

### Article Format (AI-Friendly)

```markdown
# Judul Artikel

## Summary (Speakable)
[40-60 kata ringkasan lengkap - jawaban langsung]

## Key Points (Speakable)
- Point 1
- Point 2
- Point 3

## H2: Apa itu [Topik]? (Question format)
[Jawaban langsung 40-60 kata]

Detail penjelasan...

### H3: Sub-topic
Content...

## H2: Mengapa [Topik] Penting?
[Jawaban langsung]

## H2: Bagaimana Cara [Action]?
1. Step one
2. Step two
3. Step three

## H2: Kesimpulan
[Ringkasan actionable]

## Referensi
- [Source 1](url)
- [Source 2](url)
```

### Content Guidelines untuk AI

1. **Atomic Answers**: Setiap H2 diawali dengan jawaban ringkas 40-60 kata
2. **Question Headers**: Gunakan format pertanyaan di H2
3. **Named Entities**: Bold untuk entity names (orang, perusahaan, produk)
4. **Specific Numbers**: Include statistics dengan sumber
5. **Active Voice**: Gunakan active verbs di steps
6. **Self-contained**: Setiap section bisa stand alone

---

## Validation Checklist

### Pre-Deploy
- [ ] Routing test passed (all detail pages accessible)
- [ ] Content rendered correctly (no empty pages)
- [ ] Domain check: zero esperion.id references
- [ ] Schema validation: Google Rich Results Test passing
- [ ] Word count: min 800 kata per artikel
- [ ] Tags: all articles have 3-5 tags
- [ ] Images: all article images exist

### Post-Deploy
- [ ] Google Search Console: no structured data errors
- [ ] AI citation test: content appears di ChatGPT/Perplexity searches
- [ ] Voice search: speakable content extractable
- [ ] Performance: <2s load time

---

## References

1. [Google Article Structured Data](https://developers.google.com/search/docs/appearance/structured-data/article)
2. [Schema.org Article](https://schema.org/Article)
3. [AI-Friendly Schema Guide](https://www.ndash.com/blog/optimizing-your-website-for-seo-and-ai-with-ai-friendly-schema)
4. [Schema for LLMs 2026](https://llmfy.ai/blog/schema-for-llm-complete-guide)
5. [LLM SEO 2026](https://www.grafit.agency/blog/the-llm-seo-guide-how-to-optimize-a-b2b-website-for-ai-search-in-2026)

---

**Version**: 1.0  
**Last Updated**: 2026-03-12  
**Domain**: esperion.one
