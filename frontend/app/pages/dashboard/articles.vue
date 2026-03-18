<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="Content management"
      :title="t('dashboard.articles.title')"
      :description="t('dashboard.articles.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          :to="localePath('/dashboard/articles/new')"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
          {{ t('dashboard.articles.newButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Filter Bar -->
    <UDashboardSection class="!p-0">
      <UDashboardFilterBar
        v-model:search="searchQuery"
        v-model:filters="filters"
        :filter-options="filterOptions"
        search-placeholder="Search articles by title, slug..."
        @search="handleSearch"
      />
    </UDashboardSection>

    <!-- Loading State -->
    <UDashboardSection v-if="pending" class="overflow-hidden">
      <UDashboardSkeleton type="table" :rows="5" :columns="6" />
    </UDashboardSection>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-3xl border border-red-200 bg-red-50 px-4 py-6"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Bulk Actions Toolbar -->
    <UDashboardBulkActionsToolbar
      v-if="!pending && !error"
      :selected-count="selectedCount"
      :total-count="filteredArticles.length"
      :actions="bulkActions"
      @clear="clearSelection"
      @select-all="toggleAllSelection"
    />

    <!-- Content Section -->
    <UDashboardSection
      v-if="!pending && !error"
      :badge="filteredArticles.length"
      class="overflow-hidden"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Articles
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              All Articles
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ filteredArticles.length }} items
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!filteredArticles.length"
        icon="i-lucide-file-text"
        title="No articles found"
        description="Try adjusting your search or filters, or create your first article to get started."
        :primary-action="{ label: 'Create Article', to: '/dashboard/articles/new', icon: 'i-lucide-plus' }"
        :secondary-actions="[
          { label: 'Clear Filters', icon: 'i-lucide-x', variant: 'ghost', onClick: clearFilters }
        ]"
        :tips="[
          'Use the search bar to find specific articles',
          'Filter by category or translation status',
          `Click 'New Article' to create content`
        ]"
      />

      <!-- Articles Table with Virtual Scroll -->
      <div
        v-else
        ref="virtualScrollContainer"
        class="overflow-x-auto"
        :style="{ maxHeight: '600px', overflowY: 'auto' }"
        @scroll="handleVirtualScroll"
      >
        <table class="w-full">
          <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark sticky top-0 z-10">
            <tr>
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :disabled="!filteredArticles.length"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleAllSelection"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles.columns.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles.columns.category') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles.columns.translation') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles.columns.publish') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles.columns.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <!-- Spacer for virtual scroll -->
            <tr v-if="virtualScrollSpacerHeight > 0">
              <td :style="{ height: `${virtualScrollSpacerHeight}px` }" class="p-0"></td>
            </tr>
            <!-- Visible rows only -->
            <tr
              v-for="article in visibleArticles"
              :key="article.id"
              :class="[
                'transition-colors',
                selectedIds.has(article.id) ? 'bg-es-accent-primary/5 dark:bg-es-accent-primary-dark/5' : 'hover:bg-es-bg-tertiary/50 dark:hover:bg-es-bg-tertiary-dark/50'
              ]"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(article.id)"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleSelection(article.id, $event as MouseEvent)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                    <UIcon name="i-lucide-file-text" class="h-5 w-5" />
                  </div>
                  <div>
                    <UInlineEdit
                      v-model="article.title"
                      type="text"
                      placeholder="Article title"
                      @save="(value, prev) => handleInlineEdit(article.id, 'title', value, prev)"
                    />
                    <div class="mt-0.5 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ article.slug_id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                <UInlineEdit
                  v-model="article.category"
                  type="text"
                  placeholder="Category"
                  @save="(value, prev) => handleInlineEdit(article.id, 'category', value, prev)"
                />
              </td>
              <td class="px-6 py-4">
                <UBadge
                  :color="translationStatusColor(article.translation_status)"
                  variant="soft"
                  size="sm"
                >
                  {{ article.translation_status.replace('_', ' ') }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                <div class="flex items-center gap-2">
                  <UIcon
                    :name="article.published ? 'i-lucide-check-circle' : 'i-lucide-circle'"
                    class="h-4 w-4"
                    :class="article.published ? 'text-green-500' : 'text-es-text-tertiary'"
                  />
                  {{ article.published ? formatDate(article.published_at) : t('dashboard.articles.status.draft') }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :to="`/dashboard/articles/${article.id}`"
                  >
                    <UIcon name="i-lucide-pencil" class="h-4 w-4 mr-1" />
                    {{ t('dashboard.articles.buttons.edit') }}
                  </UButton>
                  <UButton
                    color="error"
                    variant="ghost"
                    size="sm"
                    @click="removeArticle(article.id)"
                  >
                    <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useArticlesApi } from '../../composables/useApi'
import type { Article } from '../../types/api'

// Virtual scroll configuration
const ROW_HEIGHT = 64 // pixels per row (including borders)
const BUFFER_SIZE = 5 // rows to render above/below viewport
const VIRTUAL_SCROLL_THRESHOLD = 50 // enable virtual scroll for 50+ items

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('dashboard.articles.seo.title'),
  description: t('dashboard.articles.seo.description')
})

