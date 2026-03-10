<template>
  <UDropdownMenu
    :items="menuItems"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-40' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark"
    >
      <span>{{ currentLanguage.name }}</span>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1" />
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, setLocale } = useI18n()

const languages = [
  { code: 'id' as const, name: 'Bahasa Indonesia' },
  { code: 'en' as const, name: 'English' },
]

const currentLanguage = computed(() =>
  languages.find(l => l.code === locale.value) || languages[0]
)

const menuItems = computed<DropdownMenuItem[]>(() =>
  languages.map(lang => ({
    label: lang.name,
    value: lang.code,
    icon: locale.value === lang.code ? 'i-heroicons-check' : undefined,
    onSelect: () => {
      if (locale.value !== lang.code) {
        setLocale(lang.code)
      }
    },
  }))
)
</script>