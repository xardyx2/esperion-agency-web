/**
 * Consent Management Composable
 *
 * Manages user consent preferences for analytics tracking
 * Stores consent in localStorage with versioning and expiration
 */

import type { ConsentPreferences, ConsentTierState } from '../types/consent'
import { defaultConsent, CONSENT_KEY, CONSENT_VERSION } from '../types/consent'

// Get stored consent from localStorage
export function getStoredConsent(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as ConsentPreferences

    // Check version - if outdated, return null (will show banner again)
    if (parsed.version !== CONSENT_VERSION) {
      console.log('[Analytics] Consent version outdated, requesting new consent')
      return null
    }

    return parsed
  } catch {
    return null
  }
}

// Check if consent is valid (not expired)
export function hasValidConsent(): boolean {
  const consent = getStoredConsent()
  if (!consent) return false

  // Check if consent is expired (e.g., 6 months)
  const consentDate = new Date(consent.timestamp)
  const expiryDate = new Date(consentDate)
  expiryDate.setMonth(expiryDate.getMonth() + 6)

  return new Date() < expiryDate
}

// Encode consent for API header (Base64)
export function encodeConsentForHeader(consent: ConsentPreferences): string {
  return btoa(JSON.stringify(consent))
}

// Accept all consent tiers
export function acceptAll(): ConsentPreferences {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    tiers: {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true
    }
  }

  localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences))
  return preferences
}

// Accept only essential + analytics (default)
export function acceptEssentialOnly(): ConsentPreferences {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    tiers: {
      essential: true,
      analytics: true, // Business essential
      functional: false,
      marketing: false
    }
  }

  localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences))
  return preferences
}

// Update consent with custom tiers
export function updateConsent(tiers: ConsentTierState): ConsentPreferences {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    tiers
  }

  localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences))
  return preferences
}

// Clear consent (for testing)
export function clearConsent(): void {
  localStorage.removeItem(CONSENT_KEY)
}

// Composable for Vue components
export const useConsent = () => {
  return {
    hasConsent: hasValidConsent,
    getConsent: getStoredConsent,
    acceptAll,
    acceptEssentialOnly,
    updateConsent,
    clearConsent,
    encodeConsentForHeader
  }
}
