<script setup lang="ts">
/**
 * UDashboardBulkActionsToolbar - Sticky toolbar for bulk actions on selection
 * 
 * @usage
 * ```vue
 * <UDashboardBulkActionsToolbar
 *   :selected-count="selectedItems.length"
 *   :total-count="totalItems"
 *   :actions="bulkActions"
 *   @clear="clearSelection"
 *   @select-all="selectAll"
 * />
 * ```
 */

export interface BulkAction {
  label: string
  icon: string
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'neutral' | 'error' | 'success' | 'warning' | 'info'
  onClick: () => void
  disabled?: boolean
}

interface Props {
  selectedCount: number
  totalCount: number
  actions: BulkAction[]
  showSelectAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSelectAll: true
})

const emit = defineEmits<{
  clear: []
  selectAll: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="selectedCount > 0"
      class="sticky top-0 z-30 rounded-xl border border-es-border bg-es-bg-secondary px-4 py-3 shadow-lg dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Selection Info -->
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
            <UIcon name="i-lucide-check" class="h-4 w-4" />
          </div>
          <span class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
            {{ selectedCount }} selected
          </span>
          <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            of {{ totalCount }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="(action, index) in actions"
            :key="index"
            :color="action.color || 'neutral'"
            :variant="action.variant || 'ghost'"
            size="sm"
            class="rounded-full"
            :disabled="action.disabled"
            @click="action.onClick"
          >
            <UIcon :name="action.icon" class="h-4 w-4 mr-1" />
            {{ action.label }}
          </UButton>

          <div class="h-6 w-px bg-es-border dark:bg-es-border-dark" />

          <UButton
            v-if="showSelectAll && selectedCount < totalCount"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('selectAll')"
          >
            Select all {{ totalCount }}
          </UButton>

          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('clear')"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4 mr-1" />
            Clear
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
