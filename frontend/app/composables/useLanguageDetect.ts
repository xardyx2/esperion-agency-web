/**
 * Language Detection Composable
 * Hybrid approach: Browser language + Cloudflare IP geolocation fallback
 *
 * Features:
 * - Detects user's preferred language from browser
 * - Falls back to Cloudflare IP geolocation if ambiguous
 * - Session-based prompt frequency capping
 * - 5-second delay before showing prompt
 *
 * @usage
 * ```ts
 * const { detectLanguage, shouldShowPrompt, markPromptShown } = useLanguageDetect()
 *
 * // Detect language
 * const lang = await detectLanguage()
 *
 * // Check if prompt should be shown
 * if (shouldShowPrompt('en')) {
 *   showPrompt()
 *   markPromptShown()
 * }
 * ```
 */

const SESSION_STORAGE_KEY = 'esperion_language_prompt_shown'

export function useLanguageDetect() {
  /**
   * Detect user's preferred language
   * Priority: 1) Browser, 2) Cloudflare IP, 3) Default (Indonesian)
   */
  async function detectLanguage(): Promise<'id' | 'en'> {
    // Step 1: Check browser language (instant, no API call)
    const browserLang = navigator.language.toLowerCase()

    // Direct match for Indonesian
    if (browserLang.startsWith('id') || browserLang.startsWith('ms')) {
      return 'id'
    }

    // Direct match for English
    if (browserLang.startsWith('en')) {
      return 'en'
    }

    // Step 2: For other languages, check Cloudflare IP geolocation
    try {
      const country = await getCloudflareCountry()

      // Map country to language
      if (country === 'ID') {
        return 'id'
      }

      // English-speaking countries
      if (['US', 'GB', 'AU', 'CA', 'NZ', 'IE', 'SG', 'MY', 'PH', 'IN'].includes(country)) {
        return 'en'
      }

      // Default to Indonesian for other countries (primary market)
      return 'id'
    } catch (error) {
      console.warn('Cloudflare geo detection failed, using browser language:', error)
      // Fallback to browser language
      return browserLang.startsWith('en') ? 'en' : 'id'
    }
  }

  /**
   * Get country code from Cloudflare headers
   * Uses Cloudflare's built-in IP geolocation (free, no API call needed)
   */
  async function getCloudflareCountry(): Promise<string> {
    // Call backend API which has access to Cloudflare headers
    const response = await $fetch<{ country_code: string }>('/api/geo', {
      method: 'GET'
    })
    return response.country_code
  }

  /**
   * Check if language prompt should be shown
   *
   * @param currentLang - Current page language (from URL)
   * @param detectedLang - Detected user language
   * @returns true if prompt should be shown
   */
  function shouldShowPrompt(
    currentLang: string,
    detectedLang: string
  ): boolean {
    // Don't show if languages match
    if (currentLang === detectedLang) {
      return false
    }

    // Don't show if already shown in this session
    if (isPromptShownThisSession()) {
      return false
    }

    return true
  }

  /**
   * Check if prompt was already shown in current session
   */
  function isPromptShownThisSession(): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false
    }
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true'
  }

  /**
   * Mark prompt as shown for current session
   */
  function markPromptShown(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
    }
  }

  /**
   * Clear prompt session (useful for testing)
   */
  function clearPromptSession(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  return {
    detectLanguage,
    getCloudflareCountry,
    shouldShowPrompt,
    isPromptShownThisSession,
    markPromptShown,
    clearPromptSession
  }
}
