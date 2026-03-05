import { ref, computed } from 'vue'

/**
 * Esperion i18n Composable
 * Simple internationalization with locale detection and switching
 * 
 * @usage
 * ```ts
 * const { t, locale, setLocale, detectLocale } = useI18n()
 * 
 * // Get translation
 * const text = t('navigation.home')
 * 
 * // Get current locale
 * const current = locale.value // 'id' | 'en'
 * 
 * // Set locale
 * setLocale('en')
 * 
 * // Auto-detect locale from IP/browser
 * await detectLocale()
 * ```
 */

type Locale = 'id' | 'en'

interface Translations {
  [key: string]: any
}

// Current locale
const locale = ref<Locale>('id')

// Loaded translations
const translations = ref<Translations>({})

/**
 * Load translations for a specific locale
 */
async function loadTranslations(loc: Locale): Promise<void> {
  try {
    const module = await import(`../locales/${loc}.json`)
    translations.value = module.default
  } catch (error) {
    console.error(`Failed to load translations for ${loc}:`, error)
  }
}

/**
 * Get nested translation by key path (e.g., 'navigation.home')
 */
function getNestedValue(obj: Translations, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path
}

/**
 * Translate a key with optional interpolation
 */
function t(key: string, params?: Record<string, string | number>): string {
  let text = getNestedValue(translations.value, key)
  
  // If translation not found, try fallback to English
  if (text === key && locale.value !== 'en') {
    text = getNestedValue(translations.value, key)
  }
  
  // Interpolate parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    })
  }
  
  return text
}

/**
 * Set locale and load translations
 */
async function setLocale(loc: Locale): Promise<void> {
  if (loc !== locale.value) {
    locale.value = loc
    await loadTranslations(loc)
    
    // Save preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('esperion_locale', loc)
    }
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = loc
    }
  }
}

/**
 * Detect locale from browser or saved preference
 */
function detectLocale(): Locale {
  // Check saved preference first
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('esperion_locale') as Locale
    if (saved && ['id', 'en'].includes(saved)) {
      return saved
    }
  }
  
  // Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('id')) {
      return 'id'
    }
    if (browserLang.startsWith('en')) {
      return 'en'
    }
  }
  
  // Default to Indonesian
  return 'id'
}

/**
 * Toggle between Indonesian and English
 */
function toggleLocale(): Promise<void> {
  const newLocale: Locale = locale.value === 'id' ? 'en' : 'id'
  return setLocale(newLocale)
}

export function useI18n() {
  // Initialize translations on first use
  if (Object.keys(translations.value).length === 0) {
    const detected = detectLocale()
    loadTranslations(detected)
    locale.value = detected
  }

  return {
    t,
    locale: computed(() => locale.value),
    setLocale,
    detectLocale,
    toggleLocale,
    isIndonesian: computed(() => locale.value === 'id'),
    isEnglish: computed(() => locale.value === 'en'),
  }
}