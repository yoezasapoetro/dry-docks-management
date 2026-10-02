<script setup lang="ts">
// Wraps Nuxt UI's Drawer. Rendered ONCE per page and opened programmatically via
// useOverlayController - never once per row or per button.
//
// Validation uses the shared zod schema rather than a form library: the schema is
// already the client-side contract, so a form library would add a dependency and
// a second validation dialect for no gain.
import UDrawer from '@nuxt/ui/components/Drawer.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import { reactive } from 'vue'
import { demoRecordFormSchema } from '@limin/contracts'
import { useDemoRecords } from '../composables/useDemoRecords.js'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { createRecord } = useDemoRecords()

const fields = reactive({ label: '', note: '' })
const errors = reactive<{ label?: string; note?: string }>({})

async function submit(): Promise<void> {
  const parsed = demoRecordFormSchema.safeParse(fields)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key === 'label' || key === 'note') errors[key] = issue.message
    }
    return
  }

  await createRecord.mutateAsync({ label: parsed.data.label, note: parsed.data.note })
  fields.label = ''
  fields.note = ''
  errors.label = undefined
  errors.note = undefined
  emit('update:open', false)
}
</script>

<template>
  <UDrawer
    :open="props.open"
    title="Add record"
    description="Slides in from the right."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-3">
        <UFormField label="Label" :error="errors.label" required>
          <UInput v-model="fields.label" placeholder="Dry dock 4" />
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
  </UDrawer>
</template>