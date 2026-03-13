// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV !== 'production'

export default ({

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  pages: true,

  components: [
    {
      path: '~/app/components',
      pathPrefix: false
    }
  ],
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      title: 'Esperion - Digital Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Esperion Digital Agency - Data-Driven Digital Strategies' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#FAFCFF' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0B1120' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS files
  css: [
    '~/app/assets/css/main.css'
  ],

  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      recaptchaSiteKey: process.env.NUXT_RECAPTCHA_SITE_KEY || '',
      ga4MeasurementId: process.env.NUXT_GA4_MEASUREMENT_ID || '',
      clarityProjectId: process.env.NUXT_CLARITY_PROJECT_ID || '',
      metaPixelId: process.env.NUXT_META_PIXEL_ID || '',
      tiktokPixelId: process.env.NUXT_TIKTOK_PIXEL_ID || '',
      linkedinPixelId: process.env.NUXT_LINKEDIN_PIXEL_ID || '',
      alibabaApiKey: process.env.NUXT_ALIBABA_AI_API_KEY || ''
    }
  }, dir: {
    pages: 'app/pages'
  },
  srcDir: '.',

  // Route rules for ISR (public pages) and CSR (dashboard)
  routeRules: isDev ? {} : {
    // Home page - 60s revalidation
    '/': { isr: 60 },
    '/id/**': { isr: 60 },
    '/en/**': { isr: 60 },

    // Work/Service detail - 300s revalidation (less frequent updates)
    '/id/our-works/**': { isr: 300 },
    '/en/our-works/**': { isr: 300 },
    '/id/our-services/**': { isr: 300 },
    '/en/our-services/**': { isr: 300 },

    // Article detail - 300s revalidation
    '/id/articles/**': { isr: 300 },
    '/en/articles/**': { isr: 300 },

    // About & Contact - 600s revalidation (static content)
    '/id/about': { isr: 600 },
    '/en/about': { isr: 600 },
    '/id/contact-us': { isr: 600 },
    '/en/contact-us': { isr: 600 },

    // Legal pages - 86400s revalidation (24 hours)
    '/id/privacy-policy': { isr: 86400 },
    '/en/privacy-policy': { isr: 86400 },
    '/id/terms-of-service': { isr: 86400 },
    '/en/terms-of-service': { isr: 86400 },

    // Dashboard pages - CSR (Client-Side Rendering)
    '/dashboard/**': { ssr: false },
    '/capital/**': { ssr: false },

    // API routes - SSR default with CORS
    '/api/**': { cors: true }
  },
  experimental: {
    appManifest: false
  },
  compatibilityDate: '2025-03-13',
  future: {
    compatibilityVersion: 4
  },

  // Vite configuration
  vite: {
    vue: {
      scriptSetup: true
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // ESLint configuration
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  // i18n configuration
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'id', iso: 'id-ID', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'id',
    lazy: true,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'id',
      alwaysRedirect: true
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  // Image configuration
  image: {
    format: ['webp', 'avif', 'png'],
    quality: 80,
    densities: [1, 2],
    provider: 'ipx',
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    }
  },

  // Robots configuration
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/', // Block dashboard from indexing
          '/capital/', // Block trading dashboard
          '/api/', // Block API endpoints
          '/admin/' // Block admin routes
        ]
      }
    ],
    sitemap: [
      '/sitemap.xml'
    ]
  },

  // Sitemap configuration
  sitemap: {
    urls: [
      // Static pages (both languages)
      '/id',
      '/en',
      '/id/our-works',
      '/en/our-works',
      '/id/our-services',
      '/en/our-services',
      '/id/articles',
      '/en/articles',
      '/id/about',
      '/en/about',
      '/id/contact-us',
      '/en/contact-us',
      '/id/privacy-policy',
      '/en/privacy-policy',
      '/id/terms-of-service',
      '/en/terms-of-service'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    exclude: [
      '/dashboard/**', // Block dashboard
      '/capital/**', // Block trading dashboard
      '/api/**', // Block API endpoints
      '/admin/**' // Block admin routes
    ]
  }
})
