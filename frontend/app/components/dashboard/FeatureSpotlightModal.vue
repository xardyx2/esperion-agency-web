<script setup lang="ts">
/**
 * FeatureSpotlightModal - Dismissible feature spotlight for underused features
 * 
 * Shows on specific page visits, can be dismissed, and reappears after N sessions
 * 
 * @usage
 * ```vue
 * <FeatureSpotlightModal
 *   v-model:open="showSpotlight"
 *   feature-id="bulk-actions"
 *   title="Bulk Actions"
 *   description="Select multiple items and perform actions on them at once."
 *   :image=""/bulk-actions-demo.png""
 *   :reappear-after="5"
 * />
 * ```
 */

export interface SpotlightFeature {
  id: string
  title: string
  description: string
  image?: string
  icon?: string
  learnMoreUrl?: string
  shortcut?: string
}

interface Props {
  modelValue?: boolean
  featureId: string
  title: string
  description: string
  image?: string
  icon?: string
  learnMoreUrl?: string
  shortcut?: string
  reappearAfter?: number // Number of sessions before showing again
}

const props = withDefaults(defineProps<Props>(), {
  reappearAfter: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  dismiss: []
  action: []
}>()

const STORAGE_KEY_PREFIX = 'esperion-spotlight-dismissed-'

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value) => emit('update:modelValue', value)
})

const dontShowAgain = ref(false)

// Check if spotlight should be shown
const shouldShowSpotlight = (): boolean => {
  const dismissedData = localStorage.getItem(`${STORAGE_KEY_PREFIX}${props.featureId}`)
  if (!dismissedData) return true
  
  try {
    const { dismissedAt, sessionCount } = JSON.parse(dismissedData)
    const sessionsSinceDismissal = getSessionCount() - sessionCount
    return sessionsSinceDismissal >= props.reappearAfter
  } catch {
    return true
  }
}

// Get current session count (simplified - increment on app load)
const getSessionCount = (): number => {
  const count = parseInt(sessionStorage.getItem('esperion-session-count') || '0')
  return count
}

// Handle dismiss
const handleDismiss = () => {
  if (dontShowAgain.value) {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${props.featureId}`,
      JSON.stringify({
        dismissedAt: new Date().toISOString(),
        sessionCount: getSessionCount(),
        permanent: true
      })
    )
  } else {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${props.featureId}`,
      JSON.stringify({
        dismissedAt: new Date().toISOString(),
        sessionCount: getSessionCount(),
        permanent: false
      })
    )
  }
  
  isOpen.value = false
  emit('dismiss')
}

// Handle action (e.g., "Try it now")
const handleAction = () => {
  // Mark as seen but not permanently dismissed
  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${props.featureId}`,
    JSON.stringify({
      dismissedAt: new Date().toISOString(),
      sessionCount: getSessionCount(),
      permanent: false
    })
  )
  
  isOpen.value = false
  emit('action')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click="handleDismiss"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary shadow-2xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
          @click.stop
        >
          <!-- Image -->
          <div
            v-if="image"
            class="relative h-48 w-full overflow-hidden bg-gradient-to-br from-es-accent-primary/20 to-es-accent-secondary/20 dark:from-es-accent-primary-dark/20 dark:to-es-accent-secondary-dark/20"
          >
            <img
              :src="image"
              :alt="title"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-es-bg-secondary/80 to-transparent dark:from-es-bg-secondary-dark/80" />
          </div>
          
          <!-- Icon fallback -->
          <div
            v-else-if="icon"
            class="flex h-32 items-center justify-center bg-gradient-to-br from-es-accent-primary/10 to-es-accent-secondary/10 dark:from-es-accent-primary-dark/10 dark:to-es-accent-secondary-dark/10"
          >
            <UIcon :name="icon" class="h-16 w-16 text-es-accent-primary dark:text-es-accent-primary-dark" />
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <!-- New badge -->
            <div class="mb-3">
              <span class="inline-flex items-center gap-1 rounded-full bg-es-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-es-accent-primary dark:bg-es-accent-primary-dark/10 dark:text-es-accent-primary-dark">
                <UIcon name="i-lucide-sparkles" class="h-3 w-3" />
                New Feature
              </span>
            </div>
            
            <h2 class="mb-2 text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
              {{ title }}
            </h2>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ description }}
            </p>
            
            <!-- Shortcut hint -->
            <div
              v-if="shortcut"
              class="mt-4 flex items-center gap-2 rounded-lg bg-es-bg-tertiary px-3 py-2 dark:bg-es-bg-tertiary-dark"
            >
              <UIcon name="i-lucide-keyboard" class="h-4 w-4 text-es-text-secondary dark:text-es-text-secondary-dark" />
              <span class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                Press <kbd class="rounded border border-es-border bg-es-bg-primary px-1.5 py-0.5 font-mono dark:border-es-border-dark dark:bg-es-bg-primary-dark">{{ shortcut }}</kbd> anytime to use this feature
              </span>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 flex items-center justify-between">
              <label class="flex cursor-pointer items-center gap-2">
                <input
                  v-model="dontShowAgain"
                  type="checkbox"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:focus:ring-es-accent-primary-dark"
                />
                <span class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  Don't show again
                </span>
              </label>
              
              <div class="flex items-center gap-2">
                <UButton
                  variant="ghost"
                  color="neutral"
                  @click="handleDismiss"
                >
                  Maybe Later
                </UButton>
                <UButton
                  color="primary"
                  @click="handleAction"
                >
                  <UIcon name="i-lucide-rocket" class="mr-1.5 h-4 w-4" />
                  Try It Now
                </UButton>
              </div>
            </div>
            
            <!-- Learn more link -->
            <div v-if="learnMoreUrl" class="mt-4 text-center">
              <NuxtLink
                :to="learnMoreUrl"
                external
                target="_blank"
                class="inline-flex items-center gap-1 text-xs text-es-accent-primary hover:underline dark:text-es-accent-primary-dark"
              >
                Learn more about {{ title }}
                <UIcon name="i-lucide-external-link" class="h-3 w-3" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