const articlesApi = useArticlesApi()

const articles = ref<Article[]>([])
const pending = ref(false)
const error = ref('')
const searchQuery = ref('')
const filters = ref({
  category: '',
  status: ''
})
const lastSelectedId = ref<string | null>(null)

// Smart Search
const { 
  parsedQuery, 
  recentSearches,
  setQuery: setSmartQuery,
  clearQuery: clearSmartQuery 
} = useSmartSearch({
  onSearch: (parsed) => {
    // Apply parsed operators to filter
    parsed.operators.forEach(op => {
      if (op.type === 'field') {
        if (op.field === 'category') {
          filters.value.category = String(op.value)
        } else if (op.field === 'status') {
          filters.value.status = String(op.value)
        }
      }
    })
  }
})

const handleSmartSearch = (value: string) => {
  searchQuery.value = value
  setSmartQuery(value)
}

// Bulk selection state with persistence
const {
  selectedIds,
  selectedCount,
  toggleSelection: togglePersistentSelection,
  selectAll: selectAllPersistent,
  deselectAll: deselectAllPersistent,
  isAllSelected: checkIsAllSelected,
  clearPersistedSelection
} = usePersistentSelection({
  key: 'articles',
  maxAge: 60 * 60 * 1000 // 1 hour
})

const isAllSelected = computed(() => {
  return checkIsAllSelected(filteredArticles.value.map(a => a.id))
})

const toggleSelection = (id: string, event?: MouseEvent) => {
  // Handle shift+click for range selection
  if (event?.shiftKey && lastSelectedId.value) {
    const ids = filteredArticles.value.map(a => a.id)
    const lastIndex = ids.indexOf(lastSelectedId.value)
    const currentIndex = ids.indexOf(id)
    
    if (lastIndex !== -1 && currentIndex !== -1) {
      const start = Math.min(lastIndex, currentIndex)
      const end = Math.max(lastIndex, currentIndex)
      
      for (let i = start; i <= end; i++) {
        togglePersistentSelection(ids[i], false)
      }
      lastSelectedId.value = id
      return
    }
  }
  
  // Normal toggle
  togglePersistentSelection(id, true, filteredArticles.value.length)
  lastSelectedId.value = id
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    deselectAllPersistent(filteredArticles.value.map(a => a.id))
  } else {
    selectAllPersistent(filteredArticles.value.map(a => a.id), true, filteredArticles.value.length)
  }
}

const clearSelection = () => {
  clearPersistedSelection()
  lastSelectedId.value = null
}

// Bulk actions
const bulkActions = computed(() => [
  { 
    label: 'Delete', 
    icon: 'i-lucide-trash-2', 
    color: 'error' as const,
    onClick: () => handleBulkAction('delete')
  },
  { 
    label: 'Publish', 
    icon: 'i-lucide-check-circle', 
    color: 'success' as const,
    onClick: () => handleBulkAction('publish')
  },
  { 
    label: 'Unpublish', 
    icon: 'i-lucide-x-circle', 
    color: 'neutral' as const,
    onClick: () => handleBulkAction('unpublish')
  },
  { 
    label: 'Export', 
    icon: 'i-lucide-download', 
    color: 'primary' as const,
    onClick: () => handleBulkAction('export')
  }
])

