// Consent Management Types
// For analytics consent management system

export enum TrackerTier {
  Essential = 'essential',
  Analytics = 'analytics',
  Functional = 'functional',
  Marketing = 'marketing'
}

export interface ConsentTierState {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export interface ConsentPreferences {
  version: string
  timestamp: string
  tiers: ConsentTierState
}

export interface TrackerConsentRules {
  tracker_id: string
  tier: TrackerTier
  requires_consent: boolean
  default_allowed: boolean
  description: string
}

export interface ConsentTierConfig {
  essential_enabled: boolean
  analytics_enabled: boolean
  functional_enabled: boolean
  marketing_enabled: boolean
}

// Default consent (new user)
export const defaultConsent: ConsentPreferences = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  tiers: {
    essential: true, // Locked
    analytics: true, // Default ON (business essential)
    functional: false, // Default OFF
    marketing: false // Default OFF
  }
}

// Consent storage key
export const CONSENT_KEY = 'esperion_consent_preferences'
export const CONSENT_VERSION = '1.0.0'
