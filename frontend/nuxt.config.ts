// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Nuxt 4 app directory
  srcDir: 'app/',

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@formkit/auto-animate/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/a11y',
    'nuxt-hints',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  // Color mode configuration
  colorMode: {
    classSuffix: '',
  },

  // Route rules for ISR (public pages) and CSR (dashboard)
  routeRules: {
    // Public pages - ISR with 60s revalidation
    '/': { isr: 60 },
    '/id/**': { isr: 60 },
    '/en/**': { isr: 60 },
    '/our-works/**': { isr: 60 },
    '/our-services/**': { isr: 60 },
    '/articles/**': { isr: 60 },
    '/about': { isr: 60 },

    // Dashboard pages - CSR (Client-Side Rendering)
    '/agency/**': { ssr: false },
    '/capital/**': { ssr: false },

    // API routes - SSR default with CORS
    '/api/**': { cors: true },
  },

  // ESLint configuration
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  // Image configuration
  image: {
    format: ['webp', 'png'],
    quality: 80,
  },

  // Sitemap configuration
  sitemap: {
    urls: [
      '/',
      '/id',
      '/en',
      '/our-works',
      '/our-services',
      '/articles',
      '/about',
      '/contact-us',
    ],
  },

  // Robots configuration
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Vite configuration
  vite: {
    vue: {
      scriptDefineProps: ['modelValue'],
    },
  },

  // App configuration
  app: {
    head: {
      title: 'Esperion - Digital Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Esperion Digital Agency - Data-Driven Digital Strategies' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
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
    },
  },
})