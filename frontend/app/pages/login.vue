<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex justify-center mb-8">
        <span class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">Esperion</span>
      </NuxtLink>

      <!-- Login Form -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
          {{ t('auth.login.title') }}
        </h1>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              {{ t('auth.login.emailLabel') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :placeholder="t('auth.login.emailPlaceholder')"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              {{ t('auth.login.passwordLabel') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div v-if="submitError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ submitError }}
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
              />
              <span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('auth.login.rememberMe') }}</span>
            </label>
            <a href="#" class="text-sm text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">
              {{ t('auth.login.forgotPassword') }}
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">{{ t('auth.login.submitButton') }}</span>
            <span v-else>{{ t('auth.login.submittingButton') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-es-border dark:border-es-border-dark"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('auth.login.noAccount') }}</span>
          </div>
        </div>

        <!-- Register Link -->
        <NuxtLink
          to="/register"
          class="w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          {{ t('auth.login.createAccount') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

// SEO Meta
useSeoMeta({
  title: t('auth.login.seo.title'),
  description: t('auth.login.seo.description'),
});

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// Form state
const form = ref({
  email: '',
  password: '',
  remember: false,
});

const isSubmitting = ref(false);
const submitError = ref('');

const errors = computed(() => {
  const nextErrors: Record<string, string> = {};

  if (!form.value.email) {
    nextErrors.email = t('auth.login.errors.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    nextErrors.email = t('auth.login.errors.emailInvalid');
  }

  if (!form.value.password) {
    nextErrors.password = t('auth.login.errors.passwordRequired');
  }

  return nextErrors;
});

const isFormValid = computed(() => Object.keys(errors.value).length === 0);

// Handle login
const handleLogin = async () => {
  if (!isFormValid.value) {
    submitError.value = t('auth.login.errors.fixFields');
    return;
  }

  isSubmitting.value = true;
  submitError.value = '';
  
  try {
    await authStore.login(form.value.email, form.value.password);
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    submitError.value = error instanceof Error ? error.message : t('auth.login.errors.invalidCredentials');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
