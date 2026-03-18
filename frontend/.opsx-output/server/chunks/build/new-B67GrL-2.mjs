import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer'
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
    useSeoMeta({ title: t('dashboard.articles_new.seo.title'), description: t('dashboard.articles_new.seo.description') })
    useRouter()
    const submitting = ref(false)
    const error = ref('')
    const form = reactive({
      title: '',
      content_id: '',
      excerpt_id: '',
      category: 'Marketing',
      published: false
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.description'))}</p></div><div class="flex gap-3">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard/articles',
        class: 'rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('dashboard.articles_new.cancel'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('dashboard.articles_new.cancel')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button type="button" class="rounded-lg bg-es-accent-primary px-5 py-3 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.articles_new.saveInProgress') : unref(t)('dashboard.articles_new.createButton'))}</button></div></div>`)
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="grid gap-6 xl:grid-cols-[2fr,1fr]"><section class="space-y-6"><div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.content.indonesian'))}</label><textarea rows="12"${ssrRenderAttr('placeholder', unref(t)('dashboard.articles_new.content.placeholder'))} class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).content_id)}</textarea></div><div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.excerpt.title'))}</label><textarea rows="4"${ssrRenderAttr('placeholder', unref(t)('dashboard.articles_new.excerpt.placeholder'))} class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).excerpt_id)}</textarea></div></section><aside class="space-y-6"><section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.publishing.title'))}</h2><div class="space-y-4"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.publishing.category'))} <select class="mt-2 w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value="Marketing"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Marketing') : ssrLooseEqual(unref(form).category, 'Marketing')) ? ' selected' : ''}>Marketing</option><option value="Design"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Design') : ssrLooseEqual(unref(form).category, 'Design')) ? ' selected' : ''}>Design</option><option value="Development"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Development') : ssrLooseEqual(unref(form).category, 'Development')) ? ' selected' : ''}>Development</option><option value="Business"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Business') : ssrLooseEqual(unref(form).category, 'Business')) ? ' selected' : ''}>Business</option><option value="E-Commerce"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'E-Commerce') : ssrLooseEqual(unref(form).category, 'E-Commerce')) ? ' selected' : ''}>E-Commerce</option></select></label><label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).published) ? ssrLooseContain(unref(form).published, null) : unref(form).published) ? ' checked' : ''} type="checkbox" class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"> ${ssrInterpolate(unref(t)('dashboard.articles_new.publishing.publishImmediately'))}</label></div></section><section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.translationWorkflow.title'))}</h2><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_new.translationWorkflow.description'))}</p></section></aside></div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/articles/new.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=new-B67GrL-2.mjs.map
