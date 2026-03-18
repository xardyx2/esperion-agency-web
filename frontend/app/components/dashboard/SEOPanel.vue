<script setup lang="ts">
/**
 * SEOPanel - Live SEO analysis panel for content editor
 * 
 * @usage
 * ```vue
 * <SEOPanel
 *   :title="articleTitle"
 *   :content="articleContent"
 *   v-model:focus-keyword="focusKeyword"
 *   v-model:seo-title="seoTitle"
 *   v-model:meta-description="metaDescription"
 * />
 * ```
 */

export interface SEOAnalysis {
  score: number
  wordCount: number
  headingStructure: {
    h1: number
    h2: number
    h3: number
  }
  internalLinks: number
  externalLinks: number
  imagesWithAlt: number
  imagesWithoutAlt: number
  keywordDensity: number
  readability: number
}

interface Props {
  title: string
  content: string
  focusKeyword: string
  seoTitle: string
  metaDescription: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:focusKeyword': [value: string]
  'update:seoTitle': [value: string]
  'update:metaDescription': [value: string]
  analyze: []
}>()

// Local state for inputs
const localFocusKeyword = computed({
  get: () => props.focusKeyword,
  set: (val) => emit('update:focusKeyword', val)
})

const localSeoTitle = computed({
  get: () => props.seoTitle,
  set: (val) => emit('update:seoTitle', val)
})

const localMetaDescription = computed({
  get: () => props.metaDescription,
  set: (val) => emit('update:metaDescription', val)
})

