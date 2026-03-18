<script setup lang="ts">
/**
 * QuickActionsWidget - Display grid of quick action buttons in dashboard widget grid
 * 
 * Features:
 * - 2x2 grid of quick action buttons
 * - Each action has icon, label, and link
 * - Different colors for each action type
 * - Hover effects
 * - Dark mode support
 * - Uses Esperion design tokens
 * 
 * @usage
 * ```vue
 * <QuickActionsWidget />
 * ```
 */

interface QuickAction {
  label: string
  icon: string
  to: string
  color: 'primary' | 'info' | 'success' | 'warning'
}

const actions: QuickAction[] = [
  { label: 'New Article', icon: 'i-lucide-file-plus', to: '/dashboard/articles/new', color: 'primary' },
  { label: 'New Work', icon: 'i-lucide-briefcase-plus', to: '/dashboard/works/new', color: 'info' },
  { label: 'Upload Media', icon: 'i-lucide-image-plus', to: '/dashboard/media', color: 'success' },
  { label: 'Analytics', icon: 'i-lucide-chart-line', to: '/dashboard/analytics', color: 'warning' }
]

const router = useRouter()

// Navigate to action route
const navigateTo = (to: string) => {
  router.push(to)
}
</script>

<template>
  <UCard
    :ui="{
      root: 'h-full rounded-2xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
      header: 'border-b border-es-border/70 px-4 py-3 dark:border-es-border-dark/70',
      body: 'p-4'
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
          Quick Actions
        </h3>
        <UIcon
          name="i-lucide-zap"
          class="h-4 w-4 text-es-text-tertiary dark:text-es-text-tertiary-dark"
        />
      </div>
    </template>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="action in actions"
        :key="action.label"
        class="flex flex-col items-center justify-center rounded-xl p-4 transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-es-accent-primary/50 dark:focus:ring-es-accent-primary-dark/50"
        :class="[
          action.color === 'primary' && 'bg-es-accent-primary/10 hover:bg-es-accent-primary/20 dark:bg-es-accent-primary-dark/10 dark:hover:bg-es-accent-primary-dark/20',
          action.color === 'info' && 'bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
          action.color === 'success' && 'bg-green-500/10 hover:bg-green-500/20 dark:bg-green-500/10 dark:hover:bg-green-500/20',
          action.color === 'warning' && 'bg-orange-500/10 hover:bg-orange-500/20 dark:bg-orange-500/10 dark:hover:bg-orange-500/20'
        ]"
        @click="navigateTo(action.to)"
      >
        <UIcon
          :name="action.icon"
          class="mb-2 h-8 w-8"
          :class="[
            action.color === 'primary' && 'text-es-accent-primary dark:text-es-accent-primary-dark',
            action.color === 'info' && 'text-blue-500 dark:text-blue-400',
            action.color === 'success' && 'text-green-500 dark:text-green-400',
            action.color === 'warning' && 'text-orange-500 dark:text-orange-400'
          ]"
        />
        <span
          class="text-xs font-medium text-es-text-primary dark:text-es-text-primary-dark"
        >
          {{ action.label }}
        </span>
      </button>
    </div>
  </UCard>
</template>
