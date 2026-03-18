<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Hero Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <div class="text-6xl mb-6">
            {{ service.icon }}
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ service.title }}
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            {{ service.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- What We Offer -->
            <div class="mb-12">
              <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                What We Offer
              </h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div
                  v-for="feature in features"
                  :key="feature.title"
                  class="flex gap-4"
                >
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center">
                    <span class="text-xl">{{ feature.icon }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
                      {{ feature.title }}
                    </h3>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Process -->
            <div class="mb-12">
              <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                Our Process
              </h2>
              <div class="space-y-6">
                <div
                  v-for="(step, index) in process"
                  :key="step.title"
                  class="flex gap-4"
                >
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark flex items-center justify-center font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
                      {{ step.title }}
                    </h3>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Pricing -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6 mb-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
                Starting From
              </h3>
              <div class="text-4xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
                {{ service.pricing }}
              </div>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4">
                Custom quotes available based on project scope
              </p>
              <NuxtLink
                to="/contact-us"
                class="w-full inline-flex justify-center items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              >
                Get a Quote
              </NuxtLink>
            </div>

            <!-- FAQ -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
                Frequently Asked Questions
              </h3>
              <div class="space-y-4">
                <div
                  v-for="faq in faqs"
                  :key="faq.question"
                  class="border-b border-es-border dark:border-es-border-dark pb-4 last:border-0 last:pb-0"
                >
                  <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    {{ faq.question }}
                  </h4>
                  <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Services -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">
          Related Services
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in relatedServices"
            :key="related.slug"
            :to="`/our-services/${related.slug}`"
            class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div class="text-3xl mb-4">{{ related.icon }}</div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
              {{ related.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2">
              {{ related.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          Let's discuss your project and find the perfect solution for your business
        </p>
        <NuxtLink
          to="/contact-us"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Contact Us Today
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Service data (in production, fetch from API based on slug)
const service = ref({
  slug: route.params.slug,
  title: 'Web Development',
  description: 'Custom websites and web applications built with modern technologies.',
  icon: '💻',
  pricing: '$5,000'
})

const features = [
  { icon: '🎨', title: 'Custom Design', description: 'Unique designs tailored to your brand' },
  { icon: '⚡', title: 'Fast Performance', description: 'Optimized for speed and efficiency' },
  { icon: '📱', title: 'Mobile Responsive', description: 'Perfect on all devices' },
  { icon: '🔒', title: 'Secure', description: 'Built with security best practices' },
  { icon: '🔍', title: 'SEO Optimized', description: 'Ready to rank on search engines' },
  { icon: '🛠️', title: 'Easy Maintenance', description: 'Simple to update and manage' }
]

const process = [
  { title: 'Discovery', description: 'We learn about your business, goals, and requirements' },
  { title: 'Planning', description: 'Create detailed project plan and timeline' },
  { title: 'Design', description: 'Design wireframes and visual mockups' },
  { title: 'Development', description: 'Build your solution using agile methodology' },
  { title: 'Testing', description: 'Thorough testing for quality assurance' },
  { title: 'Launch', description: 'Deploy and monitor your project' }
]

const faqs = [
  { question: 'How long does a typical project take?', answer: 'Most projects take 4-12 weeks depending on complexity and scope.' },
  { question: 'What technologies do you use?', answer: 'We use modern technologies like React, Vue, Node.js, and more based on project needs.' },
  { question: 'Do you provide ongoing support?', answer: 'Yes, we offer maintenance and support packages for all our projects.' },
  { question: 'Can you work with existing designs?', answer: 'Absolutely! We can work with your existing designs or create new ones.' }
]

const relatedServices = [
  { slug: 'mobile-app-development', title: 'Mobile App Development', description: 'Native and cross-platform mobile apps', icon: '📱' },
  { slug: 'ui-ux-design', title: 'UI/UX Design', description: 'User-centered design solutions', icon: '🎨' },
  { slug: 'ecommerce-solutions', title: 'E-Commerce Solutions', description: 'Complete online store solutions', icon: '🛒' }
]

const serviceName = computed(() => service.value.title)
const serviceSlug = computed(() => service.value.slug)

// Generate SEO meta dynamically
const pageUrl = `https://esperion.one/id/our-services/${serviceSlug.value}`
const imageUrl = `/images/service-${serviceSlug.value.replace(/-/g, '')}.jpg`

useSeoMeta({
  title: `${serviceName.value} Jakarta | Jasa ${serviceName.value} Terbaik`,
  description: `Kami menawarkan layanan ${service.value.description.toLowerCase()}. Solusi terbaik untuk memajukan bisnis Anda.`,
  ogTitle: `${serviceName.value} Jakarta | Jasa ${serviceName.value} Terbaik`,
  ogDescription: `Kami menawarkan layanan ${service.value.description.toLowerCase()}. Solusi terbaik untuk memajukan bisnis Anda.`,
  ogImage: imageUrl || '/images/hero-service-development.jpg',
  ogUrl: pageUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: `${serviceName.value} Jakarta | Jasa ${serviceName.value} Terbaik`,
  twitterDescription: `Kami menawarkan layanan ${service.value.description.toLowerCase()}. Solusi terbaik untuk memajukan bisnis Anda.`,
  twitterImage: imageUrl || '/images/hero-service-development.jpg',
  alternates: {
    canonical: pageUrl
  },
  link: [
    { rel: 'alternate', hreflang: 'id', href: pageUrl },
    { rel: 'alternate', hreflang: 'en', href: pageUrl.replace('/id/', '/en/') },
    { rel: 'alternate', hreflang: 'x-default', href: pageUrl }
  ]
})

// Implement BreadcrumbList and FAQPage schemas
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    'name': service.value.title,
    'description': service.value.description,
    'url': pageUrl,
    'image': imageUrl || '/images/hero-service-development.jpg',
    'dateModified': new Date().toISOString()
  }),
  defineBreadcrumbList({
    itemListElement: [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Beranda',
        'item': 'https://esperion.one/id'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Layanan',
        'item': 'https://esperion.one/id/our-services'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': service.value.title,
        'item': pageUrl
      }
    ]
  }),
  defineFAQPage({
    mainEntity: [
      {
        '@type': 'Question',
        'name': 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan proyek?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Durasi rata-rata untuk sebuah proyek adalah 4-12 minggu tergantung pada kompleksitas dan lingkup pekerjaan.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Apa saja teknologi yang digunakan?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Kami menggunakan teknologi modern seperti React, Vue, Node.js, dan lainnya sesuai kebutuhan proyek Anda.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Apakah Anda menyediakan dukungan purna jual?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Ya, kami menawarkan paket pemeliharaan dan dukungan untuk semua proyek yang kami kerjakan.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Dapatkah Anda bekerja dengan desain yang sudah ada?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Tentu! Kami bisa bekerja dengan desain yang sudah Anda miliki atau membuat yang baru dari awal.'
        }
      }
    ]
  })
])
</script>
