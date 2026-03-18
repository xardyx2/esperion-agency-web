<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Our Works
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects across various industries
          </p>
        </div>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="py-8 border-b border-es-border dark:border-es-border-dark sticky top-16 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Service Filter Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="service in allServices"
              :key="service.value"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedService === service.value
                ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark'
                : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary/10 dark:hover:bg-es-accent-primary-dark/10'"
              @click="selectedService = service.value"
            >
              {{ service.label }}
            </button>
          </div>

          <!-- Platform Filter Dropdown -->
          <div class="flex items-center gap-2">
            <select
              v-model="selectedPlatform"
              class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            >
              <option value="">
                All Platforms
              </option>
              <option
                v-for="platform in platforms"
                :key="platform"
                :value="platform"
              >
                {{ platform }}
              </option>
            </select>

            <button
              v-if="selectedService || selectedPlatform"
              class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium"
              @click="clearFilters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Works Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <!-- Results Count -->
        <div class="mb-8">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            Showing {{ filteredWorks.length }} of {{ works.length }} projects
          </p>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredWorks.length === 0"
          class="text-center py-16"
        >
          <div class="text-6xl mb-4">
            🔍
          </div>
          <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            No projects found
          </h3>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">
            Try adjusting your filters to see more results
          </p>
          <button
            class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            @click="clearFilters"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Works Grid -->
        <div
          v-else
          class="grid md:grid-cols-2 gap-8"
        >
          <NuxtLink
            v-for="work in visibleWorks"
            :key="work.id"
            :to="`/our-works/${work.slug}`"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <div class="relative overflow-hidden">
              <img
                :src="work.image"
                :alt="work.title"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              >
              <div
                v-if="work.featured"
                class="absolute top-4 right-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full"
              >
                Featured
              </div>
            </div>
            <div class="p-6">
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">
                  {{ work.service }}
                </span>
                <span class="px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full">
                  {{ work.platform }}
                </span>
              </div>
              <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2">
                {{ work.description }}
              </p>
              <div class="flex flex-wrap gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                <div
                  v-for="metric in work.metrics.slice(0, 3)"
                  :key="metric.label"
                >
                  <span class="font-semibold text-es-accent-primary dark:text-es-accent-primary-dark">{{ metric.value }}{{ metric.suffix }}</span>
                  <span class="ml-1">{{ metric.label }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Load More -->
        <div
          v-if="filteredWorks.length > visibleWorks.length"
          class="text-center mt-12"
        >
          <button
            class="px-8 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-medium hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            @click="loadMore"
          >
            See More Projects
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Our Works - Esperion Digital Agency Portfolio',
  description: 'Browse our portfolio of successful digital projects including web development, mobile apps, and UI/UX design.',
  ogTitle: 'Our Works Portfolio',
  ogDescription: 'Explore our successful digital projects.'
})

// State
const selectedService = ref('')
const selectedPlatform = ref('')
const visibleCount = ref(6)

