<script setup lang="ts">
/**
 * USlideOutDrawer - Slide-out drawer for medium-complexity forms
 * 
 * @usage
 * ```vue
 * <USlideOutDrawer
 *   v-model="isOpen"
 *   title="Edit Article"
 *   size="md"
 *   :show-footer="true"
 *   @close="handleClose"
 * >
 *   <template #default>
 *     <!-- Form content here -->
 *   </template>
 *   <template #footer>
 *     <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
 *     <UButton color="primary" @click="handleSubmit">Save</UButton>
 *   </template>
 * </USlideOutDrawer>
 * ```
 */

import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export type DrawerSize = 'sm' | 'md' | 'lg'

interface Props {
  modelValue: boolean
  title: string
  size?: DrawerSize
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showFooter: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Drawer size mapping
const sizeMap: Record<DrawerSize, string> = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[600px]',
  lg: 'sm:max-w-[800px]'
}

const drawerSizeClass = computed(() => sizeMap[props.size])

// Drawer element reference
const drawerRef = ref<HTMLElement | null>(null)

// Store previously focused element for focus restoration
let previouslyFocusedElement: HTMLElement | null = null

// Focusable elements selector
const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

// Get all focusable elements in drawer
const getFocusableElements = (): HTMLElement[] => {
  if (!drawerRef.value) return []
  return Array.from(drawerRef.value.querySelectorAll(FOCUSABLE_SELECTORS))
}

// Focus first element in drawer
const focusFirstElement = () => {
  const focusableElements = getFocusableElements()
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  } else {
    // Fallback: focus the drawer itself
    drawerRef.value?.focus()
  }
}

// Focus last element in drawer
const focusLastElement = () => {
  const focusableElements = getFocusableElements()
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus()
  }
}

// Handle tab key for focus trap
const handleTabKey = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' || !drawerRef.value) return

  const focusableElements = getFocusableElements()
  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Shift + Tab
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
  }
  // Tab
  else {
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
}

// Activate focus trap when drawer opens
watch(isOpen, async (newValue) => {
  if (newValue) {
    // Store previously focused element
    previouslyFocusedElement = document.activeElement as HTMLElement
    
    await nextTick()
    
    // Focus first element in drawer
    focusFirstElement()
  } else {
    // Restore focus to previously focused element
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus()
      previouslyFocusedElement = null
    }
  }
}, { immediate: false })

// Handle keyboard events
const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeDrawer()
  }
  
  // Handle focus trap
  handleTabKey(e)
}

// Close drawer
const closeDrawer = () => {
  isOpen.value = false
  emit('close')
}

// Handle backdrop click
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeDrawer()
  }
}

// Setup keyboard listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // Restore focus if drawer is unmounted while open
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Backdrop Overlay -->
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <!-- Drawer Panel -->
        <Transition
          enter-active-class="transform transition ease-out duration-300"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <aside
            ref="drawerRef"
            :class="[
              'fixed right-0 top-0 h-full w-full bg-es-bg-primary shadow-2xl outline-none dark:bg-es-bg-primary-dark',
              'sm:max-w-full',
              drawerSizeClass
            ]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabindex="-1"
          >
            <div class="flex h-full flex-col">
              <!-- Header -->
              <header
                class="flex items-center justify-between border-b border-es-border px-6 py-4 dark:border-es-border-dark"
              >
                <h2
                  id="drawer-title"
                  class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark"
                >
                  {{ title }}
                </h2>
                <button
                  type="button"
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-es-text-tertiary transition-colors hover:bg-es-bg-tertiary hover:text-es-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-es-accent-primary dark:hover:bg-es-bg-tertiary-dark dark:hover:text-es-text-primary-dark dark:focus-visible:outline-es-accent-primary-dark"
                  aria-label="Close drawer"
                  @click="closeDrawer"
                >
                  <UIcon name="i-lucide-x" class="h-5 w-5" />
                </button>
              </header>

              <!-- Body Content -->
              <main class="flex-1 overflow-y-auto px-6 py-4">
                <slot />
              </main>

              <!-- Footer -->
              <footer
                v-if="showFooter"
                class="flex items-center justify-end gap-3 border-t border-es-border bg-es-bg-secondary px-6 py-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
              >
                <slot name="footer" />
              </footer>
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
