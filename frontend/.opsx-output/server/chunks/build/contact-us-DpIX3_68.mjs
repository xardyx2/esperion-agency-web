import { _ as __nuxt_component_0 } from './SocialIcons-B3XvT23j.mjs'
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrGetDynamicModelProps, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer'
import { p as publicAssetsURL } from '../_/nitro.mjs'
import { t as toVeeTypedSchema, a as createContactSchema, u as useForm } from './useValidation-ClFrraDa.mjs'
import { useContactApi, useAnalyticsApi } from './useApi-L_axzZs3.mjs'
import { u as usePublicIdentity } from './usePublicIdentity-SKKe4NtZ.mjs'
import { b as useI18n, c as useSeoMeta, d as useSchemaOrg, e as useRuntimeConfig } from './server.mjs'
import { defineWebPage, defineBreadcrumb } from '@unhead/schema-org/vue'
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
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const _imports_0 = publicAssetsURL('/images/contact-banner.jpg')
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'contact-us',
  __ssrInlineRender: true,
  setup(__props) {
    const i18n = useI18n()
    const t = i18n.t.bind(i18n)
    const locale = i18n.locale
    const publicIdentity = usePublicIdentity()
    const mapCtaLabel = computed(() => locale.value === 'en' ? 'Open in Google Maps' : 'Buka di Google Maps')
    const contactPageUrl = `${publicIdentity.siteUrl}/id/contact-us`
    useSeoMeta({
      title: t('seo.contact.title'),
      description: t('seo.contact.description'),
      ogTitle: t('seo.contact.ogTitle'),
      ogDescription: t('seo.contact.ogDescription'),
      ogImage: '/images/contact-banner.jpg',
      ogUrl: contactPageUrl,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: t('seo.contact.twitterTitle'),
      twitterDescription: t('seo.contact.ogDescription'),
      twitterImage: '/images/contact-banner.jpg',
      ogLocale: 'id_ID'
    })
    useSchemaOrg([
      defineWebPage({
        '@type': 'ContactPage',
        'name': t('seo.contact.schemaName'),
        'description': t('seo.contact.schemaDescription'),
        'url': contactPageUrl,
        'dateModified': (/* @__PURE__ */ new Date()).toISOString()
      }),
      defineBreadcrumb({
        itemListElement: [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': t('breadcrumb.home'),
            'item': `${publicIdentity.siteUrl}/id`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': t('breadcrumb.contact'),
            'item': contactPageUrl
          }
        ]
      })
    ])
    const schema = computed(() => toVeeTypedSchema(createContactSchema(t, locale.value)))
    const {
      values,
      errors,
      defineField,
      handleSubmit,
      resetForm
    } = useForm({
      validationSchema: schema,
      initialValues: {
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        service: '',
        description: ''
      }
    })
    const [fullName, fullNameField] = defineField('fullName')
    const [companyName, companyNameField] = defineField('companyName')
    const [email, emailField] = defineField('email')
    const [phone, phoneField] = defineField('phone')
    const [service, serviceField] = defineField('service')
    const [description, descriptionField] = defineField('description')
    const isSubmitting = ref(false)
    const analyticsApi = useAnalyticsApi()
    const getError = (field) => {
      return errors.value[field]
    }
    const fullNameError = computed(() => getError('fullName'))
    const emailError = computed(() => getError('email'))
    const serviceError = computed(() => getError('service'))
    const descriptionError = computed(() => getError('description'))
    handleSubmit(async () => {
      isSubmitting.value = true
      try {
        const config = useRuntimeConfig()
        const recaptchaSiteKey = config.public.recaptchaSiteKey
        let recaptchaToken = null
        const windowWithRecaptcha = void 0
        if (recaptchaSiteKey && false) ;
        else if (recaptchaSiteKey) {
        }
        const payload = {
          full_name: values.fullName,
          company_name: values.companyName || void 0,
          email: values.email || void 0,
          phone: values.phone || void 0,
          service: values.service,
          description: values.description,
          recaptcha_token: recaptchaToken || void 0
        }
        const { submit } = useContactApi()
        await submit(payload)
        await analyticsApi.trackEvent({
          event_name: 'contact_submit',
          page_url: '/contact-us',
          metadata: {
            service: values.service
          }
        }).catch(() => void 0)
        alert(t('contact.form.successMessage'))
        resetForm()
      } catch (error) {
        alert(t('contact.form.errorMessage'))
      } finally {
        isSubmitting.value = false
      }
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SocialIcons = __nuxt_component_0
      let _temp0, _temp1, _temp2, _temp3
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><section class="relative h-[300px] md:h-[400px] overflow-hidden bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><img${ssrRenderAttr('src', _imports_0)}${ssrRenderAttr('alt', unref(t)('contact.banner.title'))} class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-r from-es-bg-primary/80 via-es-bg-primary/60 to-es-bg-primary/40 dark:from-es-bg-primary-dark/80 dark:via-es-bg-primary-dark/60 dark:to-es-bg-primary-dark/40"></div><div class="absolute inset-0 bg-gradient-to-t from-es-bg-primary/60 via-transparent to-transparent dark:from-es-bg-primary-dark/60"></div><div class="absolute inset-0 flex items-center justify-center"><div class="container mx-auto px-4 text-center"><h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4 drop-shadow-lg">${ssrInterpolate(unref(t)('contact.banner.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto drop-shadow-md">${ssrInterpolate(unref(t)('contact.banner.description'))}</p></div></div></section><section class="py-12 md:py-16"><div class="w-full px-4"><div class="grid lg:grid-cols-3 gap-12"><div class="lg:col-span-2"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8"><h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('contact.form.title'))}</h2><form class="space-y-6"><div class="grid md:grid-cols-2 gap-6"><div><label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.fullNameLabel'))} <span class="text-es-accent-primary">*</span></label><input${ssrRenderAttrs((_temp0 = mergeProps({
        id: 'fullName',
        value: unref(values).fullName
      }, unref(fullNameField), {
        type: 'text',
        placeholder: unref(t)('contact.form.fullNamePlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(fullNameError) }]
      }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(values).fullName))))}>`)
      if (unref(fullNameError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(fullNameError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="companyName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.companyNameLabel'))}</label><input${ssrRenderAttrs((_temp1 = mergeProps({
        id: 'companyName',
        value: unref(values).companyName
      }, unref(companyNameField), {
        type: 'text',
        placeholder: unref(t)('contact.form.companyNamePlaceholder'),
        class: 'w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark'
      }), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, unref(values).companyName))))}></div></div><div class="grid md:grid-cols-2 gap-6"><div><label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.emailLabel'))} <span class="text-es-accent-primary">*</span></label><input${ssrRenderAttrs((_temp2 = mergeProps({
        id: 'email',
        value: unref(values).email
      }, unref(emailField), {
        type: 'email',
        placeholder: unref(t)('contact.form.emailPlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(emailError) }]
      }), mergeProps(_temp2, ssrGetDynamicModelProps(_temp2, unref(values).email))))}>`)
      if (unref(emailError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(emailError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="phone" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.phoneLabel'))}</label><input${ssrRenderAttrs((_temp3 = mergeProps({
        id: 'phone',
        value: unref(values).phone
      }, unref(phoneField), {
        type: 'tel',
        placeholder: unref(t)('contact.form.phonePlaceholder'),
        class: 'w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark'
      }), mergeProps(_temp3, ssrGetDynamicModelProps(_temp3, unref(values).phone))))}></div></div><div><label for="service" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.serviceLabel'))} <span class="text-es-accent-primary">*</span></label><select${ssrRenderAttrs(mergeProps({ id: 'service' }, unref(serviceField), {
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark', { 'border-red-500': unref(serviceError) }]
      }))}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, '') : ssrLooseEqual(unref(values).service, '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.servicePlaceholder'))}</option><option value="Web Development"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'Web Development') : ssrLooseEqual(unref(values).service, 'Web Development')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.webDevelopment'))}</option><option value="Mobile App Development"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'Mobile App Development') : ssrLooseEqual(unref(values).service, 'Mobile App Development')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.mobileApp'))}</option><option value="UI/UX Design"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'UI/UX Design') : ssrLooseEqual(unref(values).service, 'UI/UX Design')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.uiUxDesign'))}</option><option value="Digital Marketing"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'Digital Marketing') : ssrLooseEqual(unref(values).service, 'Digital Marketing')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.digitalMarketing'))}</option><option value="E-Commerce Solutions"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'E-Commerce Solutions') : ssrLooseEqual(unref(values).service, 'E-Commerce Solutions')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.ecommerce'))}</option><option value="Consulting"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'Consulting') : ssrLooseEqual(unref(values).service, 'Consulting')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.consulting'))}</option><option value="Other"${ssrIncludeBooleanAttr(Array.isArray(unref(values).service) ? ssrLooseContain(unref(values).service, 'Other') : ssrLooseEqual(unref(values).service, 'Other')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('contact.form.serviceOptions.other'))}</option></select>`)
      if (unref(serviceError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(serviceError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><div><label for="description" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.form.descriptionLabel'))} <span class="text-es-accent-primary">*</span></label><textarea${ssrRenderAttrs(mergeProps({ id: 'description' }, unref(descriptionField), {
        rows: '6',
        placeholder: unref(t)('contact.form.descriptionPlaceholder'),
        class: ['w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark resize-none', { 'border-red-500': unref(descriptionError) }]
      }), 'textarea')}>${ssrInterpolate(unref(values).description)}</textarea>`)
      if (unref(descriptionError)) {
        _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(descriptionError))}</p>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? ' disabled' : ''} class="w-full px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`)
      if (!unref(isSubmitting)) {
        _push(`<span>${ssrInterpolate(unref(t)('contact.form.submitButton'))}</span>`)
      } else {
        _push(`<span>${ssrInterpolate(unref(t)('contact.form.submittingButton'))}</span>`)
      }
      _push(`</button></form></div></div><div class="space-y-8"><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8"><h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('contact.info.title'))}</h3><div class="space-y-4"><div class="flex items-start gap-4"><span class="text-2xl">📍</span><div><h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(unref(t)('contact.info.location'))}</h4><a${ssrRenderAttr('href', unref(publicIdentity).mapUrl)} target="_blank" rel="noopener noreferrer" class="text-sm text-es-text-secondary transition-colors hover:text-es-accent-primary dark:text-es-text-secondary-dark dark:hover:text-es-accent-primary-dark">${ssrInterpolate(unref(publicIdentity).officeAddressFull)}</a></div></div><div class="flex items-start gap-4"><span class="text-2xl">📱</span><div><h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(unref(t)('contact.info.phone'))}</h4><a${ssrRenderAttr('href', unref(publicIdentity).whatsappHref)} target="_blank" rel="noopener noreferrer" class="text-sm text-es-text-secondary transition-colors hover:text-es-accent-primary dark:text-es-text-secondary-dark dark:hover:text-es-accent-primary-dark">${ssrInterpolate(unref(publicIdentity).phoneDisplay)}</a></div></div><div class="flex items-start gap-4"><span class="text-2xl">✉️</span><div><h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(unref(t)('contact.info.email'))}</h4><a${ssrRenderAttr('href', `mailto:${unref(publicIdentity).email}`)} class="text-sm text-es-text-secondary transition-colors hover:text-es-accent-primary dark:text-es-text-secondary-dark dark:hover:text-es-accent-primary-dark">${ssrInterpolate(unref(publicIdentity).email)}</a></div></div><div class="flex items-start gap-4"><span class="text-2xl">🕐</span><div><h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(unref(t)('contact.info.businessHours'))}</h4><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(unref(t)('contact.info.businessHoursText'))}</p></div></div></div></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8"><h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">${ssrInterpolate(unref(t)('contact.social.title'))}</h3>`)
      _push(ssrRenderComponent(_component_SocialIcons, null, null, _parent))
      _push(`</div></div></div></div></section><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="container mx-auto px-4"><div class="text-center mb-8"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('contact.map.title'))}</h2><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('contact.map.description'))}</p></div><div class="grid overflow-hidden rounded-xl bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark md:grid-cols-2"><div class="relative h-[320px] md:h-[400px]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6587654321!2d106.778123456789!3d-6.123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1234567890%3A0xabc123def456789!2sSawangan%20Elok%20A1%20No%205%20RT%201%20RW%2010!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid" width="100%" height="100%" style="${ssrRenderStyle({ border: '0' })}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"${ssrRenderAttr('title', unref(publicIdentity).officeAddressFull)} class="absolute inset-0 w-full h-full"></iframe></div><div class="flex flex-col justify-center gap-4 p-8"><p class="text-sm font-semibold uppercase tracking-wider text-es-accent-primary dark:text-es-accent-primary-dark"> Esperion Office </p><h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(publicIdentity).officeAreaText)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(publicIdentity).officeAddressText)}</p><a${ssrRenderAttr('href', unref(publicIdentity).mapUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex w-fit items-center gap-2 rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"><span>🗺️</span><span>${ssrInterpolate(unref(mapCtaLabel))}</span></a></div></div></div></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/contact-us.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=contact-us-DpIX3_68.mjs.map
