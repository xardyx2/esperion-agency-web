# Design: Articles & Portfolio Fix + AI-Friendly SEO

## Domain Correction

**CRITICAL**: All references must use `esperion.one` (NOT esperion.id)

### Files to Update Domain:
1. `frontend/app/composables/useSeoMeta.ts` - Line ~230
2. `frontend/app/composables/useLocalBusinessSchema.ts` - All URLs
3. `frontend/app/pages/articles/[slug].vue` - Schema URLs
4. `frontend/app/pages/our-works/[slug].vue` - Schema URLs
5. `frontend/app/pages/our-services/[slug].vue` - Schema URLs
6. `frontend/app/pages/about.vue` - Schema URLs

---

## Routing Fix Strategy

### Root Cause Analysis
Berdasarkan testing, issue adalah client-side routing tidak trigger re-render. URL berubah tapi komponen tidak update.

### Solution Options

**Option A: Watch Route Parameter (Recommended)**
```vue
<script setup>
const route = useRoute()
const { data: article, refresh } = await useAsyncData(
  () => findPublicArticleBySlug(route.params.slug),
  { watch: [() => route.params.slug] }
)
</script>
```

**Option B: Force Page Reload on Client**
```vue
<script setup>
const router = useRouter()
// Add to nuxt.config or page level
if (process.client) {
  router.options.scrollBehavior = () => {}
}
</script>
```

**Option C: Check ISR Configuration**
Current ISR config di `nuxt.config.ts`:
```typescript
'/id/articles/**': { isr: 300 },
'/en/articles/**': { isr: 300 },
```

Mungkin perlu tambah `swr: true` atau adjust revalidation.

### Recommended Implementation
Gunakan **Option A** - Watch route parameter dengan proper reactive data fetching.

---

## Article Content Structure

### Data Flow
```
public-content.ts (enhanced data)
    ↓
[slug].vue (page component)
    ↓
    ├─ useSeoMeta() - Meta tags
    ├─ useSchemaOrg() - Structured data
    └─ Template - Render content
```

### Enhanced Data Model

```typescript
// frontend/app/data/public-content.ts

export const publicArticles: PublicArticle[] = [
  {
    id: 1,
    slug_id: 'digital-marketing-trends-2024',
    slug_en: 'digital-marketing-trends-2024',
    title: 'Digital Marketing Trends to Watch in 2024',
    
    // NEW FIELDS
    excerpt_id: 'Ringkasan singkat...',
    body_id: `## Summary
    
Digital marketing di 2024 dipenuhi dengan inovasi AI... [40-60 kata]

## Key Points
- AI-powered personalization
- Voice search optimization  
- Video-first content strategy

## Apa yang Berubah di 2024?

Tiga perubahan besar melanda digital marketing... [jawaban langsung]

### AI dalam Marketing

Content tentang AI...

## Kesimpulan

Actionable takeaway...`,
    
    // METADATA
    category: 'Marketing',
    tags: ['Digital Marketing', 'AI', '2024', 'Trends'],
    image: '/articles/article-1.jpg',
    author: 'Esperion Team',
    authorId: 'esperion-team',
    published_at: '2024-01-15',
    read_time: 8,
    wordCount: 1250,
    
    // AI ENHANCEMENTS
    entities: [
      {
        name: 'Artificial Intelligence',
        type: 'Thing',
        sameAs: 'https://www.wikidata.org/wiki/Q11660'
      },
      {
        name: 'Digital Marketing',
        type: 'Thing', 
        sameAs: 'https://www.wikidata.org/wiki/Q1323528'
      }
    ],
    
    speakableSelectors: [
      '.article-title',
      '.article-summary',
      '.key-points'
    ]
  }
  // ... 11 more articles
]
```

---

## AI-Friendly Schema Design

### Enhanced Article Schema

