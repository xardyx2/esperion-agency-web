import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer'
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
  __name: 'clients',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.clients.seo.title'), description: t('dashboard.clients.seo.description') })
    const clients = ref([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const showForm = ref(false)
    const editingClientId = ref(null)
    const form = reactive({
      name: '',
      logo: '',
      category: '',
      status: 'active',
      testimonial: '',
      internal_notes: '',
      featured: false
    })
    const statusClass = (status) => {
      if (status === 'active') return 'bg-green-500/10 text-green-500'
      if (status === 'prospect') return 'bg-blue-500/10 text-blue-500'
      return 'bg-gray-500/10 text-gray-500'
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.clients.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.clients.description'))}</p></div><button type="button" class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"><span class="text-xl mr-2">+</span> ${ssrInterpolate(unref(t)('dashboard.clients.newButton'))}</button></div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(showForm)) {
        _push(`<section class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-4 flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(editingClientId) ? unref(t)('dashboard.clients.create.update') : unref(t)('dashboard.clients.create.title'))}</h2><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(editingClientId) ? 'Update retained client showcase details.' : unref(t)('dashboard.clients.create.title'))}</p></div><button type="button" class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(t)('dashboard.clients.create.cancel'))}</button></div><form class="grid gap-4 md:grid-cols-2"><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.nameTitle'))}</span><input${ssrRenderAttr('value', unref(form).name)} type="text" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.logoTitle'))}</span><input${ssrRenderAttr('value', unref(form).logo)} type="text" required${ssrRenderAttr('placeholder', unref(t)('dashboard.clients.create.logoPlaceholder'))} class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.categoryTitle'))}</span><input${ssrRenderAttr('value', unref(form).category)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.clients.create.categoryPlaceholder'))} class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.statusTitle'))}</span><select class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, 'active') : ssrLooseEqual(unref(form).status, 'active')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.clients.status.active'))}</option><option value="prospect"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, 'prospect') : ssrLooseEqual(unref(form).status, 'prospect')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.clients.status.prospect'))}</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, 'inactive') : ssrLooseEqual(unref(form).status, 'inactive')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.clients.status.inactive'))}</option></select></label><label class="space-y-2 text-sm md:col-span-2"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.testimonialTitle'))}</span><textarea rows="3" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).testimonial)}</textarea></label><label class="space-y-2 text-sm md:col-span-2"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.internalNotesTitle'))}</span><textarea rows="3" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).internal_notes)}</textarea></label><label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark md:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).featured) ? ssrLooseContain(unref(form).featured, null) : unref(form).featured) ? ' checked' : ''} type="checkbox" class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"> ${ssrInterpolate(unref(t)('dashboard.clients.create.featured'))}</label><div class="md:col-span-2 flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.clients.create.saveInProgress') : unref(editingClientId) ? unref(t)('dashboard.clients.create.saveButton') : unref(t)('dashboard.clients.create.createButton'))}</button></div></form></section>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.clients.create.loading'))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden"><table class="w-full"><thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"><tr><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.clients.table.client'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.clients.table.category'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.clients.table.status'))}</th><th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.clients.table.testimonial'))}</th><th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">${ssrInterpolate(unref(t)('dashboard.clients.table.actions'))}</th></tr></thead><tbody class="divide-y divide-es-border dark:divide-es-border-dark"><!--[-->`)
      ssrRenderList(unref(clients), (client) => {
        _push(`<tr class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">${ssrInterpolate(client.logo ? 'Logo' : unref(t)('dashboard.clients.status.n_a'))}</div><div><div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(client.name)}</div></div></div></td><td class="px-6 py-4"><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">${ssrInterpolate(client.category || '-')}</span></td><td class="px-6 py-4"><span class="${ssrRenderClass([statusClass(client.status), 'px-3 py-1 text-xs rounded-full capitalize'])}">${ssrInterpolate(client.status)}</span></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(client.testimonial ? unref(t)('dashboard.clients.testimonialStatus.available') : unref(t)('dashboard.clients.testimonialStatus.none'))}</td><td class="px-6 py-4 text-right"><div class="flex items-center justify-end gap-2"><button type="button" class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">${ssrInterpolate(unref(t)('dashboard.clients.buttons.edit'))}</button><button type="button" class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">${ssrInterpolate(unref(t)('dashboard.clients.buttons.delete'))}</button></div></td></tr>`)
      })
      _push(`<!--]--></tbody></table>`)
      if (!unref(pending) && !unref(clients).length) {
        _push(`<div class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.clients.table.noResults'))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/clients.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=clients-BKXAhsgI.mjs.map
