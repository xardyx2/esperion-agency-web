<template>
  <div class="theme-toggle" role="radiogroup" :aria-label="t('footer.appearance')">
    <button
      v-for="option in themeOptions"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="currentTheme === option.value"
      :aria-label="option.label"
      class="theme-toggle-btn"
      :class="{ active: currentTheme === option.value }"
      @click="setTheme(option.value)"
    >
      <UIcon :name="option.icon" class="w-4 h-4" />
    </button>
    <!-- Sliding indicator -->
    <div class="theme-toggle-indicator" :style="indicatorStyle" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

type ThemeValue = 'system' | 'light' | 'dark'

const themeOptions: { value: ThemeValue; icon: string; label: string }[] = [
  { value: 'system', icon: 'i-heroicons-computer-desktop', label: 'System' },
  { value: 'light', icon: 'i-heroicons-sun', label: 'Light' },
  { value: 'dark', icon: 'i-heroicons-moon', label: 'Dark' },
]

const currentTheme = computed(() => colorMode.preference as ThemeValue)

const setTheme = (theme: ThemeValue) => {
  colorMode.preference = theme
}

// Calculate indicator position based on selected theme
const indicatorStyle = computed(() => {
  const index = themeOptions.findIndex(opt => opt.value === currentTheme.value)
  const position = index >= 0 ? index : 1 // Default to light (index 1)
  return {
    transform: `translateX(${position * 100}%)`,
  }
})
</script>

<style scoped>
.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 9999px;
  background-color: var(--es-bg-tertiary);
}

.dark .theme-toggle {
  background-color: var(--es-bg-tertiary-dark);
}

.theme-toggle-btn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: var(--es-text-secondary);
  transition: color 0.2s;
  cursor: pointer;
}

.theme-toggle-btn:hover {
  color: var(--es-text-primary);
}

.dark .theme-toggle-btn {
  color: var(--es-text-secondary-dark);
}

.dark .theme-toggle-btn:hover {
  color: var(--es-text-primary-dark);
}

.theme-toggle-btn.active {
  color: var(--es-accent-primary);
}

.dark .theme-toggle-btn.active {
  color: var(--es-accent-primary-dark);
}

.theme-toggle-indicator {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: var(--es-bg-secondary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease;
}

.dark .theme-toggle-indicator {
  background-color: var(--es-bg-secondary-dark);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>