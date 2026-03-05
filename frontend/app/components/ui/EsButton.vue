<script setup lang="ts">
/**
 * Esperion Button Component
 * Reusable button with Esperion Design System styling
 * 
 * @usage
 * ```vue
 * <EsButton variant="primary">Click me</EsButton>
 * <EsButton variant="secondary">Cancel</EsButton>
 * <EsButton variant="danger">Delete</EsButton>
 * ```
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

// Variant classes following Esperion 60-30-10 rule
const variantClasses = {
  primary: 'bg-esperion-primary hover:bg-blue-600 text-white',
  secondary: 'bg-esperion-light-surface dark:bg-esperion-dark-surface border border-esperion-light-border dark:border-esperion-dark-border text-esperion-light-text-primary dark:text-esperion-dark-text-primary hover:bg-gray-50 dark:hover:bg-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

// Size classes
const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-esperion-primary',
      variantClasses[variant],
      sizeClasses[size],
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Button content -->
    <slot />
  </button>
</template>