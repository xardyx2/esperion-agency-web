import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer'
import { p as publicAssetsURL } from '../_/nitro.mjs'
import { a as publicArticles } from './public-content-D_mrJhWa.mjs'
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

const _imports_0 = publicAssetsURL('/images/banner-5.jpg')
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    const localePath = useLocalePath()
    const { t } = useI18n()
    const { locale } = useI18n()
    useSeoMeta({
      title: t('articles.banner.title') + ' - Insight Digital dari Esperion',
      description: 'Baca artikel, insight, dan pembelajaran seputar pengembangan web, desain, dan pemasaran digital dari tim Esperion.',
      ogTitle: t('articles.banner.title') + ' Esperion',
      ogDescription: 'Insight dan pembaruan dari tim Esperion.',
      ogImage: '/images/banner-5.jpg'
    })
    const selectedCategory = ref('')
    const searchQuery = ref('')
    const visibleCount = ref(6)
    const email = ref('')
    const allCategories = computed(() => [
      { value: '', label: t('articles.filters.allCategories') },
      { value: 'Marketing', label: t('articles.filters.marketing') },
      { value: 'Design', label: t('articles.filters.design') },
      { value: 'Development', label: t('articles.filters.development') },
      { value: 'E-Commerce', label: t('articles.filters.ecommerce') },
      { value: 'Business', label: t('articles.filters.business') }
    ])
    const articles = ref(publicArticles)
    const articlePath = (article) => {
      const slug = locale.value === 'en' ? article.slug_en || article.slug_id : article.slug_id
      return localePath(`/articles/${slug}`)
    }
    const filteredArticles = computed(() => {
      return articles.value.filter((article) => {
        const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
        const matchesSearch = !searchQuery.value || article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || article.excerpt_id.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchesCategory && matchesSearch
      })
    })
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', _imports_0)}${ssrRenderAttr('alt', unref(t)('articles.banner.title'))} class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div><div class="absolute inset-0 flex items-center justify-center"><div class="container mx-auto px-4 text-center"><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('articles.banner.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">${ssrInterpolate(unref(t)('articles.banner.description'))}</p></div></div></section><section class="py-8 border-b border-es-border dark:border-es-border-dark sticky top-16 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark"><div class="container mx-auto px-4"><div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="flex flex-wrap gap-2"><!--[-->`)
      ssrRenderList(unref(allCategories), (category) => {
        _push(`<button class="${ssrRenderClass([unref(selectedCategory) === category.value ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark' : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary/10 dark:hover:bg-es-accent-primary-dark/10', 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'])}">${ssrInterpolate(category.label)}</button>`)
      })
      _push(`<!--]--></div><div class="flex items-center gap-2"><div class="relative"><input${ssrRenderAttr('value', unref(searchQuery))} type="text"${ssrRenderAttr('placeholder', unref(t)('articles.search.placeholder'))} class="w-64 px-4 py-2 pl-10 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-es-text-secondary dark:text-es-text-secondary-dark">🔍</span></div>`)
      if (unref(selectedCategory) || unref(searchQuery)) {
        _push(`<button class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium">${ssrInterpolate(unref(t)('common.reset'))}</button>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div></div></div></section><section class="py-12 md:py-16"><div class="container mx-auto px-4"><div class="mb-8"><p class="text-es-text-secondary dark:text-es-text-secondary-dark"> Showing ${ssrInterpolate(unref(filteredArticles).length)} dari ${ssrInterpolate(unref(articles).length)} artikel </p></div>`)
      if (unref(filteredArticles).length === 0) {
        _push(`<div class="text-center py-16"><div class="text-6xl mb-4"> 📝 </div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('articles.emptyState.title'))}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">${ssrInterpolate(unref(t)('articles.emptyState.description'))}</p><button class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">${ssrInterpolate(unref(t)('common.reset'))} Semua Filter </button></div>`)
      } else {
        _push(`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(filteredArticles), (article) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: article.id,
            to: articlePath(article),
            class: 'group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative overflow-hidden"${_scopeId}><img${ssrRenderAttr('src', article.image)}${ssrRenderAttr('alt', article.title)} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}><span class="absolute top-4 left-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full"${_scopeId}>${ssrInterpolate(article.category)}</span></div><div class="p-6"${_scopeId}><div class="flex items-center gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-3"${_scopeId}><span${_scopeId}>📅 ${ssrInterpolate(formatDate(article.published_at))}</span><span${_scopeId}>👤 ${ssrInterpolate(article.author)}</span></div><h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(article.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3 mb-4"${_scopeId}>${ssrInterpolate(article.excerpt_id)}</p><div class="flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(t)('common.readMore'))} <span class="ml-1 group-hover:translate-x-1 transition-transform"${_scopeId}>→</span></div></div>`)
              } else {
                return [
                  createVNode('div', { class: 'relative overflow-hidden' }, [
                    createVNode('img', {
                      src: article.image,
                      alt: article.title,
                      class: 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                    }, null, 8, ['src', 'alt']),
                    createVNode('span', { class: 'absolute top-4 left-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full' }, toDisplayString(article.category), 1)
                  ]),
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('div', { class: 'flex items-center gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-3' }, [
                      createVNode('span', null, '📅 ' + toDisplayString(formatDate(article.published_at)), 1),
                      createVNode('span', null, '👤 ' + toDisplayString(article.author), 1)
                    ]),
                    createVNode('h3', { class: 'text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(article.title), 1),
                    createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3 mb-4' }, toDisplayString(article.excerpt_id), 1),
                    createVNode('div', { class: 'flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium' }, [
                      createTextVNode(toDisplayString(unref(t)('common.readMore')) + ' ', 1),
                      createVNode('span', { class: 'ml-1 group-hover:translate-x-1 transition-transform' }, '→')
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
      if (unref(filteredArticles).length > unref(visibleCount)) {
        _push(`<div class="text-center mt-12"><button class="px-8 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-medium hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">${ssrInterpolate(unref(t)('articles.loadMore.button'))}</button></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div></section><section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="container mx-auto px-4"><div class="max-w-2xl mx-auto text-center"><h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('articles.newsletter.title'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-8">${ssrInterpolate(unref(t)('articles.newsletter.description'))}</p><form class="flex flex-col sm:flex-row gap-4"><input${ssrRenderAttr('value', unref(email))} type="email"${ssrRenderAttr('placeholder', unref(t)('articles.newsletter.placeholder'))} required class="flex-1 px-6 py-4 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"><button type="submit" class="px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">${ssrInterpolate(unref(t)('articles.newsletter.subscribeButton'))}</button></form></div></div></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/articles/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=index-C2v_sGdT.mjs.map
