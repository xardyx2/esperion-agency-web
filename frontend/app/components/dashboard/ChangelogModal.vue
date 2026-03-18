<script setup lang="ts">
/**
 * ChangelogModal - "What's new" changelog for post-update notifications
 * 
 * @usage
 * ```vue
 * <ChangelogModal v-model:open="showChangelog" />
 * ```
 */

export interface ChangelogEntry {
  version: string
  date: string
  type: 'feature' | 'improvement' | 'bugfix' | 'breaking'
  title: string
  description: string
}

export interface ChangelogVersion {
  version: string
  date: string
  entries: ChangelogEntry[]
}

interface Props {
  modelValue?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const STORAGE_KEY = 'esperion-changelog-last-seen'

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value) => emit('update:modelValue', value)
})

const searchQuery = ref('')
const activeFilter = ref<'all' | 'feature' | 'improvement' | 'bugfix'>('all')

// Sample changelog data - in production, this would come from an API or JSON file
const changelog: ChangelogVersion[] = [
  {
    version: '2.5.0',
    date: '2026-03-18',
    entries: [
      {
        version: '2.5.0',
        date: '2026-03-18',
        type: 'feature',
        title: 'Command Palette',
        description: 'Press ⌘K to quickly navigate, search, and perform actions from anywhere in the dashboard.'
      },
      {
        version: '2.5.0',
        date: '2026-03-18',
        type: 'feature',
        title: 'Bulk Actions',
        description: 'Select multiple items and perform actions like delete, publish, or export all at once.'
      },
      {
        version: '2.5.0',
        date: '2026-03-18',
        type: 'feature',
        title: 'Keyboard Shortcuts',
        description: 'Press ? to see all available keyboard shortcuts for faster navigation.'
      },
      {
        version: '2.5.0',
        date: '2026-03-18',
        type: 'improvement',
        title: 'Enhanced Empty States',
        description: 'All pages now have helpful empty states with quick tips and documentation links.'
      }
    ]
  },
  {
    version: '2.4.0',
    date: '2026-03-10',
    entries: [
      {
        version: '2.4.0',
        date: '2026-03-10',
        type: 'feature',
        title: 'Bilingual Content Editor',
        description: 'New split-view editor for creating content in both Indonesian and English simultaneously.'
      },
      {
        version: '2.4.0',
        date: '2026-03-10',
        type: 'feature',
        title: 'Auto-Save',
        description: 'Content is automatically saved every 30 seconds and when you pause typing.'
      },
      {
        version: '2.4.0',
        date: '2026-03-10',
        type: 'improvement',
        title: 'SEO Panel',
        description: 'Real-time SEO analysis with score, suggestions, and social media previews.'
      },
      {
        version: '2.4.0',
        date: '2026-03-10',
        type: 'bugfix',
        title: 'Mobile Navigation',
        description: 'Fixed sidebar behavior on mobile devices for smoother navigation.'
      }
    ]
  },
  {
    version: '2.3.0',
    date: '2026-03-01',
    entries: [
      {
        version: '2.3.0',
        date: '2026-03-01',
        type: 'feature',
        title: 'Dark Mode',
        description: 'Full dark mode support across the entire dashboard interface.'
      },
      {
        version: '2.3.0',
        date: '2026-03-01',
        type: 'improvement',
        title: 'Dashboard Redesign',
        description: 'Modern, template-inspired dashboard shell with collapsible sidebar.'
      },
      {
        version: '2.3.0',
        date: '2026-03-01',
        type: 'improvement',
        title: 'Performance',
        description: 'Significant performance improvements with faster page loads.'
      }
    ]
  }
]

const filteredChangelog = computed(() => {
  let versions = [...changelog]
  
  // Filter by type
  if (activeFilter.value !== 'all') {
    versions = versions.map(v => ({
      ...v,
      entries: v.entries.filter(e => e.type === activeFilter.value)
    })).filter(v => v.entries.length > 0)
  }
  
  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    versions = versions.map(v => ({
      ...v,
      entries: v.entries.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      )
    })).filter(v => v.entries.length > 0)
  }
  
  return versions
})

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature': return 'i-lucide-sparkles'
    case 'improvement': return 'i-lucide-arrow-up-circle'
    case 'bugfix': return 'i-lucide-bug-off'
    case 'breaking': return 'i-lucide-alert-triangle'
    default: return 'i-lucide-circle'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature': return 'text-purple-600 dark:text-purple-400'
    case 'improvement': return 'text-blue-600 dark:text-blue-400'
    case 'bugfix': return 'text-green-600 dark:text-green-400'
    case 'breaking': return 'text-red-600 dark:text-red-400'
    default: return 'text-es-text-secondary dark:text-es-text-secondary-dark'
  }
}

