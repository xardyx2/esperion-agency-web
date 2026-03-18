<script setup lang="ts">
/**
 * ContentEditor - Main content editor container with Gutenberg-style layout
 */

import { useAutoSave } from '../../composables/useAutoSave'

export interface EditorContent {
  id: string
  en: string
}

export type ViewMode = 'single' | 'split'

interface Props {
  content: EditorContent
  title?: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:content': [content: EditorContent]
  'update:title': [title: string]
  save: [content: EditorContent]
  'auto-save': [content: EditorContent]
}>()

const localePath = useLocalePath()

const viewMode = ref<ViewMode>('single')
const activeLanguage = ref<'id' | 'en'>('id')
const isSidebarOpen = ref(true)

// Word count
const wordCount = computed(() => {
  const text = `${props.content.id} ${props.content.en}`
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
})

// Reading time estimation
const readingTime = computed(() => {
  const minutes = Math.ceil(wordCount.value / 200)
  return minutes
})

// Auto-save
const { lastSaved, isSaving, triggerAutoSave } = useAutoSave(
  () => props.content,
  (content: EditorContent) => emit('auto-save', content)
)

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + 1: Single view
  if ((e.ctrlKey || e.metaKey) && e.key === '1') {
    e.preventDefault()
    viewMode.value = 'single'
  }
  // Ctrl/Cmd + 2: Split view
  if ((e.ctrlKey || e.metaKey) && e.key === '2') {
    e.preventDefault()
    viewMode.value = 'split'
  }
  // Ctrl/Cmd + Tab: Switch language
  if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
    e.preventDefault()
    activeLanguage.value = activeLanguage.value === 'id' ? 'en' : 'id'
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Sticky Toolbar -->
    <header class="sticky top-0 z-20 border-b border-es-border bg-es-bg-primary/95 backdrop-blur dark:border-es-border-dark dark:bg-es-bg-primary-dark/95">
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <!-- Left: Back & Title -->
        <div class="flex items-center gap-4">
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-full"
            :to="localePath('/dashboard/articles')"
          >
            <UIcon name="i-lucide-arrow-left" class="h-4 w-4 mr-1" />
            Back
          </UButton>
          
          <div class="h-6 w-px bg-es-border dark:bg-es-border-dark" />
          
          <input
            :value="title"
            type="text"
            placeholder="Article Title"
            class="min-w-[200px] bg-transparent text-lg font-semibold text-es-text-primary outline-none placeholder-es-text-tertiary dark:text-es-text-primary-dark dark:placeholder-es-text-tertiary-dark"
            @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
          >
        </div>

        <!-- Center: View Mode Toggle -->
        <div class="hidden items-center gap-2 rounded-full border border-es-border bg-es-bg-secondary p-1 dark:border-es-border-dark dark:bg-es-bg-secondary-dark md:flex">
          <UButton
            color="neutral"
            :variant="viewMode === 'single' ? 'solid' : 'ghost'"
            size="sm"
            class="rounded-full"
            @click="viewMode = 'single'"
          >
            <UIcon name="i-lucide-square" class="h-4 w-4 mr-1" />
            Single
          </UButton>
          <UButton
            color="neutral"
            :variant="viewMode === 'split' ? 'solid' : 'ghost'"
            size="sm"
            class="rounded-full"
            @click="viewMode = 'split'"
          >
            <UIcon name="i-lucide-columns" class="h-4 w-4 mr-1" />
            Split
          </UButton>
        </div>

        <!-- Right: Status & Actions -->
        <div class="flex items-center gap-2">
          <!-- Save Status -->
          <div class="flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            <UIcon 
              :name="isSaving ? 'i-lucide-loader-2' : lastSaved ? 'i-lucide-check' : 'i-lucide-circle'" 
              class="h-4 w-4"
              :class="{ 'animate-spin': isSaving }"
            />
            <span v-if="isSaving">Saving...</span>
            <span v-else-if="lastSaved">{{ lastSaved }}</span>
            <span v-else>Draft</span>
          </div>

          <div class="h-6 w-px bg-es-border dark:bg-es-border-dark" />

          <!-- Word Count -->
          <div class="hidden text-sm text-es-text-secondary dark:text-es-text-secondary-dark sm:block">
            {{ wordCount }} words
            <span class="text-es-text-tertiary">({{ readingTime }} min read)</span>
          </div>

          <div class="h-6 w-px bg-es-border dark:bg-es-border-dark" />

          <!-- Actions -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full"
          >
            <UIcon name="i-lucide-eye" class="h-4 w-4 mr-1" />
            Preview
          </UButton>
          
          <UButton
            color="primary"
            size="sm"
            class="rounded-full"
            :loading="loading"
            @click="triggerAutoSave(); $emit('save', content)"
          >
            <UIcon name="i-lucide-save" class="h-4 w-4 mr-1" />
            Publish
          </UButton>

          <!-- Sidebar Toggle -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full lg:hidden"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <UIcon name="i-lucide-panel-right" class="h-4 w-4" />
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Editor Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Editor -->
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-4xl p-4 md:p-8">
          <!-- Split View -->
          <template v-if="viewMode === 'split'">
            <div class="grid gap-4 md:grid-cols-2">
              <!-- Indonesian Content -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
                  <span class="rounded bg-es-accent-primary/10 px-2 py-1 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">ID</span>
                  Indonesian
                </div>
                <slot name="editor-id" :content="content.id" @update:content="(val: string) => $emit('update:content', { ...content, id: val })" />
              </div>

              <!-- English Content -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
                  <span class="rounded bg-es-accent-primary/10 px-2 py-1 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">EN</span>
                  English
                </div>
                <slot name="editor-en" :content="content.en" @update:content="(val: string) => $emit('update:content', { ...content, en: val })" />
              </div>
            </div>
          </template>

          <!-- Single View -->
          <template v-else>
            <!-- Language Tabs -->
            <div class="mb-4 flex gap-2">
              <UButton
                color="neutral"
                :variant="activeLanguage === 'id' ? 'solid' : 'ghost'"
                size="sm"
                class="rounded-full"
                @click="activeLanguage = 'id'"
              >
                <span class="mr-1 rounded bg-white/20 px-1.5 py-0.5 text-xs">ID</span>
                Indonesian
              </UButton>
              <UButton
                color="neutral"
                :variant="activeLanguage === 'en' ? 'solid' : 'ghost'"
                size="sm"
                class="rounded-full"
                @click="activeLanguage = 'en'"
              >
                <span class="mr-1 rounded bg-white/20 px-1.5 py-0.5 text-xs">EN</span>
                English
              </UButton>
            </div>

            <!-- Editor Content -->
            <slot 
              name="editor" 
              :language="activeLanguage"
              :content="activeLanguage === 'id' ? content.id : content.en"
              @update:content="(val: string) => $emit('update:content', { 
                ...content, 
                [activeLanguage]: val 
              })"
            />
          </template>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside 
        class="w-80 border-l border-es-border bg-es-bg-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark lg:block"
        :class="{ 'hidden': !isSidebarOpen }"
      >
        <div class="h-full overflow-y-auto p-4">
          <slot name="sidebar" />
        </div>
      </aside>
    </div>
  </div>
</template>
