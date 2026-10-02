import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('demo_record')
export class DemoRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 120 })
  label!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  note!: string | null

  @Column({ name: 'attachment_key', type: 'varchar', length: 512, nullable: true })
  attachmentKey!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date
}