// Computed analysis
const analysis = computed<SEOAnalysis>(() => {
  const text = `${props.title} ${props.content}`
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length
  
  // Count headings (simple regex for HTML tags)
  const h1Count = (text.match(/<h1/gi) || []).length
  const h2Count = (text.match(/<h2/gi) || []).length
  const h3Count = (text.match(/<h3/gi) || []).length
  
  // Count links
  const internalLinks = (text.match(/href="\//gi) || []).length
  const externalLinks = (text.match(/href="https?:\/\//gi) || []).length
  
  // Count images
  const totalImages = (text.match(/<img/gi) || []).length
  const imagesWithAlt = (text.match(/alt="[^"]+"/gi) || []).length
  
  // Keyword density
  const keyword = props.focusKeyword.toLowerCase()
  const keywordCount = keyword ? words.filter(w => w.toLowerCase().includes(keyword)).length : 0
  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0
  
  // Calculate score
  let score = 50 // Base score
  
  // Content length (ideal: 300+ words)
  if (wordCount >= 300) score += 10
  if (wordCount >= 600) score += 10
  
  // Title length (ideal: 50-60 chars)
  const seoTitleLen = props.seoTitle.length
  if (seoTitleLen >= 50 && seoTitleLen <= 60) score += 10
  
  // Meta description (ideal: 120-160 chars)
  const metaLen = props.metaDescription.length
  if (metaLen >= 120 && metaLen <= 160) score += 10
  
  // Keyword in title
  if (keyword && props.seoTitle.toLowerCase().includes(keyword)) score += 5
  
  // Has headings
  if (h2Count > 0) score += 5
  
  // Images with alt
  if (totalImages > 0 && imagesWithAlt === totalImages) score += 5
  
  // Keyword density (ideal: 1-2%)
  if (keywordDensity >= 1 && keywordDensity <= 2) score += 5
  
  return {
    score: Math.min(100, Math.max(0, score)),
    wordCount,
    headingStructure: { h1: h1Count, h2: h2Count, h3: h3Count },
    internalLinks,
    externalLinks,
    imagesWithAlt,
    imagesWithoutAlt: totalImages - imagesWithAlt,
    keywordDensity,
    readability: 70 // Placeholder
  }
})

// Score color
const scoreColor = computed(() => {
  if (analysis.value.score >= 80) return 'success'
  if (analysis.value.score >= 60) return 'warning'
  return 'error'
})

// SEO Checks
const seoChecks = computed(() => [
  { 
    label: 'Title length (50-60 chars)', 
    passed: props.seoTitle.length >= 50 && props.seoTitle.length <= 60,
    value: `${props.seoTitle.length} chars`
  },
  { 
    label: 'Meta description (120-160 chars)', 
    passed: props.metaDescription.length >= 120 && props.metaDescription.length <= 160,
    value: `${props.metaDescription.length} chars`
  },
  { 
    label: 'Content length (300+ words)', 
    passed: analysis.value.wordCount >= 300,
    value: `${analysis.value.wordCount} words`
  },
  { 
    label: 'Focus keyword in title', 
    passed: props.focusKeyword ? props.seoTitle.toLowerCase().includes(props.focusKeyword.toLowerCase()) : false,
    value: props.focusKeyword ? 'Found' : 'No keyword'
  },
  { 
    label: 'Has H2 headings', 
    passed: analysis.value.headingStructure.h2 > 0,
    value: `${analysis.value.headingStructure.h2} H2 tags`
  },
  { 
    label: 'Images with alt text', 
    passed: analysis.value.imagesWithoutAlt === 0,
    value: `${analysis.value.imagesWithAlt}/${analysis.value.imagesWithAlt + analysis.value.imagesWithoutAlt} images`
  },
  { 
    label: 'Keyword density (1-2%)', 
    passed: analysis.value.keywordDensity >= 1 && analysis.value.keywordDensity <= 2,
    value: `${analysis.value.keywordDensity.toFixed(1)}%`
  }
])

// Social preview
const socialPreview = computed(() => {
  const url = 'esperion.id/articles/your-article-slug'
  return {
    url,
    title: props.seoTitle || props.title,
    description: props.metaDescription
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark">
        SEO Analysis
      </h3>
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        class="rounded-full"
        @click="$emit('analyze')"
      >
        <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-1" />
        Refresh
      </UButton>
    </div>

    <!-- Score Ring -->
    <div class="flex items-center gap-4">
      <div class="relative flex h-20 w-20 items-center justify-center">
        <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <path
            class="text-es-bg-tertiary dark:text-es-bg-tertiary-dark"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            :class="{
              'text-green-500': scoreColor === 'success',
              'text-yellow-500': scoreColor === 'warning',
              'text-red-500': scoreColor === 'error'
            }"
            :stroke-dasharray="`${analysis.score}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          />
        </svg>
        <span class="absolute text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
          {{ analysis.score }}
        </span>
      </div>
      <div>
        <p class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
          {{ analysis.score >= 80 ? 'Great!' : analysis.score >= 60 ? 'Good' : 'Needs Improvement' }}
        </p>
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ analysis.wordCount }} words
        </p>
      </div>
    </div>

    <!-- Focus Keyword -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
        Focus Keyword
      </label>
      <input
        v-model="localFocusKeyword"
        type="text"
        placeholder="Enter your focus keyword..."
        class="w-full rounded-lg border border-es-border bg-es-bg-primary px-3 py-2 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
      >
      <p class="text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
        Density: {{ analysis.keywordDensity.toFixed(1) }}%
      </p>
    </div>

    <!-- SEO Title -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
        SEO Title
      </label>
      <input
        v-model="localSeoTitle"
        type="text"
        placeholder="Enter SEO title..."
        class="w-full rounded-lg border border-es-border bg-es-bg-primary px-3 py-2 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
      >
      <div class="flex justify-between text-xs">
        <span :class="localSeoTitle.length > 60 ? 'text-es-error' : 'text-es-text-tertiary'">
          {{ localSeoTitle.length }}/60 characters
        </span>
      </div>
    </div>

    <!-- Meta Description -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
        Meta Description
      </label>
      <textarea
        v-model="localMetaDescription"
        rows="3"
        placeholder="Enter meta description..."
        class="w-full rounded-lg border border-es-border bg-es-bg-primary px-3 py-2 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark resize-none"
      />
      <div class="flex justify-between text-xs">
        <span :class="localMetaDescription.length > 160 ? 'text-es-error' : 'text-es-text-tertiary'">
          {{ localMetaDescription.length }}/160 characters
        </span>
      </div>
    </div>

    <!-- SEO Checks -->
    <div class="space-y-2">
      <h4 class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
        SEO Checklist
      </h4>
      <div class="space-y-1">
        <div
          v-for="check in seoChecks"
          :key="check.label"
          class="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
          :class="check.passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark'"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="check.passed ? 'i-lucide-check-circle' : 'i-lucide-circle'"
              class="h-4 w-4"
              :class="check.passed ? 'text-green-500' : 'text-es-text-tertiary'"
            />
            <span :class="check.passed ? 'text-green-700 dark:text-green-400' : 'text-es-text-secondary dark:text-es-text-secondary-dark'">
              {{ check.label }}
            </span>
          </div>
          <span class="text-xs text-es-text-tertiary">
            {{ check.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Social Preview -->
    <div class="space-y-2">
      <h4 class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
        Search Preview
      </h4>
      <div class="rounded-lg border border-es-border bg-es-bg-primary p-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
        <p class="text-xs text-green-600 dark:text-green-400 truncate">
          {{ socialPreview.url }}
        </p>
        <p class="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
          {{ socialPreview.title || 'No title set' }}
        </p>
        <p class="mt-0.5 text-xs text-es-text-secondary dark:text-es-text-secondary-dark line-clamp-2">
          {{ socialPreview.description || 'No description set' }}
        </p>
      </div>
    </div>
  </div>
</template>
