<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-es-accent-primary"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-es-text-primary mb-4">{{ t('articles.detail.notFound') }}</h1>
        <NuxtLink :to="localePath('/articles')" class="text-es-accent-primary hover:underline">
          {{ t('articles.detail.backToArticles') }}
        </NuxtLink>
      </div>
    </div>
    
    <!-- Article Content -->
    <template v-else-if="article">
      <article class="max-w-4xl mx-auto px-4 py-12">
        <!-- Category Badge (Clickable) -->
        <div class="mb-6">
          <NuxtLink
            :to="localePath(`/articles?category=${article.category}`)"
            class="inline-block px-4 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-semibold rounded-full hover:bg-es-accent-primary/20 dark:hover:bg-es-accent-primary-dark/20 transition-colors cursor-pointer"
          >
            {{ article.category }}
          </NuxtLink>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6 leading-tight">
          {{ article.title }}
        </h1>

      <!-- Meta Info -->
      <div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-4 pb-8 border-b border-es-border dark:border-es-border-dark">
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
      </div>

      <!-- Tags (Clickable) -->
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-8">
        <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mr-2">{{ t('articles.detail.tags') }}:</span>
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="localePath(`/articles?tag=${encodeURIComponent(tag)}`)"
          class="px-3 py-1 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors cursor-pointer"
        >
          {{ tag }}
        </NuxtLink>
      </div>

      <!-- Hero Image -->
      <div class="mb-12">
        <img
          :src="article.image"
          :alt="article.title"
          class="w-full rounded-xl shadow-lg"
        >
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p class="text-xl text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-8">
          {{ article.excerpt_id }}
        </p>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          {{ t('articles.detail.mainSummary') }}
        </h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          {{ t('articles.detail.summaryParagraph1') }}
        </p>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          {{ t('articles.detail.keyPoints') }}
        </h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          {{ t('articles.detail.keyPointIntro') }}
        </p>
        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>{{ t('articles.detail.keyPoint1') }}</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>{{ t('articles.detail.keyPoint2') }}</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>{{ t('articles.detail.keyPoint3') }}</span>
          </li>
        </ul>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          {{ t('articles.detail.closing') }}
        </h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
          {{ t('articles.detail.closingParagraph') }}
        </p>
      </div>

      <!-- Share Section -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          {{ t('articles.detail.shareArticle') }}
        </h3>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="shareToFacebook"
            class="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            {{ t('articles.detail.facebook') }}
          </button>
          <button 
            @click="shareToTwitter"
            class="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            {{ t('articles.detail.twitter') }}
          </button>
          <button 
            @click="shareToLinkedIn"
            class="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            {{ t('articles.detail.linkedin') }}
          </button>
          <button 
            @click="copyLink"
            class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            {{ t('articles.detail.copyLink') }}
          </button>
        </div>
        <!-- Copy Success Message -->
        <p v-if="copySuccess" class="mt-3 text-sm text-green-600 dark:text-green-400">
          {{ t('articles.detail.linkCopied') }}
        </p>
      </div>

      <!-- Author Bio -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
              {{ article.author }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
              {{ t('articles.detail.authorBio') }}
            </p>
          </div>
        </div>
      </div>
    </article>

    <!-- Related Articles -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">
          {{ t('articles.detail.relatedArticles') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in relatedArticles"
            :key="related.id"
            :to="relatedArticlePath(related)"
            class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              :src="related.image"
              :alt="related.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="p-6">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ related.category }}</span>
              <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">{{ related.title }}</h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2">{{ related.excerpt_id }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          {{ t('articles.detail.newsletterTitle') }}
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          {{ t('articles.detail.newsletterDescription') }}
        </p>
        <NuxtLink
          :to="localePath('/articles')"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >{{ t('articles.detail.viewAllArticles') }}</NuxtLink>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { findPublicArticleBySlug, getRelatedArticles } from '../../data/public-content'

const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

// Slug parsing with edge case handling
const slugParam = computed(() => {
  const raw = route.params.slug

  if (Array.isArray(raw)) {
    return raw[0] ?? ''
  }

  return typeof raw === 'string' ? raw : ''
})

// FIX: Use useAsyncData with watch untuk reactive route changes
const { data: article, pending, error } = await useAsyncData(
  `article-${route.params.slug}`,
  () => {
    const record = findPublicArticleBySlug(slugParam.value)
    
    if (!record) {
      throw createError({ statusCode: 404, statusMessage: 'Article not found' })
    }
    
    return record
  },
  {
    watch: [slugParam],
    server: true,
    default: () => null
  }
)

// Handle error after fetch completes
watchEffect(() => {
  if (!pending.value && error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }
})

const relatedArticles = computed(() => article.value ? getRelatedArticles(article.value.slug_id, 3) : [])

const localizedArticleSlug = computed(() => 
  article.value ? (locale.value === 'en' ? (article.value.slug_en || article.value.slug_id) : article.value.slug_id) : ''
)

const relatedArticlePath = (related: { slug_id: string, slug_en?: string }) => {
  const slug = locale.value === 'en' ? (related.slug_en || related.slug_id) : related.slug_id
  return localePath(`/articles/${slug}`)
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })

const articleKeywords = computed(() => {
  if (!article.value) return ''
  return article.value.title
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .slice(0, 5)
    .join(',')
})

const localePrefix = computed(() => (locale.value === 'en' ? 'en' : 'id'))
const pageUrl = computed(() => article.value ? `https://esperion.one/${localePrefix.value}/articles/${localizedArticleSlug.value}` : '')
const imageUrl = computed(() => article.value ? `https://esperion.one${article.value.image}` : '')

// Share functionality
const copySuccess = ref(false)

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareToTwitter = () => {
  const text = article.value ? article.value.title : ''
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl.value)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareToLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = pageUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  }
}

// Only set SEO meta when article is loaded
watchEffect(() => {
  if (!article.value) return
  
  useSeoMeta({
    title: `${article.value.title} | ${t('seo.articles.title')}`,
    description: article.value.excerpt_id,
    ogTitle: `${article.value.title} | ${t('seo.articles.ogTitle')}`,
    ogDescription: article.value.excerpt_id,
    ogImage: imageUrl.value,
    ogUrl: pageUrl.value,
    ogType: 'article',
    articleAuthor: [article.value.author],
    articlePublishedTime: article.value.published_at,
    articleModifiedTime: new Date().toISOString(),
    articleSection: article.value.category,
    articleTag: [articleKeywords.value],
    twitterCard: 'summary_large_image',
    twitterTitle: `${article.value.title} | ${t('seo.articles.twitterTitle')}`,
    twitterDescription: article.value.excerpt_id,
    twitterImage: imageUrl.value,
    ogLocale: locale.value === 'en' ? 'en_US' : 'id_ID'
  })
})

/*
// Only set Schema.org when article is loaded
watchEffect(() => {
  if (!article.value) return
  
  useSchemaOrg([
    defineArticle({
      '@type': ['Article', 'BlogPosting'],
      'headline': article.value.title,
      'alternativeHeadline': article.value.excerpt_id,
      'description': article.value.excerpt_id,
      'author': {
        '@type': 'Person',
        'name': article.value.author,
        'url': `https://esperion.one/${localePrefix.value}/experts/${article.value.author.toLowerCase().replace(/\s+/g, '-')}`
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Esperion Digital Agency',
        'legalName': 'PT Esperion Teknologi Digital',
        'url': `https://esperion.one/${localePrefix.value}`,
        'logo': {
          '@type': 'ImageObject',
          'url': '/placeholders/first-party/brand-mark-required.svg',
          'width': 300,
          'height': 150
        }
      },
      'dateModified': new Date().toISOString(),
      'datePublished': article.value.published_at,
      'image': imageUrl.value,
      'thumbnailUrl': imageUrl.value,
      'wordCount': 1200,
      'articleBody': `${article.value.excerpt_id}. Content about ${article.value.title} discussed in detail with practical examples and implementation guides.`,
      'articleSection': [article.value.category],
      'keywords': [articleKeywords.value],
      'url': pageUrl.value,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageUrl.value
      }
    }),
    defineWebPage({
      name: article.value.title,
      description: article.value.excerpt_id,
      url: pageUrl.value,
      dateModified: new Date().toISOString(),
      datePublished: article.value.published_at
    }),
    defineBreadcrumb({
      itemListElement: [
        {
          '@type': 'ListItem',
          'position': 1,
          name: t('breadcrumb.home'),
          item: `https://esperion.one/${localePrefix.value}`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          name: t('breadcrumb.articles'),
          item: `https://esperion.one/${localePrefix.value}/articles`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          name: article.value.title,
          item: pageUrl.value
        }
      ]
    })
  ])
})
*/
</script>
