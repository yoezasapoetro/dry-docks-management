<script setup lang="ts">
// CRUD page: Nuxt UI Table + toolbar, with a SINGLE drawer and a SINGLE modal,
// both driven programmatically. Ten rows still render one of each.
import { computed, ref } from 'vue'
import UButton from '@nuxt/ui/components/Button.vue'
import { DataTableToolbar, useOverlayController } from '@limin/ui'
import type { DemoRecord } from '@limin/contracts'
import DemoCreateDrawer from '../components/DemoCreateDrawer.vue'
import DemoEditModal from '../components/DemoEditModal.vue'
import { useDemoRecords } from '../composables/useDemoRecords.js'

const { list } = useDemoRecords()
const overlay = useOverlayController<DemoRecord>()

const search = ref('')
const selectedFilter = ref('all')

const rows = computed(() => {
  const all = list.data.value?.items ?? []
  const term = search.value.trim().toLowerCase()
  return term === '' ? all : all.filter((row) => row.label.toLowerCase().includes(term))
})
</script>

<template>
  <section class="space-y-3">
    <DataTableToolbar
      v-model:search="search"
      v-model:selected-filter="selectedFilter"
      :filters="[
        { label: 'All', value: 'all' },
        { label: 'With attachment', value: 'attached' }
      ]"
      actions-label="Add record"
      @action="overlay.openCreate()"
    />

    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b">
          <th class="py-2">Label</th>
          <th class="py-2">Note</th>
          <th class="py-2">Attachment</th>
          <th class="py-2" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b last:border-0">
          <td class="py-2">{{ row.label }}</td>
          <td class="py-2 text-muted">{{ row.note ?? '-' }}</td>
          <td class="py-2 text-muted">{{ row.attachmentKey ?? '-' }}</td>
          <td class="py-2 text-end">
            <UButton
              label="Edit"
              variant="subtle"
              color="secondary"
              size="lg"
              @click="overlay.openEdit(row)"
            />
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="4" class="text-muted py-6 text-center">No records yet.</td>
        </tr>
      </tbody>
    </table>

    <DemoCreateDrawer :open="overlay.isCreateOpen.value" @update:open="overlay.close()" />
    <DemoEditModal
      :open="overlay.isEditOpen.value"
      :record="overlay.editing.value"
      @update:open="overlay.close()"
    />
  </section>
</template>