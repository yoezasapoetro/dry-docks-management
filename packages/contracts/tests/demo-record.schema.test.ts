import { describe, expect, it } from 'vitest'
import { demoRecordListSchema, demoRecordSchema, CONTRACT_VERSION } from '../src/index.js'

const valid = {
  id: '11111111-1111-4111-8111-111111111111',
  label: 'Dry dock 4',
  note: 'Awaiting survey',
  attachmentKey: null,
  createdAt: '2026-10-02T00:00:00.000Z',
  contractVersion: CONTRACT_VERSION
}

describe('demoRecordSchema', () => {
  it('accepts a well-formed record', () => {
    expect(demoRecordSchema.parse(valid)).toMatchObject({ label: 'Dry dock 4' })
  })

  it('accepts a null note and a null attachment key', () => {
    expect(demoRecordSchema.parse({ ...valid, note: null, attachmentKey: null })).toBeTruthy()
  })

  it('rejects a missing id', () => {
    const { id: _id, ...withoutId } = valid
    expect(demoRecordSchema.safeParse(withoutId).success).toBe(false)
  })

  it('rejects an empty label', () => {
    expect(demoRecordSchema.safeParse({ ...valid, label: '' }).success).toBe(false)
  })

  it('rejects a label beyond 120 characters', () => {
    expect(demoRecordSchema.safeParse({ ...valid, label: 'x'.repeat(121) }).success).toBe(false)
  })

  it('rejects a contract version that does not match the shared constant', () => {
    expect(demoRecordSchema.safeParse({ ...valid, contractVersion: '9.9.9' }).success).toBe(false)
  })
})

describe('demoRecordListSchema', () => {
  it('accepts a list payload', () => {
    const payload = { items: [valid], total: 1, contractVersion: CONTRACT_VERSION }

    expect(demoRecordListSchema.parse(payload).items).toHaveLength(1)
  })

  it('rejects a total that disagrees with nothing structural', () => {
    const payload = { items: [valid], total: 1, contractVersion: CONTRACT_VERSION }

    expect(demoRecordListSchema.safeParse(payload).success).toBe(true)
  })

  it('rejects a payload with no items array', () => {
    expect(
      demoRecordListSchema.safeParse({ total: 0, contractVersion: CONTRACT_VERSION }).success
    ).toBe(false)
  })
})