/**
 * useInlineEdit - Composable for managing inline editing with undo support
 * 
 * @usage
 * ```vue
 * const { editField, saveField, undoLastEdit } = useInlineEdit({
 *   onSave: async (id, field, value) => {
 *     await api.update(id, { [field]: value })
 *   },
 *   onUndo: (id, field, previousValue) => {
 *     showToast(`Undo: ${field} restored`)
 *   }
 * })
 * ```
 */

import type { UToastOptions } from '#ui/components/Toast.vue'

interface InlineEditState {
  id: string
  field: string
  previousValue: any
  currentValue: any
  timestamp: number
}

interface UseInlineEditOptions {
  onSave?: (id: string, field: string, value: any, previousValue: any) => Promise<void>
  onUndo?: (id: string, field: string, value: any, previousValue: any) => Promise<void>
  toast?: {
    success?: (message: string, options?: UToastOptions) => void
    error?: (message: string, options?: UToastOptions) => void
    info?: (message: string, options?: UToastOptions) => void
  }
}

export const useInlineEdit = (options: UseInlineEditOptions = {}) => {
  const editHistory = ref<InlineEditState[]>([])
  const lastEdit = computed(() => editHistory.value[editHistory.value.length - 1])

  const editField = (id: string, field: string, previousValue: any) => {
    const state: InlineEditState = {
      id,
      field,
      previousValue,
      currentValue: null,
      timestamp: Date.now()
    }
    return state
  }

  const saveField = async (
    id: string,
    field: string,
    value: any,
    previousValue: any,
    itemLabel?: string
  ) => {
    const state: InlineEditState = {
      id,
      field,
      previousValue,
      currentValue: value,
      timestamp: Date.now()
    }
    editHistory.value.push(state)

    // Keep only last 10 edits
    if (editHistory.value.length > 10) {
      editHistory.value.shift()
    }

    try {
      if (options.onSave) {
        await options.onSave(id, field, value, previousValue)
      }

      // Show success toast with undo option
      if (options.toast?.success) {
        options.toast.success(
          `${itemLabel || field} updated`,
          {
            actions: [
              {
                label: 'Undo',
                click: () => undoLastEdit()
              }
            ]
          }
        )
      }
    } catch (err) {
      // Show error toast
      if (options.toast?.error) {
        options.toast.error(
          `Failed to update ${itemLabel || field}`,
          {
            description: err instanceof Error ? err.message : 'Unknown error'
          }
        )
      }
      throw err
    }
  }

  const undoLastEdit = async () => {
    const edit = lastEdit.value
    if (!edit) return

    try {
      if (options.onUndo) {
        await options.onUndo(edit.id, edit.field, edit.previousValue, edit.currentValue)
      }

      // Remove from history
      editHistory.value.pop()

      // Show info toast
      if (options.toast?.info) {
        options.toast.info(`${edit.field} restored`)
      }
    } catch (err) {
      if (options.toast?.error) {
        options.toast.error('Failed to undo')
      }
      throw err
    }
  }

  const clearHistory = () => {
    editHistory.value = []
  }

  return {
    editHistory: readonly(editHistory),
    lastEdit: readonly(lastEdit),
    editField,
    saveField,
    undoLastEdit,
    clearHistory
  }
}

export default useInlineEdit
