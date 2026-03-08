// LocalBusiness Schema Composable for SEO
// Implements Schema.org LocalBusiness structured data for local SEO

export interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': string
  '@id'?: string
  name: string
  description?: string
  url: string
  telephone?: string
  email?: string
  image?: string | string[]
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: OpeningHoursSpec[]
  priceRange?: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
  }
  sameAs?: string[]
  areaServed?: string[]
  hasOfferCatalog?: OfferCatalog
}

export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export interface OfferCatalog {
  '@type': 'OfferCatalog'
  name: string
  itemListElement: {
    '@type': 'Offer'
    itemOffered: {
      '@type': 'Service'
      name: string
      description?: string
    }
  }[]
}

// Esperion Business Configuration
// TODO: Update with actual business details
export const esperionBusinessConfig = {
  name: 'Esperion Digital Agency',
  description: 'Esperion Digital Agency adalah agensi digital terkemuka di Jakarta yang menyediakan layanan web development, mobile app development, UI/UX design, dan digital marketing.',
  url: 'https://esperion.id',
  telephone: '+62-XXX-XXXX-XXXX', // TODO: Update with actual phone
  email: 'hello@esperion.id',
  logo: '/placeholders/first-party/brand-mark-required.svg',
  image: [
    '/images/office-exterior.jpg',
    '/images/office-interior.jpg',
    '/images/team.jpg'
  ],
  // TODO: Update with actual address
  address: {
    streetAddress: 'Jl. [Street Name] No. [Number]',
    addressLocality: 'Jakarta Selatan',
    addressRegion: 'DKI Jakarta',
    postalCode: '12XXX',
    addressCountry: 'ID'
  },
  // TODO: Update with actual coordinates
  geo: {
    latitude: -6.2088,
    longitude: 106.8456
  },
  priceRange: '$$',
  // Social media profiles
  sameAs: [
    'https://instagram.com/esperionagency',
    'https://facebook.com/esperionagency',
    'https://linkedin.com/company/esperionagency',
    'https://twitter.com/esperionagency'
  ],
  // Service areas
  areaServed: [
    'Jakarta',
    'Tangerang',
    'Bekasi',
    'Depok',
    'Bogor'
  ]
}

// Opening hours configuration
export const openingHours: OpeningHoursSpec[] = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00'
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday'],
    opens: '09:00',
    closes: '14:00'
  }
]

// Services offered
export const services = [
  {
    name: 'Web Development',
    description: 'Custom website dan web application development menggunakan teknologi modern seperti Nuxt, Next.js, dan React.'
  },
  {
    name: 'Mobile App Development',
    description: 'Native dan cross-platform mobile application development untuk iOS dan Android menggunakan React Native dan Flutter.'
  },
  {
    name: 'UI/UX Design',
    description: 'User-centered design yang menciptakan pengalaman digital yang intuitif dan engaging.'
  },
  {
    name: 'Digital Marketing',
    description: 'Strategi digital marketing komprehensif termasuk SEO, SEM, Social Media Marketing, dan Content Marketing.'
  },
  {
    name: 'E-Commerce Solutions',
    description: 'Setup dan optimasi online store dengan platform seperti Shopify, WooCommerce, atau custom solution.'
  },
  {
    name: 'Consulting',
    description: 'Konsultasi transformasi digital dan technology strategy untuk bisnis Anda.'
  }
]

/**
 * Generate LocalBusiness schema for Esperion
 */
