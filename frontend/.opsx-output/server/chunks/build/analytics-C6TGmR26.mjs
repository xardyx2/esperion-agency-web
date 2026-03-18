import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer'
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
  __name: 'analytics',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({
      title: t('dashboard.analytics.title'),
      description: t('dashboard.analytics.description')
    })
    const loading = ref(false)
    const errorMessage = ref('')
    const report = reactive({
      overview: {
        total_events: 0,
        total_sessions: 0,
        page_views: 0,
        conversion_events: 0
      },
      funnels: []
    })
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.title'))}</h1><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.description'))}</p></div><button type="button" class="px-4 py-2 rounded-lg border border-es-border dark:border-es-border-dark text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(loading)) ? ' disabled' : ''}>${ssrInterpolate(unref(loading) ? unref(t)('dashboard.analytics.refresh.inProgress') : unref(t)('dashboard.analytics.refresh.button'))}</button></div>`)
      if (unref(errorMessage)) {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><article class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4"><p class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.overview.totalEvents'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(report).overview.total_events)}</p></article><article class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4"><p class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.overview.totalSessions'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(report).overview.total_sessions)}</p></article><article class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4"><p class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.overview.pageViews'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(report).overview.page_views)}</p></article><article class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4"><p class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.overview.conversionEvents'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(report).overview.conversion_events)}</p></article></section><section class="space-y-4"><h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.funnels.title'))}</h2>`)
      if (unref(report).funnels.length === 0) {
        _push(`<div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.funnels.noActive'))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<!--[-->`)
      ssrRenderList(unref(report).funnels, (funnel) => {
        _push(`<article class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4"><h3 class="text-base font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(funnel.funnel_name)}</h3><div class="mt-3 space-y-2"><!--[-->`)
        ssrRenderList(funnel.steps, (step) => {
          _push(`<div class="rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-3 flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(step.step_name)}</p><p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.analytics.funnels.eventLabel'))}: ${ssrInterpolate(step.event_name)}</p></div><div class="text-right"><p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(step.count)} events </p><p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(step.conversion_rate_from_previous == null ? unref(t)('dashboard.analytics.funnels.step') : `${step.conversion_rate_from_previous.toFixed(1)}% from previous`)}</p></div></div>`)
        })
        _push(`<!--]--></div></article>`)
      })
      _push(`<!--]--></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/analytics.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=analytics-C6TGmR26.mjs.map
