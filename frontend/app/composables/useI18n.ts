import { ref, computed } from 'vue'

/**
 * Esperion i18n Composable with Caching
 * Internationalization with smart caching to minimize API calls
 * 
 * Caching Strategy:
 * - Static UI translations: Cached in localStorage (never expire)
 * - Dynamic content translations: Cached in SurrealDB with version tracking
 * - Only changed content is requested from API
 * 
 * @usage
 * ```ts
 * const { t, locale, setLocale, detectLocale, cacheTranslation } = useI18n()
 * 
 * // Get translation (auto-cached)
 * const text = t('navigation.home')
 * 
 * // Cache dynamic content translation
 * await cacheTranslation({
 *   sourceText: 'Hello World',
 *   translatedText: 'Halo Dunia',
 *   sourceLang: 'en',
 *   targetLang: 'id'
 * })
 * ```
 */

type Locale = 'id' | 'en'

interface Translations {
  [key: string]: any
}

interface CachedTranslation {
  id: string
  sourceText: string
  translatedText: string
  sourceLang: Locale
  targetLang: Locale
  contentType: 'static' | 'dynamic'
  version: number
  createdAt: Date
  updatedAt: Date
}

// Current locale
const locale = ref<Locale>('id')

// Loaded translations
const translations = ref<Translations>({})

// Translation cache (in-memory)
const translationCache = ref<Map<string, CachedTranslation>>(new Map())

// Cache version for dynamic content
const cacheVersion = ref<number>(1)

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  LOCALE: 'esperion_locale',
  STATIC_CACHE: 'esperion_static_translations',
  CACHE_VERSION: 'esperion_cache_version',
}

/**
 * Load translations for a specific locale
 * Prioritizes cached translations
 */
async function loadTranslations(loc: Locale): Promise<void> {
  try {
    // Try to load from cache first (faster)
    const cached = loadFromCache(loc)
    if (cached) {
      translations.value = cached
      return
    }

    // Fallback to loading from file
    const module = await import(`../locales/${loc}.json`)
    translations.value = module.default
    
    // Cache for next time
    saveToCache(loc, module.default)
  } catch (error) {
    console.error(`Failed to load translations for ${loc}:`, error)
  }
}

/**
 * Load static translations from localStorage cache
 */
function loadFromCache(loc: Locale): Translations | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  try {
    const cached = localStorage.getItem(`${STORAGE_KEYS.STATIC_CACHE}_${loc}`)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('Failed to load translation cache:', error)
  }

  return null
}

/**
 * Save static translations to localStorage cache
 */
function saveToCache(loc: Locale, translations: Translations): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(
      `${STORAGE_KEYS.STATIC_CACHE}_${loc}`,
      JSON.stringify(translations)
    )
  } catch (error) {
    console.error('Failed to save translation cache:', error)
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
 * Uses cached translations when available
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
      localStorage.setItem(STORAGE_KEYS.LOCALE, loc)
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
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale
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

/**
 * Cache dynamic content translation
 * Only caches if content has changed (version tracking)
 * 
 * @param content - Content to cache
 * @param forceUpdate - Force update even if version matches
 */
async function cacheTranslation(
  content: Omit<CachedTranslation, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  forceUpdate: boolean = false
): Promise<void> {
  const cacheKey = `${content.sourceLang}-${content.targetLang}-${content.sourceText}`
  
  // Check if already cached with same version
  const existing = translationCache.value.get(cacheKey)
  if (existing && existing.version >= cacheVersion.value && !forceUpdate) {
    return // Already cached, no need to update
  }

  const cached: CachedTranslation = {
    ...content,
    id: cacheKey,
    version: cacheVersion.value,
    createdAt: existing?.createdAt || new Date(),
    updatedAt: new Date(),
  }

  // Update in-memory cache
  translationCache.value.set(cacheKey, cached)

  // Persist to backend (only if content changed)
  if (!existing || existing.translatedText !== content.translatedText) {
    await saveToBackend(cached)
  }
}

/**
 * Get cached translation for dynamic content
 * Returns null if not found or cache expired
 */
function getCachedTranslation(
  sourceText: string,
  sourceLang: Locale,
  targetLang: Locale
): string | null {
  const cacheKey = `${sourceLang}-${targetLang}-${sourceText}`
  const cached = translationCache.value.get(cacheKey)
  
  if (cached && cached.version >= cacheVersion.value) {
    return cached.translatedText
  }
  
  return null
}

/**
 * Save translation to backend (SurrealDB)
 * Only saves changed content to minimize API calls
 */
async function saveToBackend(content: CachedTranslation): Promise<void> {
  try {
    // This will be called from the backend API
    // POST /api/v1/translations/cache
    await $fetch('/api/v1/translations/cache', {
      method: 'POST',
      body: content,
    })
  } catch (error) {
    console.error('Failed to save translation to backend:', error)
  }
}

/**
 * Load translation cache from backend
 * Only loads content that has changed since last sync
 */
async function loadCacheFromBackend(): Promise<void> {
  try {
    // GET /api/v1/translations/cache?version={cacheVersion}
    const cached = await $fetch< CachedTranslation[]>('/api/v1/translations/cache', {
      query: { version: cacheVersion.value },
    })

    // Update in-memory cache with only new/changed translations
    cached.forEach(item => {
      translationCache.value.set(item.id, item)
    })
  } catch (error) {
    console.error('Failed to load translation cache from backend:', error)
  }
}

/**
 * Invalidate cache and force refresh
 */
function invalidateCache(): void {
  translationCache.value.clear()
  cacheVersion.value++
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CACHE_VERSION, String(cacheVersion.value))
  }
}

/**
 * Clear all caches (useful for testing or manual refresh)
 */
function clearAllCaches(): void {
  translationCache.value.clear()
  
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.STATIC_CACHE_id)
    localStorage.removeItem(STORAGE_KEYS.STATIC_CACHE_en)
    localStorage.removeItem(STORAGE_KEYS.LOCALE)
    localStorage.removeItem(STORAGE_KEYS.CACHE_VERSION)
  }
  
  cacheVersion.value = 1
}

export function useI18n() {
  // Initialize translations on first use
  if (Object.keys(translations.value).length === 0) {
    const detected = detectLocale()
    loadTranslations(detected)
    locale.value = detected
    
    // Load cache version from storage
    if (typeof localStorage !== 'undefined') {
      const version = localStorage.getItem(STORAGE_KEYS.CACHE_VERSION)
      if (version) {
        cacheVersion.value = parseInt(version, 10)
      }
    }
    
    // Load dynamic content cache from backend (non-blocking)
    loadCacheFromBackend()
  }

  return {
    t,
    locale: computed(() => locale.value),
    setLocale,
    detectLocale,
    toggleLocale,
    isIndonesian: computed(() => locale.value === 'id'),
    isEnglish: computed(() => locale.value === 'en'),
    // Cache management
    cacheTranslation,
    getCachedTranslation,
    invalidateCache,
    clearAllCaches,
    cacheVersion: computed(() => cacheVersion.value),
  }
}