// All Services for filter
const allServices = [
  { value: '', label: 'All Services' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile App Development', label: 'Mobile App Development' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'E-Commerce Solutions', label: 'E-Commerce' },
  { value: 'Consulting', label: 'Consulting' }
]

// Available platforms
const platforms = ['Shopify', 'React Native', 'Next.js', 'Nuxt', 'Flutter', 'WordPress', 'Laravel', 'Vue.js']

// Works data
const works = ref([
  {
    id: 1,
    slug: 'ecommerce-platform-redesign',
    title: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of online store resulting in 45% increase in conversions and improved user experience.',
    image: '/works/work-1.jpg',
    service: 'Web Development',
    platform: 'Shopify',
    featured: true,
    client_name: 'Fashion Retailer',
    metrics: [
      { label: 'Conversion Increase', value: '45', suffix: '%' },
      { label: 'Revenue Growth', value: '120', suffix: '%' },
      { label: 'Page Speed', value: '2.1', suffix: 's' }
    ]
  },
  {
    id: 2,
    slug: 'mobile-banking-app',
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking experience with biometric authentication and real-time notifications.',
    image: '/works/work-2.jpg',
    service: 'Mobile App Development',
    platform: 'React Native',
    featured: true,
    client_name: 'Regional Bank',
    metrics: [
      { label: 'Downloads', value: '50', suffix: 'K+' },
      { label: 'App Rating', value: '4.8', suffix: '/5' },
      { label: 'Active Users', value: '30', suffix: 'K' }
    ]
  },
  {
    id: 3,
    slug: 'healthcare-portal',
    title: 'Healthcare Patient Portal',
    description: 'Comprehensive patient management system with telemedicine capabilities and electronic health records.',
    image: '/works/work-3.jpg',
    service: 'Web Development',
    platform: 'Next.js',
    featured: true,
    client_name: 'Healthcare Network',
    metrics: [
      { label: 'Patients Served', value: '100', suffix: 'K+' },
      { label: 'Doctors', value: '500', suffix: '+' },
      { label: 'Uptime', value: '99.9', suffix: '%' }
    ]
  },
  {
    id: 4,
    slug: 'restaurant-website',
    title: 'Restaurant Chain Website',
    description: 'Multi-location website with online ordering integration and real-time menu management.',
    image: '/works/work-4.jpg',
    service: 'Web Development',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Restaurant Group',
    metrics: [
      { label: 'Locations', value: '25', suffix: '+' },
      { label: 'Online Orders', value: '10', suffix: 'K/mo' },
      { label: 'SEO Traffic', value: '200', suffix: '%' }
    ]
  },
  {
    id: 5,
    slug: 'fitness-tracking-app',
    title: 'Fitness Tracking App',
    description: 'Comprehensive fitness tracking application with AI-powered workout recommendations and nutrition planning.',
    image: '/works/work-5.jpg',
    service: 'Mobile App Development',
    platform: 'Flutter',
    featured: true,
    client_name: 'Fitness Startup',
    metrics: [
      { label: 'Active Users', value: '25', suffix: 'K' },
      { label: 'Workouts Tracked', value: '1', suffix: 'M+' },
      { label: 'App Rating', value: '4.7', suffix: '/5' }
    ]
  },
  {
    id: 6,
    slug: 'saas-dashboard-ui',
    title: 'SaaS Dashboard UI Design',
    description: 'Modern and intuitive dashboard design for B2B SaaS platform with complex data visualization.',
    image: '/works/work-6.jpg',
    service: 'UI/UX Design',
    platform: 'Vue.js',
    featured: false,
    client_name: 'SaaS Company',
    metrics: [
      { label: 'User Engagement', value: '60', suffix: '%' },
      { label: 'Task Completion', value: '85', suffix: '%' },
      { label: 'NPS Score', value: '72', suffix: '' }
    ]
  },
  {
    id: 7,
    slug: 'digital-marketing-campaign',
    title: 'Digital Marketing Campaign',
    description: 'Integrated digital marketing campaign across multiple channels driving brand awareness and lead generation.',
    image: '/works/work-7.jpg',
    service: 'Digital Marketing',
    platform: 'WordPress',
    featured: false,
    client_name: 'Tech Startup',
    metrics: [
      { label: 'Lead Increase', value: '300', suffix: '%' },
      { label: 'CTR', value: '4.5', suffix: '%' },
      { label: 'ROI', value: '450', suffix: '%' }
    ]
  },
  {
    id: 8,
    slug: 'ecommerce-mobile-app',
    title: 'E-Commerce Mobile App',
    description: 'Native shopping app with AR product visualization and seamless checkout experience.',
    image: '/works/work-8.jpg',
    service: 'Mobile App Development',
    platform: 'React Native',
    featured: false,
    client_name: 'Retail Brand',
    metrics: [
      { label: 'App Sales', value: '35', suffix: '%' },
      { label: 'Retention Rate', value: '45', suffix: '%' },
      { label: 'Avg Order Value', value: '85', suffix: '$' }
    ]
  },
  {
    id: 9,
    slug: 'corporate-website',
    title: 'Corporate Website Redesign',
    description: 'Enterprise website redesign with improved navigation and content management system.',
    image: '/works/work-9.jpg',
    service: 'Web Development',
    platform: 'Laravel',
    featured: false,
    client_name: 'Corporation',
    metrics: [
      { label: 'Page Views', value: '500', suffix: 'K/mo' },
      { label: 'Bounce Rate', value: '-40', suffix: '%' },
      { label: 'Load Time', value: '1.8', suffix: 's' }
    ]
  },
  {
    id: 10,
    slug: 'brand-identity-design',
    title: 'Brand Identity Design',
    description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
    image: '/works/work-10.jpg',
    service: 'UI/UX Design',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Startup',
    metrics: [
      { label: 'Brand Recognition', value: '75', suffix: '%' },
      { label: 'Social Engagement', value: '200', suffix: '%' },
      { label: 'Website Traffic', value: '150', suffix: '%' }
    ]
  },
  {
    id: 11,
    slug: 'seo-optimization-project',
    title: 'SEO Optimization Project',
    description: 'Comprehensive SEO strategy resulting in top rankings for competitive keywords.',
    image: '/works/work-11.jpg',
    service: 'Digital Marketing',
    platform: 'WordPress',
    featured: false,
    client_name: 'Service Company',
    metrics: [
      { label: 'Organic Traffic', value: '400', suffix: '%' },
      { label: 'Keyword Rankings', value: '50', suffix: '+' },
      { label: 'Backlinks', value: '200', suffix: '+' }
    ]
  },
  {
    id: 12,
    slug: 'digital-transformation-consulting',
    title: 'Digital Transformation Consulting',
    description: 'Strategic consulting for enterprise digital transformation initiative.',
    image: '/works/work-12.jpg',
    service: 'Consulting',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Enterprise',
    metrics: [
      { label: 'Cost Reduction', value: '30', suffix: '%' },
      { label: 'Efficiency Gain', value: '50', suffix: '%' },
      { label: 'Employee Satisfaction', value: '85', suffix: '%' }
    ]
  }
])

// Computed
const filteredWorks = computed(() => {
  return works.value.filter((work) => {
    const matchesService = !selectedService.value || work.service === selectedService.value
    const matchesPlatform = !selectedPlatform.value || work.platform === selectedPlatform.value
    return matchesService && matchesPlatform
  })
})

const visibleWorks = computed(() => {
  return filteredWorks.value.slice(0, visibleCount.value)
})

// Methods
const clearFilters = () => {
  selectedService.value = ''
  selectedPlatform.value = ''
  visibleCount.value = 6
}

const loadMore = () => {
  visibleCount.value += 6
}
</script>
