<script setup lang="ts">
/**
 * UDashboardFilterBar - Filter bar for dashboard list pages
 * 
 * @usage
 * ```vue
 * <UDashboardFilterBar
 *   v-model:search="searchQuery"
 *   v-model:filters="activeFilters"
 *   :filter-options="filterOptions"
 *   @search="handleSearch"
 * >
 *   <template #actions>
 *     <UButton>Export</UButton>
 *   </template>
 * </UDashboardFilterBar>
 * ```
 */

import { ref, computed } from 'vue'

export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'date' | 'checkbox'
  options?: { label: string; value: string }[]
}

interface Props {
  searchPlaceholder?: string
  filterOptions?: FilterOption[]
  showSearch?: boolean
  showFilters?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search...',
  showSearch: true,
  showFilters: true,
  loading: false
})

const emit = defineEmits<{
  search: [value: string]
  'update:search': [value: string]
  'update:filters': [value: Record<string, any>]
}>()

const search = defineModel<string>('search', { default: '' })
const filters = defineModel<Record<string, any>>('filters', { default: () => ({}) })

const showFilterPanel = ref(false)
const searchInput = ref<HTMLInputElement>()

const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter(v => v !== undefined && v !== '' && v !== null).length
})

const clearFilters = () => {
  filters.value = {}
  emit('update:filters', {})
}

const clearSearch = () => {
  search.value = ''
  emit('update:search', '')
  emit('search', '')
}

// Keyboard shortcut: / to focus search
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== searchInput.value) {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <!-- Search and Filters -->
    <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <!-- Search Input -->
      <div
        v-if="showSearch"
        class="relative flex-1 max-w-md"
      >
        <UIcon
          name="i-lucide-search"
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-es-text-tertiary dark:text-es-text-tertiary-dark"
        />
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full rounded-xl border border-es-border bg-es-bg-primary py-2.5 pl-10 pr-10 text-sm text-es-text-primary placeholder-es-text-tertiary focus:border-es-accent-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary/20 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:placeholder-es-text-tertiary-dark dark:focus:border-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark/20"
          @input="$emit('search', search)"
        />
        <button
          v-if="search"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-es-text-tertiary hover:text-es-text-secondary dark:text-es-text-tertiary-dark dark:hover:text-es-text-secondary-dark"
          @click="clearSearch"
        >
          <UIcon name="i-lucide-x" class="h-4 w-4" />
        </button>
        <span
          v-else
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark"
        >
          /
        </span>
      </div>
      
      <!-- Filter Toggle -->
      <UButton
        v-if="showFilters && filterOptions?.length"
        color="neutral"
        variant="outline"
        class="rounded-xl border-es-border dark:border-es-border-dark"
        :class="{ 'border-es-accent-primary dark:border-es-accent-primary-dark': activeFilterCount > 0 }"
        @click="showFilterPanel = !showFilterPanel"
      >
        <UIcon name="i-lucide-filter" class="h-4 w-4" />
        <span>Filters</span>
        <UBadge
          v-if="activeFilterCount > 0"
          color="primary"
          variant="solid"
          size="xs"
          class="ml-1"
        >
          {{ activeFilterCount }}
        </UBadge>
      </UButton>
      
      <!-- Clear Filters -->
      <UButton
        v-if="activeFilterCount > 0"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      >
        Clear
      </UButton>
    </div>
    
    <!-- Actions slot -->
    <div
      v-if="$slots.actions"
      class="flex items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </div>
  
  <!-- Filter Panel -->
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="showFilterPanel && filterOptions?.length"
      class="mt-3 rounded-xl border border-es-border bg-es-bg-primary p-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="filter in filterOptions"
          :key="filter.key"
          class="space-y-1.5"
        >
          <label class="text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ filter.label }}
          </label>
          
          <USelect
            v-if="filter.type === 'select'"
            v-model="filters[filter.key]"
            :options="filter.options"
            placeholder="All"
            class="w-full"
            @update:model-value="$emit('update:filters', filters)"
          />
          
          <UInput
            v-else-if="filter.type === 'date'"
            v-model="filters[filter.key]"
            type="date"
            class="w-full"
            @update:model-value="$emit('update:filters', filters)"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
