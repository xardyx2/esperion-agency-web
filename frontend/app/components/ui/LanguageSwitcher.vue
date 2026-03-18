<script setup lang="ts">
/**
 * Language Switcher Component
 * Dropdown style like vuejs.org
 *
 * @usage
 * ```vue
 * <LanguageSwitcher />
 * <LanguageSwitcher size="sm" />
 * ```
 */

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const { locale, setLocale } = useI18n()
const colorMode = useColorMode()

// Dropdown state
const isOpen = ref(false)
const dropdownRef = ref<HTMLDivElement>()

// Language options with translations
const languages = [
  { code: 'id' as const, name: 'Bahasa Indonesia', shortName: 'ID' },
  { code: 'en' as const, name: 'English', shortName: 'EN' }
]

// Size classes
const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2'
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
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
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Toggle dropdown
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative inline-block"
  >
    <!-- Dropdown Trigger Button -->
    <button
      type="button"
      :class="[
        'inline-flex items-center gap-1.5 rounded-lg transition-colors duration-200',
        'text-es-text-secondary dark:text-es-text-secondary-dark',
        'hover:text-es-text-primary dark:hover:text-es-text-primary-dark',
        'hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark',
        sizeClasses[size]
      ]"
      :aria-label="`Current language: ${currentLang.name}. Click to change`"
      :aria-expanded="isOpen"
      @click.stop="toggleDropdown"
    >
      <!-- Translate Icon -->
      <svg
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
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span class="font-medium">{{ currentLang.shortName }}</span>
      <!-- Chevron Icon -->
      <svg
        :class="[iconSizes[size], 'transition-transform duration-200', isOpen ? 'rotate-180' : '']"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-full mb-2 right-0 w-48 rounded-lg shadow-lg z-50 overflow-hidden"
        :class="[
          'bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
          'border border-es-border dark:border-es-border-dark'
        ]"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            :class="[
              'w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3',
              'hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark',
              locale === lang.code 
                ? 'text-es-accent-primary dark:text-es-accent-primary-dark font-medium' 
                : 'text-es-text-secondary dark:text-es-text-secondary-dark'
            ]"
            @click="switchToLanguage(lang.code)"
          >
            <!-- Check Icon for active language -->
            <svg
              v-if="locale === lang.code"
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span
              v-else
              class="w-4 h-4"
            />
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
