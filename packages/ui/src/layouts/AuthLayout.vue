<script setup lang="ts">
// Centred card for sign-in screens. Shell only: no credential handling, no
// session logic, no permission model. Authentication is out of scope per
// spec.md, so this provides a place for those screens to live later without
// implying a sign-in capability exists.
import UAuthForm from '@nuxt/ui/components/AuthForm.vue'

withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: 'Sign in',
  description: 'Authentication is not yet part of this starting point.'
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-lg font-semibold">{{ title }}</h1>
        <p v-if="description" class="text-muted text-sm">{{ description }}</p>
      </template>

      <UAuthForm :fields="[]" :submit-label="title" class="w-full" @submit.prevent />
    </UCard>
  </div>
</template>