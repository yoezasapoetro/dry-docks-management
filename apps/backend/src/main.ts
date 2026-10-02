import 'reflect-metadata'
import { config as loadDotenv } from 'dotenv'
import { loadConfig } from './config.js'
import { buildComposition } from './composition.js'
import { buildApp } from './http/server.js'

loadDotenv({ path: '.env' })
loadDotenv({ path: '.env.compose' })

async function main(): Promise<void> {
  const config = loadConfig()
  const composition = buildComposition(config)

  try {
    await composition.dataSource.initialize()
    await runMigrations(composition)
  } catch (error) {
    console.error('Database is unreachable. Is `pnpm infra:up` running?')
    throw error
  }

  const app = buildApp()
  app.listen(config.http.port, () => {
    console.error(`backend listening on http://localhost:${config.http.port}`)
  })
}

async function runMigrations(composition: ReturnType<typeof buildComposition>): Promise<void> {
  await composition.dataSource.runMigrations({ transaction: 'each' })
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
