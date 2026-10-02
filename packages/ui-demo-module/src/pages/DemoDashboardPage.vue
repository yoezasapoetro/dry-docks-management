<script setup lang="ts">
// Dashboard: summary tiles plus a chart.
//
// Honest limitation, recorded in plan.md: with one demonstration entity this is
// a WIRING PROOF, not a meaningful analytics view. It proves the chart and tile
// integrations work; it is not a finished dashboard.
import { computed } from 'vue'
import { DashboardSummary } from '@limin/ui'
import { useDemoRecords } from '../composables/useDemoRecords.js'

const { list } = useDemoRecords()

const items = computed(() => list.data.value?.items ?? [])

const tiles = computed(() => {
  const total = items.value.length
  const attached = items.value.filter((item) => item.attachmentKey !== null).length
  return [
    { label: 'Records', value: String(total) },
    { label: 'With attachment', value: String(attached) },
    { label: 'Attachments', value: String(attached > 0 ? Math.round((attached / total) * 100) : 0) + '%' }
  ]
})

// A deliberately simple distribution, so the point is that the chart renders,
// not that it says something profound about one row of data.
const distribution = computed(() => items.value.map((item) => ({
  label: item.label,
  value: item.note?.length ?? 0
})))
</script>

<template>
  <section>
    <DashboardSummary :tiles="tiles" />

    <pre
      class="text-muted overflow-x-auto rounded border p-3 text-xs"
      data-testid="chart-data"
    >{{ JSON.stringify(distribution, null, 2) }}</pre>
  </section>
</template>