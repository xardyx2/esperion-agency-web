import { defineStore } from 'pinia'
import { useAuthApi, useApi } from '~/composables/useApi'
import type { User } from '~/types/api'

export interface UserPreferences {
  theme?: 'light' | 'dark'
  language?: 'en' | 'id'
  notifications?: boolean
  sidebarCollapsed?: boolean
  [key: string]: any
}

interface UserState {
  profile: User | null
  preferences: UserPreferences
  isLoading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    preferences: {},
    isLoading: false
  }),

  getters: {
    userProfile: state => state.profile,
    userPreferences: state => state.preferences,
    isProfileLoading: state => state.isLoading
  },

  actions: {
    async fetchProfile() {
      this.isLoading = true
      try {
        const response = await useAuthApi().getCurrentUser()
        this.profile = response
        return response
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(data: Partial<User>) {
      // NOTE: This is currently a simplified implementation
      // In practice, you'd make an API call to update user data
      this.isLoading = true

      try {
        // In a real implementation, this would be an API call like:
        // const response = await useUserApi().updateProfile(data);

        // For now, we'll just update locally
        if (this.profile) {
          this.profile = { ...this.profile, ...data }
        }
        return this.profile
      } catch (error) {
        console.error('Failed to update user profile:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    updatePreferences(prefs: UserPreferences) {
      this.preferences = { ...this.preferences, ...prefs }

      // Save preferences to local storage for persistence
      if (import.meta.client) {
        localStorage.setItem('user-preferences', JSON.stringify(this.preferences))
      }
    },

    loadPreferencesFromStorage() {
      if (import.meta.client) {
        const storedPrefs = localStorage.getItem('user-preferences')
        if (storedPrefs) {
          try {
            this.preferences = JSON.parse(storedPrefs)
          } catch (e) {
            console.error('Failed to parse stored preferences:', e)
          }
        }
      }
    }
  },

  persist: {
    key: 'user-store',
    pick: ['preferences']
  }
})
