import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrGetDynamicModelProps, ssrLooseContain, ssrIncludeBooleanAttr } from 'vue/server-renderer'
import { u as useAuthStore } from './auth-eqZ1paNc.mjs'
import { d as createRegisterSchema, u as useForm, t as toVeeTypedSchema } from './useValidation-ClFrraDa.mjs'
import { b as useI18n, f as useRouter, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: 'register',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    const router = useRouter()
    const localePath = useLocalePath()
    const authStore = useAuthStore()
    useSeoMeta({
      title: t('auth.register.seo.title'),
      description: t('auth.register.seo.description')
    })
    const schema = createRegisterSchema(t)
    const {
      values,
      errors,
      defineField,
      handleSubmit,
      meta
    } = useForm({
      validationSchema: toVeeTypedSchema(schema),
      initialValues: {
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        acceptTerms: false
      }
    })
    const [fullName, fullNameField] = defineField('fullName')
    const [username, usernameField] = defineField('username')
    const [email, emailField] = defineField('email')
    const [phone, phoneField] = defineField('phone')
    const [password, passwordField] = defineField('password')
    const [acceptTerms, acceptTermsField] = defineField('acceptTerms')
    const isSubmitting = ref(false)
    const submitError = ref('')
    const acceptTermsHtml = computed(() => {
      return t('auth.register.acceptTerms', {
        terms: `<a href="${localePath('/terms-of-service')}" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">${t('auth.register.termsOfService')}</a>`,
        privacy: `<a href="${localePath('/privacy-policy')}" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">${t('auth.register.privacyPolicy')}</a>`
      })
    })
    const getError = (field) => {
      return errors.value[field]
    }
    const fullNameError = computed(() => getError('fullName'))
    const usernameError = computed(() => getError('username'))
    const emailError = computed(() => getError('email'))
    const passwordError = computed(() => getError('password'))
    const acceptTermsError = computed(() => getError('acceptTerms'))
    const isFormValid = computed(() => {
      return Boolean(
        values.fullName.trim() && values.username.trim() && values.email.trim() && values.password && values.acceptTerms && meta.value.valid
      )
    })
    handleSubmit(async (formValues) => {
      isSubmitting.value = true
      submitError.value = ''
      try {
        await authStore.register({
          full_name: formValues.fullName,
          username: formValues.username,
          email: formValues.email,
          phone: formValues.phone || void 0,
          password: formValues.password
        })
        router.push(localePath('/dashboard'))
      } catch (error) {
        submitError.value = error instanceof Error ? error.message : t('auth.register.errors.registrationFailed')
      } finally {
        isSubmitting.value = false
      }
    }, () => {
      submitError.value = acceptTermsError.value || t('auth.register.errors.fixFields')
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      let _temp0, _temp1, _temp2, _temp3, _temp4, _temp5
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary flex items-center justify-center px-4 py-12' }, _attrs))}><div class="w-full max-w-md">`)
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
      _push(`<div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl"><h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">${ssrInterpolate(unref(t)('auth.register.title'))}</h1><form class="space-y-5"><div><label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.register.fullNameLabel'))}</label><input${ssrRenderAttrs((_temp0 = mergeProps({
        id: 'fullName',
        value: unref(values).fullName
      }, unref(fullNameField), {
        type: 'text',
        placeholder: unref(t)('auth.register.fullNamePlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(fullNameError) }]
      }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(values).fullName))))}>`)
      if (unref(fullNameError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(fullNameError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="username" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.register.usernameLabel'))}</label><input${ssrRenderAttrs((_temp1 = mergeProps({
        id: 'username',
        value: unref(values).username
      }, unref(usernameField), {
        type: 'text',
        placeholder: unref(t)('auth.register.usernamePlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(usernameError) }]
      }), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, unref(values).username))))}>`)
      if (unref(usernameError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(usernameError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.register.emailLabel'))}</label><input${ssrRenderAttrs((_temp2 = mergeProps({
        id: 'email',
        value: unref(values).email
      }, unref(emailField), {
        type: 'email',
        placeholder: unref(t)('auth.register.emailPlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(emailError) }]
      }), mergeProps(_temp2, ssrGetDynamicModelProps(_temp2, unref(values).email))))}>`)
      if (unref(emailError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(emailError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="phone" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.register.phoneLabel'))}</label><input${ssrRenderAttrs((_temp3 = mergeProps({
        id: 'phone',
        value: unref(values).phone
      }, unref(phoneField), {
        type: 'tel',
        placeholder: unref(t)('auth.register.phonePlaceholder'),
        class: 'w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark'
      }), mergeProps(_temp3, ssrGetDynamicModelProps(_temp3, unref(values).phone))))}></div><div><label for="password" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('auth.register.passwordLabel'))}</label><input${ssrRenderAttrs((_temp4 = mergeProps({
        id: 'password',
        value: unref(values).password
      }, unref(passwordField), {
        type: 'password',
        placeholder: '••••••••',
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(passwordError) }]
      }), mergeProps(_temp4, ssrGetDynamicModelProps(_temp4, unref(values).password))))}>`)
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
      _push(`<div><label class="flex items-start"><input${ssrRenderAttrs((_temp5 = mergeProps({
        checked: Array.isArray(unref(values).acceptTerms) ? ssrLooseContain(unref(values).acceptTerms, null) : unref(values).acceptTerms
      }, unref(acceptTermsField), {
        type: 'checkbox',
        class: ['w-4 h-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary', { 'border-red-500': unref(acceptTermsError) }]
      }), mergeProps(_temp5, ssrGetDynamicModelProps(_temp5, unref(values).acceptTerms))))}><span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${unref(acceptTermsHtml) ?? ''}</span></label>`)
      if (unref(acceptTermsError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(acceptTermsError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(isFormValid)) ? ' disabled' : ''} class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`)
      if (!unref(isSubmitting)) {
        _push(`<span>${ssrInterpolate(unref(t)('auth.register.submitButton'))}</span>`)
      } else {
        _push(`<span>${ssrInterpolate(unref(t)('auth.register.submittingButton'))}</span>`)
      }
      _push(`</button></form><div class="relative my-8"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-es-border dark:border-es-border-dark"></div></div><div class="relative flex justify-center text-sm"><span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('auth.register.hasAccount'))}</span></div></div>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/login'),
        class: 'w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('auth.register.signIn'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('auth.register.signIn')), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/register.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=register-GdcC4n0J.mjs.map
