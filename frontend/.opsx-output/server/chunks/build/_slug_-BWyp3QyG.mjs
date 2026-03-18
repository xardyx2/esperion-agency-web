import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, withAsyncContext, watchEffect, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer'
import { c as findPublicServiceBySlug, d as getRelatedServices } from './public-content-D_mrJhWa.mjs'
import { g as useRoute, a as useLocalePath, b as useI18n, h as useAsyncData, i as createError, c as useSeoMeta, d as useSchemaOrg } from './server.mjs'
import { defineWebPage, defineBreadcrumb } from '@unhead/schema-org/vue'
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

const EXCHANGE_RATE = 15500
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: '[slug]',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
    const formatIDR = (priceUSD) => {
      const priceIDR = Math.round(priceUSD * EXCHANGE_RATE)
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(priceIDR)
    }
    const formatUSD = (priceUSD) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(priceUSD)
    }
    const route = useRoute()
    const localePath = useLocalePath()
    const { t, locale } = useI18n()
    const slugParam = computed(() => {
      const raw = route.params.slug
      if (Array.isArray(raw)) {
        return raw[0] ?? ''
      }
      return typeof raw === 'string' ? raw : ''
    })
    const { data: service, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `service-${route.params.slug}`,
      () => {
        const record = findPublicServiceBySlug(slugParam.value)
        if (!record) {
          throw createError({ statusCode: 404, statusMessage: 'Service not found' })
        }
        return record
      },
      {
        watch: [slugParam],
        server: true,
        default: () => null
      }
    )), __temp = await __temp, __restore(), __temp)
    watchEffect(() => {
      if (!pending.value && error.value) {
        throw createError({ statusCode: 404, statusMessage: 'Service not found' })
      }
    })
    const features = computed(() => service.value?.features || [])
    const process = computed(() => service.value?.process || [])
    const faqs = computed(() => service.value?.faqs || [])
    const relatedServices = computed(() => service.value ? getRelatedServices(service.value.slug, 3) : [])
    const serviceName = computed(() => service.value?.title || '')
    const serviceSlug = computed(() => service.value?.slug || '')
    const localePrefix = computed(() => locale.value === 'en' ? 'en' : 'id')
    const pageUrl = computed(() => service.value ? `https://esperion.one/${localePrefix.value}/our-services/${serviceSlug.value}` : '')
    const imageUrl = computed(() => service.value ? `/images/service-${serviceSlug.value.replace(/-/g, '')}.jpg` : '')
    const heroImage = computed(() => imageUrl.value || '/images/hero-service-development.jpg')
    watchEffect(() => {
      if (!service.value) return
      useSeoMeta({
        title: `${serviceName.value} Jakarta | ${t('seo.services.title')}`,
        description: `${t('services.detail.serviceScope')}: ${service.value.description}`,
        ogTitle: `${serviceName.value} - Esperion`,
        ogDescription: service.value.description,
        ogImage: heroImage.value,
        ogUrl: pageUrl.value,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: `${serviceName.value} - Esperion`,
        twitterDescription: service.value.description,
        twitterImage: heroImage.value,
        ogLocale: locale.value === 'en' ? 'en_US' : 'id_ID'
      })
    })
    watchEffect(() => {
      if (!service.value) return
      const priceUSD = service.value.pricingUSD
      const priceIDR = Math.round(priceUSD * EXCHANGE_RATE)
      useSchemaOrg([
        // AI-Friendly Service Schema with Dual Currency
        {
          '@type': 'Service',
          'name': service.value.title,
          'description': service.value.description,
          'provider': {
            '@type': 'Organization',
            'name': 'Esperion Digital Agency',
            'url': 'https://esperion.one'
          },
          'areaServed': {
            '@type': 'Country',
            'name': 'Indonesia'
          },
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': service.value.title,
            'itemListElement': {
              '@type': 'Offer',
              'price': priceUSD.toString(),
              'priceCurrency': 'USD',
              'priceValidUntil': '2026-12-31',
              'availability': 'https://schema.org/InStock',
              'description': `Starting from Rp ${priceIDR.toLocaleString('id-ID')} IDR ($${priceUSD.toLocaleString('en-US')} USD)`,
              // AI-friendly dual currency
              'priceSpecification': {
                '@type': 'PriceSpecification',
                'minPrice': priceUSD.toString(),
                'maxPrice': (priceUSD * 3).toString(),
                // Estimate max 3x starting
                'priceCurrency': 'USD',
                'valueAddedTaxIncluded': false,
                'description': `IDR: Rp ${priceIDR.toLocaleString('id-ID')} | USD: $${priceUSD.toLocaleString('en-US')}`
              }
            }
          },
          // Service details
          'serviceType': 'Digital Agency Services',
          'termsOfService': 'Project-based with milestone payments'
        },
        // WebPage schema
        defineWebPage({
          '@type': 'CollectionPage',
          'name': service.value.title,
          'description': service.value.description,
          'url': pageUrl.value,
          'image': imageUrl.value || '/images/hero-service-development.jpg',
          'dateModified': (/* @__PURE__ */ new Date()).toISOString()
        }),
        // Breadcrumb
        defineBreadcrumb({
          itemListElement: [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': t('breadcrumb.home'),
              'item': `https://esperion.one/${localePrefix.value}`
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': t('breadcrumb.services'),
              'item': `https://esperion.one/${localePrefix.value}/our-services`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': service.value.title,
              'item': pageUrl.value
            }
          ]
        })
      ])
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}>`)
      if (unref(pending)) {
        _push(`<div class="flex items-center justify-center min-h-screen"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-es-accent-primary"></div></div>`)
      } else if (unref(error)) {
        _push(`<div class="flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl font-bold text-es-text-primary mb-4">${ssrInterpolate(unref(t)('services.detail.notFound'))}</h1>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/our-services'),
          class: 'text-es-accent-primary hover:underline'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('services.detail.backToServices'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('services.detail.backToServices')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></div>`)
      } else if (unref(service)) {
        _push(`<!--[--><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', unref(heroImage))}${ssrRenderAttr('alt', unref(service).title)} class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-bg-primary/80 via-es-bg-primary/60 to-es-bg-primary/40 dark:from-es-bg-primary-dark/80 dark:via-es-bg-primary-dark/60 dark:to-es-bg-primary-dark/40"></div><div class="absolute inset-0 bg-gradient-to-t from-es-bg-primary/60 via-transparent to-transparent dark:from-es-bg-primary-dark/60"></div><div class="absolute inset-0 flex items-center justify-center"><div class="w-full px-4 text-center"><div class="text-6xl mb-6 drop-shadow-lg">${ssrInterpolate(unref(service).icon)}</div><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4 drop-shadow-lg">${ssrInterpolate(unref(service).title)}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto drop-shadow-md">${ssrInterpolate(unref(service).description)}</p></div></div></section><section class="py-12 md:py-16"><div class="w-full px-4"><div class="grid lg:grid-cols-3 gap-12"><div class="lg:col-span-2"><div class="mb-12"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('services.detail.serviceScope'))}</h2><div class="grid md:grid-cols-2 gap-6"><!--[-->`)
        ssrRenderList(unref(features), (feature) => {
          _push(`<div class="flex gap-4"><div class="flex-shrink-0 w-12 h-12 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center"><span class="text-xl">${ssrInterpolate(feature.icon)}</span></div><div><h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(feature.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(feature.description)}</p></div></div>`)
        })
        _push(`<!--]--></div></div><div class="mb-12"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('services.detail.workflow'))}</h2><div class="space-y-6"><!--[-->`)
        ssrRenderList(unref(process), (step, index) => {
          _push(`<div class="flex gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-full bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark flex items-center justify-center font-bold">${ssrInterpolate(index + 1)}</div><div><h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(step.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(step.description)}</p></div></div>`)
        })
        _push(`<!--]--></div></div></div><div class="lg:col-span-1"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6 mb-8"><h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('services.detail.estimateStartingFrom'))}</h3><div class="text-4xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-1">${ssrInterpolate(formatIDR(unref(service).pricingUSD))}</div><div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-2"> ≈ ${ssrInterpolate(formatUSD(unref(service).pricingUSD))} USD </div><div class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-2">${ssrInterpolate(unref(t)('services.detail.priceNote') || 'Harga dapat disesuaikan berdasarkan scope proyek')}</div><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4">${ssrInterpolate(unref(t)('services.detail.estimateNote'))}</p>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/contact-us'),
          class: 'w-full inline-flex justify-center items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('services.detail.requestEstimate'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('services.detail.requestEstimate')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('services.detail.faq'))}</h3><div class="space-y-4"><!--[-->`)
        ssrRenderList(unref(faqs), (faq) => {
          _push(`<div class="border-b border-es-border dark:border-es-border-dark pb-4 last:border-0 last:pb-0"><h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(faq.question)}</h4><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(faq.answer)}</p></div>`)
        })
        _push(`<!--]--></div></div></div></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="w-full px-4"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">${ssrInterpolate(unref(t)('services.detail.relatedServices'))}</h2><div class="grid md:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(relatedServices), (related) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: related.slug,
            to: unref(localePath)(`/our-services/${related.slug}`),
            class: 'group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg p-6 shadow-md hover:shadow-xl transition-all'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-3xl mb-4"${_scopeId}>${ssrInterpolate(related.icon)}</div><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(related.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2"${_scopeId}>${ssrInterpolate(related.description)}</p>`)
              } else {
                return [
                  createVNode('div', { class: 'text-3xl mb-4' }, toDisplayString(related.icon), 1),
                  createVNode('h3', { class: 'text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(related.title), 1),
                  createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2' }, toDisplayString(related.description), 1)
                ]
              }
            }),
            _: 2
          }, _parent))
        })
        _push(`<!--]--></div></div></section><section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark"><div class="container mx-auto px-4 text-center"><h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">${ssrInterpolate(unref(t)('services.detail.ctaTitle'))}</h2><p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">${ssrInterpolate(unref(t)('services.detail.ctaDescription'))}</p>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/contact-us'),
          class: 'inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('services.detail.ctaButton'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('services.detail.ctaButton')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></section><!--]-->`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/our-services/[slug].vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=_slug_-BWyp3QyG.mjs.map
