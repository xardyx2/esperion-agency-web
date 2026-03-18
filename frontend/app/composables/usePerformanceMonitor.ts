/**
 * usePerformanceMonitor - Composable for tracking performance metrics
 * 
 * Tracks:
 * - Page load time (from navigation start to current)
 * - Component render time (custom markers)
 * - Logs to console in development
 * - Sends to analytics in production
 * 
 * @usage
 * ```vue
 * <script setup>
 * const { startTimer, endTimer, pageLoadTime, mark } = usePerformanceMonitor()
 * 
 * // Track component render
 * const renderTimer = startTimer('ComponentRender')
 * onMounted(() => {
 *   endTimer(renderTimer)
 * })
 * 
 * // Add custom mark
 * mark('DataLoaded')
 * </script>
 * ```
 */

export interface PerformanceMark {
  name: string
  startTime: number
  duration?: number
}

export interface PerformanceMetrics {
  pageLoadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  customMarks: PerformanceMark[]
  componentRenders: Record<string, number>
}

export interface UsePerformanceMonitorOptions {
  enableLogging?: boolean
  analyticsEndpoint?: string
  sampleRate?: number
}

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions = {}) => {
  const {
    enableLogging = import.meta.dev,
    analyticsEndpoint,
    sampleRate = 1.0
  } = options

  const pageLoadStart = ref<number>(0)
  const pageLoadTime = ref<number>(0)
  const domContentLoaded = ref<number>(0)
  const firstContentfulPaint = ref<number>(0)
  const customMarks = ref<PerformanceMark[]>([])
  const componentRenders = ref<Record<string, number>>({})
  const timers = ref<Map<string, number>>(new Map())

  // Check if we should send to analytics
  const shouldSendToAnalytics = () => {
    if (!analyticsEndpoint) return false
    if (import.meta.dev) return false
    return Math.random() < sampleRate
  }

  // Log to console in development
  const log = (message: string, data?: any) => {
    if (enableLogging && import.meta.dev) {
      console.log(`[PerformanceMonitor] ${message}`, data || '')
    }
  }

  // Send metrics to analytics endpoint
  const sendToAnalytics = async (metrics: Partial<PerformanceMetrics>) => {
    if (!shouldSendToAnalytics()) return

    try {
      await fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          url: window.location.href,
          ...metrics
        })
      })
      log('Sent to analytics', metrics)
    } catch (error) {
      console.error('[PerformanceMonitor] Failed to send analytics:', error)
    }
  }

  // Initialize page load tracking
  const initPageLoadTracking = () => {
    if (typeof window === 'undefined') return

    // Get navigation timing
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigationEntry) {
      pageLoadStart.value = navigationEntry.startTime
      domContentLoaded.value = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime
      firstContentfulPaint.value = navigationEntry.domInteractive - navigationEntry.startTime
      pageLoadTime.value = navigationEntry.loadEventEnd - navigationEntry.startTime
    }

    // Fallback: use performance.now() if navigation timing not available
    if (!navigationEntry) {
      pageLoadStart.value = 0
      const timing = performance.timing as any
      if (timing.navigationStart) {
        pageLoadTime.value = performance.now()
      }
    }

    log('Page load initialized', {
      pageLoadTime: pageLoadTime.value,
      domContentLoaded: domContentLoaded.value,
      firstContentfulPaint: firstContentfulPaint.value
    })

    // Send initial page load metrics
    sendToAnalytics({
      pageLoadTime: pageLoadTime.value,
      domContentLoaded: domContentLoaded.value,
      firstContentfulPaint: firstContentfulPaint.value
    })
  }

  // Start a timer for component render or custom operation
  const startTimer = (name: string): string => {
    const timerId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    timers.value.set(timerId, performance.now())
    log(`Timer started: ${timerId}`)
    return timerId
  }

  // End a timer and record duration
  const endTimer = (timerId: string): number => {
    const startTime = timers.value.get(timerId)
    if (startTime === undefined) {
      console.warn(`[PerformanceMonitor] Timer not found: ${timerId}`)
      return 0
    }

    const duration = performance.now() - startTime
    timers.value.delete(timerId)

    // Extract base name from timerId
    const name = timerId.split('_').slice(0, -2).join('_')
    
    // Store component render time
    componentRenders.value[name] = (componentRenders.value[name] || 0) + duration

    log(`Timer ended: ${timerId}`, { duration: `${duration.toFixed(2)}ms` })
    
    // Send to analytics for significant operations (>100ms)
    if (duration > 100) {
      sendToAnalytics({
        componentRenders: { [name]: duration }
      })
    }

    return duration
  }

  // Add a custom performance mark
  const mark = (name: string) => {
    const markEntry = performance.now()
    const markData: PerformanceMark = {
      name,
      startTime: markEntry
    }
    customMarks.value.push(markData)

    // Also create a browser performance mark
    try {
      performance.mark(`esperion_${name}`)
    } catch {
      // Mark already exists
    }

    log(`Mark added: ${name}`, { startTime: `${markEntry.toFixed(2)}ms` })

    sendToAnalytics({
      customMarks: [markData]
    })
  }

  // Measure between two marks
  const measure = (name: string, startMark: string, endMark: string) => {
    try {
      performance.measure(`esperion_${name}`, `esperion_${startMark}`, `esperion_${endMark}`)
      const measures = performance.getEntriesByName(`esperion_${name}`)
      if (measures.length > 0) {
        const measureData = measures[0] as PerformanceMeasure
        log(`Measure: ${name}`, { duration: `${measureData.duration.toFixed(2)}ms` })
        return measureData.duration
      }
    } catch (error) {
      console.warn(`[PerformanceMonitor] Measure failed: ${name}`, error)
    }
    return 0
  }

  // Get all metrics
  const getMetrics = (): PerformanceMetrics => ({
    pageLoadTime: pageLoadTime.value,
    domContentLoaded: domContentLoaded.value,
    firstContentfulPaint: firstContentfulPaint.value,
    customMarks: customMarks.value,
    componentRenders: { ...componentRenders.value }
  })

  // Clear all metrics
  const clearMetrics = () => {
    customMarks.value = []
    componentRenders.value = {}
    timers.value.clear()
    log('Metrics cleared')
  }

  // Initialize on mount
  onMounted(() => {
    initPageLoadTracking()
  })

  return {
    pageLoadTime: readonly(pageLoadTime),
    domContentLoaded: readonly(domContentLoaded),
    firstContentfulPaint: readonly(firstContentfulPaint),
    customMarks: readonly(customMarks),
    componentRenders: readonly(componentRenders),
    startTimer,
    endTimer,
    mark,
    measure,
    getMetrics,
    clearMetrics,
    sendToAnalytics
  }
}

export default usePerformanceMonitor
