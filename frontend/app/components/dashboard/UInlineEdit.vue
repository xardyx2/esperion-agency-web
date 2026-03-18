<script setup lang="ts">
/**
 * UInlineEdit - Inline editing component for quick field updates
 * 
 * @usage
 * ```vue
 * <UInlineEdit
 *   v-model="value"
 *   type="text"
 *   @save="handleSave"
 *   @cancel="handleCancel"
 * />
 * ```
 */

export type EditType = 'text' | 'select' | 'toggle' | 'textarea'

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number | boolean
  type: EditType
  placeholder?: string
  options?: SelectOption[]
  loading?: boolean
  disabled?: boolean
  validate?: (value: any) => string | undefined
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  save: [value: any, previousValue: any]
  cancel: []
}>()

const isEditing = ref(false)
const editValue = ref<string | number | boolean>(props.modelValue)
const previousValue = ref<string | number | boolean>(props.modelValue)
const error = ref('')
const inputRef = ref<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>()

// Computed string value for textarea
const textValue = computed({
  get: () => String(editValue.value),
  set: (val: string) => {
    editValue.value = val
  }
})

// Watch for external value changes
watch(() => props.modelValue, (newVal) => {
  if (!isEditing.value) {
    editValue.value = newVal
  }
})

const startEdit = () => {
  if (props.disabled) return
  isEditing.value = true
  previousValue.value = props.modelValue
  editValue.value = props.modelValue
  error.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const validate = (): boolean => {
  if (props.validate) {
    const validationError = props.validate(editValue.value)
    if (validationError) {
      error.value = validationError
      return false
    }
  }
  error.value = ''
  return true
}

const save = () => {
  if (!validate()) return
  if (editValue.value === previousValue.value) {
    cancel()
    return
  }
  
  emit('update:modelValue', editValue.value)
  emit('save', editValue.value, previousValue.value)
  isEditing.value = false
}

const cancel = () => {
  editValue.value = previousValue.value
  error.value = ''
  isEditing.value = false
  emit('cancel')
}

const undo = () => {
  const temp = editValue.value
  editValue.value = previousValue.value
  previousValue.value = temp
  emit('update:modelValue', editValue.value)
  emit('save', editValue.value, previousValue.value)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (props.type !== 'textarea') {
      save()
    }
  } else if (e.key === 'Escape') {
    cancel()
  }
}

const handleBlur = () => {
  // Small delay to allow click on save button
  setTimeout(() => {
    if (isEditing.value && !error.value) {
      save()
    }
  }, 200)
}

const displayValue = computed(() => {
  if (props.type === 'select' && props.options) {
    const option = props.options.find(o => o.value === props.modelValue)
    return option?.label || props.modelValue
  }
  return props.modelValue
})
</script>

<template>
  <div class="relative">
    <!-- View Mode -->
    <div
      v-if="!isEditing"
      class="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
      @click="startEdit"
    >
      <!-- Toggle Display -->
      <template v-if="type === 'toggle'">
        <USwitch
          :model-value="modelValue as boolean"
          :disabled="disabled"
          size="sm"
        />
      </template>
      
      <!-- Text Display -->
      <template v-else>
        <span 
          class="text-es-text-primary dark:text-es-text-primary-dark"
          :class="{ 'italic text-es-text-tertiary': !modelValue }"
        >
          {{ displayValue || placeholder || 'Click to edit' }}
        </span>
      </template>
      
      <UIcon 
        name="i-lucide-pencil" 
        class="h-3.5 w-3.5 opacity-0 text-es-text-tertiary transition-opacity group-hover:opacity-100 dark:text-es-text-tertiary-dark"
      />
    </div>

    <!-- Edit Mode -->
    <div
      v-else
      class="flex flex-col gap-1"
    >
      <div class="flex items-center gap-2">
        <!-- Text Input -->
        <input
          v-if="type === 'text'"
          ref="inputRef"
          v-model="editValue"
          type="text"
          class="w-full rounded-lg border border-es-border bg-es-bg-primary px-2 py-1 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          :placeholder="placeholder"
          @keydown="handleKeydown"
          @blur="handleBlur"
        >

        <!-- Textarea -->
        <textarea
          v-else-if="type === 'textarea'"
          ref="inputRef"
          v-model="textValue"
          rows="3"
          class="w-full rounded-lg border border-es-border bg-es-bg-primary px-2 py-1 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          :placeholder="placeholder"
          @keydown="handleKeydown"
        />

        <!-- Select -->
        <select
          v-else-if="type === 'select'"
          ref="inputRef"
          v-model="editValue"
          class="w-full rounded-lg border border-es-border bg-es-bg-primary px-2 py-1 text-sm text-es-text-primary focus:border-es-accent-primary focus:outline-none focus:ring-1 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          @keydown="handleKeydown"
          @blur="handleBlur"
        >
          <option 
            v-for="option in options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1">
          <button
            class="rounded-md p-1 text-es-success hover:bg-es-success/10"
            :disabled="loading"
            @click="save"
          >
            <UIcon name="i-lucide-check" class="h-4 w-4" />
          </button>
          <button
            class="rounded-md p-1 text-es-error hover:bg-es-error/10"
            :disabled="loading"
            @click="cancel"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <p
        v-if="error"
        class="text-xs text-es-error"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>
