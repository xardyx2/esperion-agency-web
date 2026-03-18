import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer'
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
  __name: 'works',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.works.seo.title'), description: t('dashboard.works.seo.description') })
    const works = ref([])
    const pending = ref(false)
    const error = ref('')
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.works.description'))}</p></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard/works/new',
        class: 'inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xl mr-2"${_scopeId}>+</span> ${ssrInterpolate(unref(t)('dashboard.works.newButton'))}`)
          } else {
            return [
              createVNode('span', { class: 'text-xl mr-2' }, '+'),
              createTextVNode(' ' + toDisplayString(unref(t)('dashboard.works.newButton')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.works.loading'))}</div>`)
      } else {
        _push(`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(works), (work) => {
          _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden"><div class="aspect-video bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center"><span class="text-4xl">${ssrInterpolate(work.image ? 'Image' : unref(t)('dashboard.works.image.noImage'))}</span></div><div class="p-4"><div class="flex items-center justify-between mb-2"><span class="px-2 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">${ssrInterpolate(work.service)}</span>`)
          if (work.featured) {
            _push(`<span class="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">${ssrInterpolate(unref(t)('dashboard.works.featuredBadge'))}</span>`)
          } else {
            _push(`<!---->`)
          }
          _push(`</div><h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(work.title)}</h3><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-1">${ssrInterpolate(work.client_name)}</p><p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-3">${ssrInterpolate(work.platform)}</p><div class="flex items-center justify-end gap-2"><button type="button" class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors">${ssrInterpolate(unref(t)('dashboard.works.buttons.delete'))}</button></div></div></div>`)
        })
        _push(`<!--]-->`)
        if (!unref(works).length) {
          _push(`<div class="col-span-full rounded-xl border border-es-border bg-es-bg-secondary px-4 py-8 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.works.noResults'))}</div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</div>`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/works.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=works-DWx-O5sh.mjs.map
