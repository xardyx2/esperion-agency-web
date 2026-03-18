import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer'
import { useAuthApi } from './useApi-L_axzZs3.mjs'
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
  __name: 'sessions',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
    const { t } = useI18n()
    useSeoMeta({
      title: t('dashboard.sessions.seo.title'),
      description: t('dashboard.sessions.seo.description')
    })
    const authApi = useAuthApi()
    const sessions = ref([])
    const pending = ref(false)
    const error = ref(null)
    const formatDate = (value) => {
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
    }
    const formatDevice = (userAgent) => {
      if (!userAgent) {
        return 'Unknown device'
      }
      if (userAgent.includes('Mobile')) {
        return 'Mobile browser'
      }
      if (userAgent.includes('Windows')) {
        return 'Windows device'
      }
      if (userAgent.includes('Macintosh')) {
        return 'Mac device'
      }
      return userAgent
    }
    const loadSessions = async () => {
      pending.value = true
      error.value = null
      try {
        const response = await authApi.getSessions()
        sessions.value = response.sessions
      } catch (err) {
        error.value = err instanceof Error ? err.message : t('dashboard.sessions.loading')
      } finally {
        pending.value = false
      }
    };
    [__temp, __restore] = withAsyncContext(() => loadSessions()), await __temp, __restore()
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.description'))}</p></div><button type="button" class="inline-flex items-center justify-center rounded-lg border border-es-border px-4 py-2 text-sm font-semibold text-es-text-primary transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(pending)) ? ' disabled' : ''}>${ssrInterpolate(unref(pending) ? unref(t)('dashboard.sessions.refresh.inProgress') : unref(t)('dashboard.sessions.refresh.button'))}</button></div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`)
      ssrRenderList(unref(sessions), (session) => {
        _push(`<article class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-4 flex items-start justify-between gap-4"><div><p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(formatDevice(session.user_agent))}</p><p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(session.device_id || 'No device id recorded')}</p></div><span class="${ssrRenderClass([session.is_current ? 'bg-green-100 text-green-700' : 'bg-es-bg-tertiary text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark', 'rounded-full px-3 py-1 text-xs font-semibold'])}">${ssrInterpolate(session.is_current ? unref(t)('dashboard.sessions.status.current') : unref(t)('dashboard.sessions.status.active'))}</span></div><dl class="space-y-3 text-sm"><div><dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.columns.ipAddress'))}</dt><dd class="text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(session.ip_address || 'Unknown')}</dd></div><div><dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.columns.created'))}</dt><dd class="text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(formatDate(session.created_at))}</dd></div><div><dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.columns.expires'))}</dt><dd class="text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(formatDate(session.expires_at))}</dd></div></dl><button type="button" class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(pending) || session.is_current) ? ' disabled' : ''}>${ssrInterpolate(session.is_current ? unref(t)('dashboard.sessions.columns.currentSession') : unref(t)('dashboard.sessions.columns.forceLogout'))}</button></article>`)
      })
      _push(`<!--]--></div>`)
      if (!unref(pending) && !unref(sessions).length) {
        _push(`<div class="rounded-xl border border-dashed border-es-border px-6 py-10 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.sessions.noResults'))}</div>`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/sessions.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=sessions-BbxAgdnG.mjs.map
