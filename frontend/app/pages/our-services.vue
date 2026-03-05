<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Our Services
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Comprehensive digital solutions to transform your business
          </p>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="service in services"
            :key="service.slug"
            :to="`/our-services/${service.slug}`"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-8 shadow-md hover:shadow-xl transition-all"
          >
            <div class="w-16 h-16 mb-6 rounded-xl bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center group-hover:bg-es-accent-primary dark:group-hover:bg-es-accent-primary-dark transition-colors">
              <span class="text-3xl group-hover:scale-110 transition-transform">{{ service.icon }}</span>
            </div>
            <h3 class="text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
              {{ service.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-6 line-clamp-3">
              {{ service.description }}
            </p>
            <div class="flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-medium">
              Learn More <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Why Choose Esperion?
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
            We deliver exceptional results through our expertise and dedication
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="reason in reasons" :key="reason.title" class="text-center">
            <div class="text-4xl mb-4">{{ reason.icon }}</div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
              {{ reason.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
              {{ reason.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          Ready to Start Your Project?
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          Let's discuss how we can help transform your digital presence
        </p>
        <NuxtLink
          to="/contact-us"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Get a Free Consultation
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Our Services - Esperion Digital Agency',
  description: 'Explore our comprehensive digital services including web development, mobile apps, UI/UX design, and digital marketing.',
  ogTitle: 'Our Services',
  ogDescription: 'Comprehensive digital solutions for your business.',
});

const services = [
  { 
    slug: 'web-development', 
    title: 'Web Development', 
    description: 'Custom websites and web applications built with modern technologies like React, Vue, and Node.js. From simple landing pages to complex enterprise systems.',
    icon: '💻'
  },
  { 
    slug: 'mobile-app-development', 
    title: 'Mobile App Development', 
    description: 'Native and cross-platform mobile applications for iOS and Android using React Native, Flutter, and Swift.',
    icon: '📱'
  },
  { 
    slug: 'ui-ux-design', 
    title: 'UI/UX Design', 
    description: 'User-centered design that creates intuitive and engaging experiences. Wireframes, prototypes, and polished interfaces.',
    icon: '🎨'
  },
  { 
    slug: 'digital-marketing', 
    title: 'Digital Marketing', 
    description: 'SEO, SEM, social media marketing, and content strategies to grow your online presence and drive conversions.',
    icon: '📈'
  },
  { 
    slug: 'ecommerce-solutions', 
    title: 'E-Commerce Solutions', 
    description: 'Complete online store setup with Shopify, WooCommerce, and custom solutions. Payment integration and inventory management.',
    icon: '🛒'
  },
  { 
    slug: 'consulting', 
    title: 'Digital Consulting', 
    description: 'Technology strategy and digital transformation consulting to help your business stay competitive in the digital age.',
    icon: '💡'
  },
];

const reasons = [
  { icon: '🏆', title: 'Proven Track Record', description: '150+ successful projects delivered' },
  { icon: '👥', title: 'Expert Team', description: '25+ skilled professionals' },
  { icon: '⚡', title: 'Fast Delivery', description: 'Agile methodology for quick turnaround' },
  { icon: '💬', title: '24/7 Support', description: 'Dedicated support team always available' },
];
</script>