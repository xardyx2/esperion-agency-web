<script setup lang="ts">
/**
 * ShortcutsHelpModal - Keyboard shortcuts reference modal
 * 
 * @usage
 * ```vue
 * <ShortcutsHelpModal v-model:open="showShortcuts" />
 * ```
 * 
 * Press '?' to open
 */

export interface Shortcut {
  keys: string[]
  description: string
  category: 'navigation' | 'action' | 'editor'
}

interface Props {
  modelValue?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value) => emit('update:modelValue', value)
})

const searchQuery = ref('')

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'navigation' },
  { keys: ['⌘', 'K'], description: 'Open command palette', category: 'navigation' },
  { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'navigation' },
  { keys: ['G', 'A'], description: 'Go to Analytics', category: 'navigation' },
  { keys: ['G', 'B'], description: 'Go to Articles', category: 'navigation' },
  { keys: ['G', 'W'], description: 'Go to Works', category: 'navigation' },
  { keys: ['G', 'M'], description: 'Go to Media', category: 'navigation' },
  { keys: ['G', 'S'], description: 'Go to Services', category: 'navigation' },
  { keys: ['G', 'C'], description: 'Go to Clients', category: 'navigation' },
  { keys: ['G', 'U'], description: 'Go to Users', category: 'navigation' },
  { keys: ['G', 'T'], description: 'Go to Settings', category: 'navigation' },
  
  // Actions
  { keys: ['N', 'A'], description: 'New Article', category: 'action' },
  { keys: ['N', 'W'], description: 'New Work', category: 'action' },
  { keys: ['N', 'S'], description: 'New Service', category: 'action' },
  { keys: ['N', 'C'], description: 'New Client', category: 'action' },
  { keys: ['N', 'M'], description: 'New Media', category: 'action' },
  { keys: ['T'], description: 'Toggle theme', category: 'action' },
  { keys: ['L'], description: 'Log out', category: 'action' },
  { keys: ['/'], description: 'Focus search', category: 'action' },
  { keys: ['Esc'], description: 'Close modal / Cancel', category: 'action' },
  
  // Editor
  { keys: ['⌘', '1'], description: 'Single view mode', category: 'editor' },
  { keys: ['⌘', '2'], description: 'Split view mode', category: 'editor' },
  { keys: ['⌘', 'Tab'], description: 'Switch language', category: 'editor' },
  { keys: ['⌘', 'S'], description: 'Save content', category: 'editor' },
  { keys: ['Ctrl', 'Enter'], description: 'Publish article', category: 'editor' }
]

const filteredShortcuts = computed(() => {
  if (!searchQuery.value.trim()) return shortcuts
  
  const query = searchQuery.value.toLowerCase()
  return shortcuts.filter(shortcut => 
    shortcut.description.toLowerCase().includes(query) ||
    shortcut.keys.some(key => key.toLowerCase().includes(query)) ||
    shortcut.category.toLowerCase().includes(query)
  )
})

const groupedShortcuts = computed(() => {
  const groups: Record<string, Shortcut[]> = {}
  filteredShortcuts.value.forEach(shortcut => {
    const category = shortcut.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category]!.push(shortcut)
  })
  return groups
})

const categoryLabels: Record<string, string> = {
  navigation: 'Navigation',
  action: 'Actions',
  editor: 'Content Editor'
}

const categoryOrder = ['navigation', 'action', 'editor']

// Handle '?' key to open
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '?' && !isOpen.value) {
    // Don't trigger when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    e.preventDefault()
    isOpen.value = true
  }
  
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Clear search when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="isOpen = false"
      >
        <div
          class="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform px-4"
          @click.stop
        >
          <div class="overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary shadow-2xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-es-border px-6 py-4 dark:border-es-border-dark">
              <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                Keyboard Shortcuts
              </h2>
              <button
                class="rounded-lg p-2 text-es-text-secondary hover:bg-es-bg-tertiary dark:text-es-text-secondary-dark dark:hover:bg-es-bg-tertiary-dark"
                @click="isOpen = false"
              >
                <UIcon name="i-lucide-x" class="h-5 w-5" />
              </button>
            </div>

            <!-- Search -->
            <div class="border-b border-es-border px-6 py-3 dark:border-es-border-dark">
              <div class="relative">
                <UIcon
                  name="i-lucide-search"
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-es-text-secondary dark:text-es-text-secondary-dark"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search shortcuts..."
                  class="w-full rounded-lg border border-es-border bg-es-bg-primary py-2 pl-10 pr-4 text-sm text-es-text-primary placeholder:text-es-text-tertiary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:placeholder:text-es-text-tertiary-dark dark:focus:border-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-es-text-secondary hover:text-es-text-primary dark:text-es-text-secondary-dark dark:hover:text-es-text-primary-dark"
                  @click="searchQuery = ''"
                >
                  <UIcon name="i-lucide-x" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="max-h-[50vh] overflow-y-auto p-6">
              <!-- No results -->
              <div
                v-if="filteredShortcuts.length === 0"
                class="py-8 text-center"
              >
                <UIcon name="i-lucide-search-x" class="mx-auto mb-2 h-8 w-8 text-es-text-tertiary dark:text-es-text-tertiary-dark" />
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  No shortcuts found for "{{ searchQuery }}"
                </p>
              </div>
              
              <!-- Results -->
              <template v-else>
                <div
                  v-for="category in categoryOrder"
                  :key="category"
                  class="mb-6 last:mb-0"
                >
                  <template v-if="groupedShortcuts[category]?.length">
                    <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ categoryLabels[category] }}
                    </h3>
                    <div class="space-y-2">
                      <div
                        v-for="shortcut in groupedShortcuts[category]"
                        :key="shortcut.description"
                        class="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
                      >
                        <span class="text-sm text-es-text-primary dark:text-es-text-primary-dark">
                          {{ shortcut.description }}
                        </span>
                        <div class="flex items-center gap-1">
                          <kbd
                            v-for="key in shortcut.keys"
                            :key="key"
                            class="rounded border border-es-border bg-es-bg-primary px-2 py-1 text-xs font-medium text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-secondary-dark"
                          >
                            {{ key }}
                          </kbd>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="border-t border-es-border bg-es-bg-primary px-6 py-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
              <p class="text-center text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                Press <kbd class="rounded border border-es-border bg-es-bg-secondary px-1.5 py-0.5 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">?</kbd> anytime to show this help
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
