/**
 * usePersistentSelection - Composable for persisting selection across pagination
 * 
 * Stores selected IDs in localStorage with expiration
 * Useful for bulk actions that span multiple pages
 * 
 * @usage
 * ```vue
 * const { 
 *   selectedIds, 
 *   toggleSelection, 
 *   isSelected,
 *   persistSelection,
 *   clearPersistedSelection 
 * } = usePersistentSelection({
 *   key: 'articles-selection',
 *   maxAge: 24 * 60 * 60 * 1000 // 24 hours
 * })
 * ```
 */

import { useStorage } from '@vueuse/core'

interface PersistentSelectionOptions {
  key: string
  maxAge?: number // milliseconds
}

interface PersistedSelection {
  ids: string[]
  timestamp: number
  totalCount: number
}

export const usePersistentSelection = (options: PersistentSelectionOptions) => {
  const { key, maxAge = 24 * 60 * 60 * 1000 } = options

  const storageKey = `esperion:selection:${key}`
  
  // Reactive set of selected IDs
  const selectedIds = ref<Set<string>>(new Set())
  
  // Load persisted selection on mount
  const persistedData = useStorage<PersistedSelection | null>(storageKey, null)
  
  onMounted(() => {
    if (persistedData.value) {
      const age = Date.now() - persistedData.value.timestamp
      if (age < maxAge) {
        selectedIds.value = new Set(persistedData.value.ids)
      } else {
        // Clear expired selection
        persistedData.value = null
      }
    }
  })

  // Persist selection whenever it changes
  const persistSelection = (totalCount: number) => {
    persistedData.value = {
      ids: Array.from(selectedIds.value),
      timestamp: Date.now(),
      totalCount
    }
  }

  const clearPersistedSelection = () => {
    selectedIds.value.clear()
    persistedData.value = null
  }

  const toggleSelection = (id: string, persist = true, totalCount?: number) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
    
    if (persist && totalCount !== undefined) {
      persistSelection(totalCount)
    }
  }

  const isSelected = (id: string): boolean => {
    return selectedIds.value.has(id)
  }

  const selectAll = (ids: string[], persist = true, totalCount?: number) => {
    ids.forEach(id => selectedIds.value.add(id))
    if (persist && totalCount !== undefined) {
      persistSelection(totalCount)
    }
  }

  const deselectAll = (ids?: string[]) => {
    if (ids) {
      ids.forEach(id => selectedIds.value.delete(id))
    } else {
      selectedIds.value.clear()
    }
    
    // Update persisted data
    if (persistedData.value) {
      persistedData.value.ids = Array.from(selectedIds.value)
      persistedData.value.timestamp = Date.now()
      if (selectedIds.value.size === 0) {
        persistedData.value = null
      }
    }
  }

  const selectedCount = computed(() => selectedIds.value.size)

  const isAllSelected = (ids: string[]): boolean => {
    if (ids.length === 0) return false
    return ids.every(id => selectedIds.value.has(id))
  }

  const isPartiallySelected = (ids: string[]): boolean => {
    const selectedCount = ids.filter(id => selectedIds.value.has(id)).length
    return selectedCount > 0 && selectedCount < ids.length
  }

  return {
    selectedIds: readonly(selectedIds),
    selectedCount: readonly(selectedCount),
    toggleSelection,
    isSelected,
    selectAll,
    deselectAll,
    isAllSelected,
    isPartiallySelected,
    persistSelection,
    clearPersistedSelection
  }
}

export default usePersistentSelection
