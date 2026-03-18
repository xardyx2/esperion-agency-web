import { mergeProps, unref, ref, withAsyncContext, watch, useSSRContext } from 'vue'
import { ssrRenderComponent } from 'vue/server-renderer'
import { ApiReference } from '@scalar/api-reference'
import { useColorMode } from '@scalar/use-hooks/useColorMode'
import { g as useRoute, o as useState, p as useFetch, h as useAsyncData, c as useSeoMeta, u as useHead, q as useRequestURL } from './server.mjs'
import { createContext } from 'reka-ui'
import { a4 as encodeParam } from '../_/nitro.mjs'
import 'pinia'
import 'vue-router'
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
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'consola'
import 'uncsrf'
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

const [injectThemeContext, provideThemeContext] = createContext('UTheme', 'RootContext')
function createMapper(map) {
  return key => key !== void 0 ? map[key] || key : map.missingValue
}
function createOperationsGenerator(config = {}) {
  const formatter = config.formatter
  const keyMap = config.keyMap && typeof config.keyMap !== 'function' ? createMapper(config.keyMap) : config.keyMap
  const map = {}
  for (const key in config.valueMap) {
    const valueKey = key
    const value = config.valueMap[valueKey]
    map[valueKey] = typeof value === 'object' ? createMapper(value) : value
  }
  return (modifiers) => {
    const operations = []
    for (const _key in modifiers) {
      const key = _key
      if (typeof modifiers[key] === 'undefined') {
        continue
      }
      const value = typeof map[key] === 'function' ? map[key](modifiers[key]) : modifiers[key]
      operations.push([keyMap ? keyMap(key) : key, value])
    }
    if (formatter) {
      return operations.map(entry => formatter(...entry)).join(config.joinWith ?? '&')
    }
    return new URLSearchParams(operations).toString()
  }
}
createOperationsGenerator({
  keyMap: {
    format: 'f',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
    position: 'pos'
  },
  formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val.toString())
})
ref(null)
const _sfc_main$1 = {
  __name: 'ScalarApiReference',
  __ssrInlineRender: true,
  props: {
    configuration: { type: Object, required: true }
  },
  async setup(__props) {
    let __temp, __restore
    const props = __props
    const isDark = ref(props.configuration.darkMode)
    const forcedMode = props.configuration.forceDarkModeState
    const { colorMode } = useColorMode({
      initialColorMode: props.configuration.darkMode ? 'dark' : 'light',
      overrideColorMode: props.configuration.forceDarkModeState
    })
    const content = props.configuration.spec?.content ?? props.configuration.content
    const url = props.configuration.spec?.url ?? props.configuration.url
    const currentRoute = useRoute()
    const meta = currentRoute.meta
    const document = useState('document', () => null)
    if (!document.value) {
      if (typeof content === 'function') {
        document.value = content()
      } else if (content) {
        document.value = content
      } else if (url) {
        try {
          const response = ([__temp, __restore] = withAsyncContext(() => useFetch(url, { responseType: 'text' })), __temp = await __temp, __restore(), __temp)
          document.value = response.data.value || null
        } catch (error) {
        }
      } else if (meta.isOpenApiEnabled) {
        try {
          const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData('openapi-spec', async () => {
            const response = await $fetch('/_openapi.json', {
              responseType: 'text'
            })
            return response
          })), __temp = await __temp, __restore(), __temp)
          document.value = data.value || null
        } catch (error) {
        }
      }
    }
    if (!document) {
      throw new Error(
        'You must provide a document for Scalar API References. Either provide a spec URL/content, or enable experimental openAPI in the Nitro config.'
      )
    }
    if (props.configuration?.metaData) {
      useSeoMeta(props.configuration.metaData)
    }
    useHead({
      script: [
        {
          // Inject dark / light detection that runs before loading Nuxt to avoid flicker
          // This is a bit of a hack inspired by @nuxtjs/color-mode, but it works
          id: 'scalar-color-mode-script',
          tagPosition: 'bodyClose',
          innerHTML: `((isDark, forced) => {
        try {
          const stored = window.localStorage.getItem('colorMode');
          const useDark = forced === 'dark' || !forced && (stored === 'dark' || !stored && isDark);
          window.document.body.classList.add(useDark ? 'dark-mode' : 'light-mode');
        } catch {}
      })(${isDark.value}, ${JSON.stringify(forcedMode)});`.replace(/[\n\r]/g, '').replace(/ +/g, ' ')
        }
      ]
    })
    watch(colorMode, () => {
      isDark.value = colorMode.value === 'dark'
    })
    const { origin } = useRequestURL()
    const route = useRoute()
    const config = {
      baseServerURL: origin,
      _integration: 'nuxt',
      layout: 'modern',
      ...props.configuration,
      // Match the workspace-store name/slug to the route name
      slug: route.name,
      // Set the fetched spec to the config content to prevent ApiReferenceLayout from fetching it again on the client side
      content: document.value
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ApiReference), mergeProps({ configuration: config }, _attrs), null, _parent))
    }
  }
}
const _sfc_setup$1 = _sfc_main$1.setup
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('node_modules/@scalar/nuxt/dist/runtime/components/ScalarApiReference.vue')
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0
}
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: 'ScalarApiReference' })
const _sfc_main = {
  __name: 'ScalarPage',
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute()
    const meta = route.meta
    if (!meta.isOpenApiEnabled && !meta.configuration?.url && !meta.configuration?.content // @ts-expect-error support the old syntax for a bit
      && !meta.configuration?.spec?.url // @ts-expect-error support the old syntax for a bit
      && !meta.configuration?.spec?.content) {
      throw new Error(
        'You must either provide a spec to scalar, or enable experimental openApi in the Nitro config.'
      )
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScalarApiReference = __nuxt_component_0
      _push(ssrRenderComponent(_component_ScalarApiReference, mergeProps({
        configuration: unref(meta).configuration
      }, _attrs), null, _parent))
    }
  }
}
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('node_modules/@scalar/nuxt/dist/runtime/pages/ScalarPage.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=ScalarPage-C8YYesOR.mjs.map
