<script setup lang="ts">
/**
 * Esperion Image Component
 * Wrapper around NuxtImg with WebP optimization and Esperion Design System styling
 *
 * @usage
 * ```vue
 * <EsImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   :width="1200"
 *   :height="600"
 *   sizes="sm:100vw md:50vw lg:800px"
 * />
 * ```
 */

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  loading?: 'eager' | 'lazy'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  sizes: undefined,
  loading: 'lazy',
  fit: 'cover',
  placeholder: undefined,
  class: ''
})

// Compute format based on browser support
const format = 'webp'

// Quality for WebP compression
const quality = 80
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :format="format"
    :quality="quality"
    :loading="loading"
    :fit="fit"
    :placeholder="placeholder"
    :class="['object-cover', class]"
    provider="ipx"
    densities="1x 2x"
    preload
  />
</template>
