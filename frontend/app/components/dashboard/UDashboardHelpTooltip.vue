<script setup lang="ts">
/**
 * UDashboardHelpTooltip - Inline help tooltip component
 * 
 * @usage
 * ```vue
 * <UDashboardHelpTooltip
 *   title="SEO Score"
 *   description="Your SEO score is calculated based on content quality, keyword usage, and technical factors."
 * />
 * 
 * <UDashboardHelpTooltip
 *   title="Funnel Reporting"
 *   description="Track user journey through your site."
 *   :learnMore="{ label: 'Learn more', to: '/docs/analytics' }"
 * />
 * ```
 */

interface Props {
  title: string
  description: string
  learnMore?: {
    label: string
    to: string
    external?: boolean
  }
  placement?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  maxWidth: '280px'
})

const showTooltip = ref(false)
const tooltipRef = ref<HTMLElement>()

const tooltipPosition = computed(() => {
  switch (props.placement) {
    case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2'
    case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2'
    case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2'
    default: return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
  }
})

const arrowPosition = computed(() => {
  switch (props.placement) {
    case 'top': return 'top-full left-1/2 -translate-x-1/2 -mt-1'
    case 'bottom': return 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180'
    case 'left': return 'left-full top-1/2 -translate-y-1/2 -ml-1 -rotate-90'
    case 'right': return 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-90'
    default: return 'top-full left-1/2 -translate-x-1/2 -mt-1'
  }
})
</script>

<template>
  <div
    ref="tooltipRef"
    class="relative inline-flex items-center"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- Trigger icon -->
    <button
      type="button"
      class="inline-flex h-5 w-5 items-center justify-center rounded-full text-es-text-secondary transition-colors hover:bg-es-bg-tertiary hover:text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary focus:ring-offset-2 dark:text-es-text-secondary-dark dark:hover:bg-es-bg-tertiary-dark dark:hover:text-es-text-primary-dark dark:focus:ring-es-accent-primary-dark"
      :aria-label="`Help: ${title}`"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
    >
      <UIcon name="i-lucide-help-circle" class="h-4 w-4" />
    </button>
    
    <!-- Tooltip -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="showTooltip"
        :class="[
          'absolute z-50 rounded-xl border border-es-border bg-es-bg-secondary p-4 shadow-xl dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          tooltipPosition
        ]"
        :style="{ maxWidth }"
        role="tooltip"
      >
        <!-- Arrow -->
        <div
          :class="[
            'absolute h-2 w-2 rotate-45 border border-es-border bg-es-bg-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
            arrowPosition
          ]"
        />
        
        <!-- Content -->
        <div class="relative">
          <h4 class="mb-1 text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ title }}
          </h4>
          <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ description }}
          </p>
          
          <!-- Learn more link -->
          <NuxtLink
            v-if="learnMore"
            :to="learnMore.to"
            :external="learnMore.external"
            :target="learnMore.external ? '_blank' : undefined"
            class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-es-accent-primary hover:underline dark:text-es-accent-primary-dark"
          >
            {{ learnMore.label }}
            <UIcon
              v-if="learnMore.external"
              name="i-lucide-external-link"
              class="h-3 w-3"
            />
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>
