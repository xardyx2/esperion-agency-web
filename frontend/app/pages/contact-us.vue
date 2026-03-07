<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Contact Us
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Let's discuss your project and find the perfect solution
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
                Send Us a Message
              </h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      Full Name <span class="text-es-accent-primary">*</span>
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

                  <!-- Company Name -->
                  <div>
                    <label for="companyName" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      v-model="form.companyName"
                      type="text"
                      placeholder="Your Company"
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
                      Phone
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
                    Service <span class="text-es-accent-primary">*</span>
                  </label>
                  <select
                    id="service"
                    v-model="form.service"
                    required
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
                  >
                    <option value="">Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    Project Description <span class="text-es-accent-primary">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="6"
                    required
                    placeholder="Tell us about your project, goals, and timeline..."
                    class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">Send Message</span>
                  <span v-else>Sending...</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- Contact Details -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                Contact Information
              </h3>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📍</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Address</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">📱</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Phone / WhatsApp</h4>
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
                      hello@esperion.com
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-2xl">🕐</span>
                  <div>
                    <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">Business Hours</h4>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                Follow Us
              </h3>
              <div class="flex flex-wrap gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  📷
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  👍
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  💼
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
                  🎵
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center text-2xl hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
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
            Our Location
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            Visit us at our Jakarta office
          </p>
        </div>
        <div class="rounded-xl overflow-hidden h-[400px] bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            🗺️ Map placeholder - Integrate with Google Maps
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Contact Us - Esperion Digital Agency',
  description: 'Get in touch with Esperion Digital Agency. We are here to help transform your digital presence.',
  ogTitle: 'Contact Esperion',
  ogDescription: 'Let us discuss your project.',
});

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
    if (recaptchaSiteKey && typeof window !== 'undefined' && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {action: 'contact'});
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
    
    // Show success notification
    alert('Thank you for your message! We will get back to you soon.');
    
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
    alert('There was an error submitting your message. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>