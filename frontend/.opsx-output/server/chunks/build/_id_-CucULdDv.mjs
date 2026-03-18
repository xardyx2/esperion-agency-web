import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer'
import { b as useI18n, c as useSeoMeta, g as useRoute, f as useRouter } from './server.mjs'
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
  __name: '[id]',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({
      title: t('dashboard.articles_edit.seo.title'),
      description: t('dashboard.articles_edit.seo.description')
    })
    const route = useRoute()
    useRouter()
    computed(() => String(route.params.id || ''))
    const pending = ref(false)
    const submitting = ref(false)
    const translating = ref(false)
    const reviewing = ref(false)
    const statusSaving = ref(false)
    const error = ref('')
    const englishDraft = ref('')
    const form = reactive({
      title: '',
      slug_id: '',
      slug_en: '',
      content_id: '',
      content_en: '',
      excerpt_id: '',
      excerpt_en: '',
      category: 'Marketing',
      image: '',
      published: false
    })
    const translationState = reactive({
      id: '',
      slug_id: '',
      slug_en: '',
      content_id: '',
      content_en: '',
      translation_status: 'draft',
      available_languages: []
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.description'))}</p></div><div class="flex gap-3">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard/articles',
        class: 'rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('dashboard.articles_edit.back'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('dashboard.articles_edit.back')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button type="button" class="rounded-lg bg-es-accent-primary px-5 py-3 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.articles_edit.saveInProgress') : unref(t)('dashboard.articles_edit.saveButton'))}</button></div></div>`)
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.loading'))}</div>`)
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<div class="grid gap-6 xl:grid-cols-[2fr,1fr]"><section class="space-y-6"><div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.content.indonesian'))}</label><textarea rows="10" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(form).content_id)}</textarea></div><div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-4 flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.content.english'))}</h2><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.content.englishDescription'))}</p></div><button type="button" class="rounded-lg border border-es-border px-4 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(translating)) ? ' disabled' : ''}>${ssrInterpolate(unref(translating) ? unref(t)('dashboard.articles_edit.content.translating') : unref(t)('dashboard.articles_edit.content.translateButton'))}</button></div><textarea rows="10" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">${ssrInterpolate(unref(englishDraft))}</textarea><div class="mt-4 flex justify-end"><button type="button" class="rounded-lg bg-es-accent-primary px-4 py-2 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(reviewing)) ? ' disabled' : ''}>${ssrInterpolate(unref(reviewing) ? unref(t)('dashboard.articles_edit.content.reviewing') : unref(t)('dashboard.articles_edit.content.reviewButton'))}</button></div></div></section><aside class="space-y-6"><section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.publishing.title'))}</h2><div class="space-y-4"><label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.publishing.category'))} <select class="mt-2 w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value="Marketing"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Marketing') : ssrLooseEqual(unref(form).category, 'Marketing')) ? ' selected' : ''}>Marketing</option><option value="Design"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Design') : ssrLooseEqual(unref(form).category, 'Design')) ? ' selected' : ''}>Design</option><option value="Development"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Development') : ssrLooseEqual(unref(form).category, 'Development')) ? ' selected' : ''}>Development</option><option value="Business"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'Business') : ssrLooseEqual(unref(form).category, 'Business')) ? ' selected' : ''}>Business</option><option value="E-Commerce"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, 'E-Commerce') : ssrLooseEqual(unref(form).category, 'E-Commerce')) ? ' selected' : ''}>E-Commerce</option></select></label><label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).published) ? ssrLooseContain(unref(form).published, null) : unref(form).published) ? ' checked' : ''} type="checkbox" class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"> ${ssrInterpolate(unref(t)('dashboard.articles_edit.publishing.published'))}</label></div></section><section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.translationStatus.title'))}</h2><div class="space-y-3 text-sm"><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.translationStatus.current'))} <span class="font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(translationState).translation_status)}</span></p><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.articles_edit.translationStatus.available'))} ${ssrInterpolate(unref(translationState).available_languages.join(', ') || 'none')}</p><select class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(translationState).translation_status) ? ssrLooseContain(unref(translationState).translation_status, 'draft') : ssrLooseEqual(unref(translationState).translation_status, 'draft')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.draft'))}</option><option value="id_only"${ssrIncludeBooleanAttr(Array.isArray(unref(translationState).translation_status) ? ssrLooseContain(unref(translationState).translation_status, 'id_only') : ssrLooseEqual(unref(translationState).translation_status, 'id_only')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.id_only'))}</option><option value="en_only"${ssrIncludeBooleanAttr(Array.isArray(unref(translationState).translation_status) ? ssrLooseContain(unref(translationState).translation_status, 'en_only') : ssrLooseEqual(unref(translationState).translation_status, 'en_only')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.en_only'))}</option><option value="complete"${ssrIncludeBooleanAttr(Array.isArray(unref(translationState).translation_status) ? ssrLooseContain(unref(translationState).translation_status, 'complete') : ssrLooseEqual(unref(translationState).translation_status, 'complete')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.articles.status.complete'))}</option></select><button type="button" class="w-full rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(statusSaving)) ? ' disabled' : ''}>${ssrInterpolate(unref(statusSaving) ? unref(t)('dashboard.articles_edit.translationStatus.saveInProgress') : unref(t)('dashboard.articles_edit.translationStatus.save'))}</button></div></section></aside></div>`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/articles/[id].vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=_id_-CucULdDv.mjs.map
