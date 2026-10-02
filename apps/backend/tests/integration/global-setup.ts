import 'reflect-metadata'
import { config as loadDotenv } from 'dotenv'
import { loadConfig } from '../../src/config.js'
import { createDataSource } from '../../src/db/data-source.js'

loadDotenv({ path: '.env' })
loadDotenv({ path: '.env.compose' })

export async function setup(): Promise<void> {
  const config = loadConfig()
  const dataSource = createDataSource(config.database.url, config.database.poolSize)
  await dataSource.initialize()
  try {
    await dataSource.runMigrations({ transaction: 'all' })
  } finally {
    await dataSource.destroy()
  }
}
