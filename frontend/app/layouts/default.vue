<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-b border-es-border dark:border-es-border-dark">
      <nav class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
              Esperion
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.href"
              :to="item.href"
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors font-medium"
              :class="{ 'text-es-accent-primary dark:text-es-accent-primary-dark': isActive(item.href) }"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <!-- Right side buttons -->
          <div class="flex items-center space-x-4">
            <!-- Language Switcher -->
            <LanguageSwitcher />

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <span v-if="isDark" class="text-xl">☀️</span>
              <span v-else class="text-xl">🌙</span>
            </button>

            <!-- Contact CTA -->
            <NuxtLink
              to="/contact-us"
              class="hidden sm:inline-flex items-center px-4 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            >
              Contact Us
            </NuxtLink>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            >
              <span v-if="mobileMenuOpen" class="text-xl">✕</span>
              <span v-else class="text-xl">☰</span>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-es-border dark:border-es-border-dark">
          <div class="flex flex-col space-y-4">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.href"
              :to="item.href"
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors font-medium"
              :class="{ 'text-es-accent-primary dark:text-es-accent-primary-dark': isActive(item.href) }"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
            <NuxtLink
              to="/contact-us"
              class="inline-flex items-center justify-center px-4 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              @click="mobileMenuOpen = false"
            >
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-t border-es-border dark:border-es-border-dark">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-lg font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
              Esperion Digital Agency
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4">
              Transforming businesses through innovative digital solutions.
            </p>
            <div class="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                📷
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                👍
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                💼
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                🎵
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                𝕏
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
              Quick Links
            </h4>
            <ul class="space-y-2">
              <li v-for="link in quickLinks" :key="link.href">
                <NuxtLink :to="link.href" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
              Our Services
            </h4>
            <ul class="space-y-2">
              <li v-for="service in services" :key="service.href">
                <NuxtLink :to="service.href" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm">
                  {{ service.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
              Contact Us
            </h4>
            <ul class="space-y-2 text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
              <li>📍 Jakarta, Indonesia</li>
              <li>📱 +62 812 3456 7890</li>
              <li>✉️ hello@esperion.com</li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
              © {{ new Date().getFullYear() }} Esperion Digital Agency. All rights reserved.
            </p>
            <div class="flex space-x-6">
              <NuxtLink to="/privacy-policy" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm">
                Privacy Policy
              </NuxtLink>
              <NuxtLink to="/terms-of-service" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm">
                Terms of Service
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const isDark = useColorMode();

const mobileMenuOpen = ref(false);

const toggleTheme = () => {
  isDark.value = isDark.value === 'dark' ? 'light' : 'dark';
};

const isActive = (href: string) => {
  const route = useRoute();
  return route.path === href || (href !== '/' && route.path.startsWith(href));
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/our-works', label: 'Our Works' },
  { href: '/our-services', label: 'Our Services' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About Us' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-works', label: 'Portfolio' },
  { href: '/our-services', label: 'Services' },
  { href: '/articles', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact-us', label: 'Contact' },
];

const services = [
  { href: '/our-services/web-development', label: 'Web Development' },
  { href: '/our-services/mobile-app-development', label: 'Mobile App Development' },
  { href: '/our-services/ui-ux-design', label: 'UI/UX Design' },
  { href: '/our-services/digital-marketing', label: 'Digital Marketing' },
  { href: '/our-services/ecommerce-solutions', label: 'E-Commerce Solutions' },
  { href: '/our-services/consulting', label: 'Consulting' },
];
</script>