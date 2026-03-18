<script setup lang="ts">
/**
 * UDashboardCommandPalette - Global command palette for keyboard-first navigation
 * 
 * @usage
 * ```vue
 * <UDashboardCommandPalette v-model:open="isOpen" />
 * ```
 * 
 * Keyboard shortcut: ⌘K (Mac) / Ctrl+K (Windows/Linux)
 */

import { ref, computed, nextTick } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useAuthStore } from '../../stores/auth'

export interface Command {
  id: string
  label: string
  icon?: string
  shortcut?: string
  category: 'navigation' | 'action' | 'recent'
  to?: string
  action?: () => void
  keywords?: string[]
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
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement>()
const localePath = useLocalePath()
const router = useRouter()
const authStore = useAuthStore()
const colorMode = useColorMode()

// Recent items (persisted in localStorage)
const recentItems = useLocalStorage<Command[]>('esperion:command-palette:recent', [])

// Navigation commands
const navigationCommands = computed<Command[]>(() => [
  { id: 'nav-dashboard', label: 'Go to Dashboard', icon: 'i-lucide-layout-dashboard', shortcut: 'G D', category: 'navigation', to: localePath('/dashboard') },
  { id: 'nav-analytics', label: 'Go to Analytics', icon: 'i-lucide-chart-column', shortcut: 'G A', category: 'navigation', to: localePath('/dashboard/analytics') },
  { id: 'nav-articles', label: 'Go to Articles', icon: 'i-lucide-file-text', shortcut: 'G B', category: 'navigation', to: localePath('/dashboard/articles') },
  { id: 'nav-works', label: 'Go to Portfolio', icon: 'i-lucide-briefcase-business', shortcut: 'G W', category: 'navigation', to: localePath('/dashboard/works') },
  { id: 'nav-services', label: 'Go to Services', icon: 'i-lucide-panels-top-left', category: 'navigation', to: localePath('/dashboard/services') },
  { id: 'nav-clients', label: 'Go to Clients', icon: 'i-lucide-users-round', category: 'navigation', to: localePath('/dashboard/clients') },
  { id: 'nav-media', label: 'Go to Media', icon: 'i-lucide-images', shortcut: 'G M', category: 'navigation', to: localePath('/dashboard/media') },
  { id: 'nav-contact', label: 'Go to Contact', icon: 'i-lucide-mail', category: 'navigation', to: localePath('/dashboard/contact') },
  { id: 'nav-users', label: 'Go to Users', icon: 'i-lucide-user-cog', category: 'navigation', to: localePath('/dashboard/users') },
  { id: 'nav-settings', label: 'Go to Settings', icon: 'i-lucide-settings-2', category: 'navigation', to: localePath('/dashboard/settings') },
  { id: 'nav-sessions', label: 'Go to Sessions', icon: 'i-lucide-shield-check', category: 'navigation', to: localePath('/dashboard/sessions') },
])

// Action commands
const actionCommands = computed<Command[]>(() => [
  { id: 'action-new-article', label: 'New Article', icon: 'i-lucide-file-plus', shortcut: 'N A', category: 'action', to: localePath('/dashboard/articles/new') },
  { id: 'action-new-work', label: 'New Portfolio Work', icon: 'i-lucide-briefcase', shortcut: 'N W', category: 'action', to: localePath('/dashboard/works/new') },
  { id: 'action-toggle-theme', label: colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon', shortcut: 'T', category: 'action', action: () => { colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark' } },
  { id: 'action-visit-site', label: 'Visit Public Site', icon: 'i-lucide-globe', category: 'action', to: localePath('/') },
  { id: 'action-logout', label: 'Log Out', icon: 'i-lucide-log-out', shortcut: 'L', category: 'action', action: () => authStore.logout() },
])

// All commands
const allCommands = computed(() => [
  ...navigationCommands.value,
  ...actionCommands.value,
  ...recentItems.value.map(item => ({ ...item, category: 'recent' as const }))
])

// Filter commands based on search
const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) {
    // Show recent first, then navigation, then actions
    return [
      ...recentItems.value.slice(0, 5),
      ...navigationCommands.value,
      ...actionCommands.value
    ].filter((cmd, index, self) => 
      index === self.findIndex(c => c.id === cmd.id)
    )
  }

  const query = searchQuery.value.toLowerCase()
  return allCommands.value.filter(cmd => {
    const searchText = `${cmd.label} ${cmd.keywords?.join(' ') || ''}`.toLowerCase()
    return searchText.includes(query)
  })
})

// Group commands by category
const groupedCommands = computed(() => {
  const groups: Record<string, Command[]> = {}
  
  filteredCommands.value.forEach(cmd => {
    const category = cmd.category
    if (!groups[category]) groups[category] = []
    groups[category].push(cmd)
  })
  
  return groups
})

