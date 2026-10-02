import type { DataSource } from 'typeorm'

export const DATA_SOURCE = Symbol('DataSource')
export const OBJECT_STORE = Symbol('ObjectStore')

export interface ObjectStoreLike {
  put(key: string, body: Uint8Array, contentType: string): Promise<void>
  get(key: string): Promise<Uint8Array | null>
  exists(key: string): Promise<boolean>
  delete(key: string): Promise<void>
}

export type { DataSource }
