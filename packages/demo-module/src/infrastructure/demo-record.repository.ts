import { injectable, inject } from 'tsyringe'
import type { DataSource } from 'typeorm'

import { DATA_SOURCE } from './tokens.js'
import { toAttachmentKey, toRecordId } from '../domain/demo-record.js'
import { DemoRecordEntity } from './demo-record.entity.js'

export interface DemoRecordView {
  id: string
  label: string
  note: string | null
  attachmentKey: string | null
  createdAt: string
}

@injectable()
export class DemoRecordRepository {
  constructor(@inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(DemoRecordEntity)
  }

  async insert(label: string, note: string | null): Promise<DemoRecordView> {
    const saved = await this.repo.save(this.repo.create({ label, note, attachmentKey: null }))
    return toView(saved)
  }

  async findAll(limit: number, offset: number): Promise<DemoRecordView[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' }, take: limit, skip: offset })
    return rows.map(toView)
  }

  async count(): Promise<number> {
    return this.repo.count()
  }

  async findById(id: string): Promise<DemoRecordView | null> {
    const row = await this.repo.findOne({ where: { id: toRecordId(id) } })
    return row === null ? null : toView(row)
  }

  async attach(id: string, key: string): Promise<DemoRecordView | null> {
    const safeKey = toAttachmentKey(key)
    const row = await this.repo.findOne({ where: { id } })
    if (row === null) return null
    row.attachmentKey = safeKey
    return toView(await this.repo.save(row))
  }
}

function toView(entity: DemoRecordEntity): DemoRecordView {
  return {
    id: entity.id,
    label: entity.label,
    note: entity.note,
    attachmentKey: entity.attachmentKey,
    createdAt: new Date(entity.createdAt).toISOString()
  }
}
