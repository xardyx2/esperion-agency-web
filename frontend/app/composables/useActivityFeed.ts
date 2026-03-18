/**
 * useActivityFeed - Composable for real-time activity feed
 * 
 * Supports WebSocket, SSE, or polling for real-time updates
 * 
 * @usage
 * ```vue
 * const { 
 *   activities, 
 *   loading, 
 *   hasMore,
 *   loadMore,
 *   sendActivity 
 * } = useActivityFeed({
 *   transport: 'sse', // 'websocket' | 'sse' | 'polling'
 *   endpoint: '/api/v1/activity'
 * })
 * ```
 */

export interface ActivityUser {
  id: string
  name: string
  avatar?: string
}

export interface ActivityTarget {
  id: string
  name: string
  link?: string
  type: string
}

export interface ActivityEvent {
  id: string
  type: string
  action: string
  user: ActivityUser
  target?: ActivityTarget
  metadata?: Record<string, any>
  timestamp: string
}

export type ActivityTransport = 'websocket' | 'sse' | 'polling'

export interface UseActivityFeedOptions {
  transport?: ActivityTransport
  endpoint: string
  pollInterval?: number
  autoConnect?: boolean
  filter?: string
}

export const useActivityFeed = (options: UseActivityFeedOptions) => {
  const {
    transport = 'sse',
    endpoint,
    pollInterval = 30000,
    autoConnect = true,
    filter = 'all'
  } = options

  const activities = ref<ActivityEvent[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)
  const perPage = 20
  const totalCount = ref(0)

  // Connection state
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  // WebSocket/SSE connection
  let connection: WebSocket | EventSource | null = null
  let pollTimer: ReturnType<typeof setInterval> | null = null

  // Sample activities for demo (remove in production)
  const sampleActivities: ActivityEvent[] = [
    {
      id: '1',
      type: 'article.created',
      action: 'created a new article',
      user: { id: '1', name: 'John Doe', avatar: '' },
      target: { id: '1', name: 'Getting Started Guide', type: 'article', link: '/dashboard/articles/1' },
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 min ago
    },
    {
      id: '2',
      type: 'article.published',
      action: 'published',
      user: { id: '2', name: 'Jane Smith', avatar: '' },
      target: { id: '2', name: 'Web Development Trends 2024', type: 'article', link: '/dashboard/articles/2' },
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 min ago
    },
    {
      id: '3',
      type: 'work.updated',
      action: 'updated',
      user: { id: '1', name: 'John Doe', avatar: '' },
      target: { id: '1', name: 'E-commerce Platform', type: 'work', link: '/dashboard/works/1' },
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
    },
    {
      id: '4',
      type: 'user.login',
      action: 'logged in',
      user: { id: '3', name: 'Admin User', avatar: '' },
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 min ago
    },
    {
      id: '5',
      type: 'media.uploaded',
      action: 'uploaded',
      user: { id: '2', name: 'Jane Smith', avatar: '' },
      target: { id: '1', name: 'hero-banner.jpg', type: 'media' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
    },
    {
      id: '6',
      type: 'settings.changed',
      action: 'updated settings',
      user: { id: '1', name: 'John Doe', avatar: '' },
      metadata: { setting: 'analytics_enabled' },
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() // 1.5 hours ago
    }
  ]

  // Initialize connection
  const connect = () => {
    if (typeof window === 'undefined') return

    connectionError.value = null

    switch (transport) {
      case 'websocket':
        connectWebSocket()
        break
      case 'sse':
        connectSSE()
        break
      case 'polling':
        startPolling()
        break
    }
  }

  const connectWebSocket = () => {
    try {
      const wsUrl = endpoint.replace(/^http/, 'ws')
      connection = new WebSocket(wsUrl)

      connection.onopen = () => {
        isConnected.value = true
        connectionError.value = null
      }

      connection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'activity') {
            activities.value.unshift(data.activity)
            // Keep only last 100 activities
            if (activities.value.length > 100) {
              activities.value = activities.value.slice(0, 100)
            }
          }
        } catch {
          console.error('Failed to parse WebSocket message')
        }
      }

      connection.onerror = () => {
        connectionError.value = 'WebSocket connection error'
        isConnected.value = false
      }

      connection.onclose = () => {
        isConnected.value = false
        // Retry connection after 5 seconds
        setTimeout(connect, 5000)
      }
    } catch (err) {
      connectionError.value = 'Failed to connect WebSocket'
      console.error('WebSocket error:', err)
    }
  }

  const connectSSE = () => {
    try {
      connection = new EventSource(`${endpoint}/stream`)

      connection.onopen = () => {
        isConnected.value = true
        connectionError.value = null
      }

      connection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          activities.value.unshift(data)
          if (activities.value.length > 100) {
            activities.value = activities.value.slice(0, 100)
          }
        } catch {
          console.error('Failed to parse SSE message')
        }
      }

      connection.onerror = () => {
        connectionError.value = 'SSE connection error'
        isConnected.value = false
        connection?.close()
        // Retry after 5 seconds
        setTimeout(connect, 5000)
      }
    } catch (err) {
      connectionError.value = 'Failed to connect SSE'
      console.error('SSE error:', err)
    }
  }

  const startPolling = () => {
    const poll = async () => {
      try {
        const response = await fetch(`${endpoint}?since=${Date.now() - pollInterval}`)
        if (response.ok) {
          const data = await response.json()
          if (data.activities?.length) {
            activities.value.unshift(...data.activities)
            if (activities.value.length > 100) {
              activities.value = activities.value.slice(0, 100)
            }
          }
          isConnected.value = true
          connectionError.value = null
        }
      } catch (err) {
        connectionError.value = 'Polling error'
        console.error('Polling error:', err)
      }
    }

    poll() // Initial poll
    pollTimer = setInterval(poll, pollInterval)
  }

  const disconnect = () => {
    if (connection) {
      if (transport === 'websocket') {
        (connection as WebSocket).close()
      } else if (transport === 'sse') {
        (connection as EventSource).close()
      }
      connection = null
    }
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
    isConnected.value = false
  }

  // Load initial activities
  const loadActivities = async () => {
    loading.value = true
    try {
      // In production, fetch from API
      // const response = await fetch(`${endpoint}?page=${page.value}&perPage=${perPage}&filter=${filter}`)
      // const data = await response.json()
      // activities.value = data.activities
      // hasMore.value = data.hasMore
      // totalCount.value = data.total

      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 500))
      activities.value = sampleActivities.slice(0, perPage)
      hasMore.value = sampleActivities.length > perPage
      totalCount.value = sampleActivities.length
    } catch (err) {
      console.error('Failed to load activities:', err)
    } finally {
      loading.value = false
    }
  }

  // Load more (pagination)
  const loadMore = async () => {
    if (!hasMore.value || loading.value) return

    loading.value = true
    page.value++

    try {
      // In production, fetch from API
      // const response = await fetch(`${endpoint}?page=${page.value}&perPage=${perPage}&filter=${filter}`)
      // const data = await response.json()
      // activities.value.push(...data.activities)
      // hasMore.value = data.hasMore

      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 300))
      const start = (page.value - 1) * perPage
      const end = start + perPage
      const moreActivities = sampleActivities.slice(start, end)
      activities.value.push(...moreActivities)
      hasMore.value = end < sampleActivities.length
    } catch (err) {
      console.error('Failed to load more activities:', err)
    } finally {
      loading.value = false
    }
  }

  // Send activity (for WebSocket)
  const sendActivity = (activity: Partial<ActivityEvent>) => {
    if (transport === 'websocket' && connection && isConnected.value) {
      ;(connection as WebSocket).send(JSON.stringify({
        type: 'activity',
        activity
      }))
    }
  }

  // Set filter
  const setFilter = (newFilter: string) => {
    page.value = 1
    activities.value = []
    // loadActivities()
  }

  // Auto-connect on mount
  onMounted(() => {
    loadActivities()
    if (autoConnect) {
      connect()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    activities: readonly(activities),
    loading: readonly(loading),
    hasMore: readonly(hasMore),
    isConnected: readonly(isConnected),
    connectionError: readonly(connectionError),
    totalCount: readonly(totalCount),
    connect,
    disconnect,
    loadActivities,
    loadMore,
    sendActivity,
    setFilter
  }
}

export default useActivityFeed
