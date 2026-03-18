/**
 * Article Editor Store - Pinia store for managing article editor state
 */

// Define locally to avoid importing from .vue file
export interface EditorContent {
  id: string
  en: string
}

export interface CursorPosition {
  top: number
  left: number
}

export interface ScrollPosition {
  top: number
  left: number
}

export type ViewMode = 'single' | 'split'

export interface ArticleEditorState {
  content: EditorContent
  viewMode: ViewMode
  activeLanguage: 'id' | 'en'
  cursorPositions: Record<'id' | 'en', CursorPosition>
  scrollPositions: Record<'id' | 'en', ScrollPosition>
  isDirty: boolean
  lastSavedAt: Date | null
  wordCount: { id: number; en: number; total: number }
}

export const useArticleEditorStore = defineStore('articleEditor', {
  state: (): ArticleEditorState => ({
    content: {
      id: '',
      en: ''
    },
    viewMode: 'single',
    activeLanguage: 'id',
    cursorPositions: {
      id: { top: 0, left: 0 },
      en: { top: 0, left: 0 }
    },
    scrollPositions: {
      id: { top: 0, left: 0 },
      en: { top: 0, left: 0 }
    },
    isDirty: false,
    lastSavedAt: null,
    wordCount: { id: 0, en: 0, total: 0 }
  }),

  getters: {
    // Combined content getter
    combinedContent: (state): string => {
      return `${state.content.id}\n\n${state.content.en}`.trim()
    },

    // Content for the currently active language
    activeContent: (state): string => {
      return state.content[state.activeLanguage]
    },

    // Reading time estimation (200 words per minute)
    readingTime: (state): { id: number; en: number } => {
      return {
        id: Math.ceil(state.wordCount.id / 200),
        en: Math.ceil(state.wordCount.en / 200)
      }
    },

    // Check if content is empty
    isEmpty: (state): boolean => {
      return !state.content.id.trim() && !state.content.en.trim()
    },

    // Translation status
    translationStatus: (state): 'empty' | 'id_only' | 'en_only' | 'complete' => {
      const hasId = state.content.id.trim().length > 0
      const hasEn = state.content.en.trim().length > 0

      if (!hasId && !hasEn) return 'empty'
      if (hasId && !hasEn) return 'id_only'
      if (!hasId && hasEn) return 'en_only'
      return 'complete'
    }
  },

  actions: {
    // Initialize store with article data
    initialize(content: EditorContent) {
      this.content = { ...content }
      this.isDirty = false
      this.updateWordCount()
    },

    // Update content for a specific language
    updateContent(language: 'id' | 'en', value: string) {
      this.content[language] = value
      this.isDirty = true
      this.updateWordCount()
    },

    // Update content for both languages
    updateContentBoth(newContent: EditorContent) {
      this.content = { ...newContent }
      this.isDirty = true
      this.updateWordCount()
    },

    // Switch view mode
    setViewMode(mode: ViewMode) {
      this.viewMode = mode
    },

    // Switch active language (for single view)
    setActiveLanguage(language: 'id' | 'en') {
      this.activeLanguage = language
    },

    // Save cursor position for a language
    saveCursorPosition(language: 'id' | 'en', position: CursorPosition) {
      this.cursorPositions[language] = { ...position }
    },

    // Save scroll position for a language
    saveScrollPosition(language: 'id' | 'en', position: ScrollPosition) {
      this.scrollPositions[language] = { ...position }
    },

    // Mark as saved
    markAsSaved() {
      this.isDirty = false
      this.lastSavedAt = new Date()
    },

    // Mark as dirty
    markAsDirty() {
      this.isDirty = true
    },

    // Update word count
    updateWordCount() {
      const countWords = (text: string): number => {
        return text.trim().split(/\s+/).filter(w => w.length > 0).length
      }

      this.wordCount = {
        id: countWords(this.content.id),
        en: countWords(this.content.en),
        total: countWords(this.combinedContent)
      }
    },

    // Reset store to initial state
    reset() {
      this.content = { id: '', en: '' }
      this.viewMode = 'single'
      this.activeLanguage = 'id'
      this.cursorPositions = { id: { top: 0, left: 0 }, en: { top: 0, left: 0 } }
      this.scrollPositions = { id: { top: 0, left: 0 }, en: { top: 0, left: 0 } }
      this.isDirty = false
      this.lastSavedAt = null
      this.wordCount = { id: 0, en: 0, total: 0 }
    },

    // Toggle view mode
    toggleViewMode() {
      this.viewMode = this.viewMode === 'single' ? 'split' : 'single'
    },

    // Switch to next language (for single view)
    switchLanguage() {
      this.activeLanguage = this.activeLanguage === 'id' ? 'en' : 'id'
    },

    // Get scroll position for a language
    getScrollPosition(language: 'id' | 'en'): ScrollPosition {
      return this.scrollPositions[language]
    },

    // Get cursor position for a language
    getCursorPosition(language: 'id' | 'en'): CursorPosition {
      return this.cursorPositions[language]
    }
  }
})

export default useArticleEditorStore
