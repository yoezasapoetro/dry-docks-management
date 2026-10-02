export interface CreateDemoRecordInput {
  label: string
  note?: string | null
}

export interface DemoRecord {
  label: string
  note: string | null
  attachmentKey: string | null
}

const LABEL_MAX = 120
const NOTE_MAX = 500

export class DomainError extends Error {
  readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.name = 'DomainError'
    this.field = field
  }
}

export function createDemoRecord(input: CreateDemoRecordInput): DemoRecord {
  const label = input.label

  if (typeof label !== 'string' || label.trim() === '') {
    throw new DomainError('label', 'label is required and cannot be blank')
  }
  if (label.length > LABEL_MAX) {
    throw new DomainError('label', `label must be at most ${LABEL_MAX} characters`)
  }

  const note = input.note ?? null
  if (note !== null && note.length > NOTE_MAX) {
    throw new DomainError('note', `note must be at most ${NOTE_MAX} characters`)
  }

  return { label, note, attachmentKey: null }
}

export function toRecordId(candidate: string): string {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (typeof candidate !== 'string' || !UUID.test(candidate)) {
    throw new DomainError('id', 'id must be a uuid')
  }
  return candidate
}

export function toAttachmentKey(candidate: string): string {
  if (typeof candidate !== 'string' || candidate.trim() === '') {
    throw new DomainError('key', 'attachment key is required')
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    throw new DomainError('key', 'attachment key must be a key, not a URL')
  }
  if (candidate.split('/').includes('..')) {
    throw new DomainError('key', 'attachment key must not traverse outside the prefix')
  }
  return candidate
}
