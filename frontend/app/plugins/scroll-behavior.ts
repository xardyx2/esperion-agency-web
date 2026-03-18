/**
 * Scroll Behavior Plugin
 *
 * This plugin is kept minimal to avoid scroll locking issues.
 * The scroll restoration functionality has been removed due to
 * compatibility issues with Nuxt i18n language switching.
 *
 * Scroll position is no longer preserved on language switch
 * to ensure smooth scrolling always works.
 */

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // Plugin is loaded but doesn't interfere with scroll
  // This prevents any scroll locking issues
})

/**
 * Placeholder function - no longer saves scroll position
 * Kept for API compatibility
 */
export function saveScrollPosition(): void {
  // Disabled to prevent scroll locking issues
  // Language switch will now naturally scroll to top
}

/**
 * Placeholder function - no longer restores scroll position
 * Kept for API compatibility
 */
export function restoreScrollPosition(): void {
  // Disabled to prevent scroll locking issues
}

/**
 * Clear any saved scroll position
 */
export function clearScrollPosition(): void {
  // No-op - nothing to clear
}
