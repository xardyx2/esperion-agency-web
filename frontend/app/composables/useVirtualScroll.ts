/**
 * useVirtualScroll - Composable for virtual scrolling of large lists
 * 
 * Optimizes rendering of large lists (100+ items) by only rendering
 * visible items plus a buffer zone for smooth scrolling.
 * 
 * @usage
 * ```vue
 * <script setup>
 * const { visibleItems, containerRef, scrollHandler, totalHeight } = useVirtualScroll({
 *   items: largeList,
 *   itemHeight: 60,
 *   bufferSize: 5
 * })
 * </script>
 * 
 * <template>
 *   <div ref="containerRef" @scroll="scrollHandler" class="h-96 overflow-auto">
 *     <div :style="{ height: totalHeight + 'px' }" class="relative">
 *       <div
 *         v-for="item in visibleItems"
 *         :key="item.id"
 *         :style="{ transform: `translateY(${item.offsetTop}px)` }"
 *         class="absolute inset-x-0"
 *       >
 *         <!-- Render item -->
 *       </div>
 *     </div>
 *   </div>
 * </template>
 * ```
 */

export interface VirtualScrollOptions<T> {
  items: T[]
  itemHeight: number
  bufferSize?: number
}

export interface VirtualScrollItem<T> {
  item: T
  index: number
  offsetTop: number
}

export interface VirtualScrollReturn<T> {
  visibleItems: VirtualScrollItem<T>[]
  containerRef: Ref<HTMLElement | null>
  scrollHandler: (event: Event) => void
  totalHeight: number
  startIndex: number
  endIndex: number
  scrollToIndex: (index: number) => void
  refresh: () => void
}

export const useVirtualScroll = <T>(options: VirtualScrollOptions<T>): VirtualScrollReturn<T> => {
  const {
    items,
    itemHeight,
    bufferSize = 5
  } = options

  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const containerHeight = ref(0)
  const startIndex = ref(0)
  const endIndex = ref(0)

  // Calculate total height
  const totalHeight = computed(() => items.length * itemHeight)

  // Calculate visible range
  const calculateVisibleRange = () => {
    const container = containerRef.value
    if (!container) return

    scrollTop.value = container.scrollTop
    containerHeight.value = container.clientHeight

    const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize)
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + bufferSize
    )

    startIndex.value = start
    endIndex.value = end
  }

  // Scroll handler
  const scrollHandler = (event: Event) => {
    calculateVisibleRange()
  }

  // Get visible items with position info
  const visibleItems = computed<VirtualScrollItem<T>[]>(() => {
    const result: VirtualScrollItem<T>[] = []
    
    for (let i = startIndex.value; i < endIndex.value; i++) {
      if (i >= 0 && i < items.length) {
        result.push({
          item: items[i],
          index: i,
          offsetTop: i * itemHeight
        })
      }
    }

    return result
  })

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    const container = containerRef.value
    if (!container || index < 0 || index >= items.length) return

    const targetScrollTop = index * itemHeight
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    })
  }

  // Refresh visible range (call after items change)
  const refresh = () => {
    calculateVisibleRange()
  }

  // Initialize on mount
  onMounted(() => {
    calculateVisibleRange()
  })

  // Watch for items changes
  watch(() => items.length, () => {
    refresh()
  })

  return {
    visibleItems,
    containerRef,
    scrollHandler,
    totalHeight: totalHeight.value,
    startIndex: readonly(startIndex),
    endIndex: readonly(endIndex),
    scrollToIndex,
    refresh
  }
}

export default useVirtualScroll
