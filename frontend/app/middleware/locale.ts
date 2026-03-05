/**
 * Locale Detection Middleware
 * Auto-detects user locale and redirects to appropriate URL prefix
 * 
 * Usage: Add to pages that need locale detection
 * 
 * @usage
 * ```ts
 * // In a page component
 * definePageMeta({
 *   middleware: ['locale']
 * })
 * ```
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip if already has locale prefix
  if (to.path.startsWith('/id') || to.path.startsWith('/en')) {
    return
  }

  // Detect locale from browser/storage
  const detected = detectLocale()
  
  // Redirect to locale-prefixed path
  return navigateTo(`/${detected}${to.path}`)
})

/**
 * Helper function to detect locale
 * Matches the logic in useI18n composable
 */
function detectLocale(): 'id' | 'en' {
  // Check saved preference first (client-side only)
  if (import.meta.client && typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('esperion_locale') as 'id' | 'en'
    if (saved && ['id', 'en'].includes(saved)) {
      return saved
    }
  }
  
  // Check if we can get locale from request headers (server-side)
  if (import.meta.server) {
    const event = useRequestEvent()
    const acceptLanguage = event?.headers.get('accept-language')
    if (acceptLanguage) {
      if (acceptLanguage.toLowerCase().includes('id')) {
        return 'id'
      }
      if (acceptLanguage.toLowerCase().includes('en')) {
        return 'en'
      }
    }
  }
  
  // Default to Indonesian
  return 'id'
}