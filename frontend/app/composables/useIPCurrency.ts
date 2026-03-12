// IP-based currency detection
// Detects user's country from IP and sets appropriate currency

export interface GeoLocationResponse {
  country: string
  countryCode: string
  currency: string
}

// Countries that use IDR (Indonesia)
const IDR_COUNTRIES = ['ID']

// Default exchange rate
const EXCHANGE_RATE = 15500 // 1 USD = 15,500 IDR

/**
 * Detect user location from IP using ipapi.co (free tier)
 * This runs on client side after hydration
 */
export async function detectLocationFromIP(): Promise<GeoLocationResponse | null> {
  try {
    // Use ipapi.co for free IP geolocation
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) return null
    
    const data = await response.json()
    return {
      country: data.country_name,
      countryCode: data.country_code,
      currency: data.currency
    }
  } catch (error) {
    console.warn('Failed to detect location from IP:', error)
    return null
  }
}

/**
 * Determine if user should see IDR based on IP
 */
export function shouldUseIDR(location: GeoLocationResponse | null): boolean {
  if (!location) return false // Default to USD if detection fails
  return IDR_COUNTRIES.includes(location.countryCode)
}

/**
 * Composable for IP-based currency
 * Usage: const { price, currency, isLoading } = useIPCurrency(pricingUSD)
 * NOTE: This only works on client-side after hydration
 */
export function useIPCurrency(priceUSD: number) {
  const location = ref<GeoLocationResponse | null>(null)
  const isLoading = ref(true)
  const isClient = ref(false)
  
  // Only detect location on client-side
  onMounted(async () => {
    isClient.value = true
    if (process.client) {
      location.value = await detectLocationFromIP()
      isLoading.value = false
    }
  })
  
  const useIDR = computed(() => shouldUseIDR(location.value))
  
  const price = computed(() => {
    if (!isClient.value) return priceUSD // Default to USD on SSR
    if (useIDR.value) {
      return Math.round(priceUSD * EXCHANGE_RATE)
    }
    return priceUSD
  })
  
  const currency = computed(() => {
    if (!isClient.value) return 'USD'
    return useIDR.value ? 'IDR' : 'USD'
  })
  
  const symbol = computed(() => {
    if (!isClient.value) return '$'
    return useIDR.value ? 'Rp' : '$'
  })
  
  const formatted = computed(() => {
    // During SSR, always show USD
    if (!isClient.value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceUSD)
    }
    
    if (useIDR.value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price.value)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price.value)
    }
  })
  
  return {
    price,
    currency,
    symbol,
    formatted,
    isLoading,
    location,
    useIDR
  }
}

/**
 * Simple composable for just formatting price based on IP
 * NOTE: This only works on client-side
 */
export function usePriceFormatter() {
  const location = ref<GeoLocationResponse | null>(null)
  const detected = ref(false)
  const isClient = ref(false)
  
  onMounted(async () => {
    isClient.value = true
    if (process.client && !detected.value) {
      location.value = await detectLocationFromIP()
      detected.value = true
    }
  })
  
  const formatPrice = (priceUSD: number): string => {
    // During SSR, always show USD
    if (!isClient.value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceUSD)
    }
    
    const isIDR = shouldUseIDR(location.value)
    
    if (isIDR) {
      const priceIDR = Math.round(priceUSD * EXCHANGE_RATE)
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceIDR)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceUSD)
    }
  }
  
  const getCurrencyLabel = (): string => {
    if (!isClient.value) return 'USD'
    return shouldUseIDR(location.value) ? 'IDR' : 'USD'
  }
  
  return {
    formatPrice,
    getCurrencyLabel,
    detected,
    location
  }
}
