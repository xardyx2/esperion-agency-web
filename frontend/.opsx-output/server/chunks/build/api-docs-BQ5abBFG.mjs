import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer'
import { b as useI18n, c as useSeoMeta, e as useRuntimeConfig } from './server.mjs'
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
  __name: 'api-docs',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    const config = useRuntimeConfig()
    const openApiUrl = computed(() => {
      config.public.apiBase || 'http://localhost:8080'
      return 'http://localhost:8081/api/v1/openapi.json'
    })
    const isLoading = ref(true)
    const error = ref(false)
    useSeoMeta({
      title: t('dashboard.apiDocs.title'),
      description: t('dashboard.apiDocs.description')
    })
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}>`)
      if (unref(isLoading)) {
        _push(`<div class="flex items-center justify-center min-h-[60vh]"><div class="text-center space-y-4"><div class="animate-spin w-12 h-12 border-4 border-es-accent-primary border-t-transparent rounded-full mx-auto"></div><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.apiDocs.loading'))}</p></div></div>`)
      } else if (unref(error)) {
        _push(`<div class="flex items-center justify-center min-h-[60vh]"><div class="text-center space-y-4 max-w-md mx-auto px-4"><div class="text-6xl">⚠️</div><h2 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.apiDocs.errorTitle'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.apiDocs.errorMessage'))}</p><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-4 text-left text-sm"><p class="font-mono text-es-text-secondary dark:text-es-text-secondary-dark break-all">${ssrInterpolate(unref(t)('dashboard.apiDocs.backendUrl'))}: ${ssrInterpolate(unref(openApiUrl))}</p></div><div class="flex gap-3 justify-center pt-2"><button class="px-4 py-2 bg-es-accent-primary text-white rounded-lg hover:opacity-90 transition-opacity">${ssrInterpolate(unref(t)('dashboard.apiDocs.retry'))}</button><a${ssrRenderAttr('href', unref(openApiUrl))} target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-es-border dark:border-es-border-dark rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors">${ssrInterpolate(unref(t)('dashboard.apiDocs.openDirect'))}</a></div></div></div>`)
      } else {
        _push(`<div id="scalar-container"></div>`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/api-docs.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=api-docs-BQ5abBFG.mjs.map
