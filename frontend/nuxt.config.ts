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
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-security'
  ],
  pages: true,

  components: [
    {
      path: '~/app/components',
      pathPrefix: false
    }
  ],
  devtools: {
    enabled: true
  },

  // DevServer config untuk Docker - expose ke semua interface
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

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
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme'
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
  future: {
    compatibilityVersion: 4
  },

  experimental: {
    appManifest: false
  },
  compatibilityDate: '2025-03-13',
  // Vite configuration
  vite: {
    vue: {
      scriptSetup: true
    },
    // Fix untuk Docker - HMR pakai port yang sama (3000)
    server: {
      hmr: {
        // Use same port as dev server to avoid CORS/WebSocket issues
        protocol: 'ws',
        port: 3000,
        clientPort: 3000
      },
      // Allow all hosts for Docker environment
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      cors: true
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

  // Fonts configuration
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: ['400', '500', '600', '700'],
        subsets: ['latin'],
        preload: true
      }
    ],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin']
    }
  }, // i18n configuration
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'id', iso: 'id-ID', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'id',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'id',
      alwaysRedirect: true
    },
    // v10: hmr promoted from experimental.hmr, lazy loading is now default (lazy option removed)
    hmr: true,
    // v10: explicitly disable to silence deprecation warning (recommended by i18n team)
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
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536
    },
    // WebP optimization settings
    ipx: {
      // Use sharp for better WebP compression
      sharp: {
        webp: {
          quality: 80,
          effort: 6 // Higher effort = better compression, slower
        },
        avif: {
          quality: 70,
          effort: 4
        }
      }
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

  // Security configuration - disabled in development for DevTools compatibility
  security: isDev ? {} : {
    headers: {
      crossOriginResourcePolicy: 'cross-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: 'require-corp',
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'script-src': [
          '\'self\'',
          '\'unsafe-inline\'',
          '\'unsafe-eval\'',
          'https://www.google.com/recaptcha/',
          'https://www.gstatic.com/recaptcha/',
          'https://www.googletagmanager.com',
          'https://connect.facebook.net',
          'https://analytics.tiktok.com',
          'https://snap.licdn.com',
          'https://www.clarity.ms',
          'https://*.googlesyndication.com',
          'https://*.google-analytics.com',
          'https://*.doubleclick.net'
        ],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        'img-src': ['\'self\'', 'data:', 'blob:', 'https:', '*'],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'connect-src': [
          '\'self\'',
          'http://localhost:8080',
          'http://localhost:8081',
          'https://*.google.com',
          'https://*.google-analytics.com',
          'https://*.facebook.com',
          'https://*.tiktok.com',
          'https://*.linkedin.com',
          'https://*.clarity.ms',
          'https://*.googlesyndication.com',
          'https://*.doubleclick.net',
          'https://translation.aliyuncs.com'
        ],
        'frame-src': [
          '\'self\'',
          'https://www.google.com/recaptcha/',
          'https://www.gstatic.com/recaptcha/',
          'https://*.google.com'
        ],
        'object-src': ['\'none\''],
        'base-uri': ['\'self\''],
        'form-action': ['\'self\'']
      },
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: []
      }
    },
    csrf: {
      enabled: true
    },
    corsHandler: {
      enabled: false // Backend handles CORS
    }
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
