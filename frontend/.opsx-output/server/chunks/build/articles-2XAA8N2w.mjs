import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer'
import { b as useI18n, c as useSeoMeta } from './server.mjs'
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
import '@unhead/schema-org/vue'
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'articles',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({
      title: t('dashboard.articles.seo.title'),
      description: t('dashboard.articles.seo.description')
    })
    const articles = ref([])
    const pending = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const categories = computed(() => [...new Set(articles.value.map(article => article.category))].sort())
    const filteredArticles = computed(() => {
      return articles.value.filter((article) => {
        const matchesSearch = [article.title, article.slug_id, article.slug_en || ''].join(' ').toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
        const matchesStatus = !selectedStatus.value || article.translation_status === selectedStatus.value
        return matchesSearch && matchesCategory && matchesStatus
      })
    })
    const translationStatusClass = (status) => {
      if (status === 'complete') return 'bg-green-100 text-green-700'
      if (status === 'id_only' || status === 'en_only') return 'bg-blue-100 text-blue-700'
      return 'bg-yellow-100 text-yellow-700'
    }
    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.description'))}</p></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard/articles/new',
        class: 'inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-6 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="mr-2 text-xl"${_scopeId}>+</span> ${ssrInterpolate(unref(t)('dashboard.articles.newButton'))}`)
          } else {
            return [
              createVNode('span', { class: 'mr-2 text-xl' }, '+'),
              createTextVNode(' ' + toDisplayString(unref(t)('dashboard.articles.newButton')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div><section class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="flex flex-col gap-4 md:flex-row"><input${ssrRenderAttr('value', unref(searchQuery))} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.articles.search.placeholder'))} class="flex-1 rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><select class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), '') : ssrLooseEqual(unref(selectedCategory), '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.filters.allCategories'))}</option><!--[-->`)
      ssrRenderList(unref(categories), (category) => {
        _push(`<option${ssrRenderAttr('value', category)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), category) : ssrLooseEqual(unref(selectedCategory), category)) ? ' selected' : ''}>${ssrInterpolate(category)}</option>`)
      })
      _push(`<!--]--></select><select class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), '') : ssrLooseEqual(unref(selectedStatus), '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.filters.allTranslationStatus'))}</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), 'draft') : ssrLooseEqual(unref(selectedStatus), 'draft')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.draft'))}</option><option value="id_only"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), 'id_only') : ssrLooseEqual(unref(selectedStatus), 'id_only')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.id_only'))}</option><option value="en_only"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), 'en_only') : ssrLooseEqual(unref(selectedStatus), 'en_only')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.en_only'))}</option><option value="complete"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), 'complete') : ssrLooseEqual(unref(selectedStatus), 'complete')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.complete'))}</option></select></div></section>`)
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.placeholders.loading'))}</div>`)
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(t)('dashboard.articles.placeholders.error'))}</div>`)
      } else {
        _push(`<section class="overflow-hidden rounded-xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><table class="w-full"><thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"><tr><th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.columns.title'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.columns.category'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.columns.translation'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.columns.publish'))}</th><th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.columns.actions'))}</th></tr></thead><tbody class="divide-y divide-es-border dark:divide-es-border-dark"><!--[-->`)
        ssrRenderList(unref(filteredArticles), (article) => {
          _push(`<tr class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><td class="px-6 py-4 align-top"><div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(article.title)}</div><div class="mt-1 text-xs text-es-text-secondary dark:text-es-text-secondary-dark"> \`${ssrInterpolate(article.slug_id)}\` / \`${ssrInterpolate(article.slug_en || article.slug_id)}\` </div></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(article.category)}</td><td class="px-6 py-4"><span class="${ssrRenderClass([translationStatusClass(article.translation_status), 'rounded-full px-3 py-1 text-xs font-semibold capitalize'])}">${ssrInterpolate(article.translation_status.replace('_', ' '))}</span></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(article.published ? formatDate(article.published_at) : unref(t)('dashboard.articles.status.draft'))}</td><td class="px-6 py-4"><div class="flex justify-end gap-2">`)
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/articles/${article.id}`,
            class: 'rounded-lg px-3 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-primary dark:text-es-text-primary-dark dark:hover:bg-es-bg-primary-dark'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)('dashboard.articles.buttons.edit'))}`)
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)('dashboard.articles.buttons.edit')), 1)
                ]
              }
            }),
            _: 2
          }, _parent))
          _push(`<button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">${ssrInterpolate(unref(t)('dashboard.articles.buttons.delete'))}</button></div></td></tr>`)
        })
        _push(`<!--]--></tbody></table>`)
        if (!unref(filteredArticles).length) {
          _push(`<div class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles.placeholders.noResults'))}</div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</section>`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/articles.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=articles-2XAA8N2w.mjs.map
