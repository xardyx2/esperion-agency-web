import { computed, toValue, type MaybeRef } from 'vue'

export function useArticleContent(body: MaybeRef<string>) {
  // Parse markdown-style content to HTML
  const parsedContent = computed(() => {
    const content = toValue(body)
    if (!content) return ''

    let html = content

    // Convert ## headings
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')

    // Convert ### headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')

    // Convert **bold**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    html = '<p class="mb-4 leading-relaxed">' + html + '</p>'

    // Convert lists
    html = html.replace(/<p>([*-] .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map((line: string) =>
        line.replace(/^[*-] (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ul class="list-disc pl-6 mb-4">${items}</ul>`
    })

    // Convert numbered lists
    html = html.replace(/<p>(\d+\. .*?)<\/p>/gs, (match, list) => {
      const items = list.split('\n').map((line: string) =>
        line.replace(/^\d+\. (.*)/, '<li class="mb-2">$1</li>')
      ).join('')
      return `<ol class="list-decimal pl-6 mb-4">${items}</ol>`
    })

    return html
  })

  // Extract key points from content
  const keyPoints = computed(() => {
    const content = toValue(body)
    const match = content.match(/## Key Points[\s\S]*?(?=##|$)/i)
    if (!match) return []

    return match[0]
      .split('\n')
      .filter((line: string) => line.trim().startsWith('- '))
      .map((line: string) => line.replace(/^- /, '').trim())
  })

  // Extract summary
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
