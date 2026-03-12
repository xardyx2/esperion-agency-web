<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">
          {{ t('dashboard.articles_edit.title') }}
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.articles_edit.description') }}
        </p>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          to="/dashboard/articles"
          class="rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
        >
          {{ t('dashboard.articles_edit.back') }}
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg bg-es-accent-primary px-5 py-3 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
          :disabled="submitting"
          @click="saveArticle"
        >
          {{ submitting ? t('dashboard.articles_edit.saveInProgress') : t('dashboard.articles_edit.saveButton') }}
        </button>
      </div>
    </div>

    <div
      v-if="pending"
      class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
    >
      {{ t('dashboard.articles_edit.loading') }}
    </div>
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div
      v-else
      class="grid gap-6 xl:grid-cols-[2fr,1fr]"
    >
      <section class="space-y-6">
        <div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <label class="mb-2 block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.articles_edit.content.indonesian') }}</label>
          <textarea
            v-model="form.content_id"
            rows="10"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          ></textarea>
        </div>

        <div class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                {{ t('dashboard.articles_edit.content.english') }}
              </h2>
              <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.articles_edit.content.englishDescription') }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-es-border px-4 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
              :disabled="translating"
              @click="translateToEnglish"
            >
              {{ translating ? t('dashboard.articles_edit.content.translating') : t('dashboard.articles_edit.content.translateButton') }}
            </button>
          </div>
          <textarea
            v-model="englishDraft"
            rows="10"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          ></textarea>
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              class="rounded-lg bg-es-accent-primary px-4 py-2 text-sm font-semibold text-es-text-inverse hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
              :disabled="reviewing"
              @click="reviewEnglishDraft"
            >
              {{ reviewing ? t('dashboard.articles_edit.content.reviewing') : t('dashboard.articles_edit.content.reviewButton') }}
            </button>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ t('dashboard.articles_edit.publishing.title') }}
          </h2>
          <div class="space-y-4">
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
              {{ t('dashboard.articles_edit.publishing.category') }}
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
              {{ t('dashboard.articles_edit.publishing.published') }}
            </label>
          </div>
        </section>

        <section class="rounded-xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
          <h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ t('dashboard.articles_edit.translationStatus.title') }}
          </h2>
          <div class="space-y-3 text-sm">
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.articles_edit.translationStatus.current') }} <span class="font-semibold text-es-text-primary dark:text-es-text-primary-dark">{{ translationState.translation_status }}</span>
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.articles_edit.translationStatus.available') }} {{ translationState.available_languages.join(', ') || 'none' }}
            </p>
            <select
              v-model="translationState.translation_status"
              class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
            >
              <option value="draft">
                {{ t('dashboard.articles.status.draft') }}
              </option>
              <option value="id_only">
                {{ t('dashboard.articles.status.id_only') }}
              </option>
              <option value="en_only">
                {{ t('dashboard.articles.status.en_only') }}
              </option>
              <option value="complete">
                {{ t('dashboard.articles.status.complete') }}
              </option>
            </select>
            <button
              type="button"
              class="w-full rounded-lg border border-es-border px-4 py-3 text-sm font-medium text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
              :disabled="statusSaving"
              @click="saveTranslationStatus"
            >
              {{ statusSaving ? t('dashboard.articles_edit.translationStatus.saveInProgress') : t('dashboard.articles_edit.translationStatus.save') }}
            </button>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticlesApi } from '../../../composables/useApi'
import type { Article, ArticleTranslationsResponse, UpdateArticleRequest } from '../../../types/api'

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.articles_edit.seo.title'),
  description: t('dashboard.articles_edit.seo.description')
})

const route = useRoute()
const router = useRouter()
const articlesApi = useArticlesApi()

const articleId = computed(() => String(route.params.id || ''))
const pending = ref(false)
const submitting = ref(false)
const translating = ref(false)
const reviewing = ref(false)
const statusSaving = ref(false)
const error = ref('')
const englishDraft = ref('')

const form = reactive<UpdateArticleRequest>({
  title: '',
  slug_id: '',
  slug_en: '',
  content_id: '',
  content_en: '',
  excerpt_id: '',
  excerpt_en: '',
  category: 'Marketing',
  image: '',
  published: false
})

const translationState = reactive<ArticleTranslationsResponse>({
  id: '',
  slug_id: '',
  slug_en: '',
  content_id: '',
  content_en: '',
  translation_status: 'draft',
  available_languages: []
})

const applyArticle = (article: Article) => {
  form.title = article.title
  form.slug_id = article.slug_id
  form.slug_en = article.slug_en
  form.content_id = article.content_id
  form.content_en = article.content_en || ''
  form.excerpt_id = article.excerpt_id || ''
  form.excerpt_en = article.excerpt_en || ''
  form.category = article.category
  form.image = article.image || ''
  form.published = article.published
  englishDraft.value = article.content_en || ''
}

const applyTranslationState = (state: ArticleTranslationsResponse) => {
  translationState.id = state.id
  translationState.slug_id = state.slug_id
  translationState.slug_en = state.slug_en
  translationState.content_id = state.content_id
  translationState.content_en = state.content_en || ''
  translationState.translation_status = state.translation_status
  translationState.available_languages = state.available_languages
}

const loadArticle = async () => {
  pending.value = true
  error.value = ''
  try {
    const [article, translations] = await Promise.all([
      articlesApi.getBySlug(articleId.value),
      articlesApi.getTranslations(articleId.value)
    ])
    applyArticle(article)
    applyTranslationState(translations)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_edit.loading')
  } finally {
    pending.value = false
  }
}

const saveArticle = async () => {
  submitting.value = true
  error.value = ''
  try {
    const updated = await articlesApi.update(articleId.value, {
      ...form,
      content_en: englishDraft.value || undefined
    })
    applyArticle(updated)
    applyTranslationState(await articlesApi.getTranslations(articleId.value))
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_edit.saveInProgress')
  } finally {
    submitting.value = false
  }
}

const translateToEnglish = async () => {
  translating.value = true
  error.value = ''
  try {
    const translated = await articlesApi.translate(articleId.value, { target_languages: ['en'], update_cache: true })
    englishDraft.value = translated.content_en || ''
    applyTranslationState(await articlesApi.getTranslations(articleId.value))
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_edit.content.translating')
  } finally {
    translating.value = false
  }
}

const reviewEnglishDraft = async () => {
  reviewing.value = true
  error.value = ''
  try {
    const reviewed = await articlesApi.reviewTranslation(articleId.value, 'en', {
      translated_text: englishDraft.value,
      approve: true,
      update_memory: true
    })
    applyArticle(reviewed)
    applyTranslationState(await articlesApi.getTranslations(articleId.value))
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_edit.content.reviewing')
  } finally {
    reviewing.value = false
  }
}

const saveTranslationStatus = async () => {
  statusSaving.value = true
  error.value = ''
  try {
    await articlesApi.updateTranslationStatus(articleId.value, { translation_status: translationState.translation_status, publication_options: 'both' })
    applyTranslationState(await articlesApi.getTranslations(articleId.value))
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.articles_edit.translationStatus.saveInProgress')
  } finally {
    statusSaving.value = false
  }
}

onMounted(loadArticle)
</script>