```typescript
// In [slug].vue - useSchemaOrg()

useSchemaOrg([
  defineArticle({
    '@type': ['Article', 'BlogPosting'],
    '@id': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`,
    
    // Basic
    'headline': () => article.value.title,
    'alternativeHeadline': () => article.value.excerpt_id,
    'description': () => article.value.excerpt_id,
    
    // Content
    'articleBody': () => article.value.body_id, // Full content!
    'wordCount': () => article.value.wordCount, // Dynamic
    'articleSection': () => article.value.category,
    'keywords': () => article.value.tags,
    
    // Author (enhanced)
    'author': {
      '@type': 'Person',
      '@id': () => `https://esperion.one/authors/${article.value.authorId}`,
      'name': () => article.value.author,
      'url': () => `https://esperion.one/${localePrefix.value}/experts/${article.value.authorId}`,
      'sameAs': [
        'https://www.linkedin.com/company/esperion',
        'https://www.instagram.com/esperion.id'
      ]
    },
    
    // Publisher (corrected domain)
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://esperion.one/#organization',
      'name': 'Esperion Digital Agency',
      'legalName': 'PT Esperion Teknologi Digital',
      'url': 'https://esperion.one',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://esperion.one/placeholders/first-party/brand-mark-required.svg',
        'width': 300,
        'height': 150
      },
      'sameAs': [
        'https://www.linkedin.com/company/esperion',
        'https://www.instagram.com/esperion.id'
      ]
    },
    
    // Dates
    'datePublished': () => article.value.published_at,
    'dateModified': () => new Date().toISOString(),
    
    // Images
    'image': () => ({
      '@type': 'ImageObject',
      'url': `https://esperion.one${article.value.image}`,
      'width': 1200,
      'height': 630
    }),
    
    // AI-SPECIFIC ENHANCEMENTS
    
    // 1. Speakable - mark content for voice/AI
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': article.value.speakableSelectors || [
        '.article-title',
        '.article-summary',
        '.key-points'
      ]
    },
    
    // 2. Entity mentions - link to knowledge graph
    'mentions': () => article.value.entities?.map(entity => ({
      '@type': entity.type,
      'name': entity.name,
      'sameAs': entity.sameAs
    })) || [],
    
    // 3. Main entity
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`
    },
    
    // 4. Language
    'inLanguage': () => locale.value === 'en' ? 'en-US' : 'id-ID',
    'isAccessibleForFree': true
  }),
  
  // WebPage schema
  defineWebPage({
    '@id': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`,
    'name': () => article.value.title,
    'description': () => article.value.excerpt_id,
    'url': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`,
    'datePublished': () => article.value.published_at,
    'dateModified': () => new Date().toISOString()
  }),
  
  // Breadcrumb
  defineBreadcrumb({
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': () => t('breadcrumb.home'),
        'item': () => `https://esperion.one/${localePrefix.value}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': () => t('breadcrumb.articles'),
        'item': () => `https://esperion.one/${localePrefix.value}/articles`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': () => article.value.title,
        'item': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`
      }
    ]
  })
])
```

---

## Template Structure (AI-Optimized)

```vue
<template>
  <article class="max-w-4xl mx-auto px-4 py-12">
    <!-- Category Badge -->
    <div class="mb-6">
      <span class="category-badge">
        {{ article.category }}
      </span>
    </div>

    <!-- Title (Speakable) -->
    <h1 class="article-title">
      {{ article.title }}
    </h1>

    <!-- Meta Info -->
    <div class="meta-info">
      <span>{{ article.author }}</span>
      <span>{{ formatDate(article.published_at) }}</span>
      <span>{{ article.read_time }} min read</span>
      
      <!-- Tags -->
      <div class="tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Hero Image -->
    <div class="hero-image">
      <img :src="article.image" :alt="article.title">
    </div>

    <!-- Summary (Speakable - Atomic Answer) -->
    <div class="article-summary">
      <p>{{ article.excerpt_id }}</p>
    </div>

    <!-- Key Points (Speakable) -->
    <div class="key-points">
      <h2>Key Points</h2>
      <ul>
        <li v-for="point in keyPoints" :key="point">{{ point }}</li>
      </ul>
    </div>

    <!-- Article Body - Parsed from Markdown -->
    <div class="article-body prose" v-html="parsedBody">
    </div>

    <!-- Entities Mentioned -->
    <div v-if="article.entities?.length" class="entities">
      <h3>Topik Terkait</h3>
      <div class="entity-list">
        <a v-for="entity in article.entities" 
           :key="entity.name"
           :href="entity.sameAs"
           target="_blank"
           class="entity-link">
          {{ entity.name }}
        </a>
      </div>
    </div>
  </article>
</template>
```

---

## Tags System Design

### UI Components

```vue
<!-- ArticleTags.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <span 
      v-for="tag in tags" 
      :key="tag"
      class="px-3 py-1 bg-es-accent-primary/10 text-es-accent-primary text-sm rounded-full">
      {{ tag }}
    </span>
  </div>
</template>
```

