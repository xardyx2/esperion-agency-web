<script setup lang="ts">
/**
 * UDashboardErrorBoundary - Error boundary component for dashboard
 * 
 * Catches errors in child components and shows fallback UI with:
 * - Error message display
 * - Retry button to reload
 * - Report button (placeholder)
 * 
 * @usage
 * ```vue
 * <UDashboardErrorBoundary>
 *   <ChildComponent />
 * </UDashboardErrorBoundary>
 * ```
 */

interface Props {
  title?: string
  description?: string
  showReport?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  description: 'We encountered an error loading this content',
  showReport: true
})

const emit = defineEmits<{
  retry: []
  report: [error: Error | null]
}>()

const error = ref<Error | null>(null)
const isRetrying = ref(false)

// Capture errors from slot
const handleError = (err: Error) => {
  error.value = err
  console.error('[UDashboardErrorBoundary]', err)
}

// Define exposed methods for parent components to report errors
defineExpose({
  handleError,
  reset: () => {
    error.value = null
  }
})

const handleRetry = async () => {
  isRetrying.value = true
  emit('retry')
  // Reset error after retry
  setTimeout(() => {
    isRetrying.value = false
    error.value = null
  }, 100)
}

const handleReport = () => {
  emit('report', error.value)
  // Placeholder for error reporting integration
  console.log('[UDashboardErrorBoundary] Report error:', error.value)
}

// Error state utilities
const hasError = computed(() => error.value !== null)
const errorMessage = computed(() => error.value?.message || 'Unknown error')
const errorStack = computed(() => error.value?.stack)
</script>

<template>
  <div v-if="hasError">
    <!-- Error Fallback UI -->
    <div class="rounded-3xl border border-es-error/20 bg-red-50 px-6 py-8 dark:border-es-error-dark/20 dark:bg-red-900/10">
      <div class="flex items-start gap-4">
        <!-- Error Icon -->
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-es-error/10 text-es-error dark:bg-es-error-dark/15 dark:text-es-error-dark">
          <UIcon name="i-lucide-alert-triangle" class="h-6 w-6" />
        </div>

        <!-- Error Content -->
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ title }}
          </h3>
          <p class="mt-1 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ description }}
          </p>

          <!-- Error Details (dev mode) -->
          <div
            v-if="errorStack && import.meta.dev"
            class="mt-4 overflow-hidden rounded-xl bg-es-bg-tertiary p-4 dark:bg-es-bg-tertiary-dark"
          >
            <pre class="max-h-48 overflow-auto text-xs font-mono text-es-text-tertiary dark:text-es-text-tertiary-dark">{{ errorStack }}</pre>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage && !import.meta.dev"
            class="mt-4 text-sm text-es-text-tertiary dark:text-es-text-tertiary-dark"
          >
            {{ errorMessage }}
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <UButton
              color="primary"
              size="sm"
              :loading="isRetrying"
              @click="handleRetry"
            >
              <UIcon name="i-lucide-refresh-cw" class="mr-1.5 h-4 w-4" />
              Retry
            </UButton>

            <UButton
              v-if="showReport"
              color="neutral"
              variant="outline"
              size="sm"
              @click="handleReport"
            >
              <UIcon name="i-lucide-flag" class="mr-1.5 h-4 w-4" />
              Report
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Normal Content -->
  <slot v-else />
</template>
