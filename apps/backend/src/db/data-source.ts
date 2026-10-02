import 'reflect-metadata'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DemoRecordEntity } from '@limin/demo-module'
import { DataSource, type DataSourceOptions } from 'typeorm'

const currDir = fileURLToPath(new URL('.', import.meta.url))

export function buildDataSourceOptions(
  databaseUrl: string,
  poolSize: number
): DataSourceOptions {
  return {
    type: 'mariadb',
    url: databaseUrl,
    poolSize,
    synchronize: false,
    migrationsRun: false,
    entities: [DemoRecordEntity],
    migrations: [join(currDir, 'migrations', '*.ts'), join(currDir, 'migrations', '*.js')],
    migrationsTableName: 'typeorm_migrations'
  }
}

export function createDataSource(
  databaseUrl: string,
  poolSize: number
): DataSource {
  return new DataSource(buildDataSourceOptions(databaseUrl, poolSize))
}
