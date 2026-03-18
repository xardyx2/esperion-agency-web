/**
 * Alibaba Cloud Translation API Composable
 * Integrates with Alibaba Cloud Translation API for auto-translation
 *
 * API Documentation:
 * https://www.alibabacloud.com/help/en/machine-translation/latest/overview-6
 *
 * @usage
 * ```ts
 * const { translate, batchTranslate, detectLanguage } = useAlibabaTranslate()
 *
 * // Translate single text
 * const result = await translate({
 *   sourceText: 'Hello World',
 *   sourceLang: 'en',
 *   targetLang: 'id'
 * })
 *
 * // Batch translate (cached)
 * const results = await batchTranslate([
 *   { text: 'Hello', from: 'en', to: 'id' },
 *   { text: 'World', from: 'en', to: 'id' }
 * ])
 * ```
 */

interface TranslateRequest {
  sourceText: string
  sourceLang: 'id' | 'en' | 'auto'
  targetLang: 'id' | 'en'
}

interface TranslateResult {
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  confidence?: number
}

interface BatchTranslateItem {
  text: string
  from: 'id' | 'en' | 'auto'
  to: 'id' | 'en'
}

// API Configuration
const API_BASE_URL = '/api/v1/translate/alibaba'
const API_KEY = useRuntimeConfig().public.alibabaApiKey || ''

/**
 * Translate text using Alibaba Cloud API
 * Falls back to cached translation if API fails
 */
async function translate(request: TranslateRequest): Promise<TranslateResult> {
  const { sourceText, sourceLang, targetLang } = request

  // Skip if source and target are the same
  if (sourceLang === targetLang) {
    return {
      sourceText,
      translatedText: sourceText,
      sourceLang,
      targetLang
    }
  }

  try {
    // Call backend API (which handles Alibaba Cloud integration)
    const result = await $fetch<TranslateResult>(API_BASE_URL, {
      method: 'POST',
      body: {
        text: sourceText,
        source: sourceLang,
        target: targetLang
      }
    })

    // Cache the translation
    const { cacheTranslation } = useI18n()
    await cacheTranslation({
      sourceText,
      translatedText: result.translatedText,
      sourceLang: result.sourceLang as 'id' | 'en',
      targetLang: result.targetLang as 'id' | 'en',
      contentType: 'dynamic'
    })

    return result
  } catch (error) {
    console.error('Translation API error:', error)

    // Try to get from cache
    const { getCachedTranslation } = useI18n()
    const cached = getCachedTranslation(
      sourceText,
      sourceLang as 'id' | 'en',
      targetLang
    )

    if (cached) {
      return {
        sourceText,
        translatedText: cached,
        sourceLang,
        targetLang
      }
    }

    // Fallback: return original text
    return {
      sourceText,
      translatedText: sourceText,
      sourceLang,
      targetLang
    }
  }
}

/**
 * Batch translate multiple texts
 * More efficient than individual calls
 */
async function batchTranslate(
  items: BatchTranslateItem[]
): Promise<TranslateResult[]> {
  const results: TranslateResult[] = []

  // Group by language pair for efficiency
  const grouped = items.reduce((acc, item) => {
    const key = `${item.from}-${item.to}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<string, BatchTranslateItem[]>)

  // Process each group
  for (const [key, group] of Object.entries(grouped)) {
    const [from, to] = key.split('-')

    try {
      const result = await $fetch<TranslateResult[]>(`${API_BASE_URL}/batch`, {
        method: 'POST',
        body: {
          texts: group.map(item => item.text),
          source: from,
          target: to
        }
      })

      results.push(...result)

      // Cache all results
      const { cacheTranslation } = useI18n()
      for (const r of result) {
        await cacheTranslation({
          sourceText: r.sourceText,
          translatedText: r.translatedText,
          sourceLang: r.sourceLang as 'id' | 'en',
          targetLang: r.targetLang as 'id' | 'en',
          contentType: 'dynamic'
        })
      }
    } catch (error) {
      console.error('Batch translation error:', error)
      // Fallback to original texts
      results.push(
        ...group.map(item => ({
          sourceText: item.text,
          translatedText: item.text,
          sourceLang: item.from,
          targetLang: item.to
        }))
      )
    }
  }

  return results
}

/**
 * Detect language of a text
 * Uses Alibaba Cloud language detection
 */
async function detectLanguage(text: string): Promise<'id' | 'en' | 'unknown'> {
  try {
    const result = await $fetch<{ language: string }>(`${API_BASE_URL}/detect`, {
      method: 'POST',
      body: { text }
    })

    const lang = result.language.toLowerCase()
    if (lang.startsWith('id') || lang.startsWith('ind')) {
      return 'id'
    }
    if (lang.startsWith('en')) {
      return 'en'
    }
    return 'unknown'
  } catch (error) {
    console.error('Language detection error:', error)
    return 'unknown'
  }
}

/**
 * Translate and cache dynamic content
 * Only calls API if translation is not cached
 */
async function translateWithCache(
  sourceText: string,
  targetLang: 'id' | 'en'
): Promise<string> {
  const { getCachedTranslation } = useI18n()

  // Check cache first
  const cached = getCachedTranslation(sourceText, 'auto', targetLang)
  if (cached) {
    return cached
  }

  // Detect source language
  const detectedLang = await detectLanguage(sourceText)
  const sourceLang = detectedLang === 'unknown' ? 'auto' : detectedLang

  // Translate
  const result = await translate({
    sourceText,
    sourceLang,
    targetLang
  })

  return result.translatedText
}

export function useAlibabaTranslate() {
  return {
    translate,
    batchTranslate,
    detectLanguage,
    translateWithCache
  }
}
