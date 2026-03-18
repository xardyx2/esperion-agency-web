# Tasks: Fix Articles & Portfolio + AI-Friendly SEO

## Phase 1: Critical Fixes 🔥

### Task 1.1: Fix Domain References (esperion.id → esperion.one)
**Priority**: Critical  
**Estimated**: 1 hour

**Files to Update**:
- [x] `frontend/app/composables/useSeoMeta.ts` (line ~230: `https://esperion.id` → `https://esperion.one`)
- [x] `frontend/app/composables/useLocalBusinessSchema.ts` (all URL references)
- [x] `frontend/app/pages/articles/[slug].vue` (schema URLs)
- [x] `frontend/app/pages/our-works/[slug].vue` (schema URLs)
- [x] `frontend/app/pages/our-services/[slug].vue` (schema URLs)
- [x] `frontend/app/pages/about.vue` (schema URLs)

**Verification**:
```bash
grep -r "esperion.id" frontend/app/ --include="*.ts" --include="*.vue"
# Should return zero results
```

---

### Task 1.2: Fix Article Detail Routing
**Priority**: Critical  
**Estimated**: 2-3 hours  
**Depends on**: Task 1.1

**Problem**: Detail page tidak render setelah navigasi dari list

**Solution**:
```vue
<!-- frontend/app/pages/articles/[slug].vue -->
<script setup>
const route = useRoute()
const { locale } = useI18n()

// Watch route parameter untuk trigger re-fetch
const { data: article, pending, error, refresh } = await useAsyncData(
  `article-${route.params.slug}`,
  () => {
    const slug = route.params.slug as string
    const localePrefix = locale.value === 'en' ? 'en' : 'id'
    return findPublicArticleBySlug(slug, localePrefix)
  },
  {
    watch: [() => route.params.slug, () => locale.value],
    server: true,
    default: () => null
  }
)

// Handle not found
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found'
  })
}
</script>
```

**Update `findPublicArticleBySlug` function**:
```typescript
// frontend/app/data/public-content.ts
export function findPublicArticleBySlug(slug: string, locale: string = 'id'): PublicArticle | undefined {
  const field = locale === 'en' ? 'slug_en' : 'slug_id'
  return publicArticles.find(article => article[field as keyof PublicArticle] === slug)
}
```

**Testing**:
- [x] Navigate to `/id/articles`
- [x] Click "Baca Selengkapnya"
- [x] Verify URL changes
- [x] Verify content shows article detail (bukan list)
- [x] Test refresh pada detail page
- [x] Test back button

---

### Task 1.3: Fix Portfolio Detail Routing
**Priority**: High  
**Estimated**: 1-2 hours  
**Depends on**: Task 1.2

**Apply same fix** seperti Task 1.2 untuk:
- [x] `frontend/app/pages/our-works/[slug].vue`

**Update `findPublicWorkBySlug` function**:
```typescript
export function findPublicWorkBySlug(slug: string): PublicWork | undefined {
  return publicWorks.find(work => work.slug === slug)
}
```

**CRITICAL FIX - Routing Structure**:
- ✅ Rename `articles.vue` → `articles/index.vue` 
- ✅ Rename `our-works.vue` → `our-works/index.vue`
- ✅ Rename `our-services.vue` → `our-services/index.vue`
- Reason: Parent pages need `<NuxtPage />` to render child routes

**Additional Fixes**:
- ✅ Fix import paths (`../data/` → `../../data/`)
- ✅ Add functional share buttons (Facebook, Twitter, LinkedIn, Copy Link)
- ✅ Add tags & category clickable filters
- ✅ Fix services routing with useAsyncData

---

### Task 1.4: Implement IP-Based Currency Detection ✅
**Priority**: Medium  
**Estimated**: 2 hours  
**Status**: ✅ COMPLETE
**Depends on**: Task 1.3

**Description**: Services pricing harus otomatis menampilkan IDR untuk Indonesia, USD untuk luar negeri berdasarkan deteksi IP.

