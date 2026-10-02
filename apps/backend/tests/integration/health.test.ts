import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import {
  appConfig,
  closeTestDataSource,
  testApp,
  testDataSource
} from './harness.js'

describe('GET /api/health', () => {
  beforeAll(async () => {
    await testDataSource()
  })

  afterAll(async () => {
    await closeTestDataSource()
  })

  it('reports the contract version', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.contractVersion).toBe(appConfig().contractVersion)
  })

  it('reports both dependencies up against real services', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.body.database).toBe('up')
    expect(res.body.objectStore).toBe('up')
  })

  it('reports overall status ok when both dependencies are up', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.body.status).toBe('ok')
  })

  it('carries a correlation id header', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.headers['x-request-id']).toBeTruthy()
  })

  it('echoes a supplied correlation id rather than replacing it', async () => {
    const res = await request(testApp()).get('/api/health').set('X-Request-Id', 'trace-42')

    expect(res.headers['x-request-id']).toBe('trace-42')
  })
})