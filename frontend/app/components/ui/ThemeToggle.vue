<script setup lang="ts">
/**
 * Theme Toggle Component
 * Simple sun/moon toggle button for dark/light mode switching
 * Inspired by vuejs.org design
 *
 * @usage
 * ```vue
 * <ThemeToggle />
 * <ThemeToggle size="sm" />
 * ```
 */

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const colorMode = useColorMode()

// Icon size mapping
const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

// Button size mapping
const buttonSizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5'
}

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    :class="[
      'rounded-lg transition-colors duration-200',
      'text-es-text-secondary dark:text-es-text-secondary-dark',
      'hover:text-es-text-primary dark:hover:text-es-text-primary-dark',
      'hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark',
      buttonSizes[size]
    ]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <!-- Sun Icon (shown in dark mode) -->
    <svg
      v-if="isDark"
      :class="iconSizes[size]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      />
    </svg>

    <!-- Moon Icon (shown in light mode) -->
    <svg
      v-else
      :class="iconSizes[size]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  </button>
</template>