const handleInlineEdit = async (id: string, field: string, value: any, previousValue: any) => {
  try {
    await articlesApi.update(id, { [field]: value })
    // Show toast with undo option
    const toast = useToast()
    toast.add({
      title: 'Updated',
      description: `${field} updated successfully`,
      color: 'success',
      actions: [
        {
          label: 'Undo',
          click: async () => {
            await articlesApi.update(id, { [field]: previousValue })
            await loadArticles()
            toast.add({
              title: 'Restored',
              description: `${field} restored to previous value`,
              color: 'info'
            })
          }
        }
      ]
    })
  } catch (err) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to update',
      color: 'error'
    })
    // Revert to previous value
    await loadArticles()
  }
}

const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish' | 'export') => {
  const ids = Array.from(selectedIds.value)
  
  switch (action) {
    case 'delete':
      if (confirm(`Delete ${ids.length} articles?`)) {
        // Implement bulk delete
        for (const id of ids) {
          await articlesApi.delete(id)
        }
        clearSelection()
        await loadArticles()
      }
      break
    case 'publish':
      // Implement bulk publish
      clearSelection()
      await loadArticles()
      break
    case 'unpublish':
      // Implement bulk unpublish
      clearSelection()
      await loadArticles()
      break
    case 'export':
      // Implement export
      const data = articles.value.filter(a => selectedIds.value.has(a.id))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `articles-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      clearSelection()
      break
  }
}

const filterOptions = [
  {
    key: 'category',
    label: 'Category',
    type: 'select' as const,
    options: computed(() => [
      { label: 'All Categories', value: '' },
      ...[...new Set(articles.value.map(a => a.category))].sort().map(c => ({ label: c, value: c }))
    ])
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'All Status', value: '' },
      { label: 'Draft', value: 'draft' },
      { label: 'ID Only', value: 'id_only' },
      { label: 'EN Only', value: 'en_only' },
      { label: 'Complete', value: 'complete' }
    ]
  }
]

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const matchesSearch = [article.title, article.slug_id, article.slug_en || '']
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filters.value.category || article.category === filters.value.category
    const matchesStatus = !filters.value.status || article.translation_status === filters.value.status
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// Virtual Scroll for large lists
const virtualScrollContainer = ref<HTMLElement | null>(null)
const virtualScrollStartIndex = ref(0)
const virtualScrollEndIndex = ref(0)
const virtualScrollSpacerHeight = ref(0)

// Enable virtual scroll only for large lists
const useVirtualScroll = computed(() => filteredArticles.value.length >= VIRTUAL_SCROLL_THRESHOLD)

// Get visible articles based on scroll position
const visibleArticles = computed(() => {
  if (!useVirtualScroll.value) {
    return filteredArticles.value
  }
  return filteredArticles.value.slice(virtualScrollStartIndex.value, virtualScrollEndIndex.value)
})

// Calculate visible range based on scroll position
const calculateVisibleRange = () => {
  const container = virtualScrollContainer.value
  if (!container) return

  const scrollTop = container.scrollTop
  const containerHeight = container.clientHeight
  
  // Calculate visible range with buffer
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE)
  const end = Math.min(
    filteredArticles.value.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_SIZE
  )

  virtualScrollStartIndex.value = start
  virtualScrollEndIndex.value = end
  virtualScrollSpacerHeight.value = start * ROW_HEIGHT
}

// Handle scroll events
const handleVirtualScroll = () => {
  if (useVirtualScroll.value) {
    calculateVisibleRange()
  }
}

// Watch for filter changes to reset scroll position
watch([searchQuery, filters], () => {
  if (virtualScrollContainer.value) {
    virtualScrollContainer.value.scrollTop = 0
  }
  calculateVisibleRange()
}, { deep: true })

// Initialize virtual scroll after data loads
watch(() => filteredArticles.value.length, () => {
  nextTick(() => {
    calculateVisibleRange()
  })
})

const translationStatusColor = (status: string) => {
  if (status === 'complete') return 'success' as const
  if (status === 'id_only' || status === 'en_only') return 'info' as const
  return 'warning' as const
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = { category: '', status: '' }
}

const handleSearch = (value: string) => {
  searchQuery.value = value
}

const loadArticles = async () => {
  pending.value = true
  error.value = ''
  try {
    articles.value = await articlesApi.list({ limit: 100 })
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles.placeholders.error')
  } finally {
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
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles.placeholders.error')
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  await loadArticles()
  nextTick(() => {
    calculateVisibleRange()
  })
})
</script>
