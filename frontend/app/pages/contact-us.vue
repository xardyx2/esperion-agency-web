<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ t('contact.banner.title') }}
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            {{ t('contact.banner.description') }}
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
                {{ t('contact.form.title') }}
              </h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      {{ t('contact.form.fullNameLabel') }} <span class="text-es-accent-primary">*</span>
                    </label>
                    <input
                      id="fullName"
                      v-model="form.fullName"
                      type="text"
                      required
                      :placeholder="t('contact.form.fullNamePlaceholder')"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>

                  <!-- Company Name -->
                  <div>
                    <label for="companyName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      {{ t('contact.form.companyNameLabel') }}
                    </label>
                    <input
                      id="companyName"
                      v-model="form.companyName"
                      type="text"
                      :placeholder="t('contact.form.companyNamePlaceholder')"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      {{ t('contact.form.emailLabel') }} <span class="text-es-accent-primary">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      :placeholder="t('contact.form.emailPlaceholder')"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      {{ t('contact.form.phoneLabel') }}
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      :placeholder="t('contact.form.phonePlaceholder')"
                      class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                    />
                  </div>
                </div>

                <!-- Service -->
                <div>
                  <label for="service" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    {{ t('contact.form.serviceLabel') }} <span class="text-es-accent-primary">*</span>
                  </label>
                  <select
                    id="service"
                    v-model="form.service"
                    required
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                  >
                    <option value="">{{ t('contact.form.servicePlaceholder') }}</option>
                    <option value="Web Development">{{ t('contact.form.serviceOptions.webDevelopment') }}</option>
                    <option value="Mobile App Development">{{ t('contact.form.serviceOptions.mobileApp') }}</option>
                    <option value="UI/UX Design">{{ t('contact.form.serviceOptions.uiUxDesign') }}</option>
                    <option value="Digital Marketing">{{ t('contact.form.serviceOptions.digitalMarketing') }}</option>
                    <option value="E-Commerce Solutions">{{ t('contact.form.serviceOptions.ecommerce') }}</option>
                    <option value="Consulting">{{ t('contact.form.serviceOptions.consulting') }}</option>
                    <option value="Other">{{ t('contact.form.serviceOptions.other') }}</option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    {{ t('contact.form.descriptionLabel') }} <span class="text-es-accent-primary">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="6"
                    required
                    :placeholder="t('contact.form.descriptionPlaceholder')"
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">{{ t('contact.form.submitButton') }}</span>
                  <span v-else>{{ t('contact.form.submittingButton') }}</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- Contact Details -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                {{ t('contact.info.title') }}
              </h3>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📍</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ t('contact.info.location') }}</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ t('contact.info.locationText') }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📱</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ t('contact.info.phone') }}</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ t('contact.info.phoneText') }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">✉️</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ t('contact.info.email') }}</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ t('contact.info.emailText') }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">🕐</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ t('contact.info.businessHours') }}</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ t('contact.info.businessHoursText') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                {{ t('contact.social.title') }}
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
            {{ t('contact.map.title') }}
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ t('contact.map.description') }}
          </p>
        </div>
        <div class="rounded-xl overflow-hidden h-[400px] bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            🗺️ {{ t('contact.map.placeholder') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsApi, useContactApi } from '../composables/useApi'

const { t } = useI18n();

// SEO Meta
useSeoMeta({
  title: t('seo.contact.title'),
  description: t('seo.contact.description'),
  ogTitle: t('seo.contact.ogTitle'),
  ogDescription: t('seo.contact.ogDescription'),
  ogImage: '/images/contact-banner.jpg',
  ogUrl: 'https://esperion.id/id/contact-us',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.contact.twitterTitle'),
  twitterDescription: t('seo.contact.ogDescription'),
  twitterImage: '/images/contact-banner.jpg',
  ogLocale: 'id_ID',
});

// Define schema for the contact page
useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: t('seo.contact.schemaName'),
    description: t('seo.contact.schemaDescription'),
    url: 'https://esperion.id/id/contact-us',
    dateModified: new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumb.home'),
        item: 'https://esperion.id/id'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb.contact'),
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
const analyticsApi = useAnalyticsApi();

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

    await analyticsApi.trackEvent({
      event_name: 'contact_submit',
      page_url: '/contact-us',
      metadata: {
        service: form.value.service,
      },
    }).catch(() => undefined)
    
    alert(t('contact.form.successMessage'));
    
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
    alert(t('contact.form.errorMessage'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>