const getTypeBg = (type: string) => {
  switch (type) {
    case 'feature': return 'bg-purple-100 dark:bg-purple-900/30'
    case 'improvement': return 'bg-blue-100 dark:bg-blue-900/30'
    case 'bugfix': return 'bg-green-100 dark:bg-green-900/30'
    case 'breaking': return 'bg-red-100 dark:bg-red-900/30'
    default: return 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark'
  }
}

// Mark as seen
const markAsSeen = () => {
  localStorage.setItem(STORAGE_KEY, new Date().toISOString())
}

// Close and mark as seen
const handleClose = () => {
  markAsSeen()
  isOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="handleClose"
      >
        <div
          class="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform px-4"
          @click.stop
        >
          <div class="overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary shadow-2xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
            <!-- Header -->
            <div class="border-b border-es-border bg-gradient-to-r from-es-accent-primary/5 to-es-accent-secondary/5 px-6 py-4 dark:border-es-border-dark dark:from-es-accent-primary-dark/5 dark:to-es-accent-secondary-dark/5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10">
                    <UIcon name="i-lucide-newspaper" class="h-5 w-5 text-es-accent-primary dark:text-es-accent-primary-dark" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                      What's New
                    </h2>
                    <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                      Latest updates and improvements
                    </p>
                  </div>
                </div>
                <button
                  class="rounded-lg p-2 text-es-text-secondary hover:bg-es-bg-tertiary dark:text-es-text-secondary-dark dark:hover:bg-es-bg-tertiary-dark"
                  @click="handleClose"
                >
                  <UIcon name="i-lucide-x" class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Search & Filter -->
            <div class="border-b border-es-border px-6 py-3 dark:border-es-border-dark">
              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <UIcon
                    name="i-lucide-search"
                    class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-es-text-secondary dark:text-es-text-secondary-dark"
                  />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search updates..."
                    class="w-full rounded-lg border border-es-border bg-es-bg-primary py-2 pl-10 pr-4 text-sm text-es-text-primary placeholder:text-es-text-tertiary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:placeholder:text-es-text-tertiary-dark dark:focus:border-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  />
                </div>
                <div class="flex items-center gap-1 rounded-lg border border-es-border bg-es-bg-primary p-1 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
                  <button
                    v-for="filter in ['all', 'feature', 'improvement', 'bugfix'] as const"
                    :key="filter"
                    :class="[
                      'rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                      activeFilter === filter
                        ? 'bg-es-accent-primary text-white dark:bg-es-accent-primary-dark'
                        : 'text-es-text-secondary hover:bg-es-bg-tertiary dark:text-es-text-secondary-dark dark:hover:bg-es-bg-tertiary-dark'
                    ]"
                    @click="activeFilter = filter"
                  >
                    {{ filter }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="max-h-[50vh] overflow-y-auto p-6">
              <!-- No results -->
              <div
                v-if="filteredChangelog.length === 0"
                class="py-8 text-center"
              >
                <UIcon name="i-lucide-search-x" class="mx-auto mb-2 h-8 w-8 text-es-text-tertiary dark:text-es-text-tertiary-dark" />
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  No updates found
                </p>
              </div>
              
              <!-- Versions -->
              <div v-else class="space-y-6">
                <div
                  v-for="version in filteredChangelog"
                  :key="version.version"
                >
                  <!-- Version header -->
                  <div class="mb-3 flex items-center gap-3">
                    <span class="rounded-lg bg-es-accent-primary/10 px-2.5 py-1 text-sm font-semibold text-es-accent-primary dark:bg-es-accent-primary-dark/10 dark:text-es-accent-primary-dark">
                      v{{ version.version }}
                    </span>
                    <span class="text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
                      {{ new Date(version.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                    </span>
                  </div>
                  
                  <!-- Entries -->
                  <div class="space-y-3">
                    <div
                      v-for="entry in version.entries"
                      :key="entry.title"
                      class="flex gap-3 rounded-xl border border-es-border bg-es-bg-primary p-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
                    >
                      <div
                        :class="[
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          getTypeBg(entry.type)
                        ]"
                      >
                        <UIcon
                          :name="getTypeIcon(entry.type)"
                          :class="['h-4 w-4', getTypeColor(entry.type)]"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <h3 class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                            {{ entry.title }}
                          </h3>
                          <span
                            :class="[
                              'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                              getTypeBg(entry.type),
                              getTypeColor(entry.type)
                            ]"
                          >
                            {{ entry.type }}
                          </span>
                        </div>
                        <p class="mt-1 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                          {{ entry.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="border-t border-es-border bg-es-bg-primary px-6 py-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
              <div class="flex items-center justify-between">
                <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  <UIcon name="i-lucide-info" class="mr-1 inline h-3 w-3" />
                  Updates are automatically applied
                </p>
                <UButton
                  size="sm"
                  color="primary"
                  @click="handleClose"
                >
                  Got it
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
