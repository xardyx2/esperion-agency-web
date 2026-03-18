import { defineComponent, ref, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer'
import { b as useI18n, c as useSeoMeta } from './server.mjs'
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
  __name: 'media',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({ title: t('dashboard.media.seo.title'), description: t('dashboard.media.seo.description') })
    const searchQuery = ref('')
    const selectedType = ref('')
    const mediaItems = ref([
      { id: 1, name: 'banner-1.jpg', type: 'image', size: '2.4 MB', icon: '🖼️' },
      { id: 2, name: 'logo.png', type: 'image', size: '156 KB', icon: '🖼️' },
      { id: 3, name: 'team-photo.jpg', type: 'image', size: '3.1 MB', icon: '🖼️' },
      { id: 4, name: 'promo-video.mp4', type: 'video', size: '45.2 MB', icon: '🎬' },
      { id: 5, name: 'brochure.pdf', type: 'document', size: '1.8 MB', icon: '📄' },
      { id: 6, name: 'work-1.jpg', type: 'image', size: '2.1 MB', icon: '🖼️' },
      { id: 7, name: 'work-2.jpg', type: 'image', size: '1.9 MB', icon: '🖼️' },
      { id: 8, name: 'icon-set.zip', type: 'document', size: '890 KB', icon: '📦' }
    ])
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">${ssrInterpolate(unref(t)('dashboard.media.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.media.description'))}</p></div><button class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"><span class="text-xl mr-2">↑</span> ${ssrInterpolate(unref(t)('dashboard.media.uploadButton'))}</button></div><div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-4 mb-6"><div class="flex flex-col sm:flex-row gap-4"><input${ssrRenderAttr('value', unref(searchQuery))} type="text"${ssrRenderAttr('placeholder', unref(t)('dashboard.media.search.placeholder'))} class="flex-1 px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"><select class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), '') : ssrLooseEqual(unref(selectedType), '')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.media.filters.allTypes'))}</option><option value="image"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), 'image') : ssrLooseEqual(unref(selectedType), 'image')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.media.filters.image'))}</option><option value="video"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), 'video') : ssrLooseEqual(unref(selectedType), 'video')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.media.filters.video'))}</option><option value="document"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), 'document') : ssrLooseEqual(unref(selectedType), 'document')) ? ' selected' : ''}>${ssrInterpolate(unref(t)('dashboard.media.filters.document'))}</option></select></div></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"><!--[-->`)
      ssrRenderList(unref(mediaItems), (media) => {
        _push(`<div class="group relative bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden"><div class="aspect-square bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center"><span class="text-4xl">${ssrInterpolate(media.icon)}</span></div><div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary"${ssrRenderAttr('title', unref(t)('dashboard.media.buttons.view'))}> 👁️ </button><button class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary"${ssrRenderAttr('title', unref(t)('dashboard.media.buttons.edit'))}> ✏️ </button><button class="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white"${ssrRenderAttr('title', unref(t)('dashboard.media.buttons.delete'))}> 🗑️ </button></div><div class="p-3"><p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark truncate">${ssrInterpolate(media.name)}</p><p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(media.size)}</p></div></div>`)
      })
      _push(`<!--]--></div></div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/media.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=media-DbBRmLFA.mjs.map
