<script setup lang="ts">
import { computed } from 'vue'
// Table above, tabs below showing the selected record's related sub-resources.
// Composed from Nuxt UI Table + Tabs; the pattern is ours, the parts are not.
import UTabs from '@nuxt/ui/components/Tabs.vue'
import UTable from '@nuxt/ui/components/Table.vue'
import type { TableColumn, TableRow } from '@nuxt/ui/components/Table.vue'

interface Column {
  key: string
  label: string
}

const props = defineProps<{
  rows: Array<Record<string, unknown>>
  columns: Column[]
  selectedId?: string | null
  tabs: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  select: [id: string]
  'update:tab': [value: string]
}>()

// Nuxt UI's TableColumn expects an id; the caller supplies a friendlier key/label.
const tableColumns = computed<Array<TableColumn<Record<string, unknown>, unknown>>>(() =>
  props.columns.map((column) => ({
    id: column.key,
    accessorKey: column.key,
    header: column.label
  }))
)

function rowKey(row: Record<string, unknown>): string {
  return String(row.id)
}

function onSelect(_event: Event, row: TableRow<Record<string, unknown>>): void {
  emit('select', String(row.id))
}
</script>

<template>
  <div class="space-y-4">
    <UTable
      :data="rows"
      :columns="tableColumns"
      :row-key="rowKey"
      class="w-full"
      @select="onSelect"
    >
      <template #actions-cell="{ row }">
        <slot name="row-actions" :row="row" />
      </template>
    </UTable>

    <UTabs
      :items="tabs"
      :value="tabs[0]?.value"
      size="lg"
      class="w-full"
      @update:value="emit('update:tab', String($event))"
    />
  </div>
</template>