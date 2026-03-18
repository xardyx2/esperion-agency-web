const sources = [
  {
    context: {
      name: 'sitemap:urls',
      description: 'Set with the `sitemap.urls` config.'
    },
    urls: [
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
    sourceType: 'user'
  },
  {
    context: {
      name: 'nuxt:pages',
      description: 'Generated from your static page files.',
      tips: [
        'Can be disabled with `{ excludeAppSources: [\'nuxt:pages\'] }`.'
      ]
    },
    urls: [
      {
        loc: '/id/dashboard/analytics',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/analytics'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/analytics'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/analytics'
          }
        ]
      },
      {
        loc: '/en/dashboard/analytics',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/analytics'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/analytics'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/analytics'
          }
        ]
      },
      {
        loc: '/id/dashboard/api-docs',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/api-docs'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/api-docs'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/api-docs'
          }
        ]
      },
      {
        loc: '/en/dashboard/api-docs',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/api-docs'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/api-docs'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/api-docs'
          }
        ]
      },
      {
        loc: '/id/dashboard/articles',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/articles'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/articles'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/articles'
          }
        ]
      },
      {
        loc: '/en/dashboard/articles',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/articles'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/articles'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/articles'
          }
        ]
      },
      {
        loc: '/id/dashboard/articles/new',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/articles/new'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/articles/new'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/articles/new'
          }
        ]
      },
      {
        loc: '/en/dashboard/articles/new',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/articles/new'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/articles/new'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/articles/new'
          }
        ]
      },
      {
        loc: '/id/dashboard/clients',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/clients'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/clients'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/clients'
          }
        ]
      },
      {
        loc: '/en/dashboard/clients',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/clients'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/clients'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/clients'
          }
        ]
      },
      {
        loc: '/id/dashboard/contact',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/contact'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/contact'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/contact'
          }
        ]
      },
      {
        loc: '/en/dashboard/contact',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/contact'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/contact'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/contact'
          }
        ]
      },
      {
        loc: '/id/dashboard/media',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/media'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/media'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/media'
          }
        ]
      },
      {
        loc: '/en/dashboard/media',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/media'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/media'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/media'
          }
        ]
      },
      {
        loc: '/id/dashboard/services',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/services'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/services'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/services'
          }
        ]
      },
      {
        loc: '/en/dashboard/services',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/services'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/services'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/services'
          }
        ]
      },
      {
        loc: '/id/dashboard/sessions',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/sessions'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/sessions'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/sessions'
          }
        ]
      },
      {
        loc: '/en/dashboard/sessions',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/sessions'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/sessions'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/sessions'
          }
        ]
      },
      {
        loc: '/id/dashboard/settings',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/settings'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/settings'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/settings'
          }
        ]
      },
      {
        loc: '/en/dashboard/settings',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/settings'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/settings'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/settings'
          }
        ]
      },
      {
        loc: '/id/dashboard/users',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/users'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/users'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/users'
          }
        ]
      },
      {
        loc: '/en/dashboard/users',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/users'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/users'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/users'
          }
        ]
      },
      {
        loc: '/id/dashboard/works',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/works'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/works'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/works'
          }
        ]
      },
      {
        loc: '/en/dashboard/works',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/works'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/works'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/works'
          }
        ]
      },
      {
        loc: '/id/dashboard/works/new',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/works/new'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/works/new'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/works/new'
          }
        ]
      },
      {
        loc: '/en/dashboard/works/new',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard/works/new'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard/works/new'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard/works/new'
          }
        ]
      },
      {
        loc: '/id/about',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/about'
          },
          {
            hreflang: 'en-US',
            href: '/en/about'
          },
          {
            hreflang: 'x-default',
            href: '/id/about'
          }
        ]
      },
      {
        loc: '/en/about',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/about'
          },
          {
            hreflang: 'en-US',
            href: '/en/about'
          },
          {
            hreflang: 'x-default',
            href: '/id/about'
          }
        ]
      },
      {
        loc: '/id/articles',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/articles'
          },
          {
            hreflang: 'en-US',
            href: '/en/articles'
          },
          {
            hreflang: 'x-default',
            href: '/id/articles'
          }
        ]
      },
      {
        loc: '/en/articles',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/articles'
          },
          {
            hreflang: 'en-US',
            href: '/en/articles'
          },
          {
            hreflang: 'x-default',
            href: '/id/articles'
          }
        ]
      },
      {
        loc: '/id/contact-us',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/contact-us'
          },
          {
            hreflang: 'en-US',
            href: '/en/contact-us'
          },
          {
            hreflang: 'x-default',
            href: '/id/contact-us'
          }
        ]
      },
      {
        loc: '/en/contact-us',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/contact-us'
          },
          {
            hreflang: 'en-US',
            href: '/en/contact-us'
          },
          {
            hreflang: 'x-default',
            href: '/id/contact-us'
          }
        ]
      },
      {
        loc: '/id/dashboard',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard'
          }
        ]
      },
      {
        loc: '/en/dashboard',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/dashboard'
          },
          {
            hreflang: 'en-US',
            href: '/en/dashboard'
          },
          {
            hreflang: 'x-default',
            href: '/id/dashboard'
          }
        ]
      },
      {
        loc: '/id/login',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/login'
          },
          {
            hreflang: 'en-US',
            href: '/en/login'
          },
          {
            hreflang: 'x-default',
            href: '/id/login'
          }
        ]
      },
      {
        loc: '/en/login',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/login'
          },
          {
            hreflang: 'en-US',
            href: '/en/login'
          },
          {
            hreflang: 'x-default',
            href: '/id/login'
          }
        ]
      },
      {
        loc: '/id/offline',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/offline'
          },
          {
            hreflang: 'en-US',
            href: '/en/offline'
          },
          {
            hreflang: 'x-default',
            href: '/id/offline'
          }
        ]
      },
      {
        loc: '/en/offline',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/offline'
          },
          {
            hreflang: 'en-US',
            href: '/en/offline'
          },
          {
            hreflang: 'x-default',
            href: '/id/offline'
          }
        ]
      },
      {
        loc: '/id/our-services',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/our-services'
          },
          {
            hreflang: 'en-US',
            href: '/en/our-services'
          },
          {
            hreflang: 'x-default',
            href: '/id/our-services'
          }
        ]
      },
      {
        loc: '/en/our-services',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/our-services'
          },
          {
            hreflang: 'en-US',
            href: '/en/our-services'
          },
          {
            hreflang: 'x-default',
            href: '/id/our-services'
          }
        ]
      },
      {
        loc: '/id/our-works',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/our-works'
          },
          {
            hreflang: 'en-US',
            href: '/en/our-works'
          },
          {
            hreflang: 'x-default',
            href: '/id/our-works'
          }
        ]
      },
      {
        loc: '/en/our-works',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/our-works'
          },
          {
            hreflang: 'en-US',
            href: '/en/our-works'
          },
          {
            hreflang: 'x-default',
            href: '/id/our-works'
          }
        ]
      },
      {
        loc: '/id/privacy-policy',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/privacy-policy'
          },
          {
            hreflang: 'en-US',
            href: '/en/privacy-policy'
          },
          {
            hreflang: 'x-default',
            href: '/id/privacy-policy'
          }
        ]
      },
      {
        loc: '/en/privacy-policy',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/privacy-policy'
          },
          {
            hreflang: 'en-US',
            href: '/en/privacy-policy'
          },
          {
            hreflang: 'x-default',
            href: '/id/privacy-policy'
          }
        ]
      },
      {
        loc: '/id/register',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/register'
          },
          {
            hreflang: 'en-US',
            href: '/en/register'
          },
          {
            hreflang: 'x-default',
            href: '/id/register'
          }
        ]
      },
      {
        loc: '/en/register',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/register'
          },
          {
            hreflang: 'en-US',
            href: '/en/register'
          },
          {
            hreflang: 'x-default',
            href: '/id/register'
          }
        ]
      },
      {
        loc: '/id/terms-of-service',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/terms-of-service'
          },
          {
            hreflang: 'en-US',
            href: '/en/terms-of-service'
          },
          {
            hreflang: 'x-default',
            href: '/id/terms-of-service'
          }
        ]
      },
      {
        loc: '/en/terms-of-service',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id/terms-of-service'
          },
          {
            hreflang: 'en-US',
            href: '/en/terms-of-service'
          },
          {
            hreflang: 'x-default',
            href: '/id/terms-of-service'
          }
        ]
      },
      {
        loc: '/id',
        _sitemap: 'id-ID',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id'
          },
          {
            hreflang: 'en-US',
            href: '/en'
          },
          {
            hreflang: 'x-default',
            href: '/id'
          }
        ]
      },
      {
        loc: '/en',
        _sitemap: 'en-US',
        alternatives: [
          {
            hreflang: 'id-ID',
            href: '/id'
          },
          {
            hreflang: 'en-US',
            href: '/en'
          },
          {
            hreflang: 'x-default',
            href: '/id'
          }
        ]
      }
    ],
    sourceType: 'app'
  },
  {
    context: {
      name: 'nuxt:route-rules',
      description: 'Generated from your route rules config.',
      tips: [
        'Can be disabled with `{ excludeAppSources: [\'nuxt:route-rules\'] }`.'
      ]
    },
    urls: [
      '/',
      '/id/about',
      '/en/about',
      '/id/contact-us',
      '/en/contact-us',
      '/id/privacy-policy',
      '/en/privacy-policy',
      '/id/terms-of-service',
      '/en/terms-of-service'
    ],
    sourceType: 'app'
  }
]

export { sources }
// # sourceMappingURL=global-sources.mjs.map
