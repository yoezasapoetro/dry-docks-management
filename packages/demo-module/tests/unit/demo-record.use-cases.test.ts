import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'
import { DemoRecordUseCases } from '../../src/application/demo-record.use-cases.js'
import type { DemoRecordRepository, DemoRecordView } from '../../src/infrastructure/demo-record.repository.js'

class InMemoryDemoRecordRepository implements DemoRecordRepository {
  rows: DemoRecordView[] = []

  async insert(label: string, note: string | null): Promise<DemoRecordView> {
    const view: DemoRecordView = {
      id: `00000000-0000-4000-8000-${String(this.rows.length).padStart(12, '0')}`,
      label,
      note,
      attachmentKey: null,
      createdAt: new Date().toISOString()
    }
    this.rows.unshift(view)
    return view
  }

  async findAll(limit: number, offset: number): Promise<DemoRecordView[]> {
    return this.rows.slice(offset, offset + limit)
  }

  async count(): Promise<number> {
    return this.rows.length
  }

  async findById(id: string): Promise<DemoRecordView | null> {
    return this.rows.find((row) => row.id === id) ?? null
  }

  async attach(id: string, key: string): Promise<DemoRecordView | null> {
    const row = this.rows.find((candidate) => candidate.id === id)
    if (row === undefined) return null
    row.attachmentKey = key
    return row
  }
}

function useCases(): { useCases: DemoRecordUseCases; repository: InMemoryDemoRecordRepository } {
  const repository = new InMemoryDemoRecordRepository()
  return { useCases: new DemoRecordUseCases(repository), repository }
}

describe('DemoRecordUseCases.create', () => {
  it('persists a valid record', async () => {
    const { useCases: sut } = useCases()

    const created = await sut.create('Dry dock 4', null)

    expect(created.label).toBe('Dry dock 4')
    expect(created.note).toBeNull()
  })

  it('rejects a blank label with a field-level detail', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.create('   ', null)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      details: [{ path: 'label' }]
    })
  })

  it('rejects a label beyond 120 characters', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.create('x'.repeat(121), null)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED'
    })
  })

  it('rejects a note beyond 500 characters', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.create('ok', 'y'.repeat(501))).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      details: [{ path: 'note' }]
    })
  })

  it('accepts a note at exactly the maximum length', async () => {
    const { useCases: sut } = useCases()

    const created = await sut.create('ok', 'y'.repeat(500))

    expect(created.note).toHaveLength(500)
  })
})

describe('DemoRecordUseCases.list', () => {
  let sut: DemoRecordUseCases

  beforeEach(async () => {
    const built = useCases()
    sut = built.useCases
    await sut.create('First', null)
    await sut.create('Second', null)
  })

  it('returns items and a total', async () => {
    const result = await sut.list(20, 0)

    expect(result.items).toHaveLength(2)
    expect(result.total).toBe(2)
  })

  it('honours limit and offset', async () => {
    const result = await sut.list(1, 0)

    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(2)
  })
})

describe('DemoRecordUseCases.get', () => {
  it('returns the requested record', async () => {
    const { useCases: sut } = useCases()
    const created = await sut.create('Findable', null)

    expect((await sut.get(created.id)).label).toBe('Findable')
  })

  it('raises NOT_FOUND for an unknown id', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.get('00000000-0000-4000-8000-000000000000')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('rejects a non-uuid id as VALIDATION_FAILED, not NOT_FOUND', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.get('not-a-uuid')).rejects.toMatchObject({ code: 'VALIDATION_FAILED' })
  })
})

describe('DemoRecordUseCases.attach', () => {
  it('records a key against the record', async () => {
    const { useCases: sut } = useCases()
    const created = await sut.create('Attachable', null)

    const updated = await sut.attach(created.id, 'attachments/a.pdf')

    expect(updated.attachmentKey).toBe('attachments/a.pdf')
  })

  it('raises NOT_FOUND for an unknown record', async () => {
    const { useCases: sut } = useCases()

    await expect(sut.attach('00000000-0000-4000-8000-000000000000', 'attachments/a.pdf')).rejects.toMatchObject({
      code: 'NOT_FOUND'
    })
  })

  it('rejects a URL as a key', async () => {
    const { useCases: sut } = useCases()
    const created = await sut.create('Url reject', null)

    await expect(sut.attach(created.id, 'https://example.com/a.pdf')).rejects.toMatchObject({
      code: 'VALIDATION_FAILED'
    })
  })

  it('rejects a traversal key', async () => {
    const { useCases: sut } = useCases()
    const created = await sut.create('Traversal', null)

    await expect(sut.attach(created.id, '../../etc/passwd')).rejects.toMatchObject({
      code: 'VALIDATION_FAILED'
    })
  })
})
