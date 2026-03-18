import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer'
import { _ as _export_sfc, b as useI18n, a as useLocalePath, c as useSeoMeta } from './server.mjs'
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
  __name: 'terms-of-service',
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n()
    const localePath = useLocalePath()
    useSeoMeta({
      title: () => locale.value === 'id' ? 'Syarat & Ketentuan - Esperion' : 'Terms of Service - Esperion',
      description: () => locale.value === 'id' ? 'Syarat dan ketentuan layanan Esperion Digital Agency' : 'Terms and conditions of Esperion Digital Agency services'
    })
    const content = computed(() => ({
      id: {
        title: 'Syarat & Ketentuan',
        lastUpdated: 'Terakhir diperbarui: 3 Mei 2026',
        sections: [
          {
            title: '1. Penerimaan Syarat',
            content: `
          Dengan mengakses dan menggunakan website Esperion Digital Agency ("Website"), 
          Anda menerima dan setuju untuk terikat dengan syarat dan ketentuan ini.
          
          Jika Anda tidak setuju dengan syarat ini, harap tidak menggunakan Website kami.
        `
          },
          {
            title: '2. Layanan Kami',
            content: `
          Esperion Digital Agency menyediakan layanan:
          
          - **Digital Advertising**: Iklan digital terarget
          - **Marketplace Marketing**: Optimasi marketplace (Shopee, Tokopedia)
          - **Social Media Marketing**: Manajemen media sosial
          - **Search Engine Optimization (SEO)**: Optimasi mesin pencari
          - **Consultant**: Konsultasi digital marketing
          - **Web & Mobile Development**: Pengembangan website dan aplikasi
          
          Kami berhak mengubah atau menghentikan layanan kapan saja.
        `
          },
          {
            title: '3. Penggunaan Website',
            content: `
          Anda setuju untuk:
          
          - Menggunakan Website hanya untuk tujuan legal
          - Tidak mengganggu atau mencoba mengakses sistem secara tidak sah
          - Tidak menggunakan Website untuk menyebarkan konten berbahaya
          - Mematuhi semua hukum dan peraturan yang berlaku
          
          Pelanggaran dapat mengakibatkan penghentian akses.
        `
          },
          {
            title: '4. Hak Kekayaan Intelektual',
            content: `
          Semua konten di Website ini dilindungi hak cipta:
          
          - **Milik Esperion**: Logo, branding, konten original
          - **Milik Klien**: Portfolio, testimonial (digunakan dengan izin)
          - **Third-party**: Analytics tools, fonts (licensed)
          
          Dilarang mengcopy, mendistribusikan, atau membuat karya turunan 
          tanpa izin tertulis dari Esperion Digital Agency.
        `
          },
          {
            title: '5. Disclaimer',
            content: `
          Website ini disediakan "sebagaimana adanya" tanpa jaminan:
          
          - **Tidak Ada Jaminan**: Kami tidak menjamin hasil spesifik
          - **Hasil Bervariasi**: Hasil marketing bergantung pada banyak faktor
          - **Informasi Umum**: Konten adalah informasi umum, bukan advice profesional
          
          Esperion tidak bertanggung jawab atas kerugian dari penggunaan Website.
        `
          },
          {
            title: '6. Limitasi Tanggung Jawab',
            content: `
          Sepanjang diizinkan oleh hukum:
          
          - Esperion tidak bertanggung jawab untuk kerugian tidak langsung
          - Tanggung jawab maksimal terbatas pada jumlah yang Anda bayar (jika ada)
          - Kami tidak bertanggung jawab untuk error, downtime, atau kehilangan data
          
          Beberapa yurisdiksi tidak mengizinkan limitasi ini.
        `
          },
          {
            title: '7. Link ke Website Lain',
            content: `
          Website kami mungkin berisi link ke website third-party:
          
          - Kami tidak mengontrol konten third-party
          - Link tidak berarti endorsemen dari Esperion
          - Akses website third-party atas risiko Anda sendiri
          
          Kami tidak bertanggung jawab untuk konten atau praktik third-party.
        `
          },
          {
            title: '8. Perubahan Syarat',
            content: `
          Kami dapat mengubah syarat ini kapan saja:
          
          - Perubahan akan diposting di halaman ini
          - Tanggal pembaruan akan diupdate
          - Penggunaan berkelanjutan berarti penerimaan perubahan
          
          Harap tinjau syarat ini secara berkala.
        `
          },
          {
            title: '9. Hukum yang Berlaku',
            content: `
          Syarat ini diatur oleh hukum Indonesia:
          
          - **Yurisdiksi**: Pengadilan Indonesia
          - **Bahasa**: Bahasa Indonesia adalah bahasa resmi
          - **Sengketa**: Akan diselesaikan melalui negosiasi terlebih dahulu
          
          Jika ada klausul yang tidak valid, sisinya tetap berlaku.
        `
          },
          {
            title: '10. Kontak',
            content: `
          Untuk pertanyaan tentang syarat ini:
          
           **Email**: legal@esperion.one
           **Alamat**: Detail alamat publik menunggu konfirmasi final
           **Telepon**: Detail telepon legal menunggu konfirmasi final
          
          Kami akan merespons dalam 5-7 hari kerja.
        `
          }
        ]
      },
      en: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated: May 3, 2026',
        sections: [
          {
            title: '1. Acceptance of Terms',
            content: `
          By accessing and using Esperion Digital Agency's website ("Website"), 
          you accept and agree to be bound by these terms and conditions.
          
          If you do not agree to these terms, please do not use our Website.
        `
          },
          {
            title: '2. Our Services',
            content: `
          Esperion Digital Agency provides the following services:
          
          - **Digital Advertising**: Targeted digital advertising
          - **Marketplace Marketing**: Marketplace optimization (Shopee, Tokopedia)
          - **Social Media Marketing**: Social media management
          - **Search Engine Optimization (SEO)**: Search engine optimization
          - **Consultant**: Digital marketing consultation
          - **Web & Mobile Development**: Website and application development
          
          We reserve the right to modify or discontinue services at any time.
        `
          },
          {
            title: '3. Website Usage',
            content: `
          You agree to:
          
          - Use the Website only for lawful purposes
          - Not interfere with or attempt to access systems unauthorized
          - Not use the Website to distribute harmful content
          - Comply with all applicable laws and regulations
          
          Violations may result in access termination.
        `
          },
          {
            title: '4. Intellectual Property',
            content: `
          All content on this Website is protected by copyright:
          
          - **Esperion Owned**: Logo, branding, original content
          - **Client Owned**: Portfolio, testimonials (used with permission)
          - **Third-party**: Analytics tools, fonts (licensed)
          
          Copying, distributing, or creating derivative works is prohibited 
          without written permission from Esperion Digital Agency.
        `
          },
          {
            title: '5. Disclaimer',
            content: `
          This Website is provided "as is" without warranties:
          
          - **No Warranties**: We do not guarantee specific results
          - **Results Vary**: Marketing results depend on many factors
          - **General Information**: Content is general information, not professional advice
          
          Esperion is not liable for damages arising from Website use.
        `
          },
          {
            title: '6. Limitation of Liability',
            content: `
          To the extent permitted by law:
          
          - Esperion is not liable for indirect or consequential damages
          - Maximum liability is limited to amounts paid (if any)
          - We are not liable for errors, downtime, or data loss
          
          Some jurisdictions do not allow these limitations.
        `
          },
          {
            title: '7. Third-Party Links',
            content: `
          Our Website may contain links to third-party websites:
          
          - We do not control third-party content
          - Links do not imply endorsement by Esperion
          - Access third-party websites at your own risk
          
          We are not responsible for third-party content or practices.
        `
          },
          {
            title: '8. Changes to Terms',
            content: `
          We may modify these terms at any time:
          
          - Changes will be posted on this page
          - Updated date will be reflected
          - Continued use constitutes acceptance of changes
          
          Please review these terms periodically.
        `
          },
          {
            title: '9. Governing Law',
            content: `
          These terms are governed by Indonesian law:
          
          - **Jurisdiction**: Indonesian courts
          - **Language**: Indonesian is the official language
          - **Disputes**: Will be resolved through negotiation first
          
          If any clause is invalid, the remainder remains effective.
        `
          },
          {
            title: '10. Contact',
            content: `
          For questions about these terms:
          
           **Email**: legal@esperion.one
           **Address**: Public address details are pending final confirmation
           **Phone**: Legal contact number is pending final confirmation
          
          We will respond within 5-7 business days.
        `
          }
        ]
      }
    }))
    const currentContent = computed(() => content.value[locale.value])
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen py-12' }, _attrs))} data-v-15378277><div class="container mx-auto px-4 max-w-4xl" data-v-15378277><header class="mb-8" data-v-15378277><h1 class="${ssrRenderClass([[
        'text-es-text-primary dark:text-es-text-primary-dark'
      ], 'text-4xl font-bold mb-4'])}" data-v-15378277>${ssrInterpolate(unref(currentContent).title)}</h1><p class="${ssrRenderClass([[
        'text-es-text-secondary dark:text-es-text-secondary-dark'
      ], 'text-sm'])}" data-v-15378277>${ssrInterpolate(unref(currentContent).lastUpdated)}</p></header><article class="prose prose-lg dark:prose-invert max-w-none" data-v-15378277><!--[-->`)
      ssrRenderList(unref(currentContent).sections, (section) => {
        _push(`<section class="mb-8" data-v-15378277><h2 class="${ssrRenderClass([[
          'text-es-text-primary dark:text-es-text-primary-dark'
        ], 'text-2xl font-semibold mb-4'])}" data-v-15378277>${ssrInterpolate(section.title)}</h2><div class="${ssrRenderClass([[
          'text-es-text-secondary dark:text-es-text-secondary-dark'
        ], 'whitespace-pre-line'])}" data-v-15378277>${section.content ?? ''}</div></section>`)
      })
      _push(`<!--]--></article><div class="mt-12" data-v-15378277>`)
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)('/'),
        class: 'inline-flex items-center gap-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline'
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15378277${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-15378277${_scopeId}></path></svg> ${ssrInterpolate(unref(locale) === 'id' ? 'Kembali ke Beranda' : 'Back to Home')}`)
          } else {
            return [
              (openBlock(), createBlock('svg', {
                class: 'w-5 h-5',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              }, [
                createVNode('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  'd': 'M10 19l-7-7m0 0l7-7m-7 7h18'
                })
              ])),
              createTextVNode(' ' + toDisplayString(unref(locale) === 'id' ? 'Kembali ke Beranda' : 'Back to Home'), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/terms-of-service.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}
const termsOfService = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-15378277']])

export { termsOfService as default }
// # sourceMappingURL=terms-of-service-B8rnBXVt.mjs.map
