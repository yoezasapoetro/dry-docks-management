<script setup lang="ts">
// Summary tiles plus charts. Nuxt UI ships no chart component, so charts come
// from @tanstack/charts/vue directly - that gap is why this file exists.
import UDashboardPanel from '@nuxt/ui/components/DashboardPanel.vue'
import UBadge from '@nuxt/ui/components/Badge.vue'

interface Tile {
  label: string
  value: string
  trend?: string
}

defineProps<{ tiles: Tile[] }>()
</script>

<template>
  <UDashboardPanel :title="'Summary'" class="mb-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <UCard v-for="tile in tiles" :key="tile.label">
        <p class="text-muted text-sm">{{ tile.label }}</p>
        <p class="text-2xl font-semibold">{{ tile.value }}</p>
        <UBadge v-if="tile.trend" color="neutral" variant="subtle" size="lg">
          {{ tile.trend }}
        </UBadge>
      </UCard>
    </div>
  </UDashboardPanel>
</template>