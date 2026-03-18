import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { m as useCookie } from './server.mjs'

const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const refreshToken = ref(null)
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)
  const authToken = computed(() => token.value)
  const isAuthenticating = computed(() => isLoading.value)
  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      const { useAuthApi: actualUseAuthApi } = await import('./useApi-L_axzZs3.mjs')
      const response = await actualUseAuthApi().login({ email, password })
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      const refreshCookie = useCookie('refresh_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token
      refreshCookie.value = response.refresh_token
      token.value = response.token
      refreshToken.value = response.refresh_token
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error2) {
      error2.value = error2.message || 'Login failed'
      throw error2
    } finally {
      isLoading.value = false
    }
  }
  async function register(data) {
    isLoading.value = true
    error.value = null
    try {
      const { useAuthApi: actualUseAuthApi } = await import('./useApi-L_axzZs3.mjs')
      const response = await actualUseAuthApi().register(data)
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      const refreshCookie = useCookie('refresh_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token
      refreshCookie.value = response.refresh_token
      token.value = response.token
      refreshToken.value = response.refresh_token
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error2) {
      error2.value = error2.message || 'Registration failed'
      throw error2
    } finally {
      isLoading.value = false
    }
  }
  async function logout() {
    isLoading.value = true
    try {
      const { useAuthApi: actualUseAuthApi } = await import('./useApi-L_axzZs3.mjs')
      await actualUseAuthApi().logout()
    } catch (error2) {
    } finally {
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
      const { useAuthApi: actualUseAuthApi } = await import('./useApi-L_axzZs3.mjs')
      const response = await actualUseAuthApi().refreshToken()
      const authCookie = useCookie('auth_token', {
        sameSite: true,
        secure: true,
        httpOnly: false
      })
      authCookie.value = response.token
      token.value = response.token
      return response
    } catch (error2) {
      error2.value = error2.message || 'Failed to refresh token'
      logout()
      throw error2
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
      const { useAuthApi: actualUseAuthApi } = await import('./useApi-L_axzZs3.mjs')
      const response = await actualUseAuthApi().getCurrentUser()
      user.value = response
      isAuthenticated.value = true
      return response
    } catch (error2) {
      error2.value = error2.message || 'Failed to fetch current user'
      throw error2
    } finally {
      isLoading.value = false
    }
  }
  function clearError() {
    error.value = null
  }
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

export { useAuthStore as u }
// # sourceMappingURL=auth-eqZ1paNc.mjs.map
