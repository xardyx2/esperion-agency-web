<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.articles.title') }}</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.description') }}</p>
      </div>
      <NuxtLink to="/dashboard/articles/new" class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-6 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark">
        <span class="mr-2 text-xl">+</span>
        {{ t('dashboard.articles.newButton') }}
      </NuxtLink>
    </div>

    <section class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
      <div class="flex flex-col gap-4 md:flex-row">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('dashboard.articles.search.placeholder')"
          class="flex-1 rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
        />
        <select v-model="selectedCategory" class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">
          <option value="">{{ t('dashboard.articles.filters.allCategories') }}</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <select v-model="selectedStatus" class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">
          <option value="">{{ t('dashboard.articles.filters.allTranslationStatus') }}</option>
          <option value="draft">{{ t('dashboard.articles.status.draft') }}</option>
          <option value="id_only">{{ t('dashboard.articles.status.id_only') }}</option>
          <option value="en_only">{{ t('dashboard.articles.status.en_only') }}</option>
          <option value="complete">{{ t('dashboard.articles.status.complete') }}</option>
        </select>
      </div>
    </section>

    <div v-if="pending" class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">
      {{ t('dashboard.articles.placeholders.loading') }}
    </div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
      {{ t('dashboard.articles.placeholders.error') }}
    </div>

    <section v-else class="overflow-hidden rounded-xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
      <table class="w-full">
        <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.columns.title') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.columns.category') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.columns.translation') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.columns.publish') }}</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.articles.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
          <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark">
            <td class="px-6 py-4 align-top">
              <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ article.title }}</div>
              <div class="mt-1 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                `{{ article.slug_id }}` / `{{ article.slug_en || article.slug_id }}`
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">{{ article.category }}</td>
            <td class="px-6 py-4">
              <span class="rounded-full px-3 py-1 text-xs font-semibold capitalize" :class="translationStatusClass(article.translation_status)">
                {{ article.translation_status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ article.published ? formatDate(article.published_at) : t('dashboard.articles.status.draft') }}
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/dashboard/articles/${article.id}`" class="rounded-lg px-3 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-primary dark:text-es-text-primary-dark dark:hover:bg-es-bg-primary-dark">
                  {{ t('dashboard.articles.buttons.edit') }}
                </NuxtLink>
                <button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" @click="removeArticle(article.id)">
                  {{ t('dashboard.articles.buttons.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filteredArticles.length" class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
        {{ t('dashboard.articles.placeholders.noResults') }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useArticlesApi } from '../../composables/useApi'
import type { Article } from '../../types/api'

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.articles.seo.title'),
  description: t('dashboard.articles.seo.description'),
})

const articlesApi = useArticlesApi()

const articles = ref<Article[]>([])
const pending = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const categories = computed(() => [...new Set(articles.value.map(article => article.category))].sort())

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const matchesSearch = [article.title, article.slug_id, article.slug_en || '']
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
    const matchesStatus = !selectedStatus.value || article.translation_status === selectedStatus.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const translationStatusClass = (status: string) => {
  if (status === 'complete') return 'bg-green-100 text-green-700'
  if (status === 'id_only' || status === 'en_only') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-700'
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const loadArticles = async () => {
  pending.value = true
  error.value = ''
  try {
    articles.value = await articlesApi.list({ limit: 100 })
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles.placeholders.error')
  }
  finally {
    pending.value = false
  }
}

const removeArticle = async (id: string) => {
  if (!(globalThis.confirm?.(t('dashboard.articles.buttons.deleteConfirm')) ?? true)) return
  pending.value = true
  error.value = ''
  try {
    await articlesApi.delete(id)
    await loadArticles()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles.placeholders.error')
  }
  finally {
    pending.value = false
  }
}

onMounted(loadArticles)
</script>
