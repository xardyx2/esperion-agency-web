<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
          {{ t('dashboard.articles_new.title') }}
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.articles_new.description') }}
        </p>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          to="/dashboard/articles"
          class="rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
        >
          {{ t('dashboard.articles_new.cancel') }}
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg bg-es-accent-primary px-5 py-3 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
          :disabled="submitting"
          @click="saveArticle"
        >
          {{ submitting ? t('dashboard.articles_new.saveInProgress') : t('dashboard.articles_new.createButton') }}
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-6 xl:grid-cols-[2fr,1fr]">
      <section class="space-y-6">
        <div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.articles_new.content.indonesian') }}</label>
          <textarea
            v-model="form.content_id"
            rows="12"
            :placeholder="t('dashboard.articles_new.content.placeholder')"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          />
        </div>

        <div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.articles_new.excerpt.title') }}</label>
          <textarea
            v-model="form.excerpt_id"
            rows="4"
            :placeholder="t('dashboard.articles_new.excerpt.placeholder')"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          />
        </div>
      </section>

      <aside class="space-y-6">
        <section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ t('dashboard.articles_new.publishing.title') }}
          </h2>
          <div class="space-y-4">
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
              {{ t('dashboard.articles_new.publishing.category') }}
              <select
                v-model="form.category"
                class="mt-2 w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
              >
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Business">Business</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>
            </label>
            <label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark">
              <input
                v-model="form.published"
                type="checkbox"
                class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"
              >
              {{ t('dashboard.articles_new.publishing.publishImmediately') }}
            </label>
          </div>
        </section>

        <section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <h2 class="mb-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ t('dashboard.articles_new.translationWorkflow.title') }}
          </h2>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ t('dashboard.articles_new.translationWorkflow.description') }}
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticlesApi } from '../../../composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.articles_new.seo.title'), description: t('dashboard.articles_new.seo.description') })

const router = useRouter()
const articlesApi = useArticlesApi()

const submitting = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  content_id: '',
  excerpt_id: '',
  category: 'Marketing',
  published: false
})

const saveArticle = async () => {
  submitting.value = true
  error.value = ''
  try {
    const article = await articlesApi.create({
      title: form.title,
      content_id: form.content_id,
      excerpt_id: form.excerpt_id,
      category: form.category,
      published: form.published
    })
    await router.push(`/dashboard/articles/${article.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_new.createButton')
  } finally {
    submitting.value = false
  }
}
</script>
