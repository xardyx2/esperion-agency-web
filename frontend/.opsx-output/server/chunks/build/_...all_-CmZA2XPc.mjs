import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, ref, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer'
import { _ as _export_sfc, b as useI18n, g as useRoute, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: '[...all]',
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n()
    useRoute()
    const localePath = useLocalePath()
    useSeoMeta({
      title: () => locale.value === 'id' ? 'Halaman Tidak Ditemukan - Esperion' : 'Page Not Found - Esperion',
      description: () => locale.value === 'id' ? 'Maaf, halaman yang Anda cari tidak ditemukan' : 'Sorry, the page you are looking for does not exist'
    })
    const content = computed(() => ({
      id: {
        title: '404',
        subtitle: 'Halaman Tidak Ditemukan',
        message: 'Maaf, kami tidak dapat menemukan halaman yang Anda cari.',
        possibleReasons: [
          'URL salah atau sudah kedaluwarsa',
          'Halaman telah dipindahkan atau dihapus',
          'Halaman bersifat privat dan memerlukan login'
        ],
        suggestions: [
          'Periksa kembali URL',
          'Kembali ke beranda',
          'Hubungi kami jika butuh bantuan'
        ],
        backHome: 'Kembali ke Beranda',
        contactUs: 'Hubungi Kami'
      },
      en: {
        title: '404',
        subtitle: 'Page Not Found',
        message: 'Sorry, we couldn\'t find the page you\'re looking for.',
        possibleReasons: [
          'The URL is incorrect or expired',
          'The page has been moved or deleted',
          'The page is private and requires login'
        ],
        suggestions: [
          'Check the URL again',
          'Go back to homepage',
          'Contact us if you need help'
        ],
        backHome: 'Back to Home',
        contactUs: 'Contact Us'
      }
    }))
    const currentContent = computed(() => content.value[locale.value])
    const showLanguagePrompt = ref(false)
    ref(null)
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen flex items-center justify-center py-12' }, _attrs))} data-v-1a29d06a><div class="container mx-auto px-4 max-w-2xl text-center" data-v-1a29d06a><h1 class="${ssrRenderClass([[
        'text-es-accent-primary dark:text-es-accent-primary-dark'
      ], 'text-9xl font-bold mb-4'])}" data-v-1a29d06a>${ssrInterpolate(unref(currentContent).title)}</h1><h2 class="${ssrRenderClass([[
        'text-es-text-primary dark:text-es-text-primary-dark'
      ], 'text-3xl font-semibold mb-6'])}" data-v-1a29d06a>${ssrInterpolate(unref(currentContent).subtitle)}</h2><p class="${ssrRenderClass([[
        'text-es-text-secondary dark:text-es-text-secondary-dark'
      ], 'text-lg mb-8'])}" data-v-1a29d06a>${ssrInterpolate(unref(currentContent).message)}</p>`)
      if (unref(currentContent).possibleReasons.length > 0) {
        _push(`<div class="${ssrRenderClass([[
          'bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
          'border border-es-border dark:border-es-border-dark'
        ], 'mb-8 p-6 rounded-lg'])}" data-v-1a29d06a><h3 class="${ssrRenderClass([[
          'text-es-text-primary dark:text-es-text-primary-dark'
        ], 'text-lg font-semibold mb-3'])}" data-v-1a29d06a>${ssrInterpolate(unref(locale) === 'id' ? 'Kemungkinan Penyebab:' : 'Possible Reasons:')}</h3><ul class="text-left space-y-2" data-v-1a29d06a><!--[-->`)
        ssrRenderList(unref(currentContent).possibleReasons, (reason) => {
          _push(`<li class="${ssrRenderClass([[
            'text-es-text-secondary dark:text-es-text-secondary-dark'
          ], 'flex items-start gap-2'])}" data-v-1a29d06a><span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1" data-v-1a29d06a>•</span><span data-v-1a29d06a>${ssrInterpolate(reason)}</span></li>`)
        })
        _push(`<!--]--></ul></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`<div class="mb-8" data-v-1a29d06a><h3 class="${ssrRenderClass([[
        'text-es-text-primary dark:text-es-text-primary-dark'
      ], 'text-lg font-semibold mb-3'])}" data-v-1a29d06a>${ssrInterpolate(unref(locale) === 'id' ? 'Saran Kami:' : 'Our Suggestions:')}</h3><ul class="text-left space-y-2 inline-block" data-v-1a29d06a><!--[-->`)
      ssrRenderList(unref(currentContent).suggestions, (suggestion) => {
        _push(`<li class="${ssrRenderClass([[
          'text-es-text-secondary dark:text-es-text-secondary-dark'
        ], 'flex items-start gap-2'])}" data-v-1a29d06a><span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1" data-v-1a29d06a>✓</span><span data-v-1a29d06a>${ssrInterpolate(suggestion)}</span></li>`)
      })
      _push(`<!--]--></ul></div><div class="flex flex-wrap justify-center gap-4 mb-8" data-v-1a29d06a>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/'),
        class: ['inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors', [
          'bg-es-accent-primary hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:hover:bg-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark'
        ]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1a29d06a${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-v-1a29d06a${_scopeId}></path></svg> ${ssrInterpolate(unref(currentContent).backHome)}`)
          } else {
            return [
              (openBlock(), createBlock('svg', {
                class: 'w-5 h-5 mr-2',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              }, [
                createVNode('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  'd': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                })
              ])),
              createTextVNode(' ' + toDisplayString(unref(currentContent).backHome), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/contact-us'),
        class: ['inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors', [
          'bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
          'border border-es-border dark:border-es-border-dark',
          'text-es-text-primary dark:text-es-text-primary-dark',
          'hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark'
        ]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1a29d06a${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-1a29d06a${_scopeId}></path></svg> ${ssrInterpolate(unref(currentContent).contactUs)}`)
          } else {
            return [
              (openBlock(), createBlock('svg', {
                class: 'w-5 h-5 mr-2',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              }, [
                createVNode('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  'd': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                })
              ])),
              createTextVNode(' ' + toDisplayString(unref(currentContent).contactUs), 1)
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`</div>`)
      if (unref(showLanguagePrompt)) {
        _push(`<div class="${ssrRenderClass([[
          'bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10',
          'border border-es-accent-primary/20 dark:border-es-accent-primary-dark/20'
        ], 'mt-8 p-4 rounded-lg'])}" data-v-1a29d06a><p class="${ssrRenderClass([[
          'text-es-text-primary dark:text-es-text-primary-dark'
        ], 'mb-3'])}" data-v-1a29d06a>${ssrInterpolate(unref(locale) === 'id' ? '🌐 Halaman ini tersedia dalam bahasa Inggris' : '🌐 This page is available in Indonesian')}</p><button class="${ssrRenderClass([[
          'bg-es-accent-primary hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:hover:bg-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark'
        ], 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors'])}" data-v-1a29d06a>${ssrInterpolate(unref(locale) === 'id' ? 'Lihat dalam Bahasa Inggris' : 'View in Indonesian')}</button></div>`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/[...all].vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}
const ____all_ = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-1a29d06a']])

export { ____all_ as default }
// # sourceMappingURL=_...all_-CmZA2XPc.mjs.map
