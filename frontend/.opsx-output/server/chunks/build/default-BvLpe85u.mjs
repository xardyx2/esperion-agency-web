import { _ as __nuxt_component_0$1 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, mergeProps, ref, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer'
import { _ as _export_sfc, g as useRoute, a as useLocalePath, b as useI18n, t as __nuxt_component_3 } from './server.mjs'
import { u as useColorMode } from './composables-D7lHs6xf.mjs'
import { _ as __nuxt_component_0$2 } from './SocialIcons-B3XvT23j.mjs'
import { u as usePublicIdentity } from './usePublicIdentity-SKKe4NtZ.mjs'
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: 'MainNav',
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute()
    const localePath = useLocalePath()
    const { t } = useI18n()
    const colorMode = useColorMode()
    const { locale, setLocale } = useI18n()
    ref(false)
    const mobileMenuOpen = ref(false)
    const isDark = computed(() => colorMode.value === 'dark')
    const toggleTheme = () => {
      colorMode.preference = isDark.value ? 'light' : 'dark'
    }
    const isActive = (href) => {
      const localizedHref = localePath(href)
      return route.path === localizedHref || href !== '/' && route.path.startsWith(localizedHref)
    }
    const navItems = computed(() => [
      { href: '/', label: t('nav.home') },
      { href: '/our-works', label: t('nav.works') },
      { href: '/our-services', label: t('nav.services') },
      { href: '/articles', label: t('nav.articles') },
      { href: '/about', label: t('nav.about') }
    ])
    computed(() => [
      {
        label: t('nav.appearance'),
        icon: 'i-heroicons-globe-americas',
        items: [
          { label: t('language.indonesian'), value: 'id', click: () => setLocale('id') },
          { label: t('language.english'), value: 'en', click: () => setLocale('en') }
        ]
      },
      {
        label: t('nav.darkMode'),
        icon: isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon',
        click: toggleTheme
      }
    ])
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1
      _push(`<header${ssrRenderAttrs(mergeProps({ class: 'sticky top-0 z-50 bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-b border-es-border dark:border-es-border-dark' }, _attrs))} data-v-864adf48><nav class="container mx-auto px-4" data-v-864adf48><div class="flex items-center justify-between h-16" data-v-864adf48>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        'to': unref(localePath)('/'),
        'class': 'flex items-center space-x-2 group',
        'aria-label': unref(t)('nav.aria.home')
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-es-accent-primary to-es-accent-secondary dark:from-es-accent-primary-dark dark:to-es-accent-secondary-dark flex items-center justify-center transform group-hover:scale-105 transition-transform" data-v-864adf48${_scopeId}><span class="text-white font-bold text-lg" data-v-864adf48${_scopeId}>E</span></div><span class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark" data-v-864adf48${_scopeId}> Esperion </span>`)
          } else {
            return [
              createVNode('div', { class: 'w-10 h-10 rounded-lg bg-gradient-to-br from-es-accent-primary to-es-accent-secondary dark:from-es-accent-primary-dark dark:to-es-accent-secondary-dark flex items-center justify-center transform group-hover:scale-105 transition-transform' }, [
                createVNode('span', { class: 'text-white font-bold text-lg' }, 'E')
              ]),
              createVNode('span', { class: 'text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark' }, ' Esperion ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<div class="hidden md:flex items-center space-x-1" data-v-864adf48><!--[-->`)
      ssrRenderList(unref(navItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.href,
          to: unref(localePath)(item.href),
          class: ['px-4 py-2 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-all font-medium', {
            'text-es-accent-primary dark:text-es-accent-primary-dark bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10': isActive(item.href)
          }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`)
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div><div class="flex items-center space-x-3" data-v-864adf48>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/contact-us'),
        class: 'hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-es-accent-primary to-es-accent-primary-hover dark:from-es-accent-primary-dark dark:to-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-es-accent-primary/25 dark:hover:shadow-es-accent-primary-dark/25 transform hover:-translate-y-0.5 transition-all'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('nav.contact'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('nav.contact')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button class="md:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"${ssrRenderAttr('aria-label', unref(mobileMenuOpen) ? unref(t)('nav.aria.closeMenu') : unref(t)('nav.aria.openMenu'))}${ssrRenderAttr('aria-expanded', unref(mobileMenuOpen))} data-v-864adf48>`)
      if (unref(mobileMenuOpen)) {
        _push(`<span class="text-2xl block" role="img"${ssrRenderAttr('aria-label', unref(t)('common.aria.close'))} data-v-864adf48>✕</span>`)
      } else {
        _push(`<span class="text-2xl block" role="img"${ssrRenderAttr('aria-label', unref(t)('common.aria.menu'))} data-v-864adf48>☰</span>`)
      }
      _push(`</button></div></div>`)
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden py-4 border-t border-es-border dark:border-es-border-dark" data-v-864adf48><div class="flex flex-col space-y-2" data-v-864adf48><!--[-->`)
        ssrRenderList(unref(navItems), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.href,
            to: unref(localePath)(item.href),
            class: ['px-4 py-3 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-all font-medium', {
              'text-es-accent-primary dark:text-es-accent-primary-dark bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10': isActive(item.href)
            }],
            onClick: $event => mobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)}`)
              } else {
                return [
                  createTextVNode(toDisplayString(item.label), 1)
                ]
              }
            }),
            _: 2
          }, _parent))
        })
        _push(`<!--]-->`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/contact-us'),
          class: 'mx-4 mt-2 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-es-accent-primary to-es-accent-primary-hover dark:from-es-accent-primary-dark dark:to-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:shadow-lg transition-all',
          onClick: $event => mobileMenuOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('nav.contact'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('nav.contact')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</nav></header>`)
    }
  }
})
const _sfc_setup$3 = _sfc_main$3.setup
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/components/Navigation/MainNav.vue')
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0
}
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [['__scopeId', 'data-v-864adf48']]), { __name: 'MainNav' })
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: 'LanguageDropdown',
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, setLocale } = useI18n()
    const isOpen = ref(false)
    const languages = [
      { code: 'id', name: 'Bahasa Indonesia' },
      { code: 'en', name: 'English' }
    ]
    const currentLanguage = computed(
      () => languages.find(l => l.code === locale.value) || languages[0]
    )
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'language-dropdown' }, _attrs))} data-v-68ec3c10><button type="button" class="language-button" data-v-68ec3c10><span class="font-medium" data-v-68ec3c10>${ssrInterpolate(unref(currentLanguage).name)}</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ 'rotate-180': unref(isOpen) }, 'w-4 h-4 ml-1 transition-transform'])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-68ec3c10><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-68ec3c10></path></svg></button>`)
      if (unref(isOpen)) {
        _push(`<div class="language-menu" data-v-68ec3c10><!--[-->`)
        ssrRenderList(languages, (lang) => {
          _push(`<button type="button" class="${ssrRenderClass([{ active: unref(locale) === lang.code }, 'language-item'])}" data-v-68ec3c10><span data-v-68ec3c10>${ssrInterpolate(lang.name)}</span>`)
          if (unref(locale) === lang.code) {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-es-accent-primary dark:text-es-accent-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-68ec3c10><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-68ec3c10></path></svg>`)
          } else {
            _push(`<!---->`)
          }
          _push(`</button>`)
        })
        _push(`<!--]--></div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(isOpen)) {
        _push(`<div class="fixed inset-0 z-40" data-v-68ec3c10></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup$2 = _sfc_main$2.setup
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/components/ui/LanguageDropdown.vue')
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0
}
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [['__scopeId', 'data-v-68ec3c10']]), { __name: 'LanguageDropdown' })
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: 'SiteFooter',
  __ssrInlineRender: true,
  setup(__props) {
    const localePath = useLocalePath()
    const { t } = useI18n()
    const publicIdentity = usePublicIdentity()
    const quickLinks = computed(() => [
      { href: '/', label: t('nav.home') },
      { href: '/our-works', label: t('nav.works') },
      { href: '/our-services', label: t('nav.services') },
      { href: '/articles', label: t('nav.articles') },
      { href: '/about', label: t('nav.about') },
      { href: '/contact-us', label: t('nav.contact') }
    ])
    const services = computed(() => [
      { href: '/our-services/web-development', label: t('footer.services.webDevelopment') },
      { href: '/our-services/mobile-app-development', label: t('footer.services.mobileAppDevelopment') },
      { href: '/our-services/ui-ux-design', label: t('footer.services.uiUxDesign') },
      { href: '/our-services/digital-marketing', label: t('footer.services.digitalMarketing') },
      { href: '/our-services/ecommerce-solutions', label: t('footer.services.ecommerceSolutions') },
      { href: '/our-services/consulting', label: t('footer.services.digitalConsulting') }
    ])
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SocialIcons = __nuxt_component_0$2
      const _component_NuxtLink = __nuxt_component_0$1
      const _component_LanguageDropdown = __nuxt_component_2
      const _component_ClientOnly = __nuxt_component_3
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: 'bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-t border-es-border dark:border-es-border-dark' }, _attrs))}><div class="container mx-auto px-4 py-12"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><div><div class="flex items-center space-x-2 mb-4"><div class="w-8 h-8 rounded-lg bg-gradient-to-br from-es-accent-primary to-es-accent-secondary dark:from-es-accent-primary-dark dark:to-es-accent-secondary-dark flex items-center justify-center"><span class="text-white font-bold text-sm">E</span></div><h3 class="text-lg font-bold text-es-text-primary dark:text-es-text-primary-dark"> Esperion </h3></div><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 leading-relaxed"> Esperion membantu bisnis bertumbuh lewat strategi, desain, dan pengembangan digital yang terarah. </p>`)
      _push(ssrRenderComponent(_component_SocialIcons, null, null, _parent))
      _push(`</div><div><h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">${ssrInterpolate(unref(t)('footer.quickLinks'))}</h4><ul class="space-y-2"><!--[-->`)
      ssrRenderList(unref(quickLinks), (link) => {
        _push(`<li>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(link.href),
          class: 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm inline-flex items-center group'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all"${_scopeId}></span> ${ssrInterpolate(link.label)}`)
            } else {
              return [
                createVNode('span', { class: 'w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all' }),
                createTextVNode(' ' + toDisplayString(link.label), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
        _push(`</li>`)
      })
      _push(`<!--]--></ul></div><div><h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">${ssrInterpolate(unref(t)('footer.ourServices'))}</h4><ul class="space-y-2"><!--[-->`)
      ssrRenderList(unref(services), (service) => {
        _push(`<li>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(service.href),
          class: 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm inline-flex items-center group'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all"${_scopeId}></span> ${ssrInterpolate(service.label)}`)
            } else {
              return [
                createVNode('span', { class: 'w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all' }),
                createTextVNode(' ' + toDisplayString(service.label), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
        _push(`</li>`)
      })
      _push(`<!--]--></ul></div><div><h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">${ssrInterpolate(unref(t)('footer.contactUs'))}</h4><ul class="space-y-3 text-es-text-secondary dark:text-es-text-secondary-dark text-sm"><li class="flex items-start space-x-3"><span class="text-lg flex-shrink-0" role="img"${ssrRenderAttr('aria-label', unref(t)('aria.location'))}>📍</span><span>${ssrInterpolate(unref(publicIdentity).officeAreaText)}<br><span class="text-es-text-tertiary dark:text-es-text-tertiary-dark text-xs">${ssrInterpolate(unref(publicIdentity).officeAddressText)}</span></span></li><li class="flex items-center space-x-3"><span class="text-lg flex-shrink-0" role="img"${ssrRenderAttr('aria-label', unref(t)('aria.phone'))}>📱</span><a${ssrRenderAttr('href', unref(publicIdentity).phoneHref)} class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">${ssrInterpolate(unref(publicIdentity).phoneDisplay)}</a></li><li class="flex items-center space-x-3"><span class="text-lg flex-shrink-0" role="img"${ssrRenderAttr('aria-label', unref(t)('aria.email'))}>✉️</span><a${ssrRenderAttr('href', `mailto:${unref(publicIdentity).email}`)} class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">${ssrInterpolate(unref(publicIdentity).email)}</a></li><li class="flex items-center space-x-3"><span class="text-lg flex-shrink-0" role="img"${ssrRenderAttr('aria-label', unref(t)('aria.businessHours'))}>🕐</span><span>${ssrInterpolate(unref(t)('footer.contact.businessHours'))}</span></li></ul><div class="mt-6 pt-6 border-t border-es-border dark:border-es-border-dark"><p class="text-xs font-semibold text-es-text-tertiary dark:text-es-text-tertiary-dark mb-3 uppercase tracking-wider">${ssrInterpolate(unref(t)('footer.appearance'))}</p><div class="mb-4">`)
      _push(ssrRenderComponent(_component_LanguageDropdown, null, null, _parent))
      _push(`</div>`)
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent))
      _push(`</div></div></div><div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark"><div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(unref(t)('footer.copyright', { year: (/* @__PURE__ */ new Date()).getFullYear() }))}</p><div class="flex space-x-6">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/privacy-policy'),
        class: 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('footer.privacyPolicy'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('footer.privacyPolicy')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/terms-of-service'),
        class: 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)('footer.termsOfService'))}`)
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)('footer.termsOfService')), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button type="button" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm">${ssrInterpolate(unref(t)('footer.cookieSettings'))}</button></div></div></div></div></footer>`)
    }
  }
})
const _sfc_setup$1 = _sfc_main$1.setup
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/components/Footer/SiteFooter.vue')
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0
}
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: 'SiteFooter' })
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'default',
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainNav = __nuxt_component_0
      const _component_SiteFooter = __nuxt_component_1
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex flex-col' }, _attrs))}>`)
      _push(ssrRenderComponent(_component_MainNav, null, null, _parent))
      _push(`<main class="flex-grow">`)
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent)
      _push(`</main>`)
      _push(ssrRenderComponent(_component_SiteFooter, null, null, _parent))
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('layouts/default.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=default-BvLpe85u.mjs.map
