<template>
  <section class="py-12 md:py-16">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <slot name="content">
            <!-- Default content slot -->
          </slot>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <slot name="sidebar">
            <!-- Default sidebar slot -->
          </slot>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ContentWithSidebar - Flexible 2-column layout component
// Main content takes 2/3 width on desktop, sidebar takes 1/3
// Stacks vertically on mobile
</script>
