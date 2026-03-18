import type { PublicAnalyticsConfig, TrackEventRequest, ConsentTierState } from '../types/api'
import { getStoredConsent, hasValidConsent, encodeConsentForHeader } from '../composables/useConsent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    clarity?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track?: (...args: unknown[]) => void
      page?: () => void
      load?: (id: string) => void
      _i?: Record<string, unknown>
    }
    lintrk?: (...args: unknown[]) => void
    _linkedin_data_partner_ids?: string[]
  }
}

function resolveApiBase(rawBase: string): string {
  if (!rawBase) return '/api/v1'
  if (rawBase.endsWith('/api/v1')) return rawBase
  if (rawBase.endsWith('/')) return `${rawBase}api/v1`
  return `${rawBase}/api/v1`
}

function ensureScript(src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

// NEW: Initialize integrations with consent checking
function initializeIntegrationsWithConsent(
  config: PublicAnalyticsConfig,
  consent: ConsentTierState
): void {
  // Essential trackers (always allowed)
  console.log('[Analytics] Initializing essential trackers')

  // Analytics tier: GA4, GTM (requires analytics consent)
  if (consent.analytics) {
    console.log('[Analytics] Analytics tier enabled - initializing GA4, GTM')
    if (config.ga4_measurement_id) {
      ensureScript(`https://www.googletagmanager.com/gtag/js?id=${config.ga4_measurement_id}`)
      window.dataLayer = window.dataLayer || []
      const gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
      gtag('js', new Date())
      gtag('config', config.ga4_measurement_id, { send_page_view: false })
    }

    if (config.gtm_container_id) {
      ensureScript(`https://www.googletagmanager.com/gtm.js?id=${config.gtm_container_id}`)
    }
  } else {
    console.log('[Analytics] Analytics tier disabled - skipping GA4, GTM')
  }

  // Functional tier: Clarity (requires functional consent)
  if (consent.functional) {
    console.log('[Analytics] Functional tier enabled - initializing Clarity')
    if (config.clarity_project_id) {
      ensureScript(`https://www.clarity.ms/tag/${config.clarity_project_id}`)
    }
  } else {
    console.log('[Analytics] Functional tier disabled - skipping Clarity')
  }

  // Marketing tier: Pixels (requires explicit marketing consent)
  if (consent.marketing) {
    console.log('[Analytics] Marketing tier enabled - initializing Meta, TikTok, LinkedIn')
    if (config.meta_pixel_id && !window.fbq) {
      ensureScript('https://connect.facebook.net/en_US/fbevents.js')
      window.fbq = (..._args: unknown[]) => {}
      window.fbq('init', config.meta_pixel_id)
    }

    if (config.tiktok_pixel_id && !window.ttq) {
      ensureScript('https://analytics.tiktok.com/i18n/pixel/events.js')
      window.ttq = { _i: {} }
      window.ttq.load?.(config.tiktok_pixel_id)
    }

    if (config.linkedin_partner_id) {
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
      if (!window._linkedin_data_partner_ids.includes(config.linkedin_partner_id)) {
        window._linkedin_data_partner_ids.push(config.linkedin_partner_id)
      }
      ensureScript('https://snap.licdn.com/li.lms-analytics/insight.min.js')
    }
  } else {
    console.log('[Analytics] Marketing tier disabled - skipping Meta, TikTok, LinkedIn')
  }
}

// NEW: Dispatch events only if consent allows
function dispatchThirdPartyPageView(path: string, consent?: ConsentTierState): void {
  if (!consent) return

  // GA4 - requires analytics consent
  if (consent.analytics && window.dataLayer) {
    window.dataLayer.push({ event: 'page_view', page_path: path })
  }

  // Clarity - requires functional consent
  if (consent.functional && window.clarity) {
    window.clarity('event', 'page_view')
  }

  // Marketing pixels - requires marketing consent
  if (consent.marketing) {
    window.fbq?.('track', 'PageView')
    window.ttq?.page?.()
    window.lintrk?.('track', { conversion_id: 0 })
  }
}

// NEW: Check if specific tracker is initialized
function isTrackerInitialized(trackerId: string): boolean {
  switch (trackerId) {
    case 'ga4':
      return typeof window.dataLayer !== 'undefined'
    case 'gtm':
      return document.querySelector('script[src*="googletagmanager.com/gtm.js"]') !== null
    case 'clarity':
      return typeof window.clarity !== 'undefined'
    case 'meta_pixel':
      return typeof window.fbq !== 'undefined'
    case 'tiktok_pixel':
      return typeof window.ttq !== 'undefined'
    case 'linkedin':
      return typeof window.lintrk !== 'undefined'
    default:
      return false
  }
}

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = resolveApiBase(runtimeConfig.public.apiBase as string)

  // STEP 1: Check for existing consent
  const storedConsent = getStoredConsent()

  // STEP 2: Fetch config with consent header (if available)
  const headers: Record<string, string> = {}
  if (storedConsent) {
    headers['X-Consent-Preferences'] = encodeConsentForHeader(storedConsent)
  }

  const publicConfig = await $fetch<PublicAnalyticsConfig>(
    `${apiBase}/analytics/public-config`,
    { headers }
  ).catch(() => null)

  if (!publicConfig || !publicConfig.enabled) {
    console.log('[Analytics] Analytics disabled or config unavailable')
    return
  }

  // STEP 3: Check if consent is required
  if (publicConfig.consent_required) {
    if (!storedConsent) {
      console.log('[Analytics] Consent required but not given - deferring tracker initialization')
      // Trackers will be initialized after user gives consent via banner
      // For now, only initialize essential (backend) tracking
    } else {
      // Consent exists - initialize allowed trackers
      initializeIntegrationsWithConsent(publicConfig, storedConsent.tiers)
    }
  } else {
    // Consent not required - initialize all configured trackers
    console.log('[Analytics] Consent not required - initializing all trackers')
    // Use default consent (all tiers enabled)
    const defaultTiers: ConsentTierState = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true
    }
    initializeIntegrationsWithConsent(publicConfig, defaultTiers)
  }

  // STEP 4: Backend event tracking (always allowed, first-party)
  const sessionKey = 'esperion_analytics_session'
  const existingSession = localStorage.getItem(sessionKey)
  const sessionId = existingSession || crypto.randomUUID()
  if (!existingSession) {
    localStorage.setItem(sessionKey, sessionId)
  }

  const track = async (eventName: string, metadata?: Record<string, unknown>) => {
    const payload: TrackEventRequest = {
      event_name: eventName,
      session_id: sessionId,
      page_url: window.location.pathname,
      referrer: document.referrer || undefined,
      language: navigator.language,
      metadata
    }

    await $fetch(`${apiBase}/analytics/track`, {
      method: 'POST',
      body: payload
    }).catch(() => undefined)
  }

  // Track page views and events
  const router = useRouter()
  router.afterEach(async (to) => {
    // Only dispatch third-party events if consent allows
    if (!publicConfig.consent_required || hasValidConsent()) {
      const consent = storedConsent?.tiers || { essential: true, analytics: true, functional: true, marketing: true }
      dispatchThirdPartyPageView(to.fullPath, consent)
    }

    // Backend tracking (always allowed)
    await track('page_view', { path: to.fullPath })
  })

  await track('session_start')

  // Provide analytics API to app
  return {
    provide: {
      analytics: {
        track,
        hasConsent: hasValidConsent,
        getConsent: getStoredConsent,
        // Function to update consent and reinitialize
        updateConsent: async (newConsent: ConsentTierState) => {
          const { updateConsent: updateStoredConsent } = await import('../composables/useConsent')
          const preferences = updateStoredConsent(newConsent)

          // Re-fetch config with new consent
          const newHeaders: Record<string, string> = {
            'X-Consent-Preferences': encodeConsentForHeader(preferences)
          }
          const newConfig = await $fetch<PublicAnalyticsConfig>(
            `${apiBase}/analytics/public-config`,
            { headers: newHeaders }
          ).catch(() => null)

          if (newConfig) {
            initializeIntegrationsWithConsent(newConfig, newConsent)
          }

          return preferences
        },
        isTrackerInitialized
      }
    }
  }
})
