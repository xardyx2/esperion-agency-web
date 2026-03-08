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
              aria-label="Instagram"
            >
              <span class="text-lg" role="img" aria-label="Instagram">📷</span>
            </a>
            <a 
              href="https://facebook.com/esperiondigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              aria-label="Facebook"
            >
              <span class="text-lg" role="img" aria-label="Facebook">👍</span>
            </a>
            <a 
              href="https://linkedin.com/company/esperiondigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <span class="text-lg" role="img" aria-label="LinkedIn">💼</span>
            </a>
            <a 
              href="https://tiktok.com/@esperion_id" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              aria-label="TikTok"
            >
              <span class="text-lg" role="img" aria-label="TikTok">🎵</span>
            </a>
            <a 
              href="https://twitter.com/esperion_id" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all transform hover:scale-110"
              aria-label="Twitter"
            >
              <span class="text-lg" role="img" aria-label="Twitter">𝕏</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4 uppercase tracking-wider">
            Navigasi Cepat
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
            Layanan Kami
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
            Hubungi Kami
          </h4>
          <ul class="space-y-3 text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
            <li class="flex items-start space-x-3">
              <span class="text-lg flex-shrink-0" role="img" aria-label="Location">📍</span>
              <span>Jakarta, Indonesia<br/><span class="text-es-text-tertiary dark:text-es-text-tertiary-dark text-xs">Alamat lengkap menunggu konfirmasi publikasi</span></span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" aria-label="Phone">📱</span>
              <a href="tel:+6281234567890" class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">+62 812 3456 7890</a>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" aria-label="Email">✉️</span>
              <a href="mailto:hello@esperion.id" class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">hello@esperion.id</a>
            </li>
            <li class="flex items-center space-x-3">
              <span class="text-lg flex-shrink-0" role="img" aria-label="Business hours">🕐</span>
              <span>Senin-Jumat: 09.00-17.00 WIB</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
            © {{ new Date().getFullYear() }} Esperion. Seluruh hak cipta dilindungi.
          </p>
          <div class="flex space-x-6">
            <NuxtLink 
              :to="localePath('/privacy-policy')" 
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm"
            >
              Kebijakan Privasi
            </NuxtLink>
            <NuxtLink 
              :to="localePath('/terms-of-service')" 
              class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors text-sm"
            >
              Syarat Layanan
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/our-works', label: 'Portofolio' },
  { href: '/our-services', label: 'Layanan' },
  { href: '/articles', label: 'Artikel' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact-us', label: 'Kontak' },
];

const services = [
  { href: '/our-services/web-development', label: 'Pengembangan Web' },
  { href: '/our-services/mobile-app-development', label: 'Pengembangan Aplikasi Mobile' },
  { href: '/our-services/ui-ux-design', label: 'UI/UX Design' },
  { href: '/our-services/digital-marketing', label: 'Digital Marketing' },
  { href: '/our-services/ecommerce-solutions', label: 'Solusi E-Commerce' },
  { href: '/our-services/consulting', label: 'Konsultasi Digital' },
];
</script>

<style scoped>
/* Footer link hover animation */
footer a {
  position: relative;
}
</style>
