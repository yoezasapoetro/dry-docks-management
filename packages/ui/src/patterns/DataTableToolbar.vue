<script setup lang="ts">
// Search, filters and an actions slot, placed in the Nuxt UI Table toolbar
// region. Upstream has no CRUD toolbar, so the arrangement is ours.
import UInput from '@nuxt/ui/components/Input.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import UButton from '@nuxt/ui/components/Button.vue'

interface FilterOption {
  label: string
  value: string
}

defineProps<{
  search: string
  filters: FilterOption[]
  selectedFilter?: string
  actionsLabel?: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:selectedFilter': [value: string]
  action: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 pb-3">
    <UInput
      :model-value="search"
      placeholder="Search"
      icon="i-heroicons-magnifying-glass"
      class="max-w-xs"
      @update:model-value="emit('update:search', String($event))"
    />

    <USelect
      :model-value="selectedFilter"
      :items="filters"
      value-key="value"
      class="max-w-[12rem]"
      @update:model-value="emit('update:selectedFilter', String($event))"
    />

    <div class="ms-auto flex items-center gap-2">
      <slot name="actions">
        <UButton
          v-if="actionsLabel"
          icon="i-heroicons-plus"
          :label="actionsLabel"
          @click="emit('action')"
        />
      </slot>
    </div>
  </div>
</template>