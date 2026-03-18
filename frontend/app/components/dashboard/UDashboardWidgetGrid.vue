<script setup lang="ts">
/**
 * UDashboardWidgetGrid - Drag-and-drop widget grid for dashboard customization
 * 
 * Features:
 * - 12-column responsive grid
 * - Drag handles for reordering
 * - Resize handles with min/max constraints
 * - Persistent layout
 * 
 * @usage
 * ```vue
 * <UDashboardWidgetGrid
 *   v-model:layout="widgetLayout"
 *   :widgets="availableWidgets"
 *   :edit-mode="isEditing"
 * />
 * ```
 */

import { ref, computed } from 'vue'

export interface WidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
}

export interface WidgetDefinition {
  id: string
  name: string
  icon: string
  description: string
  defaultSize: { w: number; h: number }
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
  component: any
}

interface Props {
  layout: WidgetLayout[]
  widgets: WidgetDefinition[]
  editMode?: boolean
  rowHeight?: number
  margin?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  rowHeight: 100,
  margin: () => [16, 16]
})

const emit = defineEmits<{
  'update:layout': [layout: WidgetLayout[]]
}>()

// Grid configuration
const cols = 12
const containerWidth = ref(1200)

// Calculate grid cell width
const cellWidth = computed(() => {
  const [marginX] = props.margin
  return (containerWidth.value - (cols - 1) * marginX) / cols
})

// Drag state
const draggingItem = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const dragPosition = ref({ x: 0, y: 0 })

// Resize state
const resizingItem = ref<string | null>(null)
const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0 })

// Get widget by ID
const getWidget = (id: string) => props.widgets.find(w => w.id === id)

// Convert layout item to pixel position
const getItemStyle = (item: WidgetLayout) => {
  const [marginX, marginY] = props.margin
  const width = item.w * cellWidth.value + (item.w - 1) * marginX
  const height = item.h * props.rowHeight + (item.h - 1) * marginY
  const left = item.x * cellWidth.value + item.x * marginX
  const top = item.y * props.rowHeight + item.y * marginY

  return {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`
  }
}

// Drag handlers
const startDrag = (e: MouseEvent, item: WidgetLayout) => {
  if (!props.editMode || item.static) return
  
  draggingItem.value = item.i
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  dragPosition.value = {
    x: parseInt(getItemStyle(item).left),
    y: parseInt(getItemStyle(item).top)
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!draggingItem.value) return

  const container = document.querySelector('[data-widget-grid]')
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  dragPosition.value = {
    x: e.clientX - containerRect.left - dragOffset.value.x,
    y: e.clientY - containerRect.top - dragOffset.value.y
  }
}

const stopDrag = () => {
  if (!draggingItem.value) return

  // Calculate new grid position
  const [marginX, marginY] = props.margin
  const item = props.layout.find(l => l.i === draggingItem.value)
  if (item) {
    const newX = Math.round(dragPosition.value.x / (cellWidth.value + marginX))
    const newY = Math.round(dragPosition.value.y / (props.rowHeight + marginY))
    
    // Ensure within bounds
    item.x = Math.max(0, Math.min(newX, cols - item.w))
    item.y = Math.max(0, newY)

    emit('update:layout', [...props.layout])
  }

  draggingItem.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Resize handlers
const startResize = (e: MouseEvent, item: WidgetLayout) => {
  if (!props.editMode) return
  
  e.stopPropagation()
  resizingItem.value = item.i
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: item.w,
    h: item.h
  }

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

const onResize = (e: MouseEvent) => {
  if (!resizingItem.value) return

  const item = props.layout.find(l => l.i === resizingItem.value)
  if (!item) return

  const [marginX, marginY] = props.margin
  const deltaX = e.clientX - resizeStart.value.x
  const deltaY = e.clientY - resizeStart.value.y

  const newW = Math.round(deltaX / (cellWidth.value + marginX)) + resizeStart.value.w
  const newH = Math.round(deltaY / (props.rowHeight + marginY)) + resizeStart.value.h

  // Apply min/max constraints
  item.w = Math.max(
    item.minW || 1,
    Math.min(newW, item.maxW || cols - item.x)
  )
  item.h = Math.max(
    item.minH || 1,
    Math.min(newH, item.maxH || 10)
  )
}

const stopResize = () => {
  if (resizingItem.value) {
    emit('update:layout', [...props.layout])
  }
  resizingItem.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

// Remove widget
const removeWidget = (widgetId: string) => {
  const newLayout = props.layout.filter(l => l.i !== widgetId)
  emit('update:layout', newLayout)
}
</script>

<template>
  <div
    ref="containerRef"
    data-widget-grid
    class="relative min-h-[600px]"
    :style="{ margin: `-${margin[1]}px -${margin[0]}px` }"
  >
    <!-- Grid Background (edit mode) -->
    <div
      v-if="editMode"
      class="pointer-events-none absolute inset-0"
      :style="{
        backgroundImage: `
          linear-gradient(to right, var(--es-border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--es-border) 1px, transparent 1px)
        `,
        backgroundSize: `${cellWidth + margin[0]}px ${rowHeight + margin[1]}px`
      }"
    />

    <!-- Widgets -->
    <div
      v-for="item in layout"
      :key="item.i"
      class="absolute transition-shadow"
      :class="{
        'z-50 shadow-2xl': draggingItem === item.i || resizingItem === item.i,
        'cursor-move': editMode && !item.static,
        'ring-2 ring-es-accent-primary': editMode
      }"
      :style="getItemStyle(item)"
      @mousedown="startDrag($event, item)"
    >
      <UCard
        :ui="{
          root: 'h-full rounded-2xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-4 py-3 dark:border-es-border-dark/70',
          body: 'p-4 overflow-auto'
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- Drag Handle -->
              <button
                v-if="editMode"
                class="cursor-grab text-es-text-tertiary hover:text-es-text-secondary dark:text-es-text-tertiary-dark dark:hover:text-es-text-secondary-dark"
                :class="{ 'cursor-grabbing': draggingItem === item.i }"
              >
                <UIcon name="i-lucide-grip-vertical" class="h-4 w-4" />
              </button>
              
              <span class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                {{ getWidget(item.i)?.name }}
              </span>
            </div>

            <div class="flex items-center gap-1">
              <!-- Remove Button (edit mode) -->
              <button
                v-if="editMode"
                class="rounded p-1 text-es-text-tertiary hover:bg-red-100 hover:text-red-600 dark:text-es-text-tertiary-dark dark:hover:bg-red-900/30 dark:hover:text-red-400"
                @click="removeWidget(item.i)"
              >
                <UIcon name="i-lucide-x" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </template>

        <!-- Widget Content -->
        <component
          :is="getWidget(item.i)?.component"
          v-if="getWidget(item.i)?.component"
        />
        <div
          v-else
          class="flex h-full items-center justify-center text-sm text-es-text-tertiary dark:text-es-text-tertiary-dark"
        >
          Widget not found
        </div>

        <!-- Resize Handle (edit mode) -->
        <div
          v-if="editMode"
          class="absolute bottom-1 right-1 cursor-se-resize rounded bg-es-accent-primary p-1 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
          :class="{ 'opacity-100': resizingItem === item.i }"
          @mousedown="startResize($event, item)"
        >
          <UIcon name="i-lucide-maximize-2" class="h-3 w-3" />
        </div>
      </UCard>
    </div>
  </div>
</template>
