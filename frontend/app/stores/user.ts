import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface UserPermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canPublish: boolean
}

export const useUserStore = defineStore('user', () => {
  // State
  const profile = ref<UserProfile | null>(null)
  const role = ref<UserRole | null>(null)
  const permissions = ref<UserPermissions | null>(null)

  // Getters
  const isAdmin = computed(() => role.value === 'admin')
  const isEditor = computed(() => role.value === 'editor' || role.value === 'admin')
  const fullName = computed(() => {
    if (!profile.value) return ''
    return `${profile.value.firstName} ${profile.value.lastName}`.trim()
  })

  // Actions
  async function fetchUser() {
    try {
      const response = await fetch('/api/v1/user/me')
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      const data = await response.json()
      profile.value = data.profile
      role.value = data.role
      permissions.value = data.permissions
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    try {
      const response = await fetch('/api/v1/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      const data = await response.json()
      profile.value = { ...profile.value, ...data }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  function clearUser() {
    profile.value = null
    role.value = null
    permissions.value = null
  }

  return {
    // State
    profile,
    role,
    permissions,
    // Getters
    isAdmin,
    isEditor,
    fullName,
    // Actions
    fetchUser,
    updateProfile,
    clearUser,
  }
})
