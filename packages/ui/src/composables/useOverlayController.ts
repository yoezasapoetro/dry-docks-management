import { ref, shallowRef } from 'vue'
import type { Ref } from 'vue'

export interface OverlayController<TRecord = unknown> {
  /** Drawer state: open for adding a new record. */
  isCreateOpen: Ref<boolean>
  /** Modal state: the record being edited, or null when closed. */
  editing: Ref<TRecord | null>
  isEditOpen: Ref<boolean>
  openCreate(): void
  openEdit(record: TRecord): void
  close(): void
}

/**
 * The one piece of the scaffold with no upstream equivalent, and the reason
 * overlays are singular.
 *
 * A page owns ONE controller and renders ONE drawer and ONE modal. Tables emit
 * intent by calling `openEdit(record)`; they never render an overlay per row.
 *
 * The alternative - one drawer per row, one per add button - puts N live overlay
 * components in the DOM, gives each independent open state, and cannot be tested
 * without driving every row. This keeps a single source of truth for open state.
 */
export function useOverlayController<TRecord = unknown>(): OverlayController<TRecord> {
  const isCreateOpen = ref(false)
  const editing = shallowRef<TRecord | null>(null)

  return {
    isCreateOpen,
    editing,
    isEditOpen: {
      get value() {
        return editing.value !== null
      },
      set value(next: boolean) {
        if (!next) editing.value = null
      }
    } as Ref<boolean>,

    openCreate() {
      editing.value = null
      isCreateOpen.value = true
    },

    openEdit(record: TRecord) {
      isCreateOpen.value = false
      editing.value = record
    },

    close() {
      isCreateOpen.value = false
      editing.value = null
    }
  }
}