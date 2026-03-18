<script setup lang="ts">
/**
 * UAddWidgetModal - Modal to add widgets to dashboard
 * 
 * Features:
 * - Grid of available widgets with preview
 * - Each widget shows icon, name, description
 * - Click to add widget to dashboard
 * - Uses useWidgets composable
 * 
 * @usage
 * ```vue
 * <UAddWidgetModal
 *   v-model:open="showAddWidgetModal"
 *   @add-widget="handleAddWidget"
 * />
 * ```
 */

import { availableWidgets, type WidgetDefinition } from '~/composables/useWidgets'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add-widget': [widget: WidgetDefinition]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleAddWidget = (widget: WidgetDefinition) => {
  emit('add-widget', widget)
  isOpen.value = false
}
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
          class="absolute left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform px-4"
          @click.stop
        >
          <div class="overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary shadow-2xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-es-border px-6 py-4 dark:border-es-border-dark">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-layout-grid" class="h-5 w-5 text-es-accent-primary" />
                <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  Add Widget to Dashboard
                </h2>
              </div>
              <button
                class="rounded-lg p-2 text-es-text-secondary hover:bg-es-bg-tertiary dark:text-es-text-secondary-dark dark:hover:bg-es-bg-tertiary-dark"
                @click="isOpen = false"
              >
                <UIcon name="i-lucide-x" class="h-5 w-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6">
              <p class="mb-6 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                Click on a widget to add it to your dashboard. You can rearrange and resize widgets after adding them.
              </p>

              <!-- Widget Grid -->
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="widget in availableWidgets"
                  :key="widget.id"
                  class="group flex flex-col items-start rounded-xl border border-es-border bg-es-bg-primary p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:hover:border-es-accent-primary-dark"
                  @click="handleAddWidget(widget)"
                >
                  <!-- Icon -->
                  <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-es-accent-primary/10 text-es-accent-primary transition-colors group-hover:bg-es-accent-primary group-hover:text-white dark:bg-es-accent-primary-dark/10 dark:text-es-accent-primary-dark dark:group-hover:bg-es-accent-primary-dark dark:group-hover:text-white">
                    <UIcon :name="widget.icon" class="h-6 w-6" />
                  </div>

                  <!-- Name -->
                  <h3 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                    {{ widget.name }}
                  </h3>

                  <!-- Description -->
                  <p class="mt-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    {{ widget.description }}
                  </p>

                  <!-- Size Info -->
                  <div class="mt-3 flex items-center gap-2 text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
                    <UIcon name="i-lucide-maximize-2" class="h-3 w-3" />
                    <span>{{ widget.defaultSize.w }} × {{ widget.defaultSize.h }}</span>
                  </div>

                  <!-- Add indicator -->
                  <div class="mt-3 flex w-full items-center justify-center rounded-lg bg-es-bg-tertiary px-3 py-2 text-xs font-medium text-es-text-secondary opacity-0 transition-opacity group-hover:opacity-100 dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark">
                    <UIcon name="i-lucide-plus" class="mr-1 h-3 w-3" />
                    Add to Dashboard
                  </div>
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-es-border bg-es-bg-primary px-6 py-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
              <div class="flex items-center justify-between">
                <p class="text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
                  {{ availableWidgets.length }} widgets available
                </p>
                <UButton
                  color="gray"
                  variant="outline"
                  size="sm"
                  @click="isOpen = false"
                  class="rounded-xl"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
