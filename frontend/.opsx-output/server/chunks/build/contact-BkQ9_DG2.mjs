import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer'
import { useContactApi } from './useApi-L_axzZs3.mjs'
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
  __name: 'contact',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.contact.seo.title'), description: t('dashboard.contact.seo.description') })
    const contactApi = useContactApi()
    const submissions = ref([])
    const stats = reactive({
      total: 0,
      by_status: {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0
      },
      by_service: []
    })
    const pending = ref(false)
    const error = ref('')
    const updatingId = ref(null)
    const serviceFilter = ref('')
    const statusFilter = ref('')
    const statusClass = (status) => {
      if (status === 'new') return 'bg-blue-500/10 text-blue-500'
      if (status === 'contacted') return 'bg-yellow-500/10 text-yellow-500'
      if (status === 'qualified') return 'bg-green-500/10 text-green-500'
      if (status === 'converted') return 'bg-emerald-500/10 text-emerald-500'
      return 'bg-gray-500/10 text-gray-500'
    }
    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
    }
    const loadContactData = async () => {
      pending.value = true
      error.value = ''
      try {
        const [listResponse, statsResponse] = await Promise.all([
          contactApi.list({
            limit: 100,
            service: serviceFilter.value || void 0,
            status: statusFilter.value || void 0
          }),
          contactApi.stats()
        ])
        submissions.value = listResponse.data
        stats.total = statsResponse.total
        stats.by_status = statsResponse.by_status
        stats.by_service = statsResponse.by_service
      } catch (err) {
        error.value = err instanceof Error ? err.message : t('dashboard.contact.loading')
      } finally {
        pending.value = false
      }
    }
    watch([serviceFilter, statusFilter], () => {
      loadContactData()
    })
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.contact.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.description'))}</p></div><button type="button" class="inline-flex items-center justify-center px-6 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"> 📥 ${ssrInterpolate(unref(t)('dashboard.contact.export.button'))}</button></div><div class="grid gap-4 md:grid-cols-3"><div class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><p class="text-xs uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.stats.total'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(stats).total)}</p></div><div class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><p class="text-xs uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.stats.new'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(stats).by_status.new)}</p></div><div class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><p class="text-xs uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.stats.qualified'))}</p><p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(stats).by_status.qualified)}</p></div></div><section class="rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="flex flex-col gap-4 md:flex-row"><input${ssrRenderAttr('value', unref(serviceFilter))} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.contact.filters.service'))} class="flex-1 rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><select class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), '') : ssrLooseEqual(unref(statusFilter), '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.allStatuses'))}</option><option value="new"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), 'new') : ssrLooseEqual(unref(statusFilter), 'new')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.new'))}</option><option value="contacted"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), 'contacted') : ssrLooseEqual(unref(statusFilter), 'contacted')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.contacted'))}</option><option value="qualified"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), 'qualified') : ssrLooseEqual(unref(statusFilter), 'qualified')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.qualified'))}</option><option value="converted"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), 'converted') : ssrLooseEqual(unref(statusFilter), 'converted')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.converted'))}</option><option value="lost"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), 'lost') : ssrLooseEqual(unref(statusFilter), 'lost')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.lost'))}</option></select><button type="button" class="rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(pending)) ? ' disabled' : ''}>${ssrInterpolate(unref(t)('dashboard.contact.filters.refresh'))}</button></div></section>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.loading'))}</div>`)
      } else {
        _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden"><table class="w-full"><thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"><tr><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.name'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.email'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.service'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.date'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.status'))}</th><th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.contact.table.actions'))}</th></tr></thead><tbody class="divide-y divide-es-border dark:divide-es-border-dark"><!--[-->`)
        ssrRenderList(unref(submissions), (submission) => {
          _push(`<tr class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><td class="px-6 py-4"><div><div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(submission.full_name)}</div><div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(submission.company_name || '-')}</div></div></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(submission.email || '-')}</td><td class="px-6 py-4"><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">${ssrInterpolate(submission.service)}</span></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(formatDate(submission.created_at))}</td><td class="px-6 py-4"><span class="${ssrRenderClass([statusClass(submission.status), 'px-3 py-1 text-xs rounded-full capitalize'])}">${ssrInterpolate(submission.status)}</span></td><td class="px-6 py-4 text-right"><div class="flex items-center justify-end gap-2"><select${ssrRenderAttr('value', submission.status)} class="rounded-lg border border-es-border bg-es-bg-primary px-3 py-2 text-xs text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"${ssrIncludeBooleanAttr(unref(updatingId) === submission.id) ? ' disabled' : ''}><option value="new">${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.new'))}</option><option value="contacted">${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.contacted'))}</option><option value="qualified">${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.qualified'))}</option><option value="converted">${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.converted'))}</option><option value="lost">${ssrInterpolate(unref(t)('dashboard.contact.filters.statusOptions.lost'))}</option></select></div></td></tr>`)
        })
        _push(`<!--]--></tbody></table>`)
        if (!unref(submissions).length) {
          _push(`<div class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.contact.table.noResults'))}</div>`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/contact.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=contact-BkQ9_DG2.mjs.map
