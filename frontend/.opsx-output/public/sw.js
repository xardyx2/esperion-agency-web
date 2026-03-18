/**
 * Esperion PWA Service Worker
 * 
 * Provides offline caching and background sync functionality
 */

const CACHE_NAME = 'esperion-v1'
const STATIC_CACHE = 'esperion-static-v1'
const DYNAMIC_CACHE = 'esperion-dynamic-v1'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return networkResponse
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html')
        }
        return null
      })

      // Return cached response or fetch from network
      return cachedResponse || fetchPromise
    })
  )
})

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  // Get pending form submissions from IndexedDB
  // and send them to the server
  console.log('[Service Worker] Syncing contact form submissions')
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from Esperion',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }

  event.waitUntil(
    self.registration.showNotification('Esperion', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})