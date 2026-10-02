import 'reflect-metadata'
import { container, type DependencyContainer } from 'tsyringe'
import { useContainer } from 'routing-controllers'
import {
  DATA_SOURCE,
  DemoRecordController,
  DemoRecordRepository,
  DemoRecordUseCases,
  OBJECT_STORE
} from '@limin/demo-module'
import { createDataSource } from './db/data-source.js'
import { createObjectStore } from './storage/object-store.js'
import { setContractVersion } from '@limin/demo-module'
import { HealthController, setHealthContractVersion } from './http/health.controller.js'
import type { AppConfig } from './config.js'

export interface Composition {
  dataSource: ReturnType<typeof createDataSource>
  objectStore: ReturnType<typeof createObjectStore>
  config: AppConfig
}

export function buildComposition(config: AppConfig): Composition {
  const dataSource = createDataSource(config.database.url, config.database.poolSize)
  const objectStore = createObjectStore(config.objectStore)
  const repository = new DemoRecordRepository(dataSource)

  container.register(DATA_SOURCE, { useValue: dataSource })
  container.register(OBJECT_STORE, { useValue: objectStore })
  container.register(DemoRecordRepository, { useValue: repository })
  container.register(DemoRecordUseCases, { useValue: new DemoRecordUseCases(repository) })
  container.register(HealthController, { useValue: new HealthController(dataSource, objectStore) })
  container.register(DemoRecordController, {
    useValue: new DemoRecordController(container.resolve(DemoRecordUseCases))
  })

  useContainer({ get: <T>(token: unknown) => container.resolve<T>(token as never) })

  setContractVersion(config.contractVersion)
  setHealthContractVersion(config.contractVersion)

  return { dataSource, objectStore, config }
}

export function resolveContainer(): DependencyContainer {
  return container
}

export async function shutdownComposition(composition: Composition): Promise<void> {
  if (composition.dataSource.isInitialized) {
    await composition.dataSource.destroy()
  }
}
