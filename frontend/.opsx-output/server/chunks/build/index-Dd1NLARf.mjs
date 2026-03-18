import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer'
import { p as publicAssetsURL } from '../_/nitro.mjs'
import { p as publicServices } from './public-content-D_mrJhWa.mjs'
import { a as useLocalePath, c as useSeoMeta, d as useSchemaOrg } from './server.mjs'
import { defineWebPage, defineBreadcrumb } from '@unhead/schema-org/vue'
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

const _imports_0 = publicAssetsURL('/images/services-banner.jpg')
const pageUrl = 'https://esperion.one/id/our-services'
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    const localePath = useLocalePath()
    useSeoMeta({
      title: 'Layanan Digital Marketing Terbaik di Jakarta - Esperion Agency',
      description: 'Temukan layanan digital terlengkap dari Esperion Agency di Jakarta. Web development, aplikasi mobile, SEO, marketing digital, dan UI/UX design profesional.',
      ogTitle: 'Layanan Digital Agency Jakarta - Esperion',
      ogDescription: 'Layanan digital marketing, pengembangan web dan aplikasi mobile profesional di Jakarta.',
      ogImage: '/images/services-banner.jpg',
      ogUrl: pageUrl,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Layanan Digital Agency Jakarta - Esperion',
      twitterDescription: 'Web development, mobile app, dan digital marketing terbaik untuk bisnis di Indonesia.',
      twitterImage: '/images/services-banner.jpg',
      ogLocale: 'id_ID'
    })
    useSchemaOrg([
      defineWebPage({
        '@type': 'CollectionPage',
        'name': 'Layanan Esperion Digital Agency',
        'description': 'Berbagai layanan digital profesional untuk membantu pertumbuhan bisnis Anda di Indonesia',
        'url': pageUrl,
        'dateModified': (/* @__PURE__ */ new Date()).toISOString()
      }),
      defineBreadcrumb({
        itemListElement: [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Beranda',
            'item': 'https://esperion.one/id'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Layanan Kami',
            'item': pageUrl
          }
        ]
      })
    ])
    const services = publicServices
    const reasons = [
      { icon: '🏆', title: 'Track record teruji', description: 'Lebih dari 150 proyek digital telah kami rampungkan.' },
      { icon: '👥', title: 'Tim lintas disiplin', description: 'Strategi, desain, dan pengembangan bergerak dalam satu alur kerja.' },
      { icon: '⚡', title: 'Eksekusi bertahap', description: 'Pendekatan iteratif membantu keputusan bergerak cepat tanpa kehilangan arah.' },
      { icon: '💬', title: 'Komunikasi terbuka', description: 'Setiap tahap kerja dibangun dengan konteks, dokumentasi, dan ekspektasi yang jelas.' }
    ]
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', _imports_0)} alt="Layanan Esperion" class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div><div class="absolute inset-0 flex items-center justify-center"><div class="container mx-auto px-4 text-center"><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4"> Layanan Kami </h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto"> Solusi digital yang disusun untuk membantu bisnis bergerak lebih jelas dan lebih siap tumbuh </p></div></div></section><section class="py-12 md:py-16"><div class="container mx-auto px-4"><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`)
      ssrRenderList(unref(services), (service) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: service.slug,
          to: unref(localePath)(`/our-services/${service.slug}`),
          class: 'group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-8 shadow-md hover:shadow-xl transition-all'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-16 h-16 mb-6 rounded-xl bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center group-hover:bg-es-accent-primary dark:group-hover:bg-es-accent-primary-dark transition-colors"${_scopeId}><span class="text-3xl group-hover:scale-110 transition-transform"${_scopeId}>${ssrInterpolate(service.icon)}</span></div><h3 class="text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(service.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-6 line-clamp-3"${_scopeId}>${ssrInterpolate(service.description)}</p><div class="flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-medium"${_scopeId}> Pelajari Detailnya <span class="ml-2 group-hover:translate-x-1 transition-transform"${_scopeId}>→</span></div>`)
            } else {
              return [
                createVNode('div', { class: 'w-16 h-16 mb-6 rounded-xl bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center group-hover:bg-es-accent-primary dark:group-hover:bg-es-accent-primary-dark transition-colors' }, [
                  createVNode('span', { class: 'text-3xl group-hover:scale-110 transition-transform' }, toDisplayString(service.icon), 1)
                ]),
                createVNode('h3', { class: 'text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(service.title), 1),
                createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark mb-6 line-clamp-3' }, toDisplayString(service.description), 1),
                createVNode('div', { class: 'flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-medium' }, [
                  createTextVNode(' Pelajari Detailnya '),
                  createVNode('span', { class: 'ml-2 group-hover:translate-x-1 transition-transform' }, '→')
                ])
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="container mx-auto px-4"><div class="text-center mb-12"><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4"> Kenapa Memilih Esperion? </h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto"> Kami menggabungkan strategi, eksekusi, dan kolaborasi yang rapi untuk hasil yang lebih terarah </p></div><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`)
      ssrRenderList(reasons, (reason) => {
        _push(`<div class="text-center"><div class="text-4xl mb-4">${ssrInterpolate(reason.icon)}</div><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(reason.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(reason.description)}</p></div>`)
      })
      _push(`<!--]--></div></div></section><section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark"><div class="container mx-auto px-4 text-center"><h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4"> Siap Memulai Proyek Anda? </h2><p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto"> Ceritakan konteks bisnis Anda, lalu kami bantu petakan solusi digital yang paling relevan. </p>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/contact-us'),
        class: 'inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Jadwalkan Konsultasi `)
          } else {
            return [
              createTextVNode(' Jadwalkan Konsultasi ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/our-services/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=index-Dd1NLARf.mjs.map
