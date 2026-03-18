import { ref, watch, onUnmounted } from 'vue'

export interface AutoSaveOptions<T> {
  delay?: number
  wordCountInterval?: number
}

export interface AutoSaveState {
  lastSaved: Ref<string | null>
  isSaving: Ref<boolean>
  saveStatus: Ref<'idle' | 'saving' | 'saved' | 'error'>
  triggerManualSave: () => Promise<void>
  triggerAutoSave: () => void
}

/**
 * useAutoSave - Composable for auto-save functionality
 * 
 * Implements three-tier save mechanism:
 * 1. Auto-save on idle (after delay of no typing)
 * 2. Auto-save every N words
 * 3. Manual save (highest priority)
 * 
 * @param getContent - Function to get current content
 * @param onSave - Callback when save is triggered
 * @param options - Configuration options
 * 
 * @example
 * ```typescript
 * const { lastSaved, isSaving, triggerAutoSave } = useAutoSave(
 *   () => content.value,
 *   async (content) => { await saveToAPI(content) }
 * )
 * ```
 */
export function useAutoSave<T>(
  getContent: () => T,
  onSave: (content: T) => Promise<void> | void,
  options: AutoSaveOptions<T> = {}
): AutoSaveState {
  const { delay = 2000, wordCountInterval = 100 } = options

  const lastSaved = ref<string | null>(null)
  const isSaving = ref(false)
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  // Track word count for milestone saves
  const lastWordCount = ref(0)
  
  // Idle timer
  let idleTimer: NodeJS.Timeout | null = null
  
  // Save coordinator token
  let saveToken = 0

  const performSave = async (content: T, type: 'manual' | 'idle' | 'word-count') => {
    const currentToken = ++saveToken
    
    // Manual save cancels pending auto-saves
    if (type === 'manual' && idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
    
    isSaving.value = true
    saveStatus.value = 'saving'
    
    try {
      await onSave(content)
      
      // Only update if this is still the latest save
      if (currentToken === saveToken) {
        lastSaved.value = new Date().toLocaleTimeString()
        saveStatus.value = 'saved'
        
        // Reset status after 2 seconds
        setTimeout(() => {
          if (saveStatus.value === 'saved') {
            saveStatus.value = 'idle'
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
      saveStatus.value = 'error'
    } finally {
      isSaving.value = false
    }
  }

  const triggerAutoSave = () => {
    const content = getContent()
    
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer)
    }
    
    // Set new idle timer
    idleTimer = setTimeout(() => {
      performSave(content, 'idle')
    }, delay)
  }

  const triggerManualSave = async () => {
    const content = getContent()
    await performSave(content, 'manual')
  }

  // Watch for word count changes
  const checkWordMilestone = () => {
    const content = getContent()
    const text = JSON.stringify(content)
    const wordCount = text.trim().split(/\s+/).length
    
    if (wordCount - lastWordCount.value >= wordCountInterval) {
      lastWordCount.value = wordCount
      performSave(content, 'word-count')
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (idleTimer) {
      clearTimeout(idleTimer)
    }
  })

  return {
    lastSaved,
    isSaving,
    saveStatus,
    triggerManualSave,
    triggerAutoSave
  }
}
