import { defineStore } from 'pinia'
import type { User } from '~/types/api'
import { ref, computed } from 'vue'

// Import the API composable at runtime
const useAuthApi = () => {
  const { useAuthApi: actualUseAuthApi } = (globalThis as any).useAuthApiRef || {}
  return actualUseAuthApi
    ? actualUseAuthApi()
    : Promise.resolve({
        login: () => Promise.reject(new Error('not implemented')),
        register: () => Promise.reject(new Error('not implemented')),
        logout: () => Promise.resolve(),
        refreshToken: () => Promise.reject(new Error('not implemented')),
        getCurrentUser: () => Promise.reject(new Error('not implemented'))
      })
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)
  const authToken = computed(() => token.value)
  const isAuthenticating = computed(() => isLoading.value)

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      // Dynamic import to avoid build issues
      const { useAuthApi: actualUseAuthApi } = await import('~/composables/useApi')
      const response = await actualUseAuthApi().login({ email, password })

      // Set token in cookie and state
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token

      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true

      return response
    } catch (error: any) {
      error.value = error.message || 'Login failed'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: {
    email: string
    password: string
    full_name: string
    username: string
    phone?: string
  }) {
    isLoading.value = true
    error.value = null

    try {
      // Dynamic import to avoid build issues
      const { useAuthApi: actualUseAuthApi } = await import('~/composables/useApi')
      const response = await actualUseAuthApi().register(data)

      // Set token in cookie and state
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token

      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true

      return response
    } catch (error: any) {
      error.value = error.message || 'Registration failed'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      // Dynamic import to avoid build issues
      const { useAuthApi: actualUseAuthApi } = await import('~/composables/useApi')
      // Call API to logout (optional)
      await actualUseAuthApi().logout()
    } catch (error) {
      // Continue with logout even if API fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear local state regardless of API result
      const authCookie = useCookie('auth_token')
      authCookie.value = null

      token.value = null
      refreshToken.value = null
      user.value = null
      isAuthenticated.value = false
      isLoading.value = false
    }
  }

  async function refreshTokenAction() {
    isLoading.value = true
    error.value = null

    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      // Dynamic import to avoid build issues
      const { useAuthApi: actualUseAuthApi } = await import('~/composables/useApi')
      const response = await actualUseAuthApi().refreshToken()

      // Set new token in cookie and state
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token

      token.value = response.token

      return response
    } catch (error: any) {
      error.value = error.message || 'Failed to refresh token'
      logout() // Logout if refresh fails
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) {
      throw new Error('No token available')
    }

    isLoading.value = true
    error.value = null

    try {
      // Dynamic import to avoid build issues
      const { useAuthApi: actualUseAuthApi } = await import('~/composables/useApi')
      const response = await actualUseAuthApi().getCurrentUser()
      user.value = response
      isAuthenticated.value = true

      return response
    } catch (error: any) {
      error.value = error.message || 'Failed to fetch current user'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state from cookie storage
  function initFromCookie() {
    const authCookie = useCookie('auth_token')
    if (authCookie.value) {
      token.value = authCookie.value
      isAuthenticated.value = true
    }
  }

  return {
    // State
    token,
    refreshToken,
    user,
    isAuthenticated,
    isLoading,
    error,

    // Getters
    isLoggedIn,
    currentUser,
    authToken,
    isAuthenticating,

    // Actions
    login,
    register,
    logout,
    refreshTokenAction,
    fetchCurrentUser,
    clearError,
    initFromCookie
  }
})
