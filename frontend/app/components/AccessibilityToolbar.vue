<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Toolbar Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-full shadow-lg flex items-center justify-center hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
      aria-label="Accessibility options"
      aria-expanded="isOpen"
    >
      <span class="text-2xl">♿</span>
    </button>

    <!-- Toolbar Menu -->
    <div
      v-if="isOpen"
      class="absolute bottom-16 right-0 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl shadow-xl p-4 min-w-[200px] border border-es-border dark:border-es-border-dark"
      role="menu"
    >
      <h3 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3">
        Accessibility Options
      </h3>

      <!-- High Contrast -->
      <button
        @click="toggleHighContrast"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
        role="menuitem"
      >
        <span class="text-sm text-es-text-primary dark:text-es-text-primary-dark">High Contrast</span>
        <span :class="isHighContrast ? 'bg-es-accent-primary' : 'bg-es-bg-tertiary'" class="w-10 h-5 rounded-full relative transition-colors">
          <span :class="isHighContrast ? 'translate-x-5' : 'translate-x-0'" class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform"></span>
        </span>
      </button>

      <!-- Font Size -->
      <div class="mt-3 pt-3 border-t border-es-border dark:border-es-border-dark">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-es-text-primary dark:text-es-text-primary-dark">Font Size</span>
          <span class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">{{ fontSize }}px</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="decreaseFontSize"
            class="w-8 h-8 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            aria-label="Decrease font size"
          >
            A-
          </button>
          <div class="flex-1 h-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-full">
            <div class="h-2 bg-es-accent-primary rounded-full transition-all" :style="{ width: ((fontSize - 12) / 12 * 100) + '%' }"></div>
          </div>
          <button
            @click="increaseFontSize"
            class="w-8 h-8 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      <!-- Skip to Content -->
      <button
        @click="skipToContent"
        class="w-full mt-3 px-3 py-2 text-left text-sm text-es-accent-primary dark:text-es-accent-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors"
        role="menuitem"
      >
        ⬇️ Skip to Content
      </button>

      <!-- Reset -->
      <button
        @click="resetPreferences"
        class="w-full mt-1 px-3 py-2 text-left text-sm text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors"
        role="menuitem"
      >
        🔄 Reset All
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const isHighContrast = ref(false)
const fontSize = ref(16)

const { toggleHighContrast, adjustFontSize, restorePreferences } = useAccessibility()

const skipToContent = () => {
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView({ behavior: 'smooth' })
  }
  isOpen.value = false
}

const increaseFontSize = () => {
  adjustFontSize(2)
  updateFontSize()
}

const decreaseFontSize = () => {
  adjustFontSize(-2)
  updateFontSize()
}

const updateFontSize = () => {
  const root = document.documentElement
  fontSize.value = parseFloat(getComputedStyle(root).fontSize)
}

const resetPreferences = () => {
  localStorage.removeItem('high-contrast')
  localStorage.removeItem('font-size')
  document.documentElement.classList.remove('high-contrast')
  document.documentElement.style.fontSize = '16px'
  isHighContrast.value = false
  fontSize.value = 16
  isOpen.value = false
}

// Watch for high contrast changes
watch(() => document.documentElement.classList.contains('high-contrast'), (value) => {
  isHighContrast.value = value
})

// Restore preferences on mount
onMounted(() => {
  restorePreferences()
  updateFontSize()
  isHighContrast.value = document.documentElement.classList.contains('high-contrast')
})

// Close menu on outside click
onClickOutside(ref(null), () => {
  isOpen.value = false
})
</script>