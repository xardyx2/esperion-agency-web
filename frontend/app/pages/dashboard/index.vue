<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
        {{ t('dashboard.index.title') }}
      </h1>
      <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
        {{ t('dashboard.index.description') }}
      </p>
    </div>

    <section class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in retainedScopeCards" :key="card.title" class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-3xl">{{ card.icon }}</span>
          <span class="rounded-full bg-es-bg-tertiary px-3 py-1 text-xs font-semibold text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark">
            {{ t(`dashboard.index.status.${card.status}`) }}
          </span>
        </div>
        <h2 class="mb-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">{{ card.title }}</h2>
        <p class="mb-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">{{ card.description }}</p>
        <NuxtLink :to="card.href" class="text-sm font-semibold text-es-accent-primary hover:underline dark:text-es-accent-primary-dark">
          {{ t('dashboard.index.cards', { key: card.title.toLowerCase(), fallback: `dashboard.index.cards.${card.title.toLowerCase()}` }) }}
        </NuxtLink>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
        <h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.index.focus.authTitle') }}</h2>
        <ul class="space-y-3 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          <li v-for="item in focusChecklist" :key="item.title" class="flex gap-3">
            <span class="mt-0.5 text-es-accent-primary dark:text-es-accent-primary-dark">•</span>
            <div>
              <p class="font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t(item.title) }}</p>
              <p>{{ t(item.detail) }}</p>
            </div>
          </li>
        </ul>
      </article>

      <article class="rounded-xl border border-es-border bg-es-bg-secondary p-6 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark">
        <h2 class="mb-4 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.index.shortcuts') }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink
            v-for="shortcut in shortcuts"
            :key="shortcut.href"
            :to="shortcut.href"
            class="rounded-lg border border-es-border bg-es-bg-primary p-4 text-sm font-medium text-es-text-primary transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          >
            <div class="mb-2 text-2xl">{{ shortcut.icon }}</div>
            <div>{{ t(`dashboard.index.shortcuts.${shortcut.label.toLowerCase()}`) }}</div>
          </NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.index.title'),
  description: t('dashboard.index.description'),
})

const retainedScopeCards = [
  {
    title: 'Articles',
    description: t('dashboard.index.cards.articles.description'),
    status: 'needsWiring',
    href: '/dashboard/articles',
    cta: 'articles',
    icon: '📝',
  },
  {
    title: 'Works',
    description: t('dashboard.index.cards.works.description'),
    status: 'stubCleanup',
    href: '/dashboard/works',
    cta: 'works',
    icon: '💼',
  },
  {
    title: 'Clients',
    description: t('dashboard.index.cards.clients.description'),
    status: 'stubCleanup',
    href: '/dashboard/clients',
    cta: 'clients',
    icon: '👥',
  },
  {
    title: 'Contact',
    description: t('dashboard.index.cards.contact.description'),
    status: 'needsVerification',
    href: '/dashboard/contact',
    cta: 'submissions',
    icon: '✉️',
  },
]

const focusChecklist = [
  {
    title: 'focus.authTitle',
    detail: 'focus.authDetail',
  },
  {
    title: 'focus.translationTitle',
    detail: 'focus.translationDetail',
  },
  {
    title: 'focus.archiveTitle',
    detail: 'focus.archiveDetail',
  },
]

const shortcuts = [
  { href: '/dashboard/articles', label: 'Articles', icon: '📝' },
  { href: '/dashboard/works', label: 'Works', icon: '💼' },
  { href: '/dashboard/services', label: 'Services', icon: '🛠️' },
  { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
  { href: '/dashboard/contact', label: 'Contact', icon: '✉️' },
  { href: '/dashboard/sessions', label: 'Sessions', icon: '🔐' },
]
</script>
