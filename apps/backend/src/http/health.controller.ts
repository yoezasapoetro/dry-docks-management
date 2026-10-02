import 'reflect-metadata'
import { Controller, Get } from 'routing-controllers'
import type { DataSource } from 'typeorm'
import { type ObjectStoreLike } from '@limin/demo-module'

@Controller('/health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly objectStore: ObjectStoreLike
  ) {}

  @Get()
  async check() {
    const [database, objectStore] = await Promise.all([
      probeDatabase(this.dataSource),
      probeObjectStore(this.objectStore)
    ])

    return {
      status: database === 'up' && objectStore === 'up' ? 'ok' : 'degraded',
      database,
      objectStore,
      contractVersion: currentVersion()
    }
  }
}

let contractVersion = '1.0.0'

export function setHealthContractVersion(version: string): void {
  contractVersion = version
}

function currentVersion(): string {
  return contractVersion
}

async function probeDatabase(dataSource: DataSource): Promise<'up' | 'down'> {
  try {
    await dataSource.query('SELECT 1')
    return 'up'
  } catch {
    return 'down'
  }
}

async function probeObjectStore(store: ObjectStoreLike): Promise<'up' | 'down'> {
  try {
    await store.exists('__healthcheck__')
    return 'up'
  } catch {
    return 'down'
  }
}
