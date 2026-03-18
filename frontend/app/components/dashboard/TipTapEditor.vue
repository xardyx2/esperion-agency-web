<script setup lang="ts">
/**
 * TipTapEditor - Rich text editor wrapper using TipTap
 * 
 * NOTE: This component requires TipTap dependencies to be installed:
 *   npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
 * 
 * Add to nuxt.config.ts:
 *   vite: {
 *     optimizeDeps: {
 *       include: ['prosemirror-state', 'prosemirror-view', 'prosemirror-model', 'prosemirror-transform']
 *     }
 *   }
 * 
 * @usage
 * ```vue
 * <TipTapEditor
 *   v-model="content"
 *   placeholder="Start writing..."
 *   @update="handleUpdate"
 * />
 * ```
 */

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  update: [content: string]
}>()

// For now, use a simple textarea as fallback
// Once TipTap is installed, replace with actual TipTap implementation

const content = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('update', value)
  }
})

const characterCount = computed(() => props.modelValue.length)
const wordCount = computed(() => props.modelValue.trim().split(/\s+/).filter(w => w.length > 0).length)

// Basic formatting functions (to be replaced with TipTap commands)
const insertBold = () => {
  // Placeholder - will be replaced with TipTap implementation
  console.log('Bold formatting - install TipTap to enable')
}

const insertItalic = () => {
  console.log('Italic formatting - install TipTap to enable')
}

const insertHeading = (level: number) => {
  console.log(`Heading ${level} - install TipTap to enable`)
}

const insertLink = () => {
  console.log('Link insertion - install TipTap to enable')
}

const insertImage = () => {
  console.log('Image insertion - install TipTap to enable')
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + B: Bold
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault()
    insertBold()
  }
  // Ctrl/Cmd + I: Italic
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault()
    insertItalic()
  }
  // Ctrl/Cmd + K: Link
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    insertLink()
  }
}
</script>

<template>
  <div class="flex flex-col rounded-xl border border-es-border bg-es-bg-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 border-b border-es-border px-3 py-2 dark:border-es-border-dark">
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded"
        title="Bold (Ctrl+B)"
        @click="insertBold"
      >
        <UIcon name="i-lucide-bold" class="h-4 w-4" />
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded"
        title="Italic (Ctrl+I)"
        @click="insertItalic"
      >
        <UIcon name="i-lucide-italic" class="h-4 w-4" />
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded"
        title="Heading"
        @click="insertHeading(2)"
      >
        <UIcon name="i-lucide-heading" class="h-4 w-4" />
      </UButton>
      <div class="h-5 w-px bg-es-border dark:bg-es-border-dark" />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded"
        title="Link (Ctrl+K)"
        @click="insertLink"
      >
        <UIcon name="i-lucide-link" class="h-4 w-4" />
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded"
        title="Image"
        @click="insertImage"
      >
        <UIcon name="i-lucide-image" class="h-4 w-4" />
      </UButton>
    </div>
    
    <!-- Editor Content -->
    <div class="relative">
      <textarea
        v-model="content"
        :placeholder="placeholder"
        :disabled="disabled"
        class="min-h-[300px] w-full resize-y bg-transparent px-4 py-3 text-sm text-es-text-primary outline-none placeholder:text-es-text-tertiary dark:text-es-text-primary-dark dark:placeholder:text-es-text-tertiary-dark"
        @keydown="handleKeydown"
      />
    </div>
    
    <!-- Status Bar -->
    <div class="flex items-center justify-between border-t border-es-border px-4 py-2 text-xs text-es-text-secondary dark:border-es-border-dark dark:text-es-text-secondary-dark">
      <div class="flex items-center gap-3">
        <span>{{ wordCount }} words</span>
        <span>{{ characterCount }} characters</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-info" class="h-3 w-3" />
        <span>TipTap editor coming soon</span>
      </div>
    </div>
  </div>
</template>