export function useLocalBusinessSchema() {
  const config = useRuntimeConfig()
  
  const generateSchema = (options: {
    type?: string
    includeServices?: boolean
    includeRating?: boolean
    ratingValue?: number
    reviewCount?: number
  } = {}): LocalBusinessSchema => {
    const {
      type = 'ProfessionalService',
      includeServices = true,
      includeRating = false,
      ratingValue = 4.9,
      reviewCount = 50
    } = options

    const schema: LocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': type,
      '@id': `${esperionBusinessConfig.url}/#organization`,
      name: esperionBusinessConfig.name,
      description: esperionBusinessConfig.description,
      url: esperionBusinessConfig.url,
      telephone: esperionBusinessConfig.telephone,
      email: esperionBusinessConfig.email,
      image: esperionBusinessConfig.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: esperionBusinessConfig.address.streetAddress,
        addressLocality: esperionBusinessConfig.address.addressLocality,
        addressRegion: esperionBusinessConfig.address.addressRegion,
        postalCode: esperionBusinessConfig.address.postalCode,
        addressCountry: esperionBusinessConfig.address.addressCountry
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: esperionBusinessConfig.geo.latitude,
        longitude: esperionBusinessConfig.geo.longitude
      },
      openingHoursSpecification: openingHours,
      priceRange: esperionBusinessConfig.priceRange,
      sameAs: esperionBusinessConfig.sameAs,
      areaServed: esperionBusinessConfig.areaServed
    }

    if (includeRating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount
      }
    }

    if (includeServices) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: 'Digital Agency Services',
        itemListElement: services.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description
          }
        }))
      }
    }

    return schema
  }

  /**
   * Generate Organization schema (alternative to LocalBusiness)
   */
  const generateOrganizationSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${esperionBusinessConfig.url}/#organization`,
      name: esperionBusinessConfig.name,
      description: esperionBusinessConfig.description,
      url: esperionBusinessConfig.url,
      logo: esperionBusinessConfig.logo,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: esperionBusinessConfig.telephone,
        contactType: 'customer service',
        availableLanguage: ['Indonesian', 'English']
      },
      sameAs: esperionBusinessConfig.sameAs,
      address: {
        '@type': 'PostalAddress',
        streetAddress: esperionBusinessConfig.address.streetAddress,
        addressLocality: esperionBusinessConfig.address.addressLocality,
        addressRegion: esperionBusinessConfig.address.addressRegion,
        postalCode: esperionBusinessConfig.address.postalCode,
        addressCountry: esperionBusinessConfig.address.addressCountry
      }
    }
  }

  /**
   * Generate FAQ schema for common questions
   */
  const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  /**
   * Generate BreadcrumbList schema
   */
  const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${esperionBusinessConfig.url}${item.url}`
      }))
    }
  }

  return {
    generateSchema,
    generateOrganizationSchema,
    generateFAQSchema,
    generateBreadcrumbSchema,
    esperionBusinessConfig,
    openingHours,
    services
  }
}

/**
 * Common FAQ for Jakarta Digital Agency
 */
export const jakartaFAQs = [
  {
    question: 'Berapa biaya jasa digital agency di Jakarta?',
    answer: 'Biaya layanan digital agency di Jakarta bervariasi tergantung scope project. Website development mulai Rp 15.000.000, mobile app development mulai Rp 50.000.000, dan digital marketing mulai Rp 5.000.000/bulan. Esperion Digital Agency menyediakan penawaran sesuai kebutuhan bisnis Anda.'
  },
  {
    question: 'Berapa lama project website selesai?',
    answer: 'Timeline project website tergantung kompleksitas. Landing page 1-2 minggu, company profile website 2-4 minggu, e-commerce website 4-8 minggu, dan custom web application 8-16 minggu. Kami memberikan timeline detail sebelum project dimulai.'
  },
  {
    question: 'Apakah bisa meeting langsung di Jakarta?',
    answer: 'Ya, Esperion Digital Agency membuka untuk meeting langsung di office kami di Jakarta, meeting online via Zoom/Google Meet, atau visit ke lokasi klien di area Jabodetabek.'
  },
  {
    question: 'Payment terms bagaimana?',
    answer: 'Kami menawarkan fleksibilitas pembayaran: 50% down payment dan 50% upon completion, milestone-based payment untuk project besar, atau monthly retainer untuk digital marketing. Invoice resmi dan kontrak kerja disediakan.'
  }
]
