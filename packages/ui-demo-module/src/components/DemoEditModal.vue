<script setup lang="ts">
// Wraps Nuxt UI's Modal. Rendered ONCE per page and opened programmatically via
// useOverlayController, with the record supplied as a prop.
import UModal from '@nuxt/ui/components/Modal.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import { reactive, watch } from 'vue'
import { demoRecordFormSchema, type DemoRecord } from '@limin/contracts'
import { useDemoRecords } from '../composables/useDemoRecords.js'

const props = defineProps<{ open: boolean; record: DemoRecord | null }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { updateRecord } = useDemoRecords()

const fields = reactive({ label: '', note: '' })
const errors = reactive<{ label?: string; note?: string }>({})

// Opening the modal loads the selected record's values. Watching the record
// rather than the open flag means re-opening for a different row always shows
// that row, never the previous one.
watch(
  () => props.record,
  (record) => {
    if (record === null) return
    fields.label = record.label
    fields.note = record.note ?? ''
    errors.label = undefined
    errors.note = undefined
  }
)

async function submit(): Promise<void> {
  if (props.record === null) return

  const parsed = demoRecordFormSchema.safeParse(fields)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key === 'label' || key === 'note') errors[key] = issue.message
    }
    return
  }

  await updateRecord.mutateAsync({
    id: props.record.id,
    label: parsed.data.label,
    note: parsed.data.note
  })
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="props.open" title="Edit record" @update:open="emit('update:open', $event)">
    <template #body>
      <div class="space-y-3">
        <UFormField label="Label" :error="errors.label" required>
          <UInput v-model="fields.label" />
        </UFormField>

        <UFormField label="Note" :error="errors.note">
          <UTextarea v-model="fields.note" :rows="3" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton label="Cancel" variant="subtle" color="secondary" @click="emit('update:open', false)" />
        <UButton label="Save" @click="submit" />
      </div>
    </template>
  </UModal>
</template>