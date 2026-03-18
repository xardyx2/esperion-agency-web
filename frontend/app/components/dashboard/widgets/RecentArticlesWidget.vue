<script setup lang="ts">
/**
 * RecentArticlesWidget - Display recent articles in dashboard widget grid
 * 
 * Features:
 * - Shows 5 most recent articles
 * - Article title, status badge, and date
 * - Click to navigate to article edit page
 * - "View all" link at bottom
 * - Empty state when no articles
 * - Dark mode support
 * 
 * @usage
 * ```vue
 * <RecentArticlesWidget />
 * ```
 */

interface Article {
  id: string
  title: string
  status: 'published' | 'draft' | 'scheduled' | 'archived'
  date: string
}

const articles = ref<Article[]>([
  { id: '1', title: 'Getting Started', status: 'published', date: '2024-01-15' },
  { id: '2', title: 'Best Practices', status: 'draft', date: '2024-01-14' },
  { id: '3', title: 'Advanced Techniques', status: 'published', date: '2024-01-13' },
  { id: '4', title: 'Common Mistakes', status: 'scheduled', date: '2024-01-16' },
  { id: '5', title: 'Quick Tips', status: 'archived', date: '2024-01-10' }
])

const router = useRouter()
const { t } = useI18n()

// Navigate to article edit page
const navigateToArticle = (articleId: string) => {
  router.push(`/dashboard/articles/${articleId}`)
}

// Navigate to all articles page
const navigateToAllArticles = () => {
  router.push('/dashboard/articles')
}

// Format date to readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Get status badge classes
const getStatusClasses = (status: Article['status']) => {
  const classes: Record<Article['status'], string> = {
    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[status] || classes.draft
}

// Translate status
const translateStatus = (status: Article['status']) => {
  const statusMap: Record<Article['status'], string> = {
    published: 'Published',
    draft: 'Draft',
    scheduled: 'Scheduled',
    archived: 'Archived'
  }
  return statusMap[status] || status
}
</script>

<template>
  <UCard
    :ui="{
      root: 'h-full rounded-2xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
      header: 'border-b border-es-border/70 px-4 py-3 dark:border-es-border-dark/70',
      body: 'p-0'
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
          Recent Articles
        </h3>
        <UIcon
          name="i-lucide-file-text"
          class="h-4 w-4 text-es-text-tertiary dark:text-es-text-tertiary-dark"
        />
      </div>
    </template>

    <div class="p-4">
      <!-- Empty State -->
      <div
        v-if="articles.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <UIcon
          name="i-lucide-inbox"
          class="mb-3 h-10 w-10 text-es-text-tertiary dark:text-es-text-tertiary-dark"
        />
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          No articles yet
        </p>
        <UButton
          variant="ghost"
          size="sm"
          class="mt-2 text-es-accent-primary dark:text-es-accent-primary-dark"
          @click="router.push('/dashboard/articles/new')"
        >
          Create your first article
        </UButton>
      </div>

      <!-- Article List -->
      <div v-else class="space-y-2">
        <button
          v-for="article in articles"
          :key="article.id"
          class="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-es-bg-tertiary/50 dark:hover:bg-es-bg-tertiary-dark/50"
          @click="navigateToArticle(article.id)"
        >
          <div class="flex-1 truncate text-left">
            <p class="truncate text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
              {{ article.title }}
            </p>
            <p class="mt-0.5 text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
              {{ formatDate(article.date) }}
            </p>
          </div>
          <span
            :class="[
              'ml-2 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium',
              getStatusClasses(article.status)
            ]"
          >
            {{ translateStatus(article.status) }}
          </span>
        </button>
      </div>

      <!-- View All Link -->
      <div
        v-if="articles.length > 0"
        class="mt-3 border-t border-es-border pt-3 dark:border-es-border-dark"
      >
        <UButton
          variant="ghost"
          size="sm"
          color="neutral"
          class="w-full rounded-lg text-xs font-medium"
          icon="i-lucide-arrow-right"
          trailing
          @click="navigateToAllArticles"
        >
          View all articles
        </UButton>
      </div>
    </div>
  </UCard>
</template>
