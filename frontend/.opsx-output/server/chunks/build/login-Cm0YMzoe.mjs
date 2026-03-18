import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, nextTick, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrGetDynamicModelProps, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer'
import { u as useAuthStore } from './auth-eqZ1paNc.mjs'
import { b as createLoginSchema, u as useForm, t as toVeeTypedSchema } from './useValidation-ClFrraDa.mjs'
import { f as useRouter, b as useI18n, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: 'login',
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter()
    const { t } = useI18n()
    const localePath = useLocalePath()
    const authStore = useAuthStore()
    useSeoMeta({
      title: t('auth.login.seo.title'),
      description: t('auth.login.seo.description')
    })
    const schema = createLoginSchema(t)
    const {
      errors,
      defineField,
      handleSubmit,
      meta
    } = useForm({
      validationSchema: toVeeTypedSchema(schema),
      initialValues: {
        email: '',
        password: ''
      }
    })
    const [email, emailProps] = defineField('email')
    const [password, passwordProps] = defineField('password')
    const rememberMe = ref(false)
    const isSubmitting = ref(false)
    const submitError = ref('')
    const getError = (field) => {
      return errors.value[field]
    }
    const emailError = computed(() => getError('email'))
    const passwordError = computed(() => getError('password'))
    const isFormValid = computed(() => {
      return Boolean(email.value && password.value) && meta.value.valid
    })
    handleSubmit(async (formValues) => {
      isSubmitting.value = true
      submitError.value = ''
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      try {
        await authStore.login(formValues.email, formValues.password)
        router.push(localePath('/dashboard'))
      } catch (error) {
        submitError.value = error instanceof Error ? error.message : t('auth.login.errors.invalidCredentials')
      } finally {
        isSubmitting.value = false
      }
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      let _temp0, _temp1
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4' }, _attrs))}><div class="w-full max-w-md">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/',
        class: 'flex justify-center mb-8'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark"${_scopeId}>Esperion</span>`)
          } else {
            return [
              createVNode('span', { class: 'text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark' }, 'Esperion')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl"><h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">${ssrInterpolate(unref(t)('auth.login.title'))}</h1><form class="space-y-6"><div><label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.login.emailLabel'))}</label><input${ssrRenderAttrs((_temp0 = mergeProps({
        id: 'email',
        value: unref(email)
      }, unref(emailProps), {
        type: 'email',
        required: '',
        placeholder: unref(t)('auth.login.emailPlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(emailError) }]
      }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(email)))))}>`)
      if (unref(emailError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(emailError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="password" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.login.passwordLabel'))}</label><input${ssrRenderAttrs((_temp1 = mergeProps({
        id: 'password',
        value: unref(password)
      }, unref(passwordProps), {
        type: 'password',
        required: '',
        placeholder: '••••••••',
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(passwordError) }]
      }), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, unref(password)))))}>`)
      if (unref(passwordError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(passwordError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div>`)
      if (unref(submitError)) {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(unref(submitError))}</div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="flex items-center justify-between"><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(rememberMe)) ? ssrLooseContain(unref(rememberMe), null) : unref(rememberMe)) ? ' checked' : ''} type="checkbox" class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"><span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('auth.login.rememberMe'))}</span></label><a href="#" class="text-sm text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">${ssrInterpolate(unref(t)('auth.login.forgotPassword'))}</a></div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(isFormValid)) ? ' disabled' : ''} class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`)
      if (!unref(isSubmitting)) {
        _push(`<span>${ssrInterpolate(unref(t)('auth.login.submitButton'))}</span>`)
      } else {
        _push(`<span>${ssrInterpolate(unref(t)('auth.login.submittingButton'))}</span>`)
      }
      _push(`</button></form><div class="relative my-8"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-es-border dark:border-es-border-dark"></div></div><div class="relative flex justify-center text-sm"><span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('auth.login.noAccount'))}</span></div></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/register'),
        class: 'w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('auth.login.createAccount'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('auth.login.createAccount')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div></div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/login.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=login-Cm0YMzoe.mjs.map
