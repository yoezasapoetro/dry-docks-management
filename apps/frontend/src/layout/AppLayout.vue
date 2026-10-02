<script setup lang="ts">
import { DefaultLayout } from '@limin/ui'
import { RouterView } from 'vue-router'
import { deriveMenu, deriveRoutes } from '@/router'

const navItems = deriveMenu().map((item) => ({
  label: item.label,
  icon: item.icon,
  to: item.to
}))
</script>

<template>
  <DefaultLayout :items="navItems" title="Limin WOMS">
    <RouterView />
  </DefaultLayout>
</template>
