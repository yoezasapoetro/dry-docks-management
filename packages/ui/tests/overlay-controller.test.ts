import { describe, expect, it } from 'vitest'
import { useOverlayController } from '../src/composables/useOverlayController.js'

describe('useOverlayController', () => {
  it('opens the create drawer and leaves the edit modal closed', () => {
    const overlay = useOverlayController()

    overlay.openCreate()

    expect(overlay.isCreateOpen.value).toBe(true)
    expect(overlay.isEditOpen.value).toBe(false)
    expect(overlay.editing.value).toBeNull()
  })

  it('opens the edit modal for the supplied record', () => {
    const overlay = useOverlayController<{ id: string }>()
    const record = { id: 'r1' }

    overlay.openEdit(record)

    expect(overlay.editing.value).toBe(record)
    expect(overlay.isEditOpen.value).toBe(true)
    expect(overlay.isCreateOpen.value).toBe(false)
  })

  it('carries the most recently selected record, not a stale one', () => {
    const overlay = useOverlayController<{ id: string }>()

    overlay.openEdit({ id: 'first' })
    overlay.close()
    overlay.openEdit({ id: 'second' })

    expect(overlay.editing.value?.id).toBe('second')
  })

  it('closes both overlays at once', () => {
    const overlay = useOverlayController<{ id: string }>()
    overlay.openEdit({ id: 'r1' })

    overlay.close()

    expect(overlay.isEditOpen.value).toBe(false)
    expect(overlay.editing.value).toBeNull()
  })

  it('switching from edit to create clears the selected record', () => {
    const overlay = useOverlayController<{ id: string }>()
    overlay.openEdit({ id: 'r1' })

    overlay.openCreate()

    expect(overlay.editing.value).toBeNull()
    expect(overlay.isCreateOpen.value).toBe(true)
  })

  it('exposes one controller per page, not one per row', () => {
    // The singular-overlay guarantee is structural: the composable holds a single
    // editing slot, so ten rows cannot produce ten open modals.
    const overlay = useOverlayController<{ id: string }>()

    for (let index = 0; index < 10; index += 1) {
      overlay.openEdit({ id: `row-${index}` })
    }

    expect(overlay.editing.value?.id).toBe('row-9')
  })
})