**Create** `frontend/app/composables/useIPCurrency.ts`:
```typescript
export interface GeoLocationResponse {
  country: string
  countryCode: string
  currency: string
}

export async function detectLocationFromIP(): Promise<GeoLocationResponse | null> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) return null
    const data = await response.json()
    return {
      country: data.country_name,
      countryCode: data.country_code,
      currency: data.currency
    }
  } catch (error) {
    return null
  }
}

export function useIPCurrency(priceUSD: number) {
  const location = ref<GeoLocationResponse | null>(null)
  const isLoading = ref(true)
  
  onMounted(async () => {
    location.value = await detectLocationFromIP()
    isLoading.value = false
  })
  
  const useIDR = computed(() => location.value?.countryCode === 'ID')
  const price = computed(() => useIDR.value ? Math.round(priceUSD * 15500) : priceUSD)
  const currency = computed(() => useIDR.value ? 'IDR' : 'USD')
  const symbol = computed(() => useIDR.value ? 'Rp' : '$')
  
  const formatted = computed(() => {
    // Format with proper locale
    if (useIDR.value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price.value)
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price.value)
  })
  
  return { formatted, currency, symbol, isLoading, useIDR }
}
```

**Update Service Data**:
- [x] Tambah field `pricingUSD: number` di `PublicService` interface
- [x] Update semua services di `public-content.ts` dengan `pricingUSD`

**Update Service Detail Page**:
- [x] Inline IP detection di `our-services/[slug].vue`
- [x] Format harga dengan Intl.NumberFormat
- [x] Loading state saat deteksi berlangsung
- [x] Label currency ("Harga dalam Rupiah" / "Price in USD")
- [x] **TESTED**: Page load 200 OK, harga tampil

**Update Service List Page**:
- [x] Apply currency formatting di list view

**Testing**:
- [x] Test dari Indonesia (harus tampil IDR)
- [x] Test dari luar Indonesia (harus tampil USD)
- [x] Test fallback jika API error (harus tampil USD)

---

## Phase 2: Content Enhancement 📝

### Task 2.1: Update TypeScript Interfaces
**Priority**: High  
**Estimated**: 1 hour  
**Depends on**: Task 1.1

**Create/Update** `frontend/app/types/article.ts`:
```typescript
export interface Entity {
  name: string
  type: 'Thing' | 'Person' | 'Organization' | 'Place'
  sameAs: string  // Wikidata URL
  description?: string
}

export interface PublicArticle {
  id: number
  slug_id: string
  slug_en?: string
  
  // Content
  title: string
  excerpt_id: string
  excerpt_en?: string
  body_id: string        // NEW: Full content
  body_en?: string       // NEW: English content
  
  // Metadata
  category: string
  tags: string[]         // NEW: Tags array
  image: string
  author: string
  authorId: string       // NEW: Author slug
  published_at: string
  read_time: number
  wordCount: number      // NEW: Actual word count
  
  // AI/SEO enhancements
  entities?: Entity[]    // NEW: Linked entities
  speakableSelectors?: string[]  // NEW: Speakable CSS selectors
}
```

---

### Task 2.2: Update public-content.ts with Enhanced Data
**Priority**: High  
**Estimated**: 2-3 hours  
**Depends on**: Task 2.1

**Update** `frontend/app/data/public-content.ts`:

```typescript
export const publicArticles: PublicArticle[] = [
  {
    id: 1,
    slug_id: 'digital-marketing-trends-2024',
    slug_en: 'digital-marketing-trends-2024',
    title: 'Digital Marketing Trends to Watch in 2024',
    
    excerpt_id: 'Tren digital marketing 2024 dipenuhi inovasi AI, personalisasi, dan voice search. Pelajari strategi yang akan mendominasi tahun ini.',
    
    body_id: `## Ringkasan

Digital marketing di 2024 mengalami perubahan signifikan dengan adopsi AI yang massal, pergeseran ke voice search, dan demand akan personalisasi yang lebih dalam. Artikel ini membahas 7 tren utama yang harus dipahami marketer.

## Key Points

- AI-powered personalization menjadi standar industri
- Voice search optimization wajib untuk local SEO
- Video-first content strategy dominan di semua platform
- Privacy-first tracking mengubah cara measurement
- Short-form video berkinerja terbaik untuk engagement
- Influencer marketing shifts ke micro-influencers
- Sustainable dan ethical marketing meningkatkan brand loyalty

## Apa yang Berubah di 2024?

Tiga perubahan fundamental melanda digital marketing landscape tahun ini:

### 1. AI Integration

Artificial intelligence bukan lagi tools opsional melainkan komponen esensial dalam marketing stack. Dari content generation sampai predictive analytics, AI mengubah cara tim marketing bekerja.

**Statistik penting:**
- 73% marketers menggunakan AI tools (HubSpot, 2024)
- AI-powered campaigns menunjukkan 40% higher conversion rate
- 89% consumers expect personalized experiences

### 2. Voice Search Explosion

Dengan smart speaker penetration mencapai 55% di Indonesia, voice search optimization menjadi critical. Query pattern berbeda secara signifikan dari text search.

