import 'reflect-metadata'
import { config as loadDotenv } from 'dotenv'
import type { DataSource } from 'typeorm'
import { loadConfig, type AppConfig } from '../../src/config.js'
import { buildComposition, shutdownComposition } from '../../src/composition.js'
import { buildApp } from '../../src/http/server.js'

loadDotenv({ path: '.env.test' })

let source: DataSource | undefined
let ready: Promise<DataSource> | undefined

export function appConfig(): AppConfig {
  return loadConfig()
}

export function testDataSource(): Promise<DataSource> {
  if (ready === undefined) {
    ready = (async () => {
      const config = appConfig()
      const composition = buildComposition(config)
      source = composition.dataSource
      await composition.dataSource.initialize()
      return composition.dataSource
    })()
  }
  return ready
}

export function testApp() {
  return buildApp()
}

export async function closeTestDataSource(): Promise<void> {
  if (source !== undefined) {
    await shutdownComposition({ dataSource: source, objectStore: {} as never, config: appConfig() })
    source = undefined
  }
}

export async function resetRecords(): Promise<void> {
  const ds = await testDataSource()
  await ds.query('DELETE FROM demo_record')
}

export async function seedRecord(label: string, note: string | null = null): Promise<string> {
  const ds = await testDataSource()
  await ds.query('INSERT INTO demo_record (id, label, note, created_at) VALUES (?, ?, ?, ?)', [
    crypto.randomUUID(),
    label,
    note,
    new Date()
  ])
  const rows = (await ds.query('SELECT id FROM demo_record WHERE label = ? ORDER BY created_at DESC', [
    label
  ])) as Array<{ id: string }>
  return rows[0].id
}
