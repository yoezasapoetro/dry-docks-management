import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { appConfig, closeTestDataSource, testApp, testDataSource } from './harness.js'
import { buildComposition } from '../../src/composition.js'

describe('object store client', () => {
  beforeAll(async () => {
    await testDataSource()
  })

  afterAll(async () => {
    await closeTestDataSource()
  })

  it('writes and reads an object through the gateway', async () => {
    const store = buildComposition(appConfig()).objectStore
    const key = `integration/probe-${Date.now()}.txt`

    await store.put(key, new TextEncoder().encode('roundtrip'), 'text/plain')
    const got = await store.get(key)

    expect(got).not.toBeNull()
    expect(new TextDecoder().decode(got!)).toBe('roundtrip')

    await store.delete(key)
  })

  it('reports a missing key as null rather than throwing', async () => {
    const store = buildComposition(appConfig()).objectStore

    expect(await store.get('integration/definitely-absent')).toBeNull()
  })

  it('reports existence accurately for present and absent keys', async () => {
    const store = buildComposition(appConfig()).objectStore
    const key = `integration/exists-${Date.now()}.txt`

    expect(await store.exists(key)).toBe(false)
    await store.put(key, new TextEncoder().encode('x'), 'text/plain')
    expect(await store.exists(key)).toBe(true)
    await store.delete(key)
    expect(await store.exists(key)).toBe(false)
  })

  it('isolates objects under the configured key prefix', async () => {
    const config = appConfig()
    const store = buildComposition(config).objectStore
    const key = `integration/prefixed-${Date.now()}.txt`

    await store.put(key, new TextEncoder().encode('prefixed'), 'text/plain')

    const raw = await store.get(key)
    expect(raw).not.toBeNull()
    expect(config.objectStore.keyPrefix.length).toBeGreaterThan(0)

    await store.delete(key)
  })

  it('does not expose the gateway as healthy through the health route when storage is unreachable', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.body.objectStore).toBe('up')
  })
})
