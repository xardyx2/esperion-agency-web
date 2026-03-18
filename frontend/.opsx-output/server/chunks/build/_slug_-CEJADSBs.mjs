import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, withAsyncContext, watchEffect, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer'
import { e as findPublicWorkBySlug, h as getRelatedWorks } from './public-content-D_mrJhWa.mjs'
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: '[slug]',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
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
    const { data: work, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `work-${route.params.slug}`,
      () => {
        const record = findPublicWorkBySlug(slugParam.value)
        if (!record) {
          throw createError({ statusCode: 404, statusMessage: 'Work not found' })
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
        throw createError({ statusCode: 404, statusMessage: 'Work not found' })
      }
    })
    const features = computed(() => work.value?.features || [])
    const gallery = computed(() => work.value?.gallery || [])
    const relatedWorks = computed(() => work.value ? getRelatedWorks(work.value.slug, 3) : [])
    const localePrefix = computed(() => locale.value === 'en' ? 'en' : 'id')
    const pageUrl = computed(() => work.value ? `https://esperion.one/${localePrefix.value}/our-works/${work.value.slug}` : '')
    watchEffect(() => {
      if (!work.value) return
      useSeoMeta({
        title: t('works.detail.seo.title', { title: work.value.title }),
        description: t('works.detail.seo.description', { description: work.value.description }),
        ogTitle: `${work.value.title} - Esperion`,
        ogDescription: work.value.description,
        ogImage: work.value.image,
        ogUrl: pageUrl.value,
        ogType: 'article',
        twitterCard: 'summary_large_image',
        twitterTitle: `${work.value.title} - Esperion`,
        twitterDescription: work.value.description,
        twitterImage: work.value.image,
        ogLocale: locale.value === 'en' ? 'en_US' : 'id_ID'
      })
    })
    watchEffect(() => {
      if (!work.value) return
      useSchemaOrg([
        defineWebPage({
          '@type': 'ItemPage',
          'name': work.value.title,
          'description': work.value.description,
          'url': pageUrl.value,
          'image': work.value.image,
          'dateModified': (/* @__PURE__ */ new Date()).toISOString()
        }),
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
              'name': t('breadcrumb.works'),
              'item': `https://esperion.one/${localePrefix.value}/our-works`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': work.value.title,
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
        _push(`<div class="flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl font-bold text-es-text-primary mb-4">${ssrInterpolate(unref(t)('works.detail.notFound'))}</h1>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/our-works'),
          class: 'text-es-accent-primary hover:underline'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('works.detail.backToWorks'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('works.detail.backToWorks')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></div>`)
      } else if (unref(work)) {
        _push(`<!--[--><section class="relative h-[400px] md:h-[500px]"><img${ssrRenderAttr('src', unref(work).image)}${ssrRenderAttr('alt', unref(work).title)} class="w-full h-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-es-bg-primary dark:from-es-bg-primary-dark to-transparent"></div></section><section class="py-12 md:py-16 -mt-32 relative z-10"><div class="w-full px-4"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-2xl p-8 md:p-12 shadow-xl"><div class="flex flex-wrap items-center gap-4 mb-6"><span class="px-4 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark rounded-full text-sm font-medium">${ssrInterpolate(unref(work).service)}</span><span class="px-4 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark rounded-full text-sm">${ssrInterpolate(unref(work).platform)}</span>`)
        if (unref(work).featured) {
          _push(`<span class="px-4 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-full text-sm font-semibold">${ssrInterpolate(unref(t)('works.detail.featuredProject'))}</span>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</div><h1 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(work).title)}</h1><div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-8"><div class="flex items-center gap-2"><span>👤</span><span>${ssrInterpolate(unref(t)('works.detail.client'))}: <strong class="text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(work).client_name)}</strong></span></div></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 p-6 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-xl"><!--[-->`)
        ssrRenderList(unref(work).metrics, (metric) => {
          _push(`<div class="text-center"><div class="text-2xl md:text-3xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-1">${ssrInterpolate(metric.value)}${ssrInterpolate(metric.suffix)}</div><div class="text-xs md:text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(metric.label)}</div></div>`)
        })
        _push(`<!--]--></div><div class="prose prose-lg dark:prose-invert max-w-none mb-12"><h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('works.detail.projectSummary'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">${ssrInterpolate(unref(work).description)}</p><p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">${ssrInterpolate(unref(t)('works.detail.projectDescription'))}</p></div><div class="mb-12"><h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('works.detail.keyFeatures'))}</h2><div class="grid md:grid-cols-2 gap-4"><!--[-->`)
        ssrRenderList(unref(features), (feature) => {
          _push(`<div class="flex items-start gap-3"><span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span><span class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(feature)}</span></div>`)
        })
        _push(`<!--]--></div></div><div class="mb-12"><h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('works.detail.projectGallery'))}</h2><div class="grid md:grid-cols-2 gap-4"><!--[-->`)
        ssrRenderList(unref(gallery), (img) => {
          _push(`<img${ssrRenderAttr('src', img)}${ssrRenderAttr('alt', unref(work).title)} class="rounded-lg hover:shadow-lg transition-shadow">`)
        })
        _push(`<!--]--></div></div><div class="flex flex-col sm:flex-row gap-4 justify-center">`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/contact-us'),
          class: 'inline-flex justify-center items-center px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('works.detail.startProjectDiscussion'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('works.detail.startProjectDiscussion')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/our-works'),
          class: 'inline-flex justify-center items-center px-8 py-4 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:border-es-accent-primary dark:hover:border-es-accent-primary-dark transition-colors'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('works.detail.viewAllPortfolio'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('works.detail.viewAllPortfolio')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="w-full px-4"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">${ssrInterpolate(unref(t)('works.detail.relatedWorks'))}</h2><div class="grid md:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(relatedWorks), (related) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: related.id,
            to: unref(localePath)(`/our-works/${related.slug}`),
            class: 'group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr('src', related.image)}${ssrRenderAttr('alt', related.title)} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}><div class="p-6"${_scopeId}><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(related.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm"${_scopeId}>${ssrInterpolate(related.service)}</p></div>`)
              } else {
                return [
                  createVNode('img', {
                    src: related.image,
                    alt: related.title,
                    class: 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  }, null, 8, ['src', 'alt']),
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('h3', { class: 'text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(related.title), 1),
                    createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm' }, toDisplayString(related.service), 1)
                  ])
                ]
              }
            }),
            _: 2
          }, _parent))
        })
        _push(`<!--]--></div></div></section><!--]-->`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/our-works/[slug].vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=_slug_-CEJADSBs.mjs.map
