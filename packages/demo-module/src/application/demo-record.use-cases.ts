import { injectable } from 'tsyringe'
import { createDemoRecord, toAttachmentKey, toRecordId, DomainError } from '../domain/demo-record.js'
import { ModuleError } from './errors.js'
import { DemoRecordRepository, type DemoRecordView } from '../infrastructure/demo-record.repository.js'

export interface ListResult {
  items: DemoRecordView[]
  total: number
}

@injectable()
export class DemoRecordUseCases {
  constructor(private readonly repository: DemoRecordRepository) {}

  async create(label: string, note: string | null): Promise<DemoRecordView> {
    try {
      const draft = createDemoRecord({ label, note })
      return await this.repository.insert(draft.label, draft.note)
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ModuleError('VALIDATION_FAILED', 400, error.message, [
          { path: error.field, message: error.message }
        ])
      }
      throw error
    }
  }

  async list(limit: number, offset: number): Promise<ListResult> {
    const [items, total] = await Promise.all([
      this.repository.findAll(limit, offset),
      this.repository.count()
    ])
    return { items, total }
  }

  async get(id: string): Promise<DemoRecordView> {
    try {
      const found = await this.repository.findById(toRecordId(id))
      if (found === null) throw new ModuleError('NOT_FOUND', 404, `No demo record with id ${id}.`)
      return found
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ModuleError('VALIDATION_FAILED', 400, error.message, [
          { path: error.field, message: error.message }
        ])
      }
      throw error
    }
  }

  async attach(id: string, key: string): Promise<DemoRecordView> {
    try {
      const updated = await this.repository.attach(toRecordId(id), toAttachmentKey(key))
      if (updated === null) {
        throw new ModuleError('NOT_FOUND', 404, `No demo record with id ${id}.`)
      }
      return updated
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ModuleError('VALIDATION_FAILED', 400, error.message, [
          { path: error.field, message: error.message }
        ])
      }
      throw error
    }
  }
}