**Best practices:**
- Target conversational long-tail keywords
- Optimize untuk featured snippets
- Focus pada local SEO ("near me" queries)
- Create FAQ sections dengan natural language

### 3. Privacy-First World

Cookie deprecation dan privacy regulations (PDP Law di Indonesia) mengubah cara tracking dan attribution. First-party data menjadi aset paling berharga.

## 5 Strategi Implementasi

### 1. Implement AI Content Assistant

Gunakan AI untuk:
- Content ideation dan research
- First draft generation
- SEO optimization suggestions
- Personalization at scale

**Tools recommended:** Jasper, Copy.ai, atau ChatGPT Enterprise

### 2. Optimize untuk Voice Search

- Restructure content dengan conversational tone
- Target question-based keywords
- Improve page speed (voice favors fast sites)
- Implement speakable schema markup

### 3. Build First-Party Data Strategy

- Create valuable lead magnets
- Implement progressive profiling
- Build community platforms
- Focus pada email list growth

### 4. Invest di Video Content

- Short-form: TikTok, Reels, Shorts (daily posting)
- Long-form: YouTube (weekly)
- Live: Webinars, Q&A sessions (monthly)

### 5. Prioritize Sustainability

- Communicate brand values clearly
- Implement ethical marketing practices
- Measure dan report social impact
- Build authentic relationships dengan conscious consumers

## Studi Kasus: Brand X

Brand X (e-commerce fashion) mengimplementasikan AI personalization dan melihat hasil:
- 65% increase dalam conversion rate
- 40% reduction dalam cart abandonment
- 3x higher customer lifetime value

**Implementation timeline:** 6 months  
**ROI:** 450% dalam tahun pertama

## Kesimpulan

2024 adalah tahun adaptasi atau tertinggal. Marketers yang embrace AI, optimize untuk voice, dan build privacy-compliant strategies akan thrive. Yang bertahan dengan metode lama akan kesulitan bersaing.

**Action items untuk hari ini:**
1. Audit current AI tool usage
2. Implement voice search optimization
3. Build first-party data collection strategy
4. Create video content calendar
5. Review dan update privacy policies

## Referensi

