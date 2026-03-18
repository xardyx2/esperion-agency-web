import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer'
import { b as useI18n, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: 'offline',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    const localePath = useLocalePath()
    useSeoMeta({
      title: t('offline.seo.title'),
      description: t('offline.seo.description')
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4' }, _attrs))}><div class="text-center max-w-md"><div class="text-8xl mb-8"> 📡 </div><h1 class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('offline.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-8">${ssrInterpolate(unref(t)('offline.message'))}</p><div class="space-y-4"><button class="w-full px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">${ssrInterpolate(unref(t)('offline.tryAgain'))}</button>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/'),
        class: 'w-full inline-flex justify-center items-center px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('offline.goToHomepage'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('offline.goToHomepage')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div><div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark"><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('offline.availablePages'))}</p><ul class="mt-4 space-y-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark"><li>📄 ${ssrInterpolate(unref(t)('offline.cachedPages.home'))}</li><li>📄 ${ssrInterpolate(unref(t)('offline.cachedPages.works'))}</li><li>📄 ${ssrInterpolate(unref(t)('offline.cachedPages.services'))}</li><li>📄 ${ssrInterpolate(unref(t)('offline.cachedPages.articles'))}</li></ul></div></div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/offline.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=offline-BhWlAfFa.mjs.map
