/**
 * API Composable for Esperion Agency Web
 *
 * Provides typed API methods for all backend endpoints
 */

import type {
  // Auth
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  // Articles
  Article,
  ArticleFilter,
  CreateArticleRequest,
  UpdateArticleRequest,
  PaginatedResponse,
  // Media
  Media,
  MediaUploadResponse,
  MediaFilter,
  UpdateMediaRequest,
  // Works
  Work,
  WorkFilter,
  CreateWorkRequest,
  UpdateWorkRequest,
  // Services
  Service,
  ServiceFilter,
  CreateServiceRequest,
  UpdateServiceRequest,
  // Clients
  Client,
  ClientFilter,
  CreateClientRequest,
  UpdateClientRequest,
  ClientStats,
  ClientLogo,
  // Contact
  ContactSubmission,
  ContactFilter,
  CreateContactRequest,
  UpdateContactRequest,
  ContactStats
} from '../types/api'

// API Base URL from environment
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  const config = useRuntimeConfig()
  const token = useCookie('auth_token').value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await $fetch<T>(url, {
    ...options,
    headers
  })

  return response
}

/**
 * File upload fetch wrapper
 */
async function uploadFile<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const token = useCookie('auth_token').value

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await $fetch<T>(url, {
    method: 'POST',
    headers,
    body: formData
  })

  return response
}

// ============== Auth API ==============

export const useAuthApi = () => {
  return {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      return fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      return fetchApi<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    logout: async (): Promise<void> => {
      return fetchApi<void>('/auth/logout', {
        method: 'POST'
      })
    },

    refreshToken: async (): Promise<AuthResponse> => {
      return fetchApi<AuthResponse>('/auth/refresh', {
        method: 'POST'
      })
    },

    getCurrentUser: async (): Promise<User> => {
      return fetchApi<User>('/auth/me')
    }
  }
}

// ============== Articles API ==============

export const useArticlesApi = () => {
  return {
    list: async (filters?: ArticleFilter): Promise<PaginatedResponse<Article>> => {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.language) params.append('language', filters.language)
      if (filters?.published !== undefined) params.append('published', String(filters.published))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<Article>>(`/articles${query}`)
    },

    getBySlug: async (slug: string, lang: 'id' | 'en' = 'id'): Promise<Article> => {
      return fetchApi<Article>(`/articles/${slug}?lang=${lang}`)
    },

    create: async (data: CreateArticleRequest): Promise<Article> => {
      return fetchApi<Article>('/articles', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: async (id: string, data: UpdateArticleRequest): Promise<Article> => {
      return fetchApi<Article>(`/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/articles/${id}`, {
        method: 'DELETE'
      })
    }
  }
}

// ============== Media API ==============

export const useMediaApi = () => {
  return {
    list: async (filters?: MediaFilter): Promise<PaginatedResponse<Media>> => {
      const params = new URLSearchParams()
      if (filters?.year) params.append('year', String(filters.year))
      if (filters?.month) params.append('month', String(filters.month))
      if (filters?.media_type) params.append('type', filters.media_type)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<Media>>(`/media${query}`)
    },

    getById: async (id: string): Promise<Media> => {
      return fetchApi<Media>(`/media/${id}`)
    },

    upload: async (file: File, altText?: string): Promise<MediaUploadResponse> => {
      const formData = new FormData()
      formData.append('file', file)
      if (altText) formData.append('alt_text', altText)
      return uploadFile<MediaUploadResponse>('/media/upload', formData)
    },

    update: async (id: string, data: UpdateMediaRequest): Promise<Media> => {
      return fetchApi<Media>(`/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/media/${id}`, {
        method: 'DELETE'
      })
    },

    getStats: async (): Promise<any> => {
      return fetchApi<any>('/media/stats')
    }
  }
}

// ============== Works API ==============

export const useWorksApi = () => {
  return {
    list: async (filters?: WorkFilter): Promise<PaginatedResponse<Work>> => {
      const params = new URLSearchParams()
      if (filters?.service) params.append('service', filters.service)
      if (filters?.platform) params.append('platform', filters.platform)
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<Work>>(`/works${query}`)
    },

    featured: async (limit?: number): Promise<Work[]> => {
      const query = limit ? `?limit=${limit}` : ''
      return fetchApi<Work[]>(`/works/featured${query}`)
    },

    getBySlug: async (slug: string): Promise<Work> => {
      return fetchApi<Work>(`/works/${slug}`)
    },

    create: async (data: CreateWorkRequest): Promise<Work> => {
      return fetchApi<Work>('/works', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: async (id: string, data: UpdateWorkRequest): Promise<Work> => {
      return fetchApi<Work>(`/works/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/works/${id}`, {
        method: 'DELETE'
      })
    }
  }
}

// ============== Services API ==============

export const useServicesApi = () => {
  return {
    list: async (filters?: ServiceFilter): Promise<PaginatedResponse<Service>> => {
      const params = new URLSearchParams()
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<Service>>(`/services${query}`)
    },

    getBySlug: async (slug: string): Promise<Service> => {
      return fetchApi<Service>(`/services/${slug}`)
    },

    create: async (data: CreateServiceRequest): Promise<Service> => {
      return fetchApi<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: async (id: string, data: UpdateServiceRequest): Promise<Service> => {
      return fetchApi<Service>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/services/${id}`, {
        method: 'DELETE'
      })
    }
  }
}

// ============== Clients API ==============

export const useClientsApi = () => {
  return {
    list: async (filters?: ClientFilter): Promise<PaginatedResponse<Client>> => {
      const params = new URLSearchParams()
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
      if (filters?.category) params.append('category', filters.category)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<Client>>(`/clients${query}`)
    },

    logos: async (limit?: number): Promise<ClientLogo[]> => {
      const query = limit ? `?limit=${limit}` : ''
      return fetchApi<ClientLogo[]>(`/clients/logos${query}`)
    },

    stats: async (): Promise<ClientStats> => {
      return fetchApi<ClientStats>('/clients/stats')
    },

    create: async (data: CreateClientRequest): Promise<Client> => {
      return fetchApi<Client>('/clients', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: async (id: string, data: UpdateClientRequest): Promise<Client> => {
      return fetchApi<Client>(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/clients/${id}`, {
        method: 'DELETE'
      })
    }
  }
}

// ============== Contact API ==============

export const useContactApi = () => {
  return {
    submit: async (data: CreateContactRequest): Promise<ContactSubmission> => {
      return fetchApi<ContactSubmission>('/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    list: async (filters?: ContactFilter): Promise<PaginatedResponse<ContactSubmission>> => {
      const params = new URLSearchParams()
      if (filters?.service) params.append('service', filters.service)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.date_from) params.append('date_from', filters.date_from)
      if (filters?.date_to) params.append('date_to', filters.date_to)
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.offset) params.append('offset', String(filters.offset))

      const query = params.toString() ? `?${params}` : ''
      return fetchApi<PaginatedResponse<ContactSubmission>>(`/contact/submissions${query}`)
    },

    stats: async (): Promise<ContactStats> => {
      return fetchApi<ContactStats>('/contact/stats')
    },

    update: async (id: string, data: UpdateContactRequest): Promise<ContactSubmission> => {
      return fetchApi<ContactSubmission>(`/contact/submissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    }
  }
}
