<script setup lang="ts">
// Master-detail: the record list with tabs below showing the selected record's
// related sub-resources. The demo record has attachments, so the tabs have real
// data without inventing a sub-resource.
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MasterDetail } from '@limin/ui'
import type { DemoRecord } from '@limin/contracts'
import { useDemoRecords } from '../composables/useDemoRecords.js'

const route = useRoute()
const { list } = useDemoRecords()

const selectedId = ref<string | null>(null)
const activeTab = ref('attachments')

const rows = computed(() => list.data.value?.items ?? [])

const selected = computed<DemoRecord | null>(
  () => rows.value.find((row) => row.id === selectedId.value) ?? null
)

const tabs = [
  { label: 'Attachments', value: 'attachments' },
  { label: 'Details', value: 'details' }
]
</script>

<template>
  <section class="space-y-3">
    <MasterDetail
      :rows="rows"
      :columns="[
        { key: 'label', label: 'Label' },
        { key: 'note', label: 'Note' }
      ]"
      :selected-id="selectedId ?? route.params.id?.toString() ?? null"
      :tabs="tabs"
      @select="selectedId = $event"
      @update:tab="activeTab = $event"
    >
      <template #row-actions="{ row }">
        <span class="text-muted text-xs">{{ (row as unknown as Record<string, unknown>).attachmentKey ?? '-' }}</span>
      </template>
    </MasterDetail>

    <p v-if="selected === null" class="text-muted text-sm">Select a record to see its sub-resources.</p>

    <div v-else class="text-sm">
      <p v-if="activeTab === 'attachments'">
        {{ selected.attachmentKey ?? 'No attachment recorded for this record.' }}
      </p>
      <p v-else>Created {{ selected.createdAt }}</p>
    </div>
  </section>
</template>