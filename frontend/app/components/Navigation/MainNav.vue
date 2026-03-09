<template>
  <header class="sticky top-0 z-50 bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-b border-es-border dark:border-es-border-dark">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
         <!-- Logo -->
        <NuxtLink 
          :to="localePath('/')" 
          class="flex items-center space-x-2 group"
          :aria-label="t('nav.aria.home')"
        >
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-es-accent-primary to-es-accent-secondary dark:from-es-accent-primary-dark dark:to-es-accent-secondary-dark flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <span class="text-white font-bold text-lg">E</span>
          </div>
          <span class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
            Esperion
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.href"
            :to="localePath(item.href)"
            class="px-4 py-2 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-all font-medium"
            :class="{ 
              'text-es-accent-primary dark:text-es-accent-primary-dark bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10': isActive(item.href) 
            }"
          >
            {{ item.label }}
          </NuxtLink>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center space-x-3">
           <!-- Contact CTA -->
          <NuxtLink
            :to="localePath('/contact-us')"
            class="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-es-accent-primary to-es-accent-primary-hover dark:from-es-accent-primary-dark dark:to-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-es-accent-primary/25 dark:hover:shadow-es-accent-primary-dark/25 transform hover:-translate-y-0.5 transition-all"
          >
            {{ t('nav.contact') }}
          </NuxtLink>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
            :aria-label="mobileMenuOpen ? t('nav.aria.closeMenu') : t('nav.aria.openMenu')"
            :aria-expanded="mobileMenuOpen"
          >
            <span v-if="mobileMenuOpen" class="text-2xl block" role="img" :aria-label="t('common.aria.close')">✕</span>
            <span v-else class="text-2xl block" role="img" :aria-label="t('common.aria.menu')">☰</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-es-border dark:border-es-border-dark">
          <div class="flex flex-col space-y-2">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.href"
              :to="localePath(item.href)"
              class="px-4 py-3 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-all font-medium"
              :class="{ 
                'text-es-accent-primary dark:text-es-accent-primary-dark bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10': isActive(item.href) 
              }"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/contact-us')"
              class="mx-4 mt-2 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-es-accent-primary to-es-accent-primary-hover dark:from-es-accent-primary-dark dark:to-es-accent-primary-hover-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:shadow-lg transition-all"
              @click="mobileMenuOpen = false"
            >
              {{ t('nav.contact') }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const appearanceOpen = ref(false);
const { theme, toggleTheme } = useTheme();
const { locale, setLocale } = useI18n();

const isActive = (href: string) => {
  const localizedHref = localePath(href);
  return route.path === localizedHref || (href !== '/' && route.path.startsWith(localizedHref));
};

const navItems = computed(() => [
  { href: '/', label: t('nav.home') },
  { href: '/our-works', label: t('nav.works') },
  { href: '/our-services', label: t('nav.services') },
  { href: '/articles', label: t('nav.articles') },
  { href: '/about', label: t('nav.about') },
]);

// Appearance dropdown items
const appearanceItems = computed(() => [
  {
    label: t('nav.appearance'),
    icon: 'i-heroicons-globe-americas',
    items: [
      { label: t('language.indonesian'), value: 'id', click: () => setLocale('id') },
      { label: t('language.english'), value: 'en', click: () => setLocale('en') }
    ]
  },
  {
    label: t('nav.darkMode'),
    icon: isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon',
    click: toggleTheme
  }
]);
</script>

<style scoped>
/* Smooth transitions for nav items */
nav a {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