### Tag Colors (Semantic)
```typescript
const TAG_COLORS: Record<string, string> = {
  'SEO': 'bg-blue-100 text-blue-800',
  'AI': 'bg-purple-100 text-purple-800',
  'Digital Marketing': 'bg-green-100 text-green-800',
  'Web Development': 'bg-orange-100 text-orange-800',
  'Design': 'bg-pink-100 text-pink-800',
  'Trends': 'bg-yellow-100 text-yellow-800',
  'Tutorial': 'bg-teal-100 text-teal-800',
  'Case Study': 'bg-indigo-100 text-indigo-800'
}
```

---

## Portfolio Detail Check

### Verify Current Implementation
Current data untuk works sudah lengkap:
- ✅ title, description (lengkap!)
- ✅ service, platform, client_name
- ✅ metrics, features, gallery
- ✅ slug

### Potential Issues
Jika portfolio detail juga broken, kemungkinan:
1. **Same routing issue** - Fix sama dengan articles
2. **ISR cache** - Clear cache atau adjust revalidation
3. **Client-side navigation** - Check NuxtLink behavior

### Schema Enhancement untuk Works
```typescript
defineWebPage({
  '@type': 'ItemPage',
  'name': () => work.value.title,
  'description': () => work.value.description,
  'mainEntity': {
    '@type': 'CreativeWork',
    'name': () => work.value.title,
    'description': () => work.value.description,
    'creator': {
      '@type': 'Organization',
      'name': 'Esperion Digital Agency'
    },
    'datePublished': () => work.value.completed_date
  }
})
```

---

## Content Creation Strategy

### Article Topics (12 Articles)

1. **Digital Marketing Trends 2024** - AI, personalization, voice search
2. **SEO untuk AI Search** - LLMO, entity optimization
3. **Web Development 2024** - JAMstack, edge computing
4. **Social Media Strategy** - Platform trends, content formats
5. **E-commerce Optimization** - Conversion, UX, performance
6. **Branding di Era Digital** - Storytelling, visual identity
7. **Content Marketing** - AI tools, distribution
8. **Analytics & Data** - GA4, attribution, privacy
9. **Mobile-First Design** - PWA, responsive, performance
10. **Video Marketing** - Short-form, live streaming
11. **Email Marketing** - Automation, personalization
12. **UX/UI Trends** - Micro-interactions, accessibility

### Content Template (Per Article)
```markdown
## Summary (60 kata)
Ringkasan lengkap apa yang dibahas dan value proposition.

## Key Points (3-5 bullet)
- Point 1
- Point 2
- Point 3

## H2: Apa itu [Topik]?
[Jawaban definisi 40-60 kata yang jelas dan direct]

Paragraf elaborasi...

### H3: Sub-topic
Detail...

## H2: Mengapa [Topik] Penting untuk Bisnis?
[Jawaban direct]

Statistik dan data...

## H2: 5 Cara Implementasi [Topik]
1. **Step One**: Detail...
2. **Step Two**: Detail...
3. **Step Three**: Detail...
4. **Step Four**: Detail...
5. **Step Five**: Detail...

## H2: Studi Kasus: [Company]
[Contoh nyata dengan hasil konkret]

## H2: Kesimpulan
[Ringkasan actionable - what to do next]

## Referensi
- [Source 1](url) - Authority site
- [Source 2](url) - Research/statistics
```

---

## Testing Strategy

### Manual Tests
1. Navigate to `/id/articles`
2. Click "Baca Selengkapnya" pada setiap artikel
3. Verify URL changes to `/id/articles/[slug]`
4. Verify content shows full article (not list page)
5. Check schema dengan [Rich Results Test](https://search.google.com/test/rich-results)

### Schema Validation
```bash
# Check JSON-LD output
curl -s https://esperion.one/id/articles/digital-marketing-trends-2024 | \
  grep -o '<script type="application/ld+json">.*</script>'
```

### Performance Tests
- Lighthouse SEO score > 90
- Page load < 2s
- No console errors

---

## Migration Checklist

### Domain Migration
- [ ] Search "esperion.id" di seluruh codebase
- [ ] Replace dengan "esperion.one"
- [ ] Update environment variables jika ada
- [ ] Test external links (LinkedIn, Instagram)

### Content Migration
- [ ] Backup existing public-content.ts
- [ ] Add new fields (body_id, tags, entities)
- [ ] Create 12 article contents
- [ ] Verify all images exist

### Schema Migration
- [ ] Update useSchemaOrg calls
- [ ] Add speakable specification
- [ ] Add entity mentions
- [ ] Test dengan Google validator

---

**Design Version**: 1.0  
**Domain**: esperion.one  
**Schema**: spec-driven
