<script setup lang="ts">
/**
 * Esperion Card Component
 * Reusable card with Esperion Design System styling
 * 
 * @usage
 * ```vue
 * <EsCard>
 *   <template #header>Card Title</template>
 *   <template #default>Card content...</template>
 *   <template #footer>Card actions</template>
 * </EsCard>
 * ```
 */

interface Props {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
})

// Variant classes following Esperion 60-30-10 rule
const variantClasses = {
  default: 'bg-esperion-light-surface dark:bg-esperion-dark-surface border border-esperion-light-border dark:border-esperion-dark-border',
  elevated: 'bg-esperion-light-surface dark:bg-esperion-dark-surface shadow-lg',
  outlined: 'bg-transparent border-2 border-esperion-primary',
}

// Padding classes
const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
}

// Hover effect
const hoverClass = computed(() => {
  if (props.hoverable) {
    return 'hover:shadow-xl transition-shadow duration-300 cursor-pointer'
  }
  return ''
})
</script>

<template>
  <div
    :class="[
      'rounded-xl transition-all duration-200',
      variantClasses[variant],
      paddingClasses[padding],
      hoverClass,
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="mb-4 pb-4 border-b border-esperion-light-border dark:border-esperion-dark-border">
      <slot name="header" />
    </div>

    <!-- Default slot (content) -->
    <slot />

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-esperion-light-border dark:border-esperion-dark-border">
      <slot name="footer" />
    </div>
  </div>
</template>