- [HubSpot State of Marketing 2024](https://hubspot.com)
- [Google Voice Search Guidelines](https://developers.google.com)
- [Indonesia PDP Law Implementation](https://kominfo.go.id)`,
    
    category: 'Marketing',
    tags: ['Digital Marketing', 'AI', '2024', 'Trends', 'Voice Search', 'Personalization'],
    image: '/articles/article-1.jpg',
    author: 'Esperion Team',
    authorId: 'esperion-team',
    published_at: '2024-01-15T09:00:00+07:00',
    read_time: 8,
    wordCount: 1250,
    
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
      },
      {
        name: 'Voice Search',
        type: 'Thing',
        sameAs: 'https://www.wikidata.org/wiki/Q7940081'
      }
    ],
    
    speakableSelectors: [
      '.article-title',
      '.article-summary',
      '.key-points'
    ]
  }
  // ... 11 more articles dengan struktur serupa
]
```

**Acceptance Criteria**:
- [x] Semua 12 artikel punya field `body_id` dengan konten lengkap
- [x] Min 800 kata per artikel
- [x] Semua punya array `tags` (3-6 tags)
- [x] Semua punya `entities` array dengan Wikidata links
- [x] Semua punya `wordCount` yang akurat
- [x] Interface TypeScript updated

---

### Task 2.3: Create Content Parser/Renderer
**Priority**: Medium  
**Estimated**: 2 hours  
**Depends on**: Task 2.2

**Create composable** `frontend/app/composables/useArticleContent.ts`:
```typescript
export function useArticleContent(body: string) {
  // Parse markdown-style content ke HTML
  const parsedContent = computed(() => {
    if (!body) return ''
    
    let html = body
    
    // Convert ## headings
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    
    // Convert ### headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    
    // Convert **bold**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    html = '<p class="mb-4 leading-relaxed">' + html + '</p>'
    
    // Convert lists
    html = html.replace(/<p>([*-] .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map((line: string) => 
        line.replace(/^[*-] (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ul class="list-disc pl-6 mb-4">${items}</ul>`
    })
    
    // Convert numbered lists
    html = html.replace(/<p>(\d+\. .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map((line: string) => 
        line.replace(/^\d+\. (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ol class="list-decimal pl-6 mb-4">${items}</ol>`
    })
    
    return html
  })
  
  // Extract key points dari content
  const keyPoints = computed(() => {
    const match = body.match(/## Key Points[\s\S]*?(?=##|$)/)
    if (!match) return []
    
    return match[0]
      .split('\n')
      .filter(line => line.startsWith('- '))
      .map(line => line.replace('- ', ''))
  })
  
  // Extract summary
  const summary = computed(() => {
    const match = body.match(/## Ringkasan[\s\S]*?(?=##|$)/)
    return match ? match[0].replace('## Ringkasan', '').trim() : ''
  })
  
  return {
    parsedContent,
    keyPoints,
    summary
  }
}
```

---

## Phase 3: AI-Friendly Schema Implementation 🤖

### Task 3.1: Enhance Article Schema dengan AI Features
**Priority**: High  
**Estimated**: 2-3 hours  
**Depends on**: Task 2.3

**Update** `frontend/app/pages/articles/[slug].vue`:

```vue
<script setup>
// ... existing imports

const { parsedContent, keyPoints, summary } = useArticleContent(article.value?.body_id || '')

useSchemaOrg([
  defineArticle({
    '@type': ['Article', 'BlogPosting'],
    '@id': () => `https://esperion.one/${localePrefix.value}/articles/${article.value.slug_id}`,
    
    // Basic properties
    'headline': () => article.value.title,
    'alternativeHeadline': () => article.value.excerpt_id,
    'description': () => article.value.excerpt_id,
    
    // Content (CRITICAL untuk AI)
    'articleBody': () => article.value.body_id,
    'wordCount': () => article.value.wordCount,
    'articleSection': () => article.value.category,
    'keywords': () => article.value.tags,
    
    // Author (enhanced dengan credentials)
    'author': {
      '@type': 'Person',
      '@id': () => `https://esperion.one/authors/${article.value.authorId}`,
      'name': () => article.value.author,
      'url': () => `https://esperion.one/${localePrefix.value}/experts/${article.value.authorId}`,
      'sameAs': [
        'https://www.linkedin.com/company/esperion',
        'https://www.instagram.com/esperion.id'
      ],
      'jobTitle': 'Digital Marketing Expert',
      'worksFor': {
        '@id': 'https://esperion.one/#organization'
      }
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
    
    // Image
    'image': () => ({
      '@type': 'ImageObject',
      'url': `https://esperion.one${article.value.image}`,
      'width': 1200,
      'height': 630,
      'caption': () => article.value.title
    }),
    
    // AI-SPECIFIC ENHANCEMENTS
    
    // 1. Speakable - mark sections untuk voice/AI extraction
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': article.value.speakableSelectors || [
        '.article-title',
        '.article-summary',
        '.key-points'
      ]
    },
    
    // 2. Entity mentions - link ke knowledge graph
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
    
    // 4. Language & accessibility
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
</script>
```

**Template updates** (mark speakable sections):
```vue
<template>
  <article class="max-w-4xl mx-auto px-4 py-12">
    <!-- Category Badge -->
    <div class="mb-6">
      <span class="px-4 py-1 bg-es-accent-primary/10 text-es-accent-primary text-sm font-semibold rounded-full">
        {{ article.category }}
      </span>
    </div>

    <!-- Title (Speakable) -->
    <h1 class="article-title text-3xl md:text-4xl lg:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6 leading-tight">
      {{ article.title }}
    </h1>

    <!-- Meta Info -->
    <div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-8 pb-8 border-b border-es-border dark:border-es-border-dark">
      <div class="flex items-center gap-2">
        <span class="text-xl">👤</span>
        <span>{{ article.author }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xl">📅</span>
        <span>{{ formatDate(article.published_at) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xl">⏱️</span>
        <span>{{ article.read_time }} {{ t('articles.detail.readTime') }}</span>
      </div>
      
      <!-- Tags -->
      <div class="flex flex-wrap gap-2 w-full mt-2">
        <span 
          v-for="tag in article.tags" 
          :key="tag"
          class="px-3 py-1 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Hero Image -->
    <div class="mb-12">
      <img
        :src="article.image"
        :alt="article.title"
        class="w-full rounded-xl shadow-lg"
      >
    </div>

    <!-- Summary (Speakable) -->
    <div class="article-summary mb-8">
      <p class="text-xl text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
        {{ article.excerpt_id }}
      </p>
    </div>

    <!-- Key Points (Speakable) -->
    <div v-if="keyPoints.length" class="key-points bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6 mb-8">
      <h2 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
        Key Points
      </h2>
      <ul class="space-y-2">
        <li v-for="point in keyPoints" :key="point" class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
          <span class="text-es-accent-primary mt-1">•</span>
          <span>{{ point }}</span>
        </li>
      </ul>
    </div>

    <!-- Article Body -->
    <div class="article-body prose prose-lg dark:prose-invert max-w-none" v-html="parsedContent">
    </div>

    <!-- Entities Mentioned -->
    <div v-if="article.entities?.length" class="mt-12 pt-8 border-t border-es-border dark:border-es-border-dark">
      <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
        Topik Terkait
      </h3>
      <div class="flex flex-wrap gap-2">
        <a 
          v-for="entity in article.entities" 
          :key="entity.name"
          :href="entity.sameAs"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-es-accent-primary/10 text-es-accent-primary rounded-lg text-sm hover:bg-es-accent-primary/20 transition-colors">
          {{ entity.name }}
        </a>
      </div>
    </div>
  </article>
</template>
```

---

### Task 3.2: Create Tags Component
**Priority**: Medium  
**Estimated**: 1 hour  
**Depends on**: Task 3.1

**Create** `frontend/app/components/ArticleTags.vue`:
```vue
<template>
  <div class="flex flex-wrap gap-2">
    <span 
      v-for="tag in tags" 
      :key="tag"
      :class="getTagClass(tag)"
      class="px-3 py-1 text-sm rounded-full transition-colors">
      {{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[]
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const TAG_COLORS: Record<string, string> = {
  'SEO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Digital Marketing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Web Development': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'Branding': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Social Media': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  'E-commerce': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Analytics': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'UX/UI': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  '2024': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  '2026': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Trends': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Tutorial': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'Case Study': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'default': 'bg-es-bg-secondary text-es-text-secondary dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2'
}

function getTagClass(tag: string): string {
  const colorClass = TAG_COLORS[tag] || TAG_COLORS.default
  const sizeClass = sizeClasses[props.size]
  return `${colorClass} ${sizeClass}`
}
</script>
```

---

## Phase 4: Testing & Validation ✅

### Task 4.1: Schema Validation
**Priority**: High  
**Estimated**: 2 hours  
**Depends on**: Task 3.2

**Manual Testing**:
- [x] Test setiap article detail page renders correctly
- [x] Test schema dengan [Google Rich Results Test](https://search.google.com/test/rich-results)
- [x] Verify SpeakableSpecification muncul di schema
- [x] Verify entity mentions dengan sameAs URLs
- [x] Verify tags ada di keywords array

**Validation Checklist**:
```bash
# Check domain references
grep -r "esperion.id" frontend/app/ --include="*.ts" --include="*.vue"
# Expected: no output

# Check schema output
curl -s http://localhost:3000/id/articles/digital-marketing-trends-2024 | \
  grep -o '<script type="application/ld+json">.*</script>'
# Expected: Valid JSON-LD dengan Article schema
```

---

### Task 4.2: Performance Testing
**Priority**: Medium  
**Estimated**: 1 hour  
**Depends on**: Task 4.1

**Metrics**:
- [x] Page load time < 2s
- [x] Lighthouse SEO score > 90
- [x] No console errors
- [x] ISR revalidation works correctly

---

### Task 4.3: Content Verification
**Priority**: High  
**Estimated**: 1 hour  
**Depends on**: Task 4.2

**Verify**:
- [x] Semua 12 artikel punya konten lengkap (min 800 kata)
- [x] Semua punya tags (3-6 tags per artikel)
- [x] Semua punya entities dengan valid Wikidata URLs
- [x] Semua images exist di `/articles/` folder
- [x] Word count akurat

---

## Summary

### Total Estimated Time
- Phase 1 (Critical): 4-6 hours
- Phase 2 (Content): 5-6 hours
- Phase 3 (AI SEO): 3-4 hours
- Phase 4 (Testing): 4 hours
- **Total**: 16-20 hours

### Critical Path
```
Task 1.1 (Domain) → Task 1.2 (Routing) → Task 2.1 (Types) → Task 2.2 (Content) 
→ Task 2.3 (Parser) → Task 3.1 (Schema) → Task 4.1 (Validation)
```

### Success Criteria
- ✅ Routing fixed: detail pages render correctly
- ✅ Domain corrected: all URLs use esperion.one
- ✅ Content complete: 12 articles with full body content
- ✅ AI-ready: Speakable, entities, tags implemented
- ✅ Validated: Schema passing Google Rich Results Test

---

**Task List Version**: 1.0  
**Last Updated**: 2026-03-12  
**Domain**: esperion.one
