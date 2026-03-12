// Currency utility for dual pricing (IDR & USD)

export interface CurrencyConfig {
  code: string
  symbol: string
  locale: string
  exchangeRate: number // IDR per 1 USD
}

// Exchange rate configuration
// NOTE: In production, this should be fetched from an API
const EXCHANGE_RATE = 15500 // 1 USD = 15,500 IDR (update as needed)

export const currencies: Record<string, CurrencyConfig> = {
  id: {
    code: 'IDR',
    symbol: 'Rp',
    locale: 'id-ID',
    exchangeRate: EXCHANGE_RATE
  },
  en: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    exchangeRate: 1
  }
}

/**
 * Format price based on locale
 * @param priceUSD - Price in USD
 * @param locale - Current locale ('id' or 'en')
 * @returns Formatted price string
 */
export function formatPrice(priceUSD: number, locale: string): string {
  const config = currencies[locale] || currencies.en
  
  if (locale === 'id') {
    // Convert to IDR
    const priceIDR = Math.round(priceUSD * config.exchangeRate)
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceIDR)
  } else {
    // Keep as USD
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceUSD)
  }
}

/**
 * Parse pricing string to number
 * Supports formats: "$5,000", "$5000", "5000", "Rp 5.000.000"
 * @param pricingString - Pricing string from data
 * @returns Price in USD number
 */
export function parsePrice(pricingString: string): number {
  // Remove currency symbols and spaces
  const cleaned = pricingString
    .replace(/[\$Rp\s]/gi, '')
    .replace(/\./g, '') // Remove thousand separators (dots for IDR)
    .replace(/,/g, '') // Remove thousand separators (commas for USD)
  
  const numericValue = parseInt(cleaned, 10)
  
  // If the value is very large (> 10000), assume it's already in IDR
  if (numericValue > 10000 && pricingString.includes('Rp')) {
    return Math.round(numericValue / EXCHANGE_RATE)
  }
  
  return numericValue || 0
}

/**
 * Get price display with locale
 * @param priceUSD - Price in USD
 * @param locale - Current locale
 * @returns Object with formatted price and currency code
 */
export function getPriceDisplay(priceUSD: number, locale: string): {
  formatted: string
  currency: string
  value: number
} {
  const config = currencies[locale] || currencies.en
  
  if (locale === 'id') {
    const value = Math.round(priceUSD * config.exchangeRate)
    return {
      formatted: new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value),
      currency: config.code,
      value
    }
  } else {
    return {
      formatted: new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceUSD),
      currency: config.code,
      value: priceUSD
    }
  }
}

/**
 * Vue composable for reactive currency display
 * Usage: const { formatPrice } = useCurrency()
 * Template: {{ formatPrice(5000) }}
 */
export function useCurrency() {
  const { locale } = useI18n()
  
  const currentCurrency = computed(() => {
    return currencies[locale.value] || currencies.en
  })
  
  const format = (priceUSD: number | string): string => {
    const numericPrice = typeof priceUSD === 'string' ? parsePrice(priceUSD) : priceUSD
    return formatPrice(numericPrice, locale.value)
  }
  
  const formatWithUnit = (priceUSD: number | string): { price: string; unit: string } => {
    const numericPrice = typeof priceUSD === 'string' ? parsePrice(priceUSD) : priceUSD
    const display = getPriceDisplay(numericPrice, locale.value)
    return {
      price: display.formatted,
      unit: locale.value === 'id' ? 'IDR' : 'USD'
    }
  }
  
  return {
    formatPrice: format,
    formatWithUnit,
    currentCurrency,
    exchangeRate: EXCHANGE_RATE
  }
}
