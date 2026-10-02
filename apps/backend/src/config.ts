export interface AppConfig {
  database: {
    url: string
    poolSize: number
  }
  objectStore: {
    endpoint: string
    region: string
    forcePathStyle: boolean
    bucket: string
    keyPrefix: string
    accessKeyId: string
    secretAccessKey: string
  }
  http: {
    port: number
  }
  logLevel: string
  contractVersion: string
}

function required(key: string): string {
  const value = process.env[key]
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required configuration value: ${key}`)
  }
  return value
}

function numeric(key: string): number {
  const parsed = Number(required(key))
  if (!Number.isFinite(parsed)) {
    throw new Error(`Configuration value ${key} must be numeric, received "${required(key)}"`)
  }
  return parsed
}

function boolean(key: string): boolean {
  const raw = required(key).toLowerCase()
  if (raw === 'true') return true
  if (raw === 'false') return false
  throw new Error(`Configuration value ${key} must be 'true' or 'false', received "${raw}"`)
}

export function loadConfig(): AppConfig {
  return {
    database: {
      url: required('DATABASE_URL'),
      poolSize: numeric('DATABASE_POOL_SIZE')
    },
    objectStore: {
      endpoint: required('OBJECT_STORE_ENDPOINT'),
      region: required('OBJECT_STORE_REGION'),
      forcePathStyle: boolean('OBJECT_STORE_FORCE_PATH_STYLE'),
      bucket: required('OBJECT_STORE_BUCKET'),
      keyPrefix: required('OBJECT_STORE_KEY_PREFIX'),
      accessKeyId: required('OBJECT_STORE_ACCESS_KEY_ID'),
      secretAccessKey: required('OBJECT_STORE_SECRET_ACCESS_KEY')
    },
    http: {
      port: numeric('HTTP_PORT')
    },
    logLevel: required('LOG_LEVEL'),
    contractVersion: required('CONTRACT_VERSION')
  }
}