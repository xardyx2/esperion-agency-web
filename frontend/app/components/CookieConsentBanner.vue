<script setup lang="ts">
/**
 * Cookie Consent Banner Component
 *
 * Displays a consent banner for GDPR/PDP compliance
 * Allows users to accept all, essential only, or customize preferences
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ConsentPreferences, ConsentTierState } from '../types/consent'
import {
  getStoredConsent,
  hasValidConsent,
  acceptAll,
  acceptEssentialOnly,
  updateConsent
} from '../composables/useConsent'

const emit = defineEmits<{
  consentUpdated: [preferences: ConsentPreferences]
}>()

// State
const showBanner = ref(false)
const showCustomize = ref(false)
const preferences = ref<ConsentTierState>({
  essential: true,
  analytics: true,
  functional: false,
  marketing: false
})

// Check if banner should be shown
const checkConsent = () => {
  if (!hasValidConsent()) {
    showBanner.value = true
    // Set defaults
    const stored = getStoredConsent()
    if (stored) {
      preferences.value = { ...stored.tiers }
    }
  }
}

// Initialize on mount
checkConsent()

// Listen for custom event to reopen consent modal
onMounted(() => {
  window.addEventListener('esperion:show-consent-modal', () => {
    showBanner.value = true
    showCustomize.value = true
    // Load current preferences
    const stored = getStoredConsent()
    if (stored) {
      preferences.value = { ...stored.tiers }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('esperion:show-consent-modal', () => {
    showBanner.value = true
    showCustomize.value = true
  })
})

// Handle actions
const handleAcceptAll = () => {
  const prefs = acceptAll()
  showBanner.value = false
  emit('consentUpdated', prefs)
}

const handleEssentialOnly = () => {
  const prefs = acceptEssentialOnly()
  showBanner.value = false
  emit('consentUpdated', prefs)
}

const handleCustomize = () => {
  showCustomize.value = true
}

const handleSavePreferences = () => {
  const prefs = updateConsent(preferences.value)
  showBanner.value = false
  showCustomize.value = false
  emit('consentUpdated', prefs)
}

const handleCancel = () => {
  showCustomize.value = false
}

// Helper for locked tiers
const isLocked = (tier: string) => tier === 'essential'
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-es-surface dark:bg-es-surface-dark border-t border-es-border dark:border-es-border-dark shadow-lg"
    >
      <div class="max-w-4xl mx-auto">
        <!-- Main Banner Content -->
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Cookie Preferences
            </h3>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              We use cookies to enhance your experience and analyze site traffic.
              Choose your preferences below.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
            <button
              class="px-4 py-2 bg-es-accent-primary hover:bg-es-accent-primary-hover text-white rounded-lg transition-colors text-sm font-medium"
              @click="handleAcceptAll"
            >
              Accept All
            </button>
            <button
              class="px-4 py-2 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors text-sm font-medium border border-es-border dark:border-es-border-dark"
              @click="handleEssentialOnly"
            >
              Essential Only
            </button>
            <button
              class="px-4 py-2 text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark transition-colors text-sm font-medium"
              @click="handleCustomize"
            >
              Customize
            </button>
          </div>
        </div>
      </div>

      <!-- Customize Modal -->
      <Teleport to="body">
        <div
          v-if="showCustomize"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          @click.self="handleCancel"
        >
          <div class="max-w-lg w-full bg-es-surface dark:bg-es-surface-dark rounded-xl shadow-2xl overflow-hidden">
            <!-- Modal Header -->
            <div class="p-6 border-b border-es-border dark:border-es-border-dark">
              <h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                Customize Cookie Preferences
              </h4>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-4">
              <!-- Essential Tier -->
              <div class="rounded-lg border border-es-border dark:border-es-border-dark p-4 bg-gray-50 dark:bg-gray-800/50">
                <label class="flex items-start gap-3 cursor-not-allowed">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    class="h-4 w-4 mt-0.5"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <strong class="text-es-text-primary dark:text-es-text-primary-dark">Essential</strong>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Always On</span>
                    </div>
                    <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                      Required for basic site functionality. Cannot be disabled.
                    </p>
                    <ul class="mt-2 text-xs text-es-text-secondary space-y-1">
                      <li>• Backend Analytics (First-party)</li>
                    </ul>
                  </div>
                </label>
              </div>

              <!-- Analytics Tier -->
              <div class="rounded-lg border border-es-border dark:border-es-border-dark p-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    v-model="preferences.analytics"
                    type="checkbox"
                    class="h-4 w-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
                  >
                  <div class="flex-1">
                    <strong class="text-es-text-primary dark:text-es-text-primary-dark">Analytics</strong>
                    <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                      Helps us understand how visitors interact with our website.
                    </p>
                    <ul class="mt-2 text-xs text-es-text-secondary space-y-1">
                      <li>• Google Analytics 4</li>
                      <li>• Google Tag Manager</li>
                    </ul>
                  </div>
                </label>
              </div>

              <!-- Functional Tier -->
              <div class="rounded-lg border border-es-border dark:border-es-border-dark p-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    v-model="preferences.functional"
                    type="checkbox"
                    class="h-4 w-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
                  >
                  <div class="flex-1">
                    <strong class="text-es-text-primary dark:text-es-text-primary-dark">Functional</strong>
                    <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                      Enhances user experience with additional features.
                    </p>
                    <ul class="mt-2 text-xs text-es-text-secondary space-y-1">
                      <li>• Microsoft Clarity (Heatmaps & Session Recordings)</li>
                    </ul>
                  </div>
                </label>
              </div>

              <!-- Marketing Tier -->
              <div class="rounded-lg border border-es-border dark:border-es-border-dark p-4 bg-red-50/50 dark:bg-red-900/10">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    v-model="preferences.marketing"
                    type="checkbox"
                    class="h-4 w-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <strong class="text-es-text-primary dark:text-es-text-primary-dark">Marketing</strong>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Opt-in</span>
                    </div>
                    <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                      Used to deliver personalized advertisements and measure their effectiveness.
                    </p>
                    <ul class="mt-2 text-xs text-es-text-secondary space-y-1">
                      <li>• Meta Pixel (Facebook/Instagram)</li>
                      <li>• TikTok Pixel</li>
                      <li>• LinkedIn Insight</li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t border-es-border dark:border-es-border-dark flex justify-end gap-3">
              <button
                class="px-4 py-2 text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark transition-colors text-sm font-medium"
                @click="handleCancel"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-es-accent-primary hover:bg-es-accent-primary-hover text-white rounded-lg transition-colors text-sm font-medium"
                @click="handleSavePreferences"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
