<script setup lang="ts">
// Composes Nuxt UI's Sidebar + NavigationMenu + Header into the application
// shell. No primitive is reimplemented here - only the arrangement, which is
// what this repository owns.
import USidebar from '@nuxt/ui/components/Sidebar.vue'
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'
import UHeader from '@nuxt/ui/components/Header.vue'
import { RouterLink } from 'vue-router'

interface NavItem {
  label: string
  icon: string
  to: string
}

defineProps<{ items: NavItem[]; title: string }>()
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <USidebar class="w-1/4 shrink-0 border-r" :ui="{ content: 'p-2' }">
      <template #header>
        <span class="truncate font-semibold">{{ title }}</span>
      </template>

      <UNavigationMenu
        orientation="vertical"
        :items="items.map((item) => ({ label: item.label, icon: item.icon, to: item.to }))"
      />
    </USidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <UHeader class="border-b" />

      <main class="flex-1 overflow-y-auto p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>