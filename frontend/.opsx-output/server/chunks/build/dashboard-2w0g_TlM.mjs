import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer'
import { u as useColorMode } from './composables-D7lHs6xf.mjs'
import { g as useRoute } from './server.mjs'
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
  __name: 'dashboard',
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarOpen = ref(false)
    const isDark = useColorMode()
    const currentDashboard = ref('agency')
    const isActive = (href) => {
      const route2 = useRoute()
      return route2.path === href || href !== '/dashboard' && route2.path.startsWith(href)
    }
    const navigation = [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/articles', label: 'Articles', icon: '📝' },
      { href: '/dashboard/media', label: 'Media Library', icon: '🖼️' },
      { href: '/dashboard/works', label: 'Works', icon: '💼' },
      { href: '/dashboard/services', label: 'Services', icon: '🛠️' },
      { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
      { href: '/dashboard/contact', label: 'Contact', icon: '✉️' },
      { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' }
    ]
    const user = {
      name: 'Admin User',
      role: 'Administrator'
    }
    const route = useRoute()
    const currentPage = computed(() => {
      const path = route.path.replace('/dashboard/', '')
      return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Overview'
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}><aside class="${ssrRenderClass([unref(sidebarOpen) ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', 'fixed inset-y-0 left-0 z-50 w-64 bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-r border-es-border dark:border-es-border-dark transform transition-transform duration-300 ease-in-out'])}"><div class="flex items-center justify-between h-16 px-4 border-b border-es-border dark:border-es-border-dark">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard',
        class: 'text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Esperion `)
          } else {
            return [
              createTextVNode(' Esperion ')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<button class="lg:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><span class="text-xl">✕</span></button></div><nav class="p-4 space-y-1"><!--[-->`)
      ssrRenderList(navigation, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.href,
          to: item.href,
          class: ['flex items-center gap-3 px-4 py-3 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark transition-colors', { 'bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark': isActive(item.href) }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xl"${_scopeId}>${ssrInterpolate(item.icon)}</span><span class="font-medium"${_scopeId}>${ssrInterpolate(item.label)}</span>`)
            } else {
              return [
                createVNode('span', { class: 'text-xl' }, toDisplayString(item.icon), 1),
                createVNode('span', { class: 'font-medium' }, toDisplayString(item.label), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></nav><div class="absolute bottom-0 left-0 right-0 p-4 border-t border-es-border dark:border-es-border-dark"><select class="w-full px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"><option value="agency"${ssrIncludeBooleanAttr(Array.isArray(unref(currentDashboard)) ? ssrLooseContain(unref(currentDashboard), 'agency') : ssrLooseEqual(unref(currentDashboard), 'agency')) ? ' selected' : ''}> Agency Dashboard </option><option value="capital"${ssrIncludeBooleanAttr(Array.isArray(unref(currentDashboard)) ? ssrLooseContain(unref(currentDashboard), 'capital') : ssrLooseEqual(unref(currentDashboard), 'capital')) ? ' selected' : ''}> Capital Dashboard </option></select></div></aside><div class="lg:pl-64"><header class="sticky top-0 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark border-b border-es-border dark:border-es-border-dark"><div class="flex items-center justify-between h-16 px-4"><button class="lg:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><span class="text-2xl">☰</span></button><div class="hidden sm:flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: '/dashboard',
        class: 'hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`)
          } else {
            return [
              createTextVNode('Dashboard')
            ]
          }
        }),
        _: 1
      }, _parent))
      _push(`<span>/</span><span class="text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(currentPage))}</span></div><div class="flex items-center gap-4"><button class="p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"${ssrRenderAttr('aria-label', unref(isDark) ? 'Switch to light mode' : 'Switch to dark mode')}>`)
      if (unref(isDark)) {
        _push(`<span class="text-xl">☀️</span>`)
      } else {
        _push(`<span class="text-xl">🌙</span>`)
      }
      _push(`</button><button class="relative p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"><span class="text-xl">🔔</span><span class="absolute top-1 right-1 w-2 h-2 bg-es-accent-primary rounded-full"></span></button><div class="flex items-center gap-3"><div class="hidden sm:block text-right"><div class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(user.name)}</div><div class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(user.role)}</div></div><div class="w-10 h-10 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-xl"> 👤 </div></div></div></div></header><main class="p-4 md:p-6 lg:p-8">`)
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent)
      _push(`</main></div>`)
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('layouts/dashboard.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=dashboard-2w0g_TlM.mjs.map
