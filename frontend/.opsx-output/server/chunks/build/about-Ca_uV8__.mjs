import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer'
import { p as publicAssetsURL } from '../_/nitro.mjs'
import { b as useI18n, a as useLocalePath, c as useSeoMeta, d as useSchemaOrg } from './server.mjs'
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

const _imports_0 = publicAssetsURL('/images/about-esperion-agency.jpg')
const _imports_1 = publicAssetsURL('/placeholders/first-party/founder-identity-required.svg')
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'about',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    const localePath = useLocalePath()
    useSeoMeta({
      title: t('about.seo.title'),
      description: t('about.seo.description'),
      ogTitle: t('about.seo.ogTitle'),
      ogDescription: t('about.seo.ogDescription'),
      ogImage: '/images/about-esperion-agency.jpg',
      ogUrl: () => `https://esperion.one/${localePath('/about').split('/')[1] || 'id'}/about`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: t('about.seo.ogTitle'),
      twitterDescription: t('about.seo.ogDescription'),
      twitterImage: '/images/about-esperion-agency.jpg'
    })
    const pageUrl = computed(() => {
      const locale = localePath('/about').split('/')[1] || 'id'
      return `https://esperion.one/${locale}/about`
    })
    useSchemaOrg([
      defineWebPage({
        '@type': 'AboutPage',
        'name': t('about.seo.schemaName'),
        'description': t('about.seo.schemaDescription'),
        'url': pageUrl.value,
        'dateModified': (/* @__PURE__ */ new Date()).toISOString()
      }),
      defineBreadcrumb({
        itemListElement: [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': t('breadcrumb.home'),
            'item': () => {
              const locale = localePath('/about').split('/')[1] || 'id'
              return `https://esperion.one/${locale}`
            }
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': t('breadcrumb.about'),
            'item': pageUrl.value
          }
        ]
      })
    ])
    const missionItems = computed(() => [
      t('about.visionMission.missionItems.0'),
      t('about.visionMission.missionItems.1'),
      t('about.visionMission.missionItems.2'),
      t('about.visionMission.missionItems.3')
    ])
    const values = computed(() => [
      {
        icon: t('about.values.items.0.icon'),
        title: t('about.values.items.0.title'),
        description: t('about.values.items.0.description')
      },
      {
        icon: t('about.values.items.1.icon'),
        title: t('about.values.items.1.title'),
        description: t('about.values.items.1.description')
      },
      {
        icon: t('about.values.items.2.icon'),
        title: t('about.values.items.2.title'),
        description: t('about.values.items.2.description')
      },
      {
        icon: t('about.values.items.3.icon'),
        title: t('about.values.items.3.title'),
        description: t('about.values.items.3.description')
      }
    ])
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', _imports_0)}${ssrRenderAttr('alt', unref(t)('about.banner.title'))} class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-bg-primary/80 via-es-bg-primary/60 to-es-bg-primary/40 dark:from-es-bg-primary-dark/80 dark:via-es-bg-primary-dark/60 dark:to-es-bg-primary-dark/40"></div><div class="absolute inset-0 bg-gradient-to-t from-es-bg-primary/60 via-transparent to-transparent dark:from-es-bg-primary-dark/60"></div><div class="absolute inset-0 flex items-center justify-center"><div class="w-full px-4 text-center"><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4 drop-shadow-lg">${ssrInterpolate(unref(t)('about.banner.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto drop-shadow-md">${ssrInterpolate(unref(t)('about.banner.description'))}</p></div></div></section><section class="py-12 md:py-16"><div class="w-full px-4"><div class="grid md:grid-cols-2 gap-12 items-start"><div><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('about.aboutSection.title'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">${ssrInterpolate(unref(t)('about.aboutSection.paragraph1'))}</p><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">${ssrInterpolate(unref(t)('about.aboutSection.paragraph2'))}</p><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">${ssrInterpolate(unref(t)('about.aboutSection.paragraph3'))}</p></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8"><h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('about.visionMission.title'))}</h3><div class="space-y-6"><div><div class="flex items-center gap-3 mb-3"><span class="text-3xl">🎯</span><h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('about.visionMission.visionTitle'))}</h4></div><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('about.visionMission.visionDescription'))}</p></div><div><div class="flex items-center gap-3 mb-3"><span class="text-3xl">🚀</span><h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('about.visionMission.missionTitle'))}</h4></div><ul class="space-y-2 text-es-text-secondary dark:text-es-text-secondary-dark"><!--[-->`)
      ssrRenderList(unref(missionItems), (item, index) => {
        _push(`<li class="flex items-start gap-2"><span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span><span>${ssrInterpolate(item)}</span></li>`)
      })
      _push(`<!--]--></ul></div></div></div></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="w-full px-4"><div class="grid grid-cols-2 md:grid-cols-4 gap-8"><div class="text-center"><div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2"> 150+ </div><div class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('about.stats.projectsCompleted'))}</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2"> 80+ </div><div class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('about.stats.clientCollaborations'))}</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2"> 10+ </div><div class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('about.stats.yearsExperience'))}</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2"> 25+ </div><div class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('about.stats.coreTalent'))}</div></div></div></div></section><section class="py-12 md:py-16"><div class="w-full px-4"><div class="max-w-3xl mx-auto text-center bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-2xl p-8 md:p-10"><div class="w-20 h-20 mx-auto mb-6 rounded-full bg-es-bg-primary dark:bg-es-bg-primary-dark overflow-hidden flex items-center justify-center"><img${ssrRenderAttr('src', _imports_1)} alt="Illustrative placeholder - founder identity not yet published" class="w-full h-full object-cover"></div><p class="mb-4 text-xs uppercase tracking-wider text-es-text-tertiary dark:text-es-text-tertiary-dark"> Founder identity visual pending official publication </p><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('about.founders.title'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">${ssrInterpolate(unref(t)('about.founders.description'))}</p></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="w-full px-4"><div class="text-center mb-12"><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('about.values.title'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">${ssrInterpolate(unref(t)('about.values.description'))}</p></div><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`)
      ssrRenderList(unref(values), (value) => {
        _push(`<div class="text-center"><div class="text-5xl mb-4">${ssrInterpolate(value.icon)}</div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3">${ssrInterpolate(value.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(value.description)}</p></div>`)
      })
      _push(`<!--]--></div></div></section><section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark"><div class="container mx-auto px-4 text-center"><h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">${ssrInterpolate(unref(t)('about.cta.title'))}</h2><p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">${ssrInterpolate(unref(t)('about.cta.description'))}</p>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/contact-us'),
        class: 'inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('about.cta.button'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('about.cta.button')), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/about.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=about-Ca_uV8__.mjs.map
