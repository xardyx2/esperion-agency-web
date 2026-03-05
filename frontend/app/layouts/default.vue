<script setup lang="ts">
/**
 * Default Layout - Esperion Design System
 * Base layout with Esperion design tokens applied
 * 
 * Features:
 * - Esperion color palette (light/dark mode)
 * - 60-30-10 color distribution
 * - Typography configuration
 * - Semantic color classes
 */

// Use Esperion theme composable
const theme = useEsperionTheme()

// Use color mode composable
const colorMode = useColorMode()
</script>

<template>
  <div 
    class="min-h-screen transition-colors duration-300"
    :class="[
      colorMode.isDark.value ? 'bg-esperion-dark-bg' : 'bg-esperion-light-bg'
    ]"
  >
    <!-- Main content area -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* 
 * Esperion Design System - Base Layout Styles
 * Following 60-30-10 rule:
 * - 60% Background colors (bg-esperion-*)
 * - 30% Surface/Secondary colors
 * - 10% Primary/Accent colors (#2B9EDB)
 */

/* Container transitions for theme switching */
main {
  transition: background-color 0.3s ease;
}
</style>