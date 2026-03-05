<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex justify-center mb-8">
        <span class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">Esperion</span>
      </NuxtLink>

      <!-- Login Form -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
          Sign In
        </h1>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
              />
              <span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">Remember me</span>
            </label>
            <a href="#" class="text-sm text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">Sign In</span>
            <span v-else>Signing in...</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-es-border dark:border-es-border-dark"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">Don't have an account?</span>
          </div>
        </div>

        <!-- Register Link -->
        <NuxtLink
          to="/register"
          class="w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          Create Account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Sign In - Esperion Dashboard',
  description: 'Sign in to your Esperion dashboard account.',
});

const router = useRouter();

// Form state
const form = ref({
  email: '',
  password: '',
  remember: false,
});

const isSubmitting = ref(false);

// Handle login
const handleLogin = async () => {
  isSubmitting.value = true;
  
  try {
    // TODO: Implement actual API call
    // const response = await useAuthApi().login(form.value);
    // useCookie('auth_token').value = response.token;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid email or password. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>