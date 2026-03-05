<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex justify-center mb-8">
        <span class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">Esperion</span>
      </NuxtLink>

      <!-- Register Form -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
          Create Account
        </h1>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="johndoe"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
          </div>

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

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Phone (Optional)
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="+62 812 3456 7890"
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
              minlength="8"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
          </div>

          <!-- Terms -->
          <div>
            <label class="flex items-start">
              <input
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="w-4 h-4 mt-0.5 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary"
              />
              <span class="ml-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                I agree to the <a href="/terms-of-service" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">Terms of Service</a> and <a href="/privacy-policy" class="text-es-accent-primary dark:text-es-accent-primary-dark hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">Create Account</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-es-border dark:border-es-border-dark"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-es-text-secondary dark:text-es-text-secondary-dark">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <NuxtLink
          to="/login"
          class="w-full inline-flex justify-center items-center px-8 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Create Account - Esperion Dashboard',
  description: 'Create your Esperion dashboard account.',
});

const router = useRouter();

// Form state
const form = ref({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  acceptTerms: false,
});

const isSubmitting = ref(false);

// Handle register
const handleRegister = async () => {
  isSubmitting.value = true;
  
  try {
    // TODO: Implement actual API call
    // const response = await useAuthApi().register({
    //   full_name: form.value.fullName,
    //   username: form.value.username,
    //   email: form.value.email,
    //   phone: form.value.phone,
    //   password: form.value.password,
    // });
    // useCookie('auth_token').value = response.token;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
    alert('Registration failed. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>