import { _ as __nuxt_component_0 } from './nuxt-link-B4_Aso1E.mjs'
import { defineComponent, computed, withAsyncContext, watchEffect, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, toValue, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer'
import { f as findPublicArticleBySlug, b as getRelatedArticles } from './public-content-D_mrJhWa.mjs'
import { u as usePublicIdentity } from './usePublicIdentity-SKKe4NtZ.mjs'
import { g as useRoute, a as useLocalePath, b as useI18n, h as useAsyncData, i as createError, c as useSeoMeta, d as useSchemaOrg } from './server.mjs'
import { defineArticle, defineWebPage, defineBreadcrumb } from '@unhead/schema-org/vue'
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
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

function useArticleContent(body) {
  const parsedContent = computed(() => {
    const content = toValue(body)
    if (!content) return ''
    let html = content
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    html = '<p class="mb-4 leading-relaxed">' + html + '</p>'
    html = html.replace(/<p>([*-] .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map(
        line => line.replace(/^[*-] (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ul class="list-disc pl-6 mb-4">${items}</ul>`
    })
    html = html.replace(/<p>(\d+\. .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map(
        line => line.replace(/^\d+\. (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ol class="list-decimal pl-6 mb-4">${items}</ol>`
    })
    return html
  })
  const keyPoints = computed(() => {
    const content = toValue(body)
    const match = content.match(/## Key Points[\s\S]*?(?=##|$)/i)
    if (!match) return []
    return match[0].split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.replace(/^- /, '').trim())
  })
  const summary = computed(() => {
    const content = toValue(body)
    const match = content.match(/## Ringkasan[\s\S]*?(?=##|$)/i) || content.match(/## Summary[\s\S]*?(?=##|$)/i)
    return match ? match[0].replace(/## Ringkasan/i, '').replace(/## Summary/i, '').trim() : ''
  })
  return {
    parsedContent,
    keyPoints,
    summary
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: '[slug]',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
    const route = useRoute()
    const localePath = useLocalePath()
    const { t, locale } = useI18n()
    const slugParam = computed(() => {
      const raw = route.params.slug
      if (Array.isArray(raw)) {
        return raw[0] ?? ''
      }
      return typeof raw === 'string' ? raw : ''
    })
    const { data: article, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `article-${route.params.slug}`,
      () => {
        const record = findPublicArticleBySlug(slugParam.value)
        if (!record) {
          throw createError({ statusCode: 404, statusMessage: 'Article not found' })
        }
        return record
      },
      {
        watch: [slugParam],
        server: true,
        default: () => null
      }
    )), __temp = await __temp, __restore(), __temp)
    const articleBody = computed(() => article.value?.body_id || '')
    const { parsedContent, keyPoints } = useArticleContent(articleBody)
    watchEffect(() => {
      if (!pending.value && error.value) {
        throw createError({ statusCode: 404, statusMessage: 'Article not found' })
      }
    })
    const relatedArticles = computed(() => article.value ? getRelatedArticles(article.value.slug_id, 3) : [])
    const localizedArticleSlug = computed(
      () => article.value ? locale.value === 'en' ? article.value.slug_en || article.value.slug_id : article.value.slug_id : ''
    )
    const relatedArticlePath = (related) => {
      const slug = locale.value === 'en' ? related.slug_en || related.slug_id : related.slug_id
      return localePath(`/articles/${slug}`)
    }
    const formatDate = dateString => new Date(dateString).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    const articleKeywords = computed(() => {
      if (!article.value) return ''
      return article.value.title.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ').split(' ').slice(0, 5).join(',')
    })
    const localePrefix = computed(() => locale.value === 'en' ? 'en' : 'id')
    const pageUrl = computed(() => article.value ? `https://esperion.one/${localePrefix.value}/articles/${localizedArticleSlug.value}` : '')
    const imageUrl = computed(() => article.value ? `https://esperion.one${article.value.image}` : '')
    const publicIdentity = usePublicIdentity()
    const copySuccess = ref(false)
    watchEffect(() => {
      if (!article.value) return
      useSeoMeta({
        title: `${article.value.title} | ${t('seo.articles.title')}`,
        description: article.value.excerpt_id,
        ogTitle: `${article.value.title} | ${t('seo.articles.ogTitle')}`,
        ogDescription: article.value.excerpt_id,
        ogImage: imageUrl.value,
        ogUrl: pageUrl.value,
        ogType: 'article',
        articleAuthor: [article.value.author],
        articlePublishedTime: article.value.published_at,
        articleModifiedTime: (/* @__PURE__ */ new Date()).toISOString(),
        articleSection: article.value.category,
        articleTag: article.value.tags || [articleKeywords.value],
        twitterCard: 'summary_large_image',
        twitterTitle: `${article.value.title} | ${t('seo.articles.twitterTitle')}`,
        twitterDescription: article.value.excerpt_id,
        twitterImage: imageUrl.value,
        ogLocale: locale.value === 'en' ? 'en_US' : 'id_ID'
      })
    })
    watchEffect(() => {
      if (!article.value) return
      useSchemaOrg([
        defineArticle({
          '@type': ['Article', 'BlogPosting'],
          '@id': pageUrl.value,
          'headline': article.value.title,
          'alternativeHeadline': article.value.excerpt_id,
          'description': article.value.excerpt_id,
          // Content
          'articleBody': article.value.body_id,
          'wordCount': article.value.wordCount,
          'articleSection': article.value.category,
          'keywords': article.value.tags || [],
          // Author
          'author': {
            '@type': 'Person',
            '@id': `https://esperion.one/authors/${article.value.authorId}`,
            'name': article.value.author,
            'url': `https://esperion.one/${localePrefix.value}/experts/${article.value.authorId}`,
            'sameAs': publicIdentity.sameAs,
            'jobTitle': 'Digital Marketing Expert',
            'worksFor': {
              '@id': 'https://esperion.one/#organization'
            }
          },
          // Publisher
          'publisher': {
            '@type': 'Organization',
            '@id': 'https://esperion.one/#organization',
            'name': 'Esperion Digital Agency',
            'legalName': 'PT Esperion Teknologi Digital',
            'url': 'https://esperion.one',
            'sameAs': publicIdentity.sameAs
          },
          // Dates
          'datePublished': article.value.published_at,
          'dateModified': (/* @__PURE__ */ new Date()).toISOString(),
          // Image
          'image': {
            '@type': 'ImageObject',
            'url': imageUrl.value,
            'width': 1200,
            'height': 630,
            'caption': article.value.title
          },
          // AI-SPECIFIC ENHANCEMENTS
          // 1. Speakable - mark sections for voice/AI extraction
          'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': article.value.speakableSelectors || [
              '.article-title',
              '.article-summary',
              '.key-points'
            ]
          },
          // 2. Entity mentions - link to knowledge graph
          'mentions': article.value.entities?.map(entity => ({
            '@type': entity.type,
            'name': entity.name,
            'sameAs': entity.sameAs
          })) || [],
          // 3. Main entity
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': pageUrl.value
          },
          // 4. Language & accessibility
          'inLanguage': locale.value === 'en' ? 'en-US' : 'id-ID',
          'isAccessibleForFree': true,
          'url': pageUrl.value
        }),
        // WebPage schema
        defineWebPage({
          '@id': pageUrl.value,
          'name': article.value.title,
          'description': article.value.excerpt_id,
          'url': pageUrl.value,
          'datePublished': article.value.published_at,
          'dateModified': (/* @__PURE__ */ new Date()).toISOString()
        }),
        // Breadcrumb
        defineBreadcrumb({
          itemListElement: [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': t('breadcrumb.home'),
              'item': `https://esperion.one/${localePrefix.value}`
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': t('breadcrumb.articles'),
              'item': `https://esperion.one/${localePrefix.value}/articles`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': article.value.title,
              'item': pageUrl.value
            }
          ]
        })
      ])
    })
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark' }, _attrs))}>`)
      if (unref(pending)) {
        _push(`<div class="flex items-center justify-center min-h-screen"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-es-accent-primary"></div></div>`)
      } else if (unref(error)) {
        _push(`<div class="flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl font-bold text-es-text-primary mb-4">${ssrInterpolate(unref(t)('articles.detail.notFound'))}</h1>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/articles'),
          class: 'text-es-accent-primary hover:underline'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('articles.detail.backToArticles'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('articles.detail.backToArticles')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></div>`)
      } else if (unref(article)) {
        _push(`<!--[--><article class="max-w-4xl mx-auto px-4 py-12"><div class="mb-6">`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(`/articles?category=${unref(article).category}`),
          class: 'inline-block px-4 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-semibold rounded-full hover:bg-es-accent-primary/20 dark:hover:bg-es-accent-primary-dark/20 transition-colors cursor-pointer'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(article).category)}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(article).category), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div><h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6 leading-tight">${ssrInterpolate(unref(article).title)}</h1><div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-4 pb-8 border-b border-es-border dark:border-es-border-dark"><div class="flex items-center gap-2"><span class="text-xl">👤</span><span>${ssrInterpolate(unref(article).author)}</span></div><div class="flex items-center gap-2"><span class="text-xl">📅</span><span>${ssrInterpolate(formatDate(unref(article).published_at))}</span></div><div class="flex items-center gap-2"><span class="text-xl">⏱️</span><span>${ssrInterpolate(unref(article).read_time)} ${ssrInterpolate(unref(t)('articles.detail.readTime'))}</span></div></div>`)
        if (unref(article).tags?.length) {
          _push(`<div class="flex flex-wrap gap-2 mb-8"><span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mr-2">${ssrInterpolate(unref(t)('articles.detail.tags'))}:</span><!--[-->`)
          ssrRenderList(unref(article).tags, (tag) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: tag,
              to: unref(localePath)(`/articles?tag=${encodeURIComponent(tag)}`),
              class: 'px-3 py-1 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors cursor-pointer'
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(tag)}`)
                } else {
                  return [
                    createTextVNode(toDisplayString(tag), 1)
                  ]
                }
              }),
              _: 2
            }, _parent))
          })
          _push(`<!--]--></div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`<div class="mb-12"><img${ssrRenderAttr('src', unref(article).image)}${ssrRenderAttr('alt', unref(article).title)} class="w-full rounded-xl shadow-lg"></div><div class="article-summary mb-8"><p class="text-xl text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">${ssrInterpolate(unref(article).excerpt_id)}</p></div>`)
        if (unref(keyPoints).length) {
          _push(`<div class="key-points bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6 mb-8"><h2 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4"> Key Points </h2><ul class="space-y-2"><!--[-->`)
          ssrRenderList(unref(keyPoints), (point) => {
            _push(`<li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark"><span class="text-es-accent-primary mt-1">•</span><span>${ssrInterpolate(point)}</span></li>`)
          })
          _push(`<!--]--></ul></div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`<div class="prose prose-lg dark:prose-invert max-w-none mb-12">${unref(parsedContent) ?? ''}</div>`)
        if (unref(article).entities?.length) {
          _push(`<div class="mt-12 pt-8 border-t border-es-border dark:border-es-border-dark"><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4"> Topik Terkait </h3><div class="flex flex-wrap gap-2"><!--[-->`)
          ssrRenderList(unref(article).entities, (entity) => {
            _push(`<a${ssrRenderAttr('href', entity.sameAs)} target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-es-accent-primary/10 text-es-accent-primary rounded-lg text-sm hover:bg-es-accent-primary/20 transition-colors">${ssrInterpolate(entity.name)}</a>`)
          })
          _push(`<!--]--></div></div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`<div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl"><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">${ssrInterpolate(unref(t)('articles.detail.shareArticle'))}</h3><div class="flex flex-wrap gap-4"><button class="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg> ${ssrInterpolate(unref(t)('articles.detail.facebook'))}</button><button class="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg> ${ssrInterpolate(unref(t)('articles.detail.twitter'))}</button><button class="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg> ${ssrInterpolate(unref(t)('articles.detail.linkedin'))}</button><button class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg> ${ssrInterpolate(unref(t)('articles.detail.copyLink'))}</button></div>`)
        if (unref(copySuccess)) {
          _push(`<p class="mt-3 text-sm text-green-600 dark:text-green-400">${ssrInterpolate(unref(t)('articles.detail.linkCopied'))}</p>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</div><div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl"><div class="flex items-start gap-4"><div class="w-16 h-16 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-2xl"> 👤 </div><div><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">${ssrInterpolate(unref(article).author)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">${ssrInterpolate(unref(t)('articles.detail.authorBio'))}</p></div></div></div></article><section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark"><div class="w-full px-4"><h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">${ssrInterpolate(unref(t)('articles.detail.relatedArticles'))}</h2><div class="grid md:grid-cols-3 gap-6"><!--[-->`)
        ssrRenderList(unref(relatedArticles), (related) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: related.id,
            to: relatedArticlePath(related),
            class: 'group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr('src', related.image)}${ssrRenderAttr('alt', related.title)} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}><div class="p-6"${_scopeId}><span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full"${_scopeId}>${ssrInterpolate(related.category)}</span><h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors"${_scopeId}>${ssrInterpolate(related.title)}</h3><p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2"${_scopeId}>${ssrInterpolate(related.excerpt_id)}</p></div>`)
              } else {
                return [
                  createVNode('img', {
                    src: related.image,
                    alt: related.title,
                    class: 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  }, null, 8, ['src', 'alt']),
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('span', { class: 'px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full' }, toDisplayString(related.category), 1),
                    createVNode('h3', { class: 'text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors' }, toDisplayString(related.title), 1),
                    createVNode('p', { class: 'text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2' }, toDisplayString(related.excerpt_id), 1)
                  ])
                ]
              }
            }),
            _: 2
          }, _parent))
        })
        _push(`<!--]--></div></div></section><section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark"><div class="w-full px-4 text-center"><h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">${ssrInterpolate(unref(t)('articles.detail.newsletterTitle'))}</h2><p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">${ssrInterpolate(unref(t)('articles.detail.newsletterDescription'))}</p>`)
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)('/articles'),
          class: 'inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors'
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)('articles.detail.viewAllArticles'))}`)
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)('articles.detail.viewAllArticles')), 1)
              ]
            }
          }),
          _: 1
        }, _parent))
        _push(`</div></section><!--]-->`)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/articles/[slug].vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=_slug_-DRUPvfX3.mjs.map
