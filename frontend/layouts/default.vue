<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex flex-col">
    <!-- Navigation -->
    <MainNav />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
// Layout setup - components are auto-imported by Nuxt
</script>
