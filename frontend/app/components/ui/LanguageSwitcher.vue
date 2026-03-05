<script setup lang="ts">
/**
 * Language Switcher Component
 * Allows users to switch between Indonesian and English
 * 
 * @usage
 * ```vue
 * <LanguageSwitcher />
 * <LanguageSwitcher variant="dropdown" />
 * <LanguageSwitcher variant="toggle" />
 * ```
 */

interface Props {
  variant?: 'dropdown' | 'toggle' | 'buttons'
  size?: 'sm' | 'md' | 'lg'
  showFlags?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dropdown',
  size: 'md',
  showFlags: true,
})

const { locale, setLocale, isIndonesian } = useI18n()

// Language options
const languages = [
  { code: 'id' as const, name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
]

// Size classes
const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

// Current language info
const currentLang = computed(() => 
  languages.find(l => l.code === locale.value) || languages[0]
)

// Switch to specific language
async function switchToLanguage(code: 'id' | 'en') {
  if (code !== locale.value) {
    await setLocale(code)
  }
}

// Toggle between languages
function toggleLanguage() {
  const newLang: 'id' | 'en' = locale.value === 'id' ? 'en' : 'id'
  switchToLanguage(newLang)
}
</script>

<template>
  <div class="language-switcher">
    <!-- Toggle Variant -->
    <button
      v-if="variant === 'toggle'"
      :class="[
        'inline-flex items-center gap-2 rounded-lg transition-colors',
        'bg-esperion-light-surface dark:bg-esperion-dark-surface',
        'border border-esperion-light-border dark:border-esperion-dark-border',
        'hover:bg-gray-50 dark:hover:bg-gray-800',
        sizeClasses[size],
      ]"
      @click="toggleLanguage"
      :aria-label="'Toggle language'"
    >
      <span v-if="showFlags">{{ currentLang.flag }}</span>
      <span>{{ currentLang.name }}</span>
    </button>

    <!-- Dropdown Variant -->
    <div v-else-if="variant === 'dropdown'" class="relative">
      <button
        :class="[
          'inline-flex items-center gap-2 rounded-lg transition-colors',
          'bg-esperion-light-surface dark:bg-esperion-dark-surface',
          'border border-esperion-light-border dark:border-esperion-dark-border',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          sizeClasses[size],
        ]"
        :aria-label="'Select language'"
      >
        <span v-if="showFlags">{{ currentLang.flag }}</span>
        <span>{{ currentLang.name }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div
        class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
        :class="[
          'bg-esperion-light-surface dark:bg-esperion-dark-surface',
          'border border-esperion-light-border dark:border-esperion-dark-border',
        ]"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          :class="[
            'w-full px-4 py-2 text-left transition-colors',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            locale === lang.code ? 'bg-esperion-primary/10' : '',
            sizeClasses[size],
          ]"
          @click="switchToLanguage(lang.code)"
        >
          <span v-if="showFlags">{{ lang.flag }}</span>
          <span class="ml-2">{{ lang.name }}</span>
        </button>
      </div>
    </div>

    <!-- Buttons Variant -->
    <div v-else-if="variant === 'buttons'" class="flex gap-2">
      <button
        v-for="lang in languages"
        :key="lang.code"
        :class="[
          'inline-flex items-center gap-1 rounded-lg transition-colors',
          locale === lang.code
            ? 'bg-esperion-primary text-white'
            : 'bg-esperion-light-surface dark:bg-esperion-dark-surface border border-esperion-light-border dark:border-esperion-dark-border',
          'hover:opacity-80',
          sizeClasses[size],
        ]"
        @click="switchToLanguage(lang.code)"
      >
        <span v-if="showFlags">{{ lang.flag }}</span>
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>