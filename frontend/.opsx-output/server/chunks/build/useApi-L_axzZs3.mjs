import { m as useCookie } from './server.mjs'
import 'vue'
import '../_/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'consola'
import 'uncsrf'
import 'vue-router'
import 'lru-cache'
import 'node:fs'
import 'node:path'
import 'node:url'
import '@iconify/utils'
import 'node:crypto'
import 'fast-xml-parser'
import 'xss'
import 'zod'
import 'ms'
import 'node:fs/promises'
import '@modelcontextprotocol/sdk/server/mcp.js'
import '@modelcontextprotocol/sdk/server/streamableHttp.js'
import 'satori'
import 'ipx'
import 'pinia'
import '@vue/shared'
import '@unhead/schema-org/vue'
import 'tailwindcss/colors'
import '@iconify/vue'
import 'vue/server-renderer'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const API_BASE = '/api/v1'
async function fetchApi(endpoint, options) {
  const url = `${API_BASE}${endpoint}`
  const token = useCookie('auth_token').value
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const response = await $fetch(url, {
    ...options,
    headers
  })
  return response
}
async function uploadFile(endpoint, formData) {
  const url = `${API_BASE}${endpoint}`
  const token = useCookie('auth_token').value
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const response = await $fetch(url, {
    method: 'POST',
    headers,
    body: formData
  })
  return response
}
const useApi = () => ({ fetchApi, uploadFile })
const useAuthApi = () => {
  return {
    login: async (data) => {
      return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    register: async (data) => {
      return fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    logout: async (refreshToken) => {
      const token = refreshToken || useCookie('refresh_token').value
      return fetchApi('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: token })
      })
    },
    refreshToken: async (refreshToken) => {
      const token = refreshToken || useCookie('refresh_token').value
      return fetchApi('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: token })
      })
    },
    getCurrentUser: async () => {
      return fetchApi('/auth/me')
    },
    getSessions: async () => {
      return fetchApi('/auth/sessions')
    },
    forceLogoutSession: async (sessionId) => {
      return fetchApi(`/auth/sessions/${sessionId}`, {
        method: 'DELETE'
      })
    }
  }
}
const useUsersApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.role) params.append('role', filters.role)
      if (filters?.page) params.append('page', String(filters.page))
      if (filters?.limit) params.append('limit', String(filters.limit))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/users${query}`)
    },
    getById: async (id) => {
      return fetchApi(`/users/${id}`)
    },
    create: async (data) => {
      return fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    update: async (id, data) => {
      return fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/users/${id}`, {
        method: 'DELETE'
      })
    },
    listRoles: async () => {
      return fetchApi('/roles')
    },
    listActivityLogs: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.user_id) params.append('user_id', filters.user_id)
      if (filters?.role) params.append('role', filters.role)
      if (filters?.page) params.append('page', String(filters.page))
      if (filters?.limit) params.append('limit', String(filters.limit))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/activity-logs${query}`)
    }
  }
}
const useArticlesApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.language) params.append('language', filters.language)
      if (filters?.published !== void 0) params.append('published', String(filters.published))
      if (filters?.translation_status) params.append('translation_status', filters.translation_status)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/articles${query}`)
    },
    getBySlug: async (slug, lang = 'id') => {
      return fetchApi(`/articles/${slug}?lang=${lang}`)
    },
    getByAnySlug: async (slug) => {
      return fetchApi(`/articles/by-slug/${slug}`)
    },
    getTranslations: async (id) => {
      return fetchApi(`/articles/${id}/translations`)
    },
    translate: async (id, data) => {
      return fetchApi(`/articles/${id}/translate`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    reviewTranslation: async (id, lang, data) => {
      return fetchApi(`/articles/${id}/translate/${lang}/review`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    updateTranslationStatus: async (id, data) => {
      return fetchApi(`/articles/${id}/translation-status`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    create: async (data) => {
      return fetchApi('/articles', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    update: async (id, data) => {
      return fetchApi(`/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/articles/${id}`, {
        method: 'DELETE'
      })
    }
  }
}
const useMediaApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.year) params.append('year', String(filters.year))
      if (filters?.month) params.append('month', String(filters.month))
      if (filters?.media_type) params.append('type', filters.media_type)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/media${query}`)
    },
    getById: async (id) => {
      return fetchApi(`/media/${id}`)
    },
    upload: async (file, altText) => {
      const formData = new FormData()
      formData.append('file', file)
      if (altText) formData.append('alt_text', altText)
      return uploadFile('/media/upload', formData)
    },
    update: async (id, data) => {
      return fetchApi(`/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/media/${id}`, {
        method: 'DELETE'
      })
    },
    getStats: async () => {
      return fetchApi('/media/stats')
    }
  }
}
const useWorksApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.service) params.append('service', filters.service)
      if (filters?.platform) params.append('platform', filters.platform)
      if (filters?.featured !== void 0) params.append('featured', String(filters.featured))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/works${query}`)
    },
    featured: async (limit) => {
      const query = limit ? `?limit=${limit}` : ''
      return fetchApi(`/works/featured${query}`)
    },
    getBySlug: async (slug) => {
      return fetchApi(`/works/${slug}`)
    },
    create: async (data) => {
      return fetchApi('/works', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    update: async (id, data) => {
      return fetchApi(`/works/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/works/${id}`, {
        method: 'DELETE'
      })
    }
  }
}
const useServicesApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.featured !== void 0) params.append('featured', String(filters.featured))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/services${query}`)
    },
    getBySlug: async (slug) => {
      return fetchApi(`/services/${slug}`)
    },
    create: async (data) => {
      return fetchApi('/services', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    update: async (id, data) => {
      return fetchApi(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/services/${id}`, {
        method: 'DELETE'
      })
    }
  }
}
const useClientsApi = () => {
  return {
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.featured !== void 0) params.append('featured', String(filters.featured))
      if (filters?.category) params.append('category', filters.category)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/clients${query}`)
    },
    logos: async (limit) => {
      const query = limit ? `?limit=${limit}` : ''
      return fetchApi(`/clients/logos${query}`)
    },
    stats: async () => {
      return fetchApi('/clients/stats')
    },
    create: async (data) => {
      return fetchApi('/clients', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    update: async (id, data) => {
      return fetchApi(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    delete: async (id) => {
      return fetchApi(`/clients/${id}`, {
        method: 'DELETE'
      })
    }
  }
}
const useContactApi = () => {
  return {
    submit: async (data) => {
      return fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    list: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.service) params.append('service', filters.service)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.date_from) params.append('date_from', filters.date_from)
      if (filters?.date_to) params.append('date_to', filters.date_to)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/contact/submissions${query}`)
    },
    stats: async () => {
      return fetchApi('/contact/stats')
    },
    update: async (id, data) => {
      return fetchApi(`/contact/submissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    }
  }
}
const useMonitoringApi = () => {
  return {
    getSettings: async () => {
      return fetchApi('/monitoring/settings')
    },
    updateSettings: async (data) => {
      return fetchApi('/monitoring/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    getStatus: async () => {
      return fetchApi('/monitoring/status')
    },
    getAlerts: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.limit !== void 0) params.append('limit', String(filters.limit))
      if (filters?.offset !== void 0) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/monitoring/alerts${query}`)
    },
    sendTestAlert: async (data) => {
      return fetchApi('/monitoring/alerts/test', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  }
}
const useAnalyticsApi = () => {
  return {
    getSettings: async () => {
      return fetchApi('/analytics/settings')
    },
    updateSettings: async (data) => {
      return fetchApi('/analytics/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    getPublicConfig: async () => {
      return fetchApi('/analytics/public-config')
    },
    trackEvent: async (data) => {
      return fetchApi('/analytics/track', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    getReport: async () => {
      return fetchApi('/analytics/report')
    }
  }
}
const useBackupApi = () => {
  return {
    getSettings: async () => {
      return fetchApi('/backups/settings')
    },
    updateSettings: async (data) => {
      return fetchApi('/backups/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    getHistory: async (filters) => {
      const params = new URLSearchParams()
      if (filters?.limit !== void 0) params.append('limit', String(filters.limit))
      if (filters?.offset !== void 0) params.append('offset', String(filters.offset))
      const query = params.toString() ? `?${params}` : ''
      return fetchApi(`/backups/history${query}`)
    },
    createBackup: async (data) => {
      return fetchApi('/backups/create', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    restoreBackup: async (data) => {
      return fetchApi('/backups/restore', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  }
}

export { useAnalyticsApi, useApi, useArticlesApi, useAuthApi, useBackupApi, useClientsApi, useContactApi, useMediaApi, useMonitoringApi, useServicesApi, useUsersApi, useWorksApi }
// # sourceMappingURL=useApi-L_axzZs3.mjs.map