// Category labels
const categoryLabels: Record<string, string> = {
  recent: 'Recent',
  navigation: 'Navigation',
  action: 'Actions'
}

// Execute command
const executeCommand = async (cmd: Command) => {
  // Add to recent
  const newRecent = [cmd, ...recentItems.value.filter(r => r.id !== cmd.id)].slice(0, 10)
  recentItems.value = newRecent
  
  // Close palette
  isOpen.value = false
  searchQuery.value = ''
  
  // Execute
  if (cmd.action) {
    cmd.action()
  } else if (cmd.to) {
    await router.push(cmd.to)
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    // Open with Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value = true
      nextTick(() => searchInput.value?.focus())
    }
    return
  }

  switch (e.key) {
    case 'Escape':
      isOpen.value = false
      searchQuery.value = ''
      break
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCommands.value.length - 1)
      scrollToSelected()
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      scrollToSelected()
      break
    case 'Enter':
      e.preventDefault()
      const command = filteredCommands.value[selectedIndex.value]
      if (command) {
        executeCommand(command)
      }
      break
  }
}

// Scroll selected item into view
const scrollToSelected = () => {
  const element = document.querySelector(`[data-cmd-index="${selectedIndex.value}"]`)
  element?.scrollIntoView({ block: 'nearest' })
}

// Watch for search changes to reset selection
watch(searchQuery, () => {
  selectedIndex.value = 0
})

// Handle keyboard shortcut
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
          class="absolute left-1/2 top-[20%] w-full max-w-2xl -translate-x-1/2 transform px-4"
          @click.stop
        >
          <div class="overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary shadow-2xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
            <!-- Search Input -->
            <div class="border-b border-es-border px-4 py-4 dark:border-es-border-dark">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-search" class="h-5 w-5 text-es-text-tertiary dark:text-es-text-tertiary-dark" />
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search commands, pages, actions..."
                  class="flex-1 bg-transparent text-lg text-es-text-primary placeholder-es-text-tertiary outline-none dark:text-es-text-primary-dark dark:placeholder-es-text-tertiary-dark"
                >
                <kbd class="hidden rounded-lg border border-es-border bg-es-bg-tertiary px-2 py-1 text-xs font-medium text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark sm:inline-block">
                  ESC
                </kbd>
              </div>
            </div>

            <!-- Commands List -->
            <div class="max-h-[60vh] overflow-y-auto p-2">
              <template v-if="filteredCommands.length === 0">
                <div class="px-4 py-8 text-center text-es-text-secondary dark:text-es-text-secondary-dark">
                  <UIcon name="i-lucide-search-x" class="mx-auto mb-3 h-8 w-8 opacity-50" />
                  <p>No commands found</p>
                </div>
              </template>

              <template v-else>
                <div
                  v-for="(commands, category) in groupedCommands"
                  :key="category"
                  class="mb-2"
                >
                  <div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-es-text-tertiary dark:text-es-text-tertiary-dark">
                    {{ categoryLabels[category] || category }}
                  </div>
                  
                  <button
                    v-for="(cmd, index) in commands"
                    :key="cmd.id"
                    :data-cmd-index="filteredCommands.indexOf(cmd)"
                    class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                    :class="filteredCommands.indexOf(cmd) === selectedIndex 
                      ? 'bg-es-accent-primary text-white dark:bg-es-accent-primary-dark' 
                      : 'text-es-text-primary hover:bg-es-bg-tertiary dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark'"
                    @click="executeCommand(cmd)"
                    @mouseenter="selectedIndex = filteredCommands.indexOf(cmd)"
                  >
                    <UIcon 
                      :name="cmd.icon || 'i-lucide-circle'" 
                      class="h-5 w-5"
                      :class="filteredCommands.indexOf(cmd) === selectedIndex 
                        ? 'text-white' 
                        : 'text-es-text-secondary dark:text-es-text-secondary-dark'"
                    />
                    <span class="flex-1 font-medium">{{ cmd.label }}</span>
                    <span 
                      v-if="cmd.shortcut"
                      class="rounded-md px-2 py-0.5 text-xs"
                      :class="filteredCommands.indexOf(cmd) === selectedIndex 
                        ? 'bg-white/20 text-white' 
                        : 'bg-es-bg-tertiary text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark'"
                    >
                      {{ cmd.shortcut }}
                    </span>
                  </button>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-es-border bg-es-bg-primary px-4 py-2 text-xs text-es-text-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-tertiary-dark">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="rounded border border-es-border bg-es-bg-secondary px-1.5 py-0.5 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">↑↓</kbd>
                  Navigate
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="rounded border border-es-border bg-es-bg-secondary px-1.5 py-0.5 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">↵</kbd>
                  Select
                </span>
              </div>
              <span>{{ filteredCommands.length }} commands</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
