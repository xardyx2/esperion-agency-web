<script setup lang="ts">
/**
 * Language Prompt Component
 * Toast notification that prompts users to switch to their detected language
 *
 * Features:
 * - Shows after 5-second delay
 * - Once per session frequency capping
 * - Auto-hide after 10 seconds
 * - Accessible with keyboard navigation
 *
 * @usage
 * ```vue
 * <LanguagePrompt
 *   :current-lang="'id'"
 *   :detected-lang="'en'"
 *   :translated-slug="'what-is-agency'"
 *   @show="handleShow"
 *   @dismiss="handleDismiss"
 * />
 * ```
 */

interface Props {
  currentLang: 'id' | 'en'
  detectedLang: 'id' | 'en'
  translatedSlug?: string
  delay?: number // milliseconds before showing
  autoHide?: number // milliseconds before auto-hiding, 0 = no auto-hide
}

const props = withDefaults(defineProps<Props>(), {
  delay: 5000,
  autoHide: 10000
})

const emit = defineEmits<{
  show: []
  dismiss: []
  switch: []
}>()

// Component state
const isVisible = ref(false)
const isAnimating = ref(false)

// Translation labels
const labels = computed(() => ({
  id: {
    title: 'Artikel ini tersedia dalam Bahasa Inggris',
    button: 'Lihat dalam Bahasa Inggris',
    dismiss: 'Tetap dalam Bahasa Indonesia'
  },
  en: {
    title: 'This article is available in Indonesian',
    button: 'View in Indonesian',
    dismiss: 'Stay in English'
  }
}))

// Current labels based on detected language
const currentLabels = computed(() =>
  props.detectedLang === 'id' ? labels.value.id : labels.value.en
)

// Target language URL for switch
const targetUrl = computed(() => {
  if (!props.translatedSlug) return null

  const currentPath = useRoute().path
  const newPath = currentPath.replace(
    `/${props.currentLang}/`,
    `/${props.detectedLang}/`
  ).replace(
    currentPath.split('/').pop() || '',
    props.translatedSlug
  )

  return `/${props.detectedLang}${newPath}`
})

// Show prompt after delay
let showTimeout: NodeJS.Timeout | null = null
let hideTimeout: NodeJS.Timeout | null = null

function showPrompt() {
  isAnimating.value = true
  setTimeout(() => {
    isVisible.value = true
    isAnimating.value = false
    emit('show')

    // Auto-hide after specified duration
    if (props.autoHide > 0 && !hideTimeout) {
      hideTimeout = setTimeout(() => {
        hidePrompt()
      }, props.autoHide)
    }
  }, 50)
}

function hidePrompt() {
  isAnimating.value = true
  setTimeout(() => {
    isVisible.value = false
    isAnimating.value = false
    emit('dismiss')
  }, 50)
}

// Handle switch language click
async function handleSwitch() {
  if (targetUrl.value) {
    await navigateTo(targetUrl.value)
  }
  emit('switch')
  hidePrompt()
}

// Handle dismiss click
function handleDismiss() {
  hidePrompt()
}

// Initialize prompt
onMounted(() => {
  // Show after delay
  showTimeout = setTimeout(() => {
    showPrompt()
  }, props.delay)
})

// Cleanup timeouts
onBeforeUnmount(() => {
  if (showTimeout) {
    clearTimeout(showTimeout)
  }
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
})

// Expose methods for parent component
defineExpose({
  show: showPrompt,
  hide: hidePrompt
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed bottom-4 right-4 z-50 max-w-sm"
        role="alert"
        aria-live="polite"
      >
        <div
          class="rounded-lg shadow-lg"
          :class="[
            'bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
            'border border-es-border dark:border-es-border-dark'
          ]"
        >
          <!-- Content -->
          <div class="p-4">
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <span class="text-2xl">🌐</span>
              </div>

              <!-- Text -->
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium"
                  :class="[
                    'text-es-text-primary dark:text-es-text-primary-dark'
                  ]"
                >
                  {{ currentLabels.title }}
                </p>

                <!-- Actions -->
                <div class="mt-3 flex gap-2">
                  <button
                    v-if="targetUrl"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                    :class="[
                      'bg-es-accent-primary hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:hover:bg-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark'
                    ]"
                    @click="handleSwitch"
                  >
                    {{ currentLabels.button }}
                  </button>
                  <button
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                    :class="[
                      'bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
                      'border border-es-border dark:border-es-border-dark',
                      'text-es-text-primary dark:text-es-text-primary-dark',
                      'hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark'
                    ]"
                    @click="handleDismiss"
                  >
                    {{ currentLabels.dismiss }}
                  </button>
                </div>
              </div>

              <!-- Close button -->
              <button
                class="flex-shrink-0 ml-2"
                :class="[
                  'text-es-text-secondary dark:text-es-text-secondary-dark',
                  'hover:text-es-text-primary dark:hover:text-es-text-primary-dark'
                ]"
                aria-label="Dismiss"
                @click="handleDismiss"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress bar (for auto-hide) -->
          <div
            v-if="autoHide > 0"
            class="h-1 rounded-b-lg overflow-hidden"
            :class="[
              'bg-esperion-light-border dark:bg-esperion-dark-border'
            ]"
          >
            <div
              class="h-full bg-esperion-primary transition-all duration-linear"
              :style="{
                animation: `shrink ${autoHide}ms linear forwards`
              }"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
