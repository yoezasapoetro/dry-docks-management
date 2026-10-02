import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'

export interface ObjectStoreSettings {
  endpoint: string
  region: string
  forcePathStyle: boolean
  bucket: string
  keyPrefix: string
  accessKeyId: string
  secretAccessKey: string
}

export interface ObjectStore {
  put(key: string, body: Uint8Array, contentType: string): Promise<void>
  get(key: string): Promise<Uint8Array | null>
  exists(key: string): Promise<boolean>
  delete(key: string): Promise<void>
}

function toClientConfig(settings: ObjectStoreSettings): S3ClientConfig {
  return {
    endpoint: settings.endpoint,
    region: settings.region,
    forcePathStyle: settings.forcePathStyle,
    credentials: {
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey
    }
  }
}

function fullKey(prefix: string, key: string): string {
  const normalised = key.replace(/^\/+/, '')
  return prefix === '' ? normalised : `${prefix.replace(/\/+$/, '')}/${normalised}`
}

export function createObjectStore(settings: ObjectStoreSettings): ObjectStore {
  const client = new S3Client(toClientConfig(settings))
  const bucket = settings.bucket

  return {
    async put(key, body, contentType) {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3')
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fullKey(settings.keyPrefix, key),
          Body: body,
          ContentType: contentType
        })
      )
    },

    async get(key) {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3')
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: fullKey(settings.keyPrefix, key) })
        )
        if (!result.Body) return null
        const bytes = await result.Body.transformToByteArray()
        return bytes
      } catch (error) {
        const name = (error as { name?: string }).name
        if (name === 'NoSuchKey' || name === 'NotFound') return null
        throw error
      }
    },

    async exists(key) {
      const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
      try {
        await client.send(
          new HeadObjectCommand({ Bucket: bucket, Key: fullKey(settings.keyPrefix, key) })
        )
        return true
      } catch {
        return false
      }
    },

    async delete(key) {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
      await client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: fullKey(settings.keyPrefix, key) })
      )
    }
  }
}
