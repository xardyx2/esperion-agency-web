import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrRenderList } from 'vue/server-renderer'
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
  __name: 'services',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.services.seo.title'), description: t('dashboard.services.seo.description') })
    const services = ref([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const showForm = ref(false)
    const editingServiceId = ref(null)
    const form = reactive({
      title: '',
      slug: '',
      description: '',
      icon: '',
      featured: false,
      display_order: 0
    })
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.services.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.services.description'))}</p></div><button type="button" class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"><span class="text-xl mr-2">+</span> ${ssrInterpolate(unref(t)('dashboard.services.newButton'))}</button></div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(showForm)) {
        _push(`<section class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-4 flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(editingServiceId) ? unref(t)('dashboard.services.create.update') : unref(t)('dashboard.services.create.title'))}</h2><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(editingServiceId) ? 'Update retained service catalog fields.' : unref(t)('dashboard.services.create.title'))}</p></div><button type="button" class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(t)('dashboard.services.create.cancel'))}</button></div><form class="grid gap-4 md:grid-cols-2"><label class="space-y-2 text-sm md:col-span-2"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.submitTitle'))}</span><input${ssrRenderAttr('value', unref(form).title)} type="text" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.slugTitle'))}</span><input${ssrRenderAttr('value', unref(form).slug)} type="text" required${ssrIncludeBooleanAttr(Boolean(unref(editingServiceId))) ? ' disabled' : ''} class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary disabled:opacity-60 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.orderTitle'))}</span><input${ssrRenderAttr('value', unref(form).display_order)} type="number" min="0" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="space-y-2 text-sm md:col-span-2"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.descTitle'))}</span><textarea rows="4" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).description)}</textarea></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.iconTitle'))}</span><input${ssrRenderAttr('value', unref(form).icon)} type="text" placeholder="Brief icon label" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"></label><label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).featured) ? ssrLooseContain(unref(form).featured, null) : unref(form).featured) ? ' checked' : ''} type="checkbox" class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"> ${ssrInterpolate(unref(t)('dashboard.services.create.featured'))}</label><div class="md:col-span-2 flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.services.create.saveInProgress') : unref(editingServiceId) ? unref(t)('dashboard.services.create.saveButton') : unref(t)('dashboard.services.create.createButton'))}</button></div></form></section>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.services.create.loading'))}</div>`)
      } else {
        _push(`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(services), (service) => {
          _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><div class="text-sm mb-4 text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(service.icon || unref(t)('dashboard.services.buttons.noIcon'))}</div><h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(service.title)}</h3><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-4 line-clamp-2">${ssrInterpolate(service.description)}</p><div class="flex items-center justify-between">`)
          if (service.featured) {
            _push(`<span class="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">${ssrInterpolate(unref(t)('dashboard.services.buttons.featured'))}</span>`)
          } else {
            _push(`<!---->`)
          }
          _push(`<div class="flex items-center gap-2 ml-auto"><button type="button" class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg">${ssrInterpolate(unref(t)('dashboard.services.buttons.edit'))}</button><button type="button" class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg">${ssrInterpolate(unref(t)('dashboard.services.buttons.delete'))}</button></div></div></div>`)
        })
        _push(`<!--]-->`)
        if (!unref(services).length) {
          _push(`<div class="col-span-full rounded-xl border border-es-border bg-es-bg-secondary px-4 py-8 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.services.noResults'))}</div>`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/services.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=services-DPZKfaDW.mjs.map
