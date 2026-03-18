import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer'
import { b as useI18n, c as useSeoMeta, f as useRouter } from './server.mjs'
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
  __name: 'new',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.works_new.seo.title'), description: t('dashboard.works_new.seo.description') })
    useRouter()
    const submitting = ref(false)
    const error = ref('')
    const form = ref({
      title: '',
      slug: '',
      description: '',
      client_name: '',
      service: 'Web Development',
      platform: '',
      image: '',
      featured: false,
      metrics: [{ label: '', value: '', suffix: '' }]
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex items-center justify-between mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.works_new.description'))}</p></div><div class="flex gap-4">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard/works',
        class: 'px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('dashboard.works_new.cancel'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('dashboard.works_new.cancel')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button type="button"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''} class="px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-60">${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.works_new.saveInProgress') : unref(t)('dashboard.works_new.publishButton'))}</button></div></div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="grid lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.metrics.title'))}</label><!--[-->`)
      ssrRenderList(unref(form).metrics, (metric, index) => {
        _push(`<div class="grid grid-cols-3 gap-4 mb-4"><input${ssrRenderAttr('value', metric.label)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.metrics.labelPlaceholder'))} class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm"><input${ssrRenderAttr('value', metric.value)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.metrics.valuePlaceholder'))} class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm"><input${ssrRenderAttr('value', metric.suffix)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.metrics.suffixPlaceholder'))} class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm"></div>`)
      })
      _push(`<!--]--><button class="text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium hover:underline">${ssrInterpolate(unref(t)('dashboard.works_new.metrics.add'))}</button></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.details.client.label'))}</label><input${ssrRenderAttr('value', unref(form).client_name)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.details.client.placeholder'))} class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.details.service.label'))}</label><select class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"><option value="Web Development"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'Web Development') : ssrLooseEqual(unref(form).service, 'Web Development')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.webDevelopment'))}</option><option value="Mobile App Development"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'Mobile App Development') : ssrLooseEqual(unref(form).service, 'Mobile App Development')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.mobileAppDevelopment'))}</option><option value="UI/UX Design"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'UI/UX Design') : ssrLooseEqual(unref(form).service, 'UI/UX Design')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.uiUxDesign'))}</option><option value="Digital Marketing"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'Digital Marketing') : ssrLooseEqual(unref(form).service, 'Digital Marketing')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.digitalMarketing'))}</option><option value="E-Commerce Solutions"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'E-Commerce Solutions') : ssrLooseEqual(unref(form).service, 'E-Commerce Solutions')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.ecommerceSolutions'))}</option><option value="Consulting"${ssrIncludeBooleanAttr(Array.isArray(unref(form).service) ? ssrLooseContain(unref(form).service, 'Consulting') : ssrLooseEqual(unref(form).service, 'Consulting')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.works_new.details.service.options.consulting'))}</option></select></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.details.platform.label'))}</label><input${ssrRenderAttr('value', unref(form).platform)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.details.platform.placeholder'))} class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"></div></div><div class="space-y-6"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.details.slug.label'))}</label><input${ssrRenderAttr('value', unref(form).slug)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.details.slug.placeholder'))} class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('dashboard.works_new.details.featured'))}</h3><div class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).featured) ? ssrLooseContain(unref(form).featured, null) : unref(form).featured) ? ' checked' : ''} type="checkbox" class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"><label class="text-sm text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.works_new.details.featured'))}</label></div></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('dashboard.works_new.image.title'))}</h3><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.works_new.image.label'))}</label><input${ssrRenderAttr('value', unref(form).image)} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.works_new.image.placeholder'))} class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"></div></div></div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/works/new.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=new-tPwo7eX2.mjs.map
