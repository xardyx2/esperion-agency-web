import { useI18n } from 'vue-i18n'
import { PUBLIC_IDENTITY } from './usePublicIdentity'
import { useHead, useRuntimeConfig } from '#app'

export interface SeoMetaOptions {
  title: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: 'website' | 'article' | 'profile'
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonical?: string
  noIndex?: boolean
  schema?: Record<string, any>
}

export interface OgImageOptions {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

/**
 * Define Open Graph image metadata
 * @param options - OG image options
 * @returns OG image meta tags object
 */
export function defineOgImage(options: OgImageOptions): Record<string, string> {
  const { url, width = 1200, height = 630, alt = '', type = 'image/jpeg' } = options

  return {
    'og:image': url,
    'og:image:width': width.toString(),
    'og:image:height': height.toString(),
    'og:image:alt': alt,
    'og:image:type': type
  }
}

/**
 * Composable for page-specific SEO metadata
 * Implements hybrid localization: English titles, Indonesian descriptions
 * @param options - SEO meta options
 * @param pageType - Type of page for default values
 */
export function usePageSeo(
  options: Partial<SeoMetaOptions> = {},
  pageType: 'home' | 'services' | 'works' | 'articles' | 'contact' | 'about' = 'home'
) {
  const { t, locale } = useI18n()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || PUBLIC_IDENTITY.siteUrl
  const currentLocale = locale.value

  // Default SEO values based on page type and locale
  const defaults: Record<string, Record<string, { title: string, description: string }>> = {
    home: {
      en: {
        title: 'Best Digital Marketing Services in Jakarta - Esperion',
        description: 'Professional digital marketing, web development, and mobile app services in Jakarta.'
      },
      id: {
        title: 'Jasa Digital Marketing Terbaik Jakarta - Esperion',
        description: 'Jasa digital marketing, web development, dan aplikasi mobile profesional di Jakarta.'
      }
    },
    services: {
      en: {
        title: 'Digital Marketing Services - Esperion Agency',
        description: 'Professional digital marketing, web development, SEO, and UI/UX design services.'
      },
      id: {
        title: 'Layanan Digital Marketing - Esperion Agency',
        description: 'Layanan digital marketing, web development, SEO, dan UI/UX design profesional.'
      }
    },
    works: {
      en: {
        title: 'Portfolio - Selected Projects from Esperion',
        description: 'Explore Esperion\'s digital project portfolio, from websites to mobile apps.'
      },
      id: {
        title: 'Portofolio - Proyek Pilihan Esperion',
        description: 'Jelajahi portofolio proyek digital Esperion, dari website hingga aplikasi mobile.'
      }
    },
    articles: {
      en: {
        title: 'Articles - Digital Insights from Esperion',
        description: 'Read articles and insights about web development, design, and digital marketing.'
      },
      id: {
        title: 'Artikel - Insight Digital dari Esperion',
        description: 'Baca artikel dan insight seputar pengembangan web, desain, dan digital marketing.'
      }
    },
    contact: {
      en: {
        title: 'Contact Us - Esperion Digital Agency Jakarta',
        description: 'Contact Esperion Digital Agency in Jakarta. FREE consultation available!'
      },
      id: {
        title: 'Hubungi Kami - Esperion Digital Agency Jakarta',
        description: 'Hubungi Esperion Digital Agency di Jakarta. Konsultasi GRATIS tersedia!'
      }
    },
    about: {
      en: {
        title: 'About Us - Esperion Digital Agency',
        description: 'Learn about Esperion, a digital agency helping businesses grow through strategy and design.'
      },
      id: {
        title: 'Tentang Kami - Esperion Digital Agency',
        description: 'Kenali Esperion, agensi digital yang membantu bisnis tumbuh lewat strategi dan desain.'
      }
    }
  }

  const localeDefaults = (defaults[pageType] || defaults.home) as Record<string, { title: string, description: string }>
  const pageDefaults = (localeDefaults[currentLocale] || localeDefaults.id) as { title: string, description: string }

  // Merge with provided options
  const title = options.title || pageDefaults.title
  const description = options.description || pageDefaults.description
  const ogTitle = options.ogTitle || title
  const ogDescription = options.ogDescription || description
  const twitterTitle = options.twitterTitle || ogTitle
  const twitterDescription = options.twitterDescription || ogDescription
  const canonicalUrl = options.canonical || `${siteUrl}/${currentLocale}`
  const ogUrl = options.ogUrl || canonicalUrl

  // Default OG image
  const defaultOgImage = '/images/esperion-agency-hero.jpg'
  const ogImage = options.ogImage || defaultOgImage
  const twitterImage = options.twitterImage || ogImage

  // Set up meta tags
  const meta: Record<string, string> = {
    description,
    'og:title': ogTitle,
    'og:description': ogDescription,
    'og:image': ogImage,
    'og:url': ogUrl,
    'og:type': options.ogType || 'website',
    'og:locale': currentLocale === 'id' ? 'id_ID' : 'en_US',
    'twitter:card': options.twitterCard || 'summary_large_image',
    'twitter:title': twitterTitle,
    'twitter:description': twitterDescription,
    'twitter:image': twitterImage
  }

  // Add OG image dimensions if using default image
  if (ogImage === defaultOgImage) {
    meta['og:image:width'] = '1200'
    meta['og:image:height'] = '630'
  }

  // Add noindex if specified
  if (options.noIndex) {
    meta.robots = 'noindex, nofollow'
  }

  // Use Nuxt's useHead for meta tags
  useHead({
    title,
    meta: Object.entries(meta).map(([name, content]) => ({
      name,
      content
    })),
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ]
  })

  // Return values for further use (e.g., in templates)
  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl
  }
}

/**
 * Helper to generate breadcrumb schema
 * @param items - Array of breadcrumb items
 * @returns Schema.org BreadcrumbList JSON-LD
 */
export function defineBreadcrumbSchema(items: Array<{ name: string, url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  }
}

/**
 * Helper to generate Organization schema
 * @returns Schema.org Organization JSON-LD
 */
export function defineOrganizationSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': PUBLIC_IDENTITY.siteName,
    'legalName': PUBLIC_IDENTITY.legalName,
    'url': PUBLIC_IDENTITY.siteUrl,
    'sameAs': PUBLIC_IDENTITY.sameAs,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': PUBLIC_IDENTITY.phoneDisplay,
      'contactType': 'customer service',
      'areaServed': 'ID',
      'availableLanguage': ['Indonesian', 'English']
    }
  }
}
