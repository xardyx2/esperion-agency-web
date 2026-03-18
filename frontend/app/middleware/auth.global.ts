import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  authStore.initFromCookie()

  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isAuthPage = to.path === '/login' || to.path === '/register'

  if (!authStore.token && isDashboardRoute) {
    return navigateTo('/login')
  }

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      await authStore.logout()
      if (isDashboardRoute) {
        return navigateTo('/login')
      }
    }
  }

  if (isAuthPage && authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
