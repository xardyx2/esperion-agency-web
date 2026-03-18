/**
 * Locale Detection Middleware
 * Auto-detects user locale and redirects to appropriate URL prefix
 * Works with @nuxtjs/i18n module
 *
 * Usage: Auto-applied by @nuxtjs/i18n when using detectBrowserLanguage
 */

export default defineNuxtRouteMiddleware((to) => {
  // With @nuxtjs/i18n configured with detectBrowserLanguage,
  // the locale detection and redirection is handled by the module
  // This middleware can be kept for additional logic if needed
  // but basic redirection functionality is provided by @nuxtjs/i18n

  // Skip if already has locale prefix - handled by module
  if (to.path.startsWith('/id') || to.path.startsWith('/en')) {
    return
  }

  // Additional custom logic can go here if needed
  // For example, custom locale resolution or logging

  // For now, return early since @nuxtjs/i18n handles redirectOn: 'root'
})
