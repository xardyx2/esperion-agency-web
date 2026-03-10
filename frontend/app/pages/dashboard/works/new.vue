<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.title') }}</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.works_new.description') }}</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/dashboard/works" class="px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors">{{ t('dashboard.works_new.cancel') }}</NuxtLink>
        <button type="button" :disabled="submitting" @click="saveWork" class="px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors disabled:opacity-60">{{ submitting ? t('dashboard.works_new.saveInProgress') : t('dashboard.works_new.publishButton') }}</button>
      </div>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.metrics.title') }}</label>
          <div v-for="(metric, index) in form.metrics" :key="index" class="grid grid-cols-3 gap-4 mb-4">
            <input v-model="metric.label" type="text" :placeholder="t('dashboard.works_new.metrics.labelPlaceholder')" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
            <input v-model="metric.value" type="text" :placeholder="t('dashboard.works_new.metrics.valuePlaceholder')" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
            <input v-model="metric.suffix" type="text" :placeholder="t('dashboard.works_new.metrics.suffixPlaceholder')" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
          </div>
          <button @click="addMetric" class="text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium hover:underline">{{ t('dashboard.works_new.metrics.add') }}</button>
        </div>

        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.details.client.label') }}</label>
          <input v-model="form.client_name" type="text" :placeholder="t('dashboard.works_new.details.client.placeholder')" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>

        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.details.service.label') }}</label>
          <select v-model="form.service" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary">
            <option value="Web Development">{{ t('dashboard.works_new.details.service.options.webDevelopment') }}</option>
            <option value="Mobile App Development">{{ t('dashboard.works_new.details.service.options.mobileAppDevelopment') }}</option>
            <option value="UI/UX Design">{{ t('dashboard.works_new.details.service.options.uiUxDesign') }}</option>
            <option value="Digital Marketing">{{ t('dashboard.works_new.details.service.options.digitalMarketing') }}</option>
            <option value="E-Commerce Solutions">{{ t('dashboard.works_new.details.service.options.ecommerceSolutions') }}</option>
            <option value="Consulting">{{ t('dashboard.works_new.details.service.options.consulting') }}</option>
          </select>
        </div>

        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.details.platform.label') }}</label>
          <input v-model="form.platform" type="text" :placeholder="t('dashboard.works_new.details.platform.placeholder')" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.details.slug.label') }}</label>
          <input v-model="form.slug" type="text" :placeholder="t('dashboard.works_new.details.slug.placeholder')" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>

        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">{{ t('dashboard.works_new.details.featured') }}</h3>
          <div class="flex items-center gap-2">
            <input v-model="form.featured" type="checkbox" class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary" />
            <label class="text-sm text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.works_new.details.featured') }}</label>
          </div>
        </div>

        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">{{ t('dashboard.works_new.image.title') }}</h3>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.works_new.image.label') }}</label>
          <input v-model="form.image" type="text" :placeholder="t('dashboard.works_new.image.placeholder')" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorksApi } from '../../../composables/useApi'

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.works_new.seo.title'), description: t('dashboard.works_new.seo.description') })

const router = useRouter()
const worksApi = useWorksApi()
const submitting = ref(false)
const error = ref('')

const form = ref({
  title: '',
  slug: '',
  description: '',
  client_name: '',
  service: 'Web Development',
  platform: '',
  image: '',
  featured: false,
  metrics: [{ label: '', value: '', suffix: '' }],
})

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

const addMetric = () => {
  form.value.metrics.push({ label: '', value: '', suffix: '' })
}

const saveWork = async () => {
  submitting.value = true
  error.value = ''
  try {
    const metrics = form.value.metrics
      .filter(metric => metric.label.trim() && metric.value.trim())
      .map(metric => ({
        label: metric.label.trim(),
        value: metric.value.trim(),
        suffix: metric.suffix.trim() || undefined,
      }))

    await worksApi.create({
      title: form.value.title,
      slug: form.value.slug || slugify(form.value.title),
      description: form.value.description,
      service: form.value.service,
      platform: form.value.platform,
      image: form.value.image,
      client_name: form.value.client_name,
      featured: form.value.featured,
      metrics,
    })

    await router.push('/dashboard/works')
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.works_new.publishButton')
  }
  finally {
    submitting.value = false
  }
}
</script>
