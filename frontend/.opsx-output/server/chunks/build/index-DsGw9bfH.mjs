import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer'
import { p as publicAssetsURL } from '../_/nitro.mjs'
import { i as publicWorks } from './public-content-D_mrJhWa.mjs'
import { a as useLocalePath, b as useI18n, c as useSeoMeta } from './server.mjs'
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
import '@unhead/schema-org/vue'
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const _imports_0 = publicAssetsURL('/images/banners/portfolio.jpg')
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    const localePath = useLocalePath()
    const { t } = useI18n()
    useSeoMeta({
      title: t('seo.works.title'),
      description: t('seo.works.description'),
      ogTitle: t('seo.works.ogTitle'),
      ogDescription: t('seo.works.ogDescription'),
      ogImage: '/images/banners/portfolio.jpg'
    })
    const selectedService = ref('')
    const selectedPlatform = ref('')
    const visibleCount = ref(6)
    const allServices = computed(() => [
      { value: '', label: t('works.services.all') },
      { value: 'Web Development', label: t('works.services.webDevelopment') },
      { value: 'Mobile App Development', label: t('works.services.mobileApp') },
      { value: 'UI/UX Design', label: t('works.services.uiUxDesign') },
      { value: 'Digital Marketing', label: t('works.services.digitalMarketing') },
      { value: 'E-Commerce Solutions', label: t('works.services.ecommerce') },
      { value: 'Consulting', label: t('works.services.consulting') }
    ])
    const platforms = ['Shopify', 'React Native', 'Next.js', 'Nuxt', 'Flutter', 'WordPress', 'Laravel', 'Vue.js']
    const works = ref(publicWorks)
    const filteredWorks = computed(() => {
      return works.value.filter((work) => {
        const matchesService = !selectedService.value || work.service === selectedService.value
        const matchesPlatform = !selectedPlatform.value || work.platform === selectedPlatform.value
        return matchesService && matchesPlatform
      })
    })
    const visibleWorks = computed(() => {
      return filteredWorks.value.slice(0, visibleCount.value)
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', _imports_0)}${ssrRenderAttr('alt', unref(t)('works.banner.title'))} class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div><div class="absolute inset-0 flex items-center justify-center"><div class="container mx-auto px-4 text-center"><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('works.banner.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">${ssrInterpolate(unref(t)('works.banner.description'))}</p></div></div></section><section class="py-8 border-b border-es-border dark:border-es-border-dark sticky top-16 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark"><div class="container mx-auto px-4"><div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="flex flex-wrap gap-2"><!--[-->`)
      ssrRenderList(unref(allServices), (service) => {
        _push(`<button class="${ssrRenderClass([unref(selectedService) === service.value ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark' : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary/10 dark:hover:bg-es-accent-primary-dark/10', 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'])}">${ssrInterpolate(service.label)}</button>`)
      })
      _push(`<!--]--></div><div class="flex items-center gap-2"><select class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPlatform)) ? ssrLooseContain(unref(selectedPlatform), '') : ssrLooseEqual(unref(selectedPlatform), '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('works.platforms.all'))}</option><!--[-->`)
      ssrRenderList(platforms, (platform) => {
        _push(`<option${ssrRenderAttr('value', platform)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPlatform)) ? ssrLooseContain(unref(selectedPlatform), platform) : ssrLooseEqual(unref(selectedPlatform), platform)) ? ' selected' : ''}>${ssrInterpolate(platform)}</option>`)
      })
      _push(`<!--]--></select>`)
      if (unref(selectedService) || unref(selectedPlatform)) {
        _push(`<button class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium">${ssrInterpolate(unref(t)('works.filters.reset'))}</button>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div></div></div></section><section class="py-12 md:py-16"><div class="container mx-auto px-4"><div class="mb-8"><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('works.results.count', { visible: unref(filteredWorks).length, total: unref(works).length }))}</p></div>`)
      if (unref(filteredWorks).length === 0) {
        _push(`<div class="text-center py-16"><div class="text-6xl mb-4"> 🔍 </div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('works.emptyState.title'))}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">${ssrInterpolate(unref(t)('works.emptyState.description'))}</p><button class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">${ssrInterpolate(unref(t)('works.emptyState.resetButton'))}</button></div>`)
      } else {
        _push(`<div class="grid md:grid-cols-2 gap-8"><!--[-->`)
        ssrRenderList(unref(visibleWorks), (work) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: work.id,
            to: unref(localePath)(`/our-works/${work.slug}`),
            class: 'group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative overflow-hidden"${_scopeId}><img${ssrRenderAttr('src', work.image)}${ssrRenderAttr('alt', work.title)} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"${_scopeId}>`)
                if (work.featured) {
                  _push2(`<div class="absolute top-4 right-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full"${_scopeId}>${ssrInterpolate(unref(t)('works.featuredBadge'))}</div>`)
                } else {
                  _push2(`<!---->`)
                }
                _push2(`</div><div class="p-6"${_scopeId}><div class="flex flex-wrap gap-2 mb-3"${_scopeId}><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full"${_scopeId}>${ssrInterpolate(work.service)}</span><span class="px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full"${_scopeId}>${ssrInterpolate(work.platform)}</span></div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(work.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2"${_scopeId}>${ssrInterpolate(work.description)}</p><div class="flex flex-wrap gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark"${_scopeId}><!--[-->`)
                ssrRenderList(work.metrics.slice(0, 3), (metric) => {
                  _push2(`<div${_scopeId}><span class="font-semibold text-es-accent-primary dark:text-es-accent-primary-dark"${_scopeId}>${ssrInterpolate(metric.value)}${ssrInterpolate(metric.suffix)}</span><span class="ml-1"${_scopeId}>${ssrInterpolate(metric.label)}</span></div>`)
                })
                _push2(`<!--]--></div></div>`)
              } else {
                return [
                  createVNode('div', { class: 'relative overflow-hidden' }, [
                    createVNode('img', {
                      src: work.image,
                      alt: work.title,
                      class: 'w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300'
                    }, null, 8, ['src', 'alt']),
                    work.featured
                      ? (openBlock(), createBlock('div', {
                          key: 0,
                          class: 'absolute top-4 right-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full'
                        }, toDisplayString(unref(t)('works.featuredBadge')), 1))
                      : createCommentVNode('', true)
                  ]),
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('div', { class: 'flex flex-wrap gap-2 mb-3' }, [
                      createVNode('span', { class: 'px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full' }, toDisplayString(work.service), 1),
                      createVNode('span', { class: 'px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full' }, toDisplayString(work.platform), 1)
                    ]),
                    createVNode('h3', { class: 'text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(work.title), 1),
                    createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2' }, toDisplayString(work.description), 1),
                    createVNode('div', { class: 'flex flex-wrap gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark' }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(work.metrics.slice(0, 3), (metric) => {
                        return openBlock(), createBlock('div', {
                          key: metric.label
                        }, [
                          createVNode('span', { class: 'font-semibold text-es-accent-primary dark:text-es-accent-primary-dark' }, toDisplayString(metric.value) + toDisplayString(metric.suffix), 1),
                          createVNode('span', { class: 'ml-1' }, toDisplayString(metric.label), 1)
                        ])
                      }), 128))
                    ])
                  ])
                ]
              }
            }),
            _: 2
          }, _parent))
        })
        _push(`<!--]--></div>`)
      }
      if (unref(filteredWorks).length > unref(visibleWorks).length) {
        _push(`<div class="text-center mt-12"><button class="px-8 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-medium hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">${ssrInterpolate(unref(t)('works.loadMore.button'))}</button></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/our-works/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=index-DsGw9bfH.mjs.map
