import { describe, expect, it } from 'vitest'
import { createDemoRecord, toAttachmentKey } from '../../src/domain/demo-record.js'

describe('createDemoRecord', () => {
  it('creates a record from a valid label', () => {
    const record = createDemoRecord({ label: 'Dry dock 4', note: 'Awaiting survey' })

    expect(record.label).toBe('Dry dock 4')
    expect(record.note).toBe('Awaiting survey')
    expect(record.attachmentKey).toBeNull()
  })

  it('treats an omitted note as null rather than undefined', () => {
    expect(createDemoRecord({ label: 'Dry dock 4' }).note).toBeNull()
  })

  it('rejects a label that is empty or whitespace only', () => {
    expect(() => createDemoRecord({ label: '' })).toThrow(/label/i)
    expect(() => createDemoRecord({ label: '   ' })).toThrow(/label/i)
  })

  it('rejects a label longer than 120 characters', () => {
    expect(() => createDemoRecord({ label: 'x'.repeat(121) })).toThrow(/120/)
    expect(() => createDemoRecord({ label: 'x'.repeat(120) })).not.toThrow()
  })

  it('rejects a note longer than 500 characters', () => {
    expect(() => createDemoRecord({ label: 'ok', note: 'y'.repeat(501) })).toThrow(/500/)
  })
})

describe('toAttachmentKey', () => {
  // The record stores a key, never a URL. A presigned URL would embed an
  // expiring credential in durable state and would break the moment local and
  // production storage differ - which is the whole point of FR-013.
  it('rejects anything that looks like a URL', () => {
    expect(() => toAttachmentKey('https://example.com/a.png')).toThrow(/key/i)
    expect(() => toAttachmentKey('s3://bucket/a.png')).toThrow(/key/i)
  })

  it('rejects a path that would escape the configured prefix', () => {
    expect(() => toAttachmentKey('../../etc/passwd')).toThrow(/key/i)
  })

  it('accepts a plain object key', () => {
    expect(toAttachmentKey('attachments/survey.png')).toBe('attachments/survey.png')
  })

  it('rejects an empty key', () => {
    expect(() => toAttachmentKey('')).toThrow(/key/i)
  })
})