import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer'
import { p as publicServices, g as getFeaturedWorks, a as publicArticles } from './public-content-D_mrJhWa.mjs'
import { u as usePublicIdentity } from './usePublicIdentity-SKKe4NtZ.mjs'
import { _ as _export_sfc, a as useLocalePath, b as useI18n, c as useSeoMeta, d as useSchemaOrg } from './server.mjs'
import { defineLocalBusiness, defineWebSite, defineWebPage, defineBreadcrumb } from '@unhead/schema-org/vue'
import '../_/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'consola'
import 'uncsrf'
import 'vue-router'
import 'lru-cache'
import 'node:fs'
import 'node:path'
import 'node:url'
import '@iconify/utils'
import 'node:crypto'
import 'fast-xml-parser'
import 'xss'
import 'zod'
import 'ms'
import 'node:fs/promises'
import '@modelcontextprotocol/sdk/server/mcp.js'
import '@modelcontextprotocol/sdk/server/streamableHttp.js'
import 'satori'
import 'ipx'
import 'pinia'
import '@vue/shared'
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    const localePath = useLocalePath()
    const { t } = useI18n()
    const { locale } = useI18n()
    const publicIdentity = usePublicIdentity()
    useSeoMeta({
      title: t('seo.home.title'),
      description: t('seo.home.description'),
      ogTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
      ogDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
      ogImage: '/images/esperion-agency-hero.jpg',
      ogUrl: `${publicIdentity.siteUrl}/id`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
      twitterDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
      twitterImage: '/images/esperion-agency-hero.jpg',
      ogLocale: 'id_ID'
    })
    useSchemaOrg([
      defineLocalBusiness({
        '@type': 'ProfessionalService',
        'name': 'Esperion Digital Agency',
        'legalName': 'PT Esperion Teknologi Digital',
        'description': 'Digital agency terbaik di Jakarta, Indonesia. Spesialis dalam pengembangan web, aplikasi mobile, desain UI/UX, dan digital marketing.',
        'email': publicIdentity.email,
        'telephone': publicIdentity.phoneDisplay,
        'url': `${publicIdentity.siteUrl}/id`,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': publicIdentity.address.streetAddress,
          'addressLocality': publicIdentity.address.addressLocality,
          'addressRegion': publicIdentity.address.addressRegion,
          'addressCountry': publicIdentity.address.addressCountry
        },
        'openingHours': ['Mo-Fr 09:00-17:00', 'Sa 09:00-13:00'],
        'priceRange': '$$',
        'areaServed': ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor'],
        'serviceArea': [
          {
            '@type': 'City',
            'name': 'Jakarta'
          },
          {
            '@type': 'City',
            'name': 'Tangerang'
          },
          {
            '@type': 'City',
            'name': 'Bekasi'
          }
        ],
        'slogan': 'Transformasi Digital untuk Bisnis Anda',
        'foundingDate': '2020',
        'numberOfEmployees': 25,
        'knowsAbout': ['digital marketing', 'SEO', 'web development', 'mobile app development', 'ui ux design', 'e-commerce'],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Digital Marketing Services',
          'itemListElement': []
        },
        'sameAs': publicIdentity.sameAs,
        'logo': {
          '@type': 'ImageObject',
          'url': '/placeholders/first-party/brand-mark-required.svg',
          'width': 300,
          'height': 150
        },
        'image': [
          '/images/banner-1.jpg',
          '/images/team.jpg'
        ],
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'telephone': publicIdentity.phoneDisplay,
            'contactType': 'customer service',
            'areaServed': 'ID',
            'availableLanguage': 'Indonesian'
          }
        ]
      }),
      defineWebSite({
        name: 'Esperion Digital Agency',
        url: `${publicIdentity.siteUrl}/id`,
        description: 'Esperion membantu bisnis bertumbuh lewat strategi digital, pengembangan produk, dan desain yang terarah.',
        publisher: {
          '@type': 'Organization',
          'name': 'Esperion Digital Agency'
        }
      }),
      defineWebPage({
        '@type': 'AboutPage',
        'name': 'Esperion Digital Agency Jakarta',
        'description': 'Esperion adalah agensi digital terkemuka di Jakarta, Indonesia yang berfokus pada solusi teknologi digital.',
        'datePublished': '2020-01-01',
        'dateModified': (/* @__PURE__ */ new Date()).toISOString()
      }),
      defineBreadcrumb({
        itemListElement: [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${publicIdentity.siteUrl}/id`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'About Us',
            'item': `${publicIdentity.siteUrl}/id/about`
          }
        ]
      })
    ])
    const currentSlide = ref(0)
    ref(0)
    const currentWorkSlide = ref(0)
    const worksVisible = ref(3)
    ref(6)
    ref(false)
    ref()
    ref(0)
    ref(0)
    ref(0)
    ref(0)
    ref(false)
    const bannerSlides = computed(() => [
      {
        id: 1,
        title: t('home.hero.slide1Title'),
        subtitle: t('home.hero.slide1Sub'),
        description: t('home.hero.slide1Desc'),
        image: '/images/banner-1.jpg',
        ctaText: t('home.hero.slide1Cta'),
        ctaLink: '/contact-us'
      },
      {
        id: 2,
        title: 'Ready for Next Growth Phase?',
        subtitle: 'Digital Solutions for Your Next Growth Phase',
        description: 'Dari perencanaan sampai peluncuran, Esperion membantu tim Anda merilis pengalaman digital yang relevan dan terukur.',
        image: '/images/banner-2.jpg',
        ctaText: 'View Portfolio',
        ctaLink: '/our-works'
      },
      {
        id: 3,
        title: 'Small Team, Real Impact',
        subtitle: 'Small Team, Real Impact',
        description: 'Kami menggabungkan strategi, desain, dan pengembangan untuk menghadirkan pengalaman digital yang konsisten dengan brand Anda.',
        image: '/images/banner-3.jpg',
        ctaText: 'Learn More',
        ctaLink: '/about'
      },
      {
        id: 4,
        title: 'Comprehensive Digital Services',
        subtitle: 'Comprehensive Digital Services',
        description: 'Dari web development hingga digital marketing, kami menyediakan solusi end-to-end untuk transformasi digital.',
        image: '/images/banner-4.jpg',
        ctaText: 'Explore Services',
        ctaLink: '/our-services'
      },
      {
        id: 5,
        title: 'Trusted by Growing Businesses',
        subtitle: 'Trusted by Growing Businesses',
        description: 'Bergabung dengan bisnis yang telah tumbuh bersama Esperion melalui solusi digital yang terukur dan berdampak.',
        image: '/images/banner-5.jpg',
        ctaText: 'View Testimonials',
        ctaLink: '/our-works'
      }
    ])
    const activeSlide = computed(() => bannerSlides.value[currentSlide.value])
    const whoAreWe = {
      title: 'About Esperion',
      description: 'Esperion adalah mitra digital untuk bisnis yang membutuhkan arah, eksekusi, dan pengalaman brand yang konsisten. Kami menggabungkan strategi, desain, dan pengembangan agar setiap peluncuran terasa lebih siap dan lebih relevan.',
      image: '/images/team.jpg',
      values: [
        { label: 'Strategi yang jelas' },
        { label: 'Eksekusi yang rapi' },
        { label: 'Kolaborasi terbuka' },
        { label: 'Fokus pada hasil' }
      ]
    }
    const services = ref(publicServices)
    const clientStats = [
      { value: '150+', label: 'Projects Completed' },
      { value: '80+', label: 'Client Collaborations' },
      { value: '10+', label: 'Years of Experience' },
      { value: '25+', label: 'Core Talent' }
    ]
    const clients = ref([
      { id: 1, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 2, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 3, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 4, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 5, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 6, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 7, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
      { id: 8, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' }
    ])
    const featuredWorks = ref(getFeaturedWorks(5))
    const articles = ref(publicArticles.slice(0, 3))
    const cta = {
      title: 'Ready for Your Next Digital Step?',
      description: 'Ceritakan konteks bisnis Anda, lalu kami bantu memetakan solusi yang paling relevan untuk tahap pertumbuhan berikutnya.'
    }
    const slideDirection = ref('next')
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))} data-v-c01e4c4d><section class="relative h-[500px] md:h-[600px] overflow-hidden" data-v-c01e4c4d><div class="relative w-full h-full" style="${ssrRenderStyle({ '--slide-direction': unref(slideDirection) })}" data-v-c01e4c4d><div class="banner-slide pointer-events-none" data-v-c01e4c4d><div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/90 to-es-bg-secondary/50 dark:from-es-bg-secondary-dark/90 dark:to-es-bg-secondary-dark/50 z-10" data-v-c01e4c4d></div><img${ssrRenderAttr('src', unref(activeSlide).image)}${ssrRenderAttr('alt', unref(activeSlide).title)} class="w-full h-full object-cover" loading="eager" fetchpriority="high" data-v-c01e4c4d><div class="absolute inset-0 z-20 flex items-center" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="max-w-2xl" data-v-c01e4c4d><h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2" data-v-c01e4c4d>${ssrInterpolate(unref(activeSlide).title)}</h1>`)
      if (unref(activeSlide).subtitle) {
        _push(`<p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-4 font-medium" data-v-c01e4c4d>${ssrInterpolate(unref(activeSlide).subtitle)}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8" data-v-c01e4c4d>${ssrInterpolate(unref(activeSlide).description)}</p>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(unref(activeSlide).ctaLink),
        class: 'inline-flex items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(activeSlide).ctaText)}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(activeSlide).ctaText), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></div></div></div></div><div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(unref(bannerSlides), (slide, index2) => {
        _push(`<button class="${ssrRenderClass([unref(currentSlide) === index2 ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark' : 'bg-es-text-secondary/50 dark:bg-es-text-secondary-dark/50 hover:bg-es-text-secondary dark:hover:bg-es-text-secondary-dark', 'w-3 h-3 rounded-full transition-colors'])}"${ssrRenderAttr('aria-label', `Go to slide ${index2 + 1}`)} data-v-c01e4c4d></button>`)
      })
      _push(`<!--]--></div><button class="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg md:flex" aria-label="Previous slide" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-c01e4c4d></path></svg></button><button class="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg md:flex" aria-label="Next slide" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-c01e4c4d></path></svg></button></section><section class="py-16 md:py-24" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="grid md:grid-cols-2 gap-12 items-center" data-v-c01e4c4d><div data-v-c01e4c4d><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6" data-v-c01e4c4d>${ssrInterpolate(whoAreWe.title)}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-6 leading-relaxed" data-v-c01e4c4d>${ssrInterpolate(whoAreWe.description)}</p><div class="flex flex-wrap gap-4" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(whoAreWe.values, (value) => {
        _push(`<div class="flex items-center space-x-2" data-v-c01e4c4d><span class="text-es-accent-primary dark:text-es-accent-primary-dark" data-v-c01e4c4d>✓</span><span class="text-es-text-secondary dark:text-es-text-secondary-dark" data-v-c01e4c4d>${ssrInterpolate(value.label)}</span></div>`)
      })
      _push(`<!--]--></div></div><div class="relative" data-v-c01e4c4d><img${ssrRenderAttr('src', whoAreWe.image)}${ssrRenderAttr('alt', whoAreWe.title)} class="rounded-lg shadow-xl w-full h-[400px] object-cover" loading="lazy" data-v-c01e4c4d></div></div></div></section><section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="text-center mb-12" data-v-c01e4c4d><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4" data-v-c01e4c4d> Our Services </h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto" data-v-c01e4c4d> Solusi digital yang dirancang untuk target bisnis Anda </p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(unref(services), (service) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: service.slug,
          to: unref(localePath)(`/our-services/${service.slug}`),
          class: 'group p-6 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg shadow-md hover:shadow-xl transition-all'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-12 h-12 mb-4 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center" data-v-c01e4c4d${_scopeId}><span class="text-2xl" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(service.icon)}</span></div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(service.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(service.description)}</p>`)
            } else {
              return [
                createVNode('div', { class: 'w-12 h-12 mb-4 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center' }, [
                  createVNode('span', { class: 'text-2xl' }, toDisplayString(service.icon), 1)
                ]),
                createVNode('h3', { class: 'text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(service.title), 1),
                createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2' }, toDisplayString(service.description), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div><div class="text-center mt-8" data-v-c01e4c4d>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/our-services'),
        class: 'inline-flex items-center px-6 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All Services `)
          } else {
            return [
              createTextVNode(' View All Services ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></div></section><section class="py-16 md:py-24" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(clientStats, (stat) => {
        _push(`<div class="text-center" data-v-c01e4c4d><div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2" data-v-c01e4c4d>${ssrInterpolate(stat.value)}</div><div class="text-es-text-secondary dark:text-es-text-secondary-dark" data-v-c01e4c4d>${ssrInterpolate(stat.label)}</div></div>`)
      })
      _push(`<!--]--></div><div class="relative" data-v-c01e4c4d><h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8" data-v-c01e4c4d> Materi logo klien ditampilkan setelah persetujuan publikasi </h3><div class="marquee-container" data-v-c01e4c4d><div class="marquee-track" data-v-c01e4c4d><!--[-->`)
      ssrRenderList([...unref(clients), ...unref(clients), ...unref(clients)], (client) => {
        _push(`<div class="marquee-item" data-v-c01e4c4d><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-shadow" data-v-c01e4c4d><img${ssrRenderAttr('src', client.logo)}${ssrRenderAttr('alt', client.name)} class="max-h-16 w-auto object-contain" loading="lazy" data-v-c01e4c4d></div></div>`)
      })
      _push(`<!--]--></div></div><button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all z-10 focus:outline-none focus:ring-2 focus:ring-es-accent-primary" aria-label="Scroll logos left" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-c01e4c4d></path></svg></button><button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all z-10 focus:outline-none focus:ring-2 focus:ring-es-accent-primary" aria-label="Scroll logos right" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-c01e4c4d></path></svg></button></div></div></section><section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="flex justify-between items-center mb-12" data-v-c01e4c4d><div data-v-c01e4c4d><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2" data-v-c01e4c4d> Featured Works </h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark" data-v-c01e4c4d> Sorotan proyek yang mewakili pendekatan kerja Esperion </p></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/our-works'),
        class: 'hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All Portfolio → `)
          } else {
            return [
              createTextVNode(' View All Portfolio → ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div><div class="relative" data-v-c01e4c4d><div class="overflow-hidden" data-v-c01e4c4d><div class="flex transition-transform" style="${ssrRenderStyle({ transform: `translateX(-${unref(currentWorkSlide) * (100 / unref(worksVisible))}%)` })}" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(unref(featuredWorks), (work) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: work.id,
          to: unref(localePath)(`/our-works/${work.slug}`),
          class: 'flex-shrink-0 px-4 work-card',
          style: { width: `${100 / unref(worksVisible)}%` }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all work-card-inner" data-v-c01e4c4d${_scopeId}><div class="overflow-hidden work-image-container" data-v-c01e4c4d${_scopeId}><img${ssrRenderAttr('src', work.image)}${ssrRenderAttr('alt', work.title)} class="w-full h-48 object-cover work-image" loading="lazy" data-v-c01e4c4d${_scopeId}></div><div class="p-6" data-v-c01e4c4d${_scopeId}><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(work.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(work.description)}</p><div class="flex flex-wrap gap-2" data-v-c01e4c4d${_scopeId}><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(work.service)}</span><span class="px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(work.platform)}</span></div></div></div>`)
            } else {
              return [
                createVNode('div', { class: 'bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all work-card-inner' }, [
                  createVNode('div', { class: 'overflow-hidden work-image-container' }, [
                    createVNode('img', {
                      src: work.image,
                      alt: work.title,
                      class: 'w-full h-48 object-cover work-image',
                      loading: 'lazy'
                    }, null, 8, ['src', 'alt'])
                  ]),
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('h3', { class: 'text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2' }, toDisplayString(work.title), 1),
                    createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2' }, toDisplayString(work.description), 1),
                    createVNode('div', { class: 'flex flex-wrap gap-2' }, [
                      createVNode('span', { class: 'px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full' }, toDisplayString(work.service), 1),
                      createVNode('span', { class: 'px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full' }, toDisplayString(work.platform), 1)
                    ])
                  ])
                ])
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div></div><button class="work-nav-arrow work-nav-left focus:outline-none focus:ring-2 focus:ring-es-accent-primary"${ssrIncludeBooleanAttr(unref(currentWorkSlide) === 0) ? ' disabled' : ''} aria-label="Previous work" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-c01e4c4d></path></svg></button><button class="work-nav-arrow work-nav-right focus:outline-none focus:ring-2 focus:ring-es-accent-primary"${ssrIncludeBooleanAttr(unref(currentWorkSlide) >= unref(featuredWorks).length - unref(worksVisible)) ? ' disabled' : ''} aria-label="Next work" data-v-c01e4c4d><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c01e4c4d><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-c01e4c4d></path></svg></button></div><div class="text-center mt-8 md:hidden" data-v-c01e4c4d>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/our-works'),
        class: 'inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All Portfolio → `)
          } else {
            return [
              createTextVNode(' View All Portfolio → ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></div></section><section class="py-16 md:py-24" data-v-c01e4c4d><div class="container mx-auto px-4" data-v-c01e4c4d><div class="flex justify-between items-center mb-12" data-v-c01e4c4d><div data-v-c01e4c4d><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2" data-v-c01e4c4d> Latest Articles </h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark" data-v-c01e4c4d> Insight singkat, pembelajaran, dan pembaruan dari tim Esperion </p></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/articles'),
        class: 'hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All Articles → `)
          } else {
            return [
              createTextVNode(' View All Articles → ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-c01e4c4d><!--[-->`)
      ssrRenderList(unref(articles), (article) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: article.id,
          to: unref(localePath)(`/articles/${article.slug_id}`),
          class: 'group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr('src', article.image)}${ssrRenderAttr('alt', article.title)} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" data-v-c01e4c4d${_scopeId}><div class="p-6" data-v-c01e4c4d${_scopeId}><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(article.category)}</span><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(article.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3" data-v-c01e4c4d${_scopeId}>${ssrInterpolate(article.excerpt_id)}</p><div class="mt-4 flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium" data-v-c01e4c4d${_scopeId}> Baca Selengkapnya <span class="ml-1" data-v-c01e4c4d${_scopeId}>→</span></div></div>`)
            } else {
              return [
                createVNode('img', {
                  src: article.image,
                  alt: article.title,
                  class: 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300',
                  loading: 'lazy'
                }, null, 8, ['src', 'alt']),
                createVNode('div', { class: 'p-6' }, [
                  createVNode('span', { class: 'px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full' }, toDisplayString(article.category), 1),
                  createVNode('h3', { class: 'text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(article.title), 1),
                  createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3' }, toDisplayString(article.excerpt_id), 1),
                  createVNode('div', { class: 'mt-4 flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium' }, [
                    createTextVNode(' Baca Selengkapnya '),
                    createVNode('span', { class: 'ml-1' }, '→')
                  ])
                ])
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div><div class="text-center mt-8 md:hidden" data-v-c01e4c4d>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/articles'),
        class: 'inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All Articles → `)
          } else {
            return [
              createTextVNode(' View All Articles → ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></div></section><section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark" data-v-c01e4c4d><div class="container mx-auto px-4 text-center" data-v-c01e4c4d><h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4" data-v-c01e4c4d>${ssrInterpolate(cta.title)}</h2><p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto" data-v-c01e4c4d>${ssrInterpolate(cta.description)}</p>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/contact-us'),
        class: 'inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Start Discussion Today `)
          } else {
            return [
              createTextVNode(' Start Discussion Today ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-c01e4c4d']])

export { index as default }
// # sourceMappingURL=index-C4fH5q_M.mjs.map
