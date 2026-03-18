<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex justify-center mb-8"
      >
        <span class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">Esperion</span>
      </NuxtLink>

      <!-- Register Form -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
          {{ t('auth.register.title') }}
        </h1>

        <form
          class="space-y-5"
          @submit.prevent="handleRegister"
        >
          <!-- Full Name -->
          <div>
            <label
              for="fullName"
              class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2"
            >
              {{ t('auth.register.fullNameLabel') }}
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              :placeholder="t('auth.register.fullNamePlaceholder')"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
            <p
              v-if="errors.fullName"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.fullName }}
            </p>
          </div>

          <!-- Username -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2"
            >
              {{ t('auth.register.usernameLabel') }}
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              :placeholder="t('auth.register.usernamePlaceholder')"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
            <p
              v-if="errors.username"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.username }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2"
            >
              {{ t('auth.register.emailLabel') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :placeholder="t('auth.register.emailPlaceholder')"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
            <p
              v-if="errors.email"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2"
            >
              {{ t('auth.register.phoneLabel') }}
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              :placeholder="t('auth.register.phonePlaceholder')"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
            <p
              v-if="errors.password"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.password }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2"
            >
              {{ t('auth.register.passwordLabel') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
          </div>

          <div
            v-if="submitError"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ submitError }}
          </div>

          <!-- Terms -->
          <div>
            <label class="flex items-start">
              <input
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="w-4 h-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
              >
              <span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('auth.register.acceptTerms', { terms: `<a href="/terms-of-service" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">${t('auth.register.termsOfService')}</a>`, privacy: `<a href="/privacy-policy" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">${t('auth.register.privacyPolicy')}</a>` }) }}
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">{{ t('auth.register.submitButton') }}</span>
            <span v-else>{{ t('auth.register.submittingButton') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-es-border dark:border-es-border-dark" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('auth.register.hasAccount') }}</span>
          </div>
        </div>

        <!-- Login Link -->
        <NuxtLink
          to="/login"
          class="w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          {{ t('auth.register.signIn') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()

// SEO Meta
useSeoMeta({
  title: t('auth.register.seo.title'),
  description: t('auth.register.seo.description')
})

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = ref({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  acceptTerms: false
})

const isSubmitting = ref(false)
const submitError = ref('')

const errors = computed(() => {
  const nextErrors: Record<string, string> = {}

  if (!form.value.fullName.trim()) {
    nextErrors.fullName = t('auth.register.errors.fullNameRequired')
  }

  if (!form.value.username.trim()) {
    nextErrors.username = t('auth.register.errors.usernameRequired')
  }

  if (!form.value.email) {
    nextErrors.email = t('auth.register.errors.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    nextErrors.email = t('auth.register.errors.emailInvalid')
  }

  if (!form.value.password) {
    nextErrors.password = t('auth.register.errors.passwordRequired')
  } else if (form.value.password.length < 8) {
    nextErrors.password = t('auth.register.errors.passwordMinLength')
  }

  if (!form.value.acceptTerms) {
    nextErrors.acceptTerms = t('auth.register.errors.acceptTermsRequired')
  }

  return nextErrors
})

const isFormValid = computed(() => Object.keys(errors.value).length === 0)

// Handle register
const handleRegister = async () => {
  if (!isFormValid.value) {
    submitError.value = errors.value.acceptTerms || t('auth.register.errors.fixFields')
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    await authStore.register({
      full_name: form.value.fullName,
      username: form.value.username,
      email: form.value.email,
      phone: form.value.phone || undefined,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
    submitError.value = error instanceof Error ? error.message : t('auth.register.errors.registrationFailed')
  } finally {
    isSubmitting.value = false
  }
}
</script>
