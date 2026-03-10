<template>
  <footer class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-t border-es-border dark:border-es-border-dark">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-es-accent-primary to-es-accent-secondary dark:from-es-accent-primary-dark dark:to-es-accent-secondary-dark flex items-center justify-center">
              <span class="text-white font-bold text-sm">E</span>
            </div>
            <h3 class="text-lg font-bold text-es-text-primary dark:text-es-text-primary-dark">
              Esperion
            </h3>
          </div>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 leading-relaxed">
            Esperion membantu bisnis bertumbuh lewat strategi, desain, dan pengembangan digital yang terarah.
          </p>
          <div class="flex space-x-3">
            <a 
              href="https://instagram.com/esperion_id" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              :aria-label="t('social.instagram')"
            >
              <span class="text-lg" role="img" :aria-label="t('social.instagram')">📷</span>
            </a>
            <a 
              href="https://facebook.com/esperiondigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              :aria-label="t('social.facebook')"
            >
              <span class="text-lg" role="img" :aria-label="t('social.facebook')">👍</span>
            </a>
            <a 
              href="https://linkedin.com/company/esperiondigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              :aria-label="t('social.linkedin')"
            >
              <span class="text-lg" role="img" :aria-label="t('social.linkedin')">💼</span>
            </a>
            <a 
              href="https://tiktok.com/@esperion_id" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              :aria-label="t('social.tiktok')"
            >
              <span class="text-lg" role="img" :aria-label="t('social.tiktok')">🎵</span>
            </a>
            <a 
              href="https://twitter.com/esperion_id" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              :aria-label="t('social.twitter')"
            >
              <span class="text-lg" role="img" :aria-label="t('social.twitter')">𝕏</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
           <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">
            {{ t('footer.quickLinks') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.href">
              <NuxtLink 
                :to="localePath(link.href)" 
                class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm inline-flex items-center group"
              >
                <span class="w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all"></span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
           <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">
            {{ t('footer.ourServices') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="service in services" :key="service.href">
              <NuxtLink 
                :to="localePath(service.href)" 
                class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm inline-flex items-center group"
              >
                <span class="w-0 group-hover:w-2 h-0.5 bg-es-accent-primary dark:bg-es-accent-primary-dark mr-0 group-hover:mr-2 transition-all"></span>
                {{ service.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
           <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">
            {{ t('footer.contactUs') }}
          </h4>
          <ul class="space-y-3 text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
            <li class="flex items-start space-x-3">
              <span class="text-lg flex-shrink-0" role="img" :aria-label="t('aria.location')">📍</span>
              <span>{{ t('footer.contact.city') }}<br/><span class="text-es-text-tertiary dark:text-es-text-tertiary-dark text-xs">{{ t('footer.contact.addressPending') }}</span></span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" :aria-label="t('aria.phone')">📱</span>
              <a href="tel:+6281234567890" class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">+62 812 3456 7890</a>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" :aria-label="t('aria.email')">✉️</span>
              <a href="mailto:hello@esperion.id" class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">hello@esperion.id</a>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" :aria-label="t('aria.businessHours')">🕐</span>
              <span>{{ t('footer.contact.businessHours') }}</span>
            </li>
          </ul>

          <!-- Appearance Settings (Language + Theme) -->
          <div class="mt-6 pt-6 border-t border-es-border dark:border-es-border-dark">
            <!-- Language Switcher -->
            <p class="text-xs font-semibold text-es-text-tertiary dark:text-es-text-tertiary-dark mb-3 uppercase tracking-wider">
              {{ t('footer.appearance') }}
            </p>
            <div class="flex gap-3 mb-4">
              <button
                @click="switchLocale('id')"
                :class="[
                  'text-sm transition-colors',
                  locale === 'id'
                    ? 'text-es-accent-primary dark:text-es-accent-primary-dark font-semibold'
                    : 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark'
                ]"
                :aria-pressed="locale === 'id'"
              >
                Bahasa Indonesia
              </button>
              <span class="text-es-text-tertiary dark:text-es-text-tertiary-dark">|</span>
              <button
                @click="switchLocale('en')"
                :class="[
                  'text-sm transition-colors',
                  locale === 'en'
                    ? 'text-es-accent-primary dark:text-es-accent-primary-dark font-semibold'
                    : 'text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark'
                ]"
                :aria-pressed="locale === 'en'"
              >
                English
              </button>
            </div>

            <!-- Theme Toggle -->
            <div class="flex gap-2">
              <button
                v-for="option in themeOptions"
                :key="option.value"
                @click="setTheme(option.value)"
                :class="[
                  'p-2 rounded-lg border-2 transition-all duration-100',
                  currentTheme === option.value
                    ? 'border-es-accent-primary dark:border-es-accent-primary-dark -translate-y-0.5 bg-es-accent-primary/5 dark:bg-es-accent-primary-dark/5'
                    : 'border-es-border dark:border-es-border-dark hover:-translate-y-0.5 hover:border-es-text-tertiary dark:hover:border-es-text-tertiary-dark'
                ]"
                :aria-label="option.label"
                :aria-pressed="currentTheme === option.value"
              >
                <span class="text-base">{{ option.icon }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
           <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
            {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
          </p>
          

          <div class="flex space-x-6">
            <NuxtLink 
              :to="localePath('/privacy-policy')" 
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm"
            >
              {{ t('footer.privacyPolicy') }}
            </NuxtLink>
            <NuxtLink 
              :to="localePath('/terms-of-service')" 
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm"
            >
              {{ t('footer.termsOfService') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();

// Theme options for toggle
const themeOptions = [
  { value: 'system', icon: '💻', label: 'System' },
  { value: 'light', icon: '☀️', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
] as const;

// Get current theme preference
const currentTheme = computed(() => colorMode.preference as 'system' | 'light' | 'dark');

// Set theme preference
const setTheme = (theme: 'system' | 'light' | 'dark') => {
  colorMode.preference = theme;
};

// Set locale
const switchLocale = async (code: 'id' | 'en') => {
  if (code === locale.value) return;
  await setLocale(code);
};

const quickLinks = computed(() => [
  { href: '/', label: t('nav.home') },
  { href: '/our-works', label: t('nav.works') },
  { href: '/our-services', label: t('nav.services') },
  { href: '/articles', label: t('nav.articles') },
  { href: '/about', label: t('nav.about') },
  { href: '/contact-us', label: t('nav.contact') },
]);

const services = computed(() => [
  { href: '/our-services/web-development', label: t('footer.services.webDevelopment') },
  { href: '/our-services/mobile-app-development', label: t('footer.services.mobileAppDevelopment') },
  { href: '/our-services/ui-ux-design', label: t('footer.services.uiUxDesign') },
  { href: '/our-services/digital-marketing', label: t('footer.services.digitalMarketing') },
  { href: '/our-services/ecommerce-solutions', label: t('footer.services.ecommerceSolutions') },
  { href: '/our-services/consulting', label: t('footer.services.digitalConsulting') },
]);
</script>

<style scoped>
/* Footer link hover animation */
footer a {
  position: relative;
}
</style>
