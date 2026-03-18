<template>
  <div class="space-y-6">
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*,video/*,.pdf"
      class="hidden"
      @change="handleFileSelect"
    >

    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="Library"
      :title="t('dashboard.media.title')"
      :description="t('dashboard.media.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          :disabled="uploading"
          @click="triggerUpload"
        >
          <UIcon name="i-lucide-upload" class="h-4 w-4 mr-1" />
          {{ uploading ? 'Uploading...' : t('dashboard.media.uploadButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Filter Bar -->
    <UDashboardSection class="!p-0">
      <UDashboardFilterBar
        v-model:search="searchQuery"
        v-model:filters="filters"
        :filter-options="filterOptions"
        search-placeholder="Search media files..."
        @search="handleSearch"
      />
    </UDashboardSection>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="n in 12"
        :key="n"
        class="animate-pulse overflow-hidden rounded-2xl border border-es-border bg-es-bg-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
      >
        <div class="aspect-square bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
        <div class="p-3 space-y-2">
          <div class="h-4 w-3/4 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
          <div class="flex gap-2">
            <div class="h-4 w-12 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
            <div class="h-4 w-16 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Toolbar -->
    <UDashboardBulkActionsToolbar
      v-if="!pending"
      :selected-count="selectedCount"
      :total-count="filteredMedia.length"
      :actions="bulkActions"
      @clear="clearSelection"
      @select-all="toggleAllSelection"
    />

    <!-- Content Section -->
    <UDashboardSection
      v-if="!pending"
      :badge="filteredMedia.length"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Media Files
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              Library
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ filteredMedia.length }} files
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!filteredMedia.length"
        icon="i-lucide-images"
        title="No media files yet"
        description="Upload images, videos, and documents to build your media library. These can be attached to articles, works, or services."
        :primary-action="{ label: 'Upload Media', icon: 'i-lucide-upload', onClick: triggerUpload }"
        :tips="[
          'Optimize images before upload (max 5MB)',
          'Use descriptive filenames for SEO',
          'WebP format preferred for web'
        ]"
      >
        <template #default>
          <div
            class="mt-6 rounded-2xl border-2 border-dashed border-es-border bg-es-bg-primary p-8 dark:border-es-border-dark dark:bg-es-bg-primary-dark cursor-pointer hover:border-es-accent-primary dark:hover:border-es-accent-primary-dark transition-colors"
            @dragover.prevent
            @drop="handleDrop"
            @click="triggerUpload"
          >
            <div class="flex flex-col items-center gap-4">
              <UIcon name="i-lucide-cloud-upload" class="h-12 w-12 text-es-text-tertiary" />
              <p class="text-sm text-es-text-secondary">
                Drag and drop files here or click to upload
              </p>
              <p class="text-xs text-es-text-tertiary">
                Supported formats: JPG, PNG, GIF, WebP, MP4, PDF (max 5MB)
              </p>
            </div>
          </div>
        </template>
      </UDashboardEmptyState>

      <!-- Media Grid -->
      <div
        v-else
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          :class="[
            'group relative overflow-hidden rounded-2xl border bg-es-bg-secondary dark:bg-es-bg-secondary-dark',
            selectedIds.has(media.id) ? 'border-es-accent-primary ring-2 ring-es-accent-primary/20 dark:border-es-accent-primary-dark dark:ring-es-accent-primary-dark/20' : 'border-es-border dark:border-es-border-dark'
          ]"
        >
          <!-- Checkbox -->
          <div class="absolute left-2 top-2 z-10">
            <input
              type="checkbox"
              :checked="selectedIds.has(media.id)"
              class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
              @change="toggleSelection(media.id)"
            />
          </div>
          <div class="aspect-square bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
            <UIcon
              :name="getMediaIcon(media.type)"
              class="h-12 w-12 text-es-text-tertiary dark:text-es-text-tertiary-dark"
            />
          </div>
          <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <UButton
              color="neutral"
              variant="solid"
              size="sm"
              class="rounded-full"
              @click="viewMedia(media)"
            >
              <UIcon name="i-lucide-eye" class="h-4 w-4" />
            </UButton>
            <UButton
              color="neutral"
              variant="solid"
              size="sm"
              class="rounded-full"
              @click="editMedia(media)"
            >
              <UIcon name="i-lucide-pencil" class="h-4 w-4" />
            </UButton>
            <UButton
              color="error"
              variant="solid"
              size="sm"
              class="rounded-full"
              @click="deleteMedia(media)"
            >
              <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
            </UButton>
          </div>
          <div class="p-3">
            <p class="truncate text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
              {{ media.name }}
            </p>
            <div class="mt-1 flex items-center gap-2">
              <UBadge
                color="neutral"
                variant="soft"
                size="xs"
              >
                {{ media.type }}
              </UBadge>
              <span class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ media.size }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useMediaApi } from '../../composables/useApi'
import type { MediaItem } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.media.seo.title'),
  description: t('dashboard.media.seo.description')
})

const mediaApi = useMediaApi()

const mediaItems = ref<MediaItem[]>([])
const pending = ref(false)
const uploading = ref(false)
const searchQuery = ref('')
const filters = ref({
  type: ''
})

// Bulk selection state
const selectedIds = ref<Set<string>>(new Set())
const isAllSelected = computed(() => {
  return filteredMedia.value.length > 0 && filteredMedia.value.every(m => selectedIds.value.has(m.id))
})
const selectedCount = computed(() => selectedIds.value.size)

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    filteredMedia.value.forEach(m => selectedIds.value.delete(m.id))
  } else {
    filteredMedia.value.forEach(m => selectedIds.value.add(m.id))
  }
}

const clearSelection = () => {
  selectedIds.value.clear()
}

// Bulk actions
const bulkActions = computed(() => [
  { 
    label: 'Delete', 
    icon: 'i-lucide-trash-2', 
    color: 'error' as const,
    onClick: () => handleBulkAction('delete')
  },
  { 
    label: 'Download', 
    icon: 'i-lucide-download', 
    color: 'primary' as const,
    onClick: () => handleBulkAction('download')
  }
])

const handleBulkAction = async (action: string) => {
  const ids = Array.from(selectedIds.value)
  
  switch (action) {
    case 'delete':
      if (confirm(`Delete ${ids.length} media files?`)) {
        for (const id of ids) {
          await mediaApi.delete(id)
        }
        clearSelection()
        await loadMedia()
      }
      break
    case 'download':
      // Download selected files
      const selectedMedia = mediaItems.value.filter(m => selectedIds.value.has(m.id))
      for (const media of selectedMedia) {
        if (media.url) {
          const a = document.createElement('a')
          a.href = media.url
          a.download = media.name
          a.click()
        }
      }
      clearSelection()
      break
  }
}

const filterOptions = [
  {
    key: 'type',
    label: 'Type',
    type: 'select' as const,
    options: [
      { label: 'All Types', value: '' },
      { label: 'Image', value: 'image' },
      { label: 'Video', value: 'video' },
      { label: 'Document', value: 'document' }
    ]
  }
]

const filteredMedia = computed(() => {
  return mediaItems.value.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filters.value.type || media.type === filters.value.type
    return matchesSearch && matchesType
  })
})

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'image':
      return 'i-lucide-image'
    case 'video':
      return 'i-lucide-video'
    case 'document':
      return 'i-lucide-file-text'
    default:
      return 'i-lucide-file'
  }
}

const loadMedia = async () => {
  pending.value = true
  try {
    const response = await mediaApi.list({ limit: 100 })
    mediaItems.value = response.data
  } catch (err) {
    console.error('Failed to load media:', err)
  } finally {
    pending.value = false
  }
}

const handleSearch = (value: string) => {
  searchQuery.value = value
}

// File upload handling
const fileInput = ref<HTMLInputElement>()

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  uploading.value = true
  const toast = useToast()

  try {
    for (const file of files) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.add({
          title: 'File too large',
          description: `${file.name} exceeds 5MB limit`,
          color: 'error'
        })
        continue
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.add({
          title: 'Invalid file type',
          description: `${file.name} is not a supported format`,
          color: 'error'
        })
        continue
      }

      // Upload file
      await mediaApi.upload(file, file.name)
      toast.add({
        title: 'Uploaded',
        description: `${file.name} uploaded successfully`,
        color: 'success'
      })
    }

    // Refresh media list
    await loadMedia()
  } catch (err) {
    toast.add({
      title: 'Upload failed',
      description: err instanceof Error ? err.message : 'Failed to upload file(s)',
      color: 'error'
    })
  } finally {
    uploading.value = false
    // Reset input
    input.value = ''
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  uploading.value = true
  const toast = useToast()

  try {
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.add({
          title: 'File too large',
          description: `${file.name} exceeds 5MB limit`,
          color: 'error'
        })
        continue
      }

      await mediaApi.upload(file, file.name)
      toast.add({
        title: 'Uploaded',
        description: `${file.name} uploaded successfully`,
        color: 'success'
      })
    }

    await loadMedia()
  } catch (err) {
    toast.add({
      title: 'Upload failed',
      description: err instanceof Error ? err.message : 'Failed to upload file(s)',
      color: 'error'
    })
  } finally {
    uploading.value = false
  }
}

const viewMedia = (media: MediaItem) => {
  // TODO: Implement view modal
  console.log('View media:', media)
}

const editMedia = (media: MediaItem) => {
  // TODO: Implement edit modal
  console.log('Edit media:', media)
}

const deleteMedia = async (media: MediaItem) => {
  const confirmed = globalThis.confirm?.(`Delete ${media.name}?`) ?? true
  if (!confirmed) return

  try {
    await mediaApi.delete(media.id)
    await loadMedia()
  } catch (err) {
    console.error('Failed to delete media:', err)
  }
}

onMounted(loadMedia)
</script>
