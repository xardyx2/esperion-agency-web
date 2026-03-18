import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer'
import { b as useI18n, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    const localePath = useLocalePath()
    useSeoMeta({
      title: t('dashboard.index.title'),
      description: t('dashboard.index.description')
    })
    const retainedScopeCards = [
      {
        title: 'Articles',
        description: t('dashboard.index.cards.articles.description'),
        status: 'needsWiring',
        href: localePath('/dashboard/articles'),
        cta: 'articles',
        icon: '📝'
      },
      {
        title: 'Works',
        description: t('dashboard.index.cards.works.description'),
        status: 'stubCleanup',
        href: localePath('/dashboard/works'),
        cta: 'works',
        icon: '💼'
      },
      {
        title: 'Clients',
        description: t('dashboard.index.cards.clients.description'),
        status: 'stubCleanup',
        href: localePath('/dashboard/clients'),
        cta: 'clients',
        icon: '👥'
      },
      {
        title: 'Contact',
        description: t('dashboard.index.cards.contact.description'),
        status: 'needsVerification',
        href: localePath('/dashboard/contact'),
        cta: 'submissions',
        icon: '✉️'
      }
    ]
    const focusChecklist = [
      {
        title: 'focus.authTitle',
        detail: 'focus.authDetail'
      },
      {
        title: 'focus.translationTitle',
        detail: 'focus.translationDetail'
      },
      {
        title: 'focus.archiveTitle',
        detail: 'focus.archiveDetail'
      }
    ]
    const shortcuts = [
      { href: localePath('/dashboard/articles'), label: 'Articles', icon: '📝' },
      { href: localePath('/dashboard/works'), label: 'Works', icon: '💼' },
      { href: localePath('/dashboard/services'), label: 'Services', icon: '🛠️' },
      { href: localePath('/dashboard/clients'), label: 'Clients', icon: '👥' },
      { href: localePath('/dashboard/contact'), label: 'Contact', icon: '✉️' },
      { href: localePath('/dashboard/api-docs'), label: 'API Docs', icon: '📚' },
      { href: localePath('/dashboard/sessions'), label: 'Sessions', icon: '🔐' }
    ]
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-8' }, _attrs))}><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.index.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.index.description'))}</p></div><section class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"><!--[-->`)
      ssrRenderList(retainedScopeCards, (card) => {
        _push(`<article class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-3 flex items-center justify-between"><span class="text-3xl">${ssrInterpolate(card.icon)}</span><span class="rounded-full bg-es-bg-tertiary px-3 py-1 text-xs font-semibold text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)(`dashboard.index.status.${card.status}`))}</span></div><h2 class="mb-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(card.title)}</h2><p class="mb-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(card.description)}</p>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: card.href,
          class: 'text-sm font-semibold text-es-accent-primary hover:underline dark:text-es-accent-primary-dark'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('dashboard.index.cards', { key: card.title.toLowerCase(), fallback: `dashboard.index.cards.${card.title.toLowerCase()}` }))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('dashboard.index.cards', { key: card.title.toLowerCase(), fallback: `dashboard.index.cards.${card.title.toLowerCase()}` })), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
        _push(`</article>`)
      })
      _push(`<!--]--></section><section class="grid gap-6 lg:grid-cols-2"><article class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.index.focus.authTitle'))}</h2><ul class="space-y-3 text-sm text-es-text-secondary dark:text-es-text-secondary-dark"><!--[-->`)
      ssrRenderList(focusChecklist, (item) => {
        _push(`<li class="flex gap-3"><span class="mt-0.5 text-es-accent-primary dark:text-es-accent-primary-dark">•</span><div><p class="font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)(item.title))}</p><p>${ssrInterpolate(unref(t)(item.detail))}</p></div></li>`)
      })
      _push(`<!--]--></ul></article><article class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.index.shortcuts'))}</h2><div class="grid grid-cols-2 gap-4"><!--[-->`)
      ssrRenderList(shortcuts, (shortcut) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: shortcut.href,
          to: shortcut.href,
          class: 'rounded-lg border border-es-border bg-es-bg-primary p-4 text-sm font-medium text-es-text-primary transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mb-2 text-2xl"${_scopeId}>${ssrInterpolate(shortcut.icon)}</div><div${_scopeId}>${ssrInterpolate(unref(t)(`dashboard.index.shortcuts.${shortcut.label.toLowerCase()}`))}</div>`)
            } else {
              return [
                createVNode('div', { class: 'mb-2 text-2xl' }, toDisplayString(shortcut.icon), 1),
                createVNode('div', null, toDisplayString(unref(t)(`dashboard.index.shortcuts.${shortcut.label.toLowerCase()}`)), 1)
              ]
            }
          }),
          _: 2
        }, _parent))
      })
      _push(`<!--]--></div></article></section></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=index-Cp31YS9j.mjs.map
