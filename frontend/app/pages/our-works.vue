<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Portofolio Kami
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Lihat contoh pendekatan kerja Esperion di berbagai kebutuhan digital
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
              @click="selectedService = service.value"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedService === service.value 
                ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark' 
                : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary/10 dark:hover:bg-es-accent-primary-dark/10'"
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
              <option value="">Semua Platform</option>
              <option v-for="platform in platforms" :key="platform" :value="platform">
                {{ platform }}
              </option>
            </select>

            <button
              v-if="selectedService || selectedPlatform"
              @click="clearFilters"
              class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium"
            >
              Reset Filter
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
            Menampilkan {{ filteredWorks.length }} dari {{ works.length }} proyek
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="filteredWorks.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Proyek tidak ditemukan
          </h3>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">
            Coba ubah filter untuk melihat hasil lain
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>

        <!-- Works Grid -->
        <div v-else class="grid md:grid-cols-2 gap-8">
          <NuxtLink
            v-for="work in visibleWorks"
            :key="work.id"
            :to="localePath(`/our-works/${work.slug}`)"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <div class="relative overflow-hidden">
              <img 
                :src="work.image" 
                :alt="work.title" 
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div v-if="work.featured" class="absolute top-4 right-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full">
                 Sorotan
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
                <div v-for="metric in work.metrics.slice(0, 3)" :key="metric.label">
                  <span class="font-semibold text-es-accent-primary dark:text-es-accent-primary-dark">{{ metric.value }}{{ metric.suffix }}</span>
                  <span class="ml-1">{{ metric.label }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Load More -->
        <div v-if="filteredWorks.length > visibleWorks.length" class="text-center mt-12">
          <button
            @click="loadMore"
            class="px-8 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-medium hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
          >
            Lihat Proyek Lainnya
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { publicWorks } from '../data/public-content';

// SEO Meta
useSeoMeta({
  title: 'Portofolio - Proyek Pilihan Esperion',
  description: 'Jelajahi portofolio proyek digital Esperion, mulai dari website, aplikasi mobile, hingga pengalaman produk yang lebih terarah.',
  ogTitle: 'Portofolio Esperion',
  ogDescription: 'Lihat beberapa proyek digital pilihan dari Esperion.',
});

const localePath = useLocalePath();

// State
const selectedService = ref('');
const selectedPlatform = ref('');
const visibleCount = ref(6);

// All Services for filter
const allServices = [
  { value: '', label: 'Semua Layanan' },
  { value: 'Web Development', label: 'Pengembangan Web' },
  { value: 'Mobile App Development', label: 'Aplikasi Mobile' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'E-Commerce Solutions', label: 'E-Commerce' },
  { value: 'Consulting', label: 'Konsultasi' },
];

// Available platforms
const platforms = ['Shopify', 'React Native', 'Next.js', 'Nuxt', 'Flutter', 'WordPress', 'Laravel', 'Vue.js'];

// Works data
const works = ref(publicWorks);

// Computed
const filteredWorks = computed(() => {
  return works.value.filter(work => {
    const matchesService = !selectedService.value || work.service === selectedService.value;
    const matchesPlatform = !selectedPlatform.value || work.platform === selectedPlatform.value;
    return matchesService && matchesPlatform;
  });
});

const visibleWorks = computed(() => {
  return filteredWorks.value.slice(0, visibleCount.value);
});

// Methods
const clearFilters = () => {
  selectedService.value = '';
  selectedPlatform.value = '';
  visibleCount.value = 6;
};

const loadMore = () => {
  visibleCount.value += 6;
};
</script>
