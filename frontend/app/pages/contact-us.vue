<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Hubungi Kami
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Ceritakan kebutuhan Anda, lalu kami bantu petakan langkah digital yang paling relevan.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                Kirim Brief Anda
              </h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                       Nama Lengkap <span class="text-es-accent-primary">*</span>
                    </label>
                    <input
                      id="fullName"
                      v-model="form.fullName"
                      type="text"
                      required
                       placeholder="Nama Anda"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>

                  <!-- Company Name -->
                  <div>
                    <label for="companyName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                       Nama Perusahaan
                    </label>
                    <input
                      id="companyName"
                      v-model="form.companyName"
                      type="text"
                       placeholder="Nama perusahaan atau brand"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      Email <span class="text-es-accent-primary">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                       Nomor Telepon
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>
                </div>

                <!-- Service -->
                <div>
                  <label for="service" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                     Layanan yang Dibutuhkan <span class="text-es-accent-primary">*</span>
                  </label>
                  <select
                    id="service"
                    v-model="form.service"
                    required
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                  >
                    <option value="">Pilih layanan</option>
                    <option value="Web Development">Pengembangan Web</option>
                    <option value="Mobile App Development">Aplikasi Mobile</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="E-Commerce Solutions">Solusi E-Commerce</option>
                    <option value="Consulting">Konsultasi Digital</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                     Ringkasan Proyek <span class="text-es-accent-primary">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="6"
                    required
                     placeholder="Ceritakan tujuan, konteks, dan target waktu proyek Anda..."
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">Kirim Pesan</span>
                  <span v-else>Mengirim...</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- Contact Details -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                 Informasi Kontak
              </h3>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📍</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Lokasi</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📱</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Telepon / WhatsApp</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      +62 812 3456 7890
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">✉️</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Email</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      hello@esperion.id
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">🕐</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Jam Operasional</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      Senin - Jumat: 09.00 - 18.00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                 Ikuti Esperion
              </h3>
              <div class="flex flex-wrap gap-4">
                 <a href="https://instagram.com/esperion_id" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  📷
                </a>
                 <a href="https://facebook.com/esperiondigital" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  👍
                </a>
                 <a href="https://linkedin.com/company/esperiondigital" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  💼
                </a>
                 <a href="https://tiktok.com/@esperion_id" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  🎵
                </a>
                 <a href="https://twitter.com/esperion_id" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  𝕏
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Lokasi Kami
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            Informasi alamat detail akan ditampilkan setelah materi publik final dikonfirmasi
          </p>
        </div>
        <div class="rounded-xl overflow-hidden h-[400px] bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            🗺️ Placeholder peta - menunggu detail lokasi publik resmi
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useContactApi } from '../composables/useApi'

// SEO Meta
useSeoMeta({
  title: 'Hubungi Kami - Esperion Digital Agency Jakarta',
  description: 'Kontak Esperion Digital Agency di Jakarta. Kami siap membantu transormasi digital bisnis Anda. Konsultasi GRATIS!',
  ogTitle: 'Kontak Esperion - Digital Agency Jakarta',
  ogDescription: 'Hubungi kami untuk konsultasi GRATIS tentang proyek digital Anda.',
  ogImage: '/images/contact-banner.jpg',
  ogUrl: 'https://esperion.id/id/contact-us',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Kontak Esperion - Digital Agency Jakarta',
  twitterDescription: 'Hubungi kami untuk konsultasi GRATIS tentang proyek digital Anda.',
  twitterImage: '/images/contact-banner.jpg',
  ogLocale: 'id_ID',
});

// Define schema for the contact page
useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: 'Hubungi Kami - Esperion Digital Agency',
    description: 'Halaman kontak untuk Esperion Digital Agency di Jakarta',
    url: 'https://esperion.id/id/contact-us',
    dateModified: new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://esperion.id/id'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kontak Kami',
        item: 'https://esperion.id/id/contact-us'
      }
    ]
  })
]);

// Form state
const form = ref({
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  service: '',
  description: '',
});

const isSubmitting = ref(false);

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // Get the runtime config that contains the reCAPTCHA site key
    const config = useRuntimeConfig();
    const recaptchaSiteKey = config.public.recaptchaSiteKey;
    
    let recaptchaToken = null;
    
    // Execute reCAPTCHA if site key is configured and reCAPTCHA is loaded
    const windowWithRecaptcha = window as Window & {
      grecaptcha?: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }

    if (recaptchaSiteKey && typeof window !== 'undefined' && windowWithRecaptcha.grecaptcha) {
      try {
        recaptchaToken = await windowWithRecaptcha.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
      } catch (recaptchaError) {
        console.warn('reCAPTCHA execution failed, continuing without token:', recaptchaError);
        // Continue with form submission even if reCAPTCHA fails, letting the backend decide
      }
    } else if (recaptchaSiteKey) {
      console.warn('reCAPTCHA library not loaded, attempting to execute without it');
    }
    
    // Prepare the API payload with reCAPTCHA token (if available)
    const payload = {
      full_name: form.value.fullName,
      company_name: form.value.companyName || undefined,
      email: form.value.email || undefined,
      phone: form.value.phone || undefined,
      service: form.value.service,
      description: form.value.description,
      recaptcha_token: recaptchaToken || undefined,
    };
    
    // Call the contact API
    const { submit } = useContactApi();
    await submit(payload);
    
    alert('Terima kasih. Brief Anda sudah terkirim dan tim Esperion akan segera menghubungi Anda.');
    
    // Reset form
    form.value = {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      service: '',
      description: '',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Terjadi kendala saat mengirim pesan. Silakan coba beberapa saat lagi.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
