<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <UIcon name="i-heroicons-exclamation-circle" class="size-12 mx-auto" />
      <h1 class="text-3xl font-bold">Page not found</h1>
      <p class="text-muted">
        This route is not registered. If you expected it, check the module registry.
      </p>
      <UButton to="/" label="Back to start" icon="i-heroicons-arrow-left" />
    </div>
  </div>
</template>