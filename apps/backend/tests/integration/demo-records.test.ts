import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { closeTestDataSource, resetRecords, testApp, testDataSource } from './harness.js'

describe('demo records API', () => {
  beforeAll(async () => {
    await testDataSource()
  })

  beforeEach(async () => {
    await resetRecords()
  })

  afterAll(async () => {
    await closeTestDataSource()
  })

  it('creates a record and returns it with an id', async () => {
    const res = await request(testApp())
      .post('/api/demo-records')
      .send({ label: 'Dry dock 4', note: 'Awaiting survey' })

    expect(res.status).toBe(201)
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(res.body.label).toBe('Dry dock 4')
    expect(res.body.note).toBe('Awaiting survey')
  })

  it('treats an omitted note as null', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: 'Bare' })

    expect(res.status).toBe(201)
    expect(res.body.note).toBeNull()
  })

  it('stamps a creation timestamp', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: 'Stamped' })

    expect(res.body.createdAt).toBeTruthy()
    expect(Number.isNaN(Date.parse(res.body.createdAt))).toBe(false)
  })

  it('carries the contract version on every response', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: 'Versioned' })

    expect(res.body.contractVersion).toBeTruthy()
  })

  it('lists the created record', async () => {
    await request(testApp()).post('/api/demo-records').send({ label: 'Listed' })

    const res = await request(testApp()).get('/api/demo-records')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].label).toBe('Listed')
    expect(res.body.total).toBe(1)
  })

  it('returns the newest record first', async () => {
    await request(testApp()).post('/api/demo-records').send({ label: 'First' })
    await request(testApp()).post('/api/demo-records').send({ label: 'Second' })

    const res = await request(testApp()).get('/api/demo-records')

    expect(res.body.items[0].label).toBe('Second')
  })

  it('fetches one record by id', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'Fetched' })

    const res = await request(testApp()).get(`/api/demo-records/${created.body.id}`)

    expect(res.status).toBe(200)
    expect(res.body.label).toBe('Fetched')
  })

  it('rejects an empty label and persists nothing', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: '' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_FAILED')

    const list = await request(testApp()).get('/api/demo-records')
    expect(list.body.total).toBe(0)
  })

  it('rejects a label longer than 120 characters', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: 'x'.repeat(121) })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_FAILED')
  })

  it('reports field-level detail for a rejected label', async () => {
    const res = await request(testApp()).post('/api/demo-records').send({ label: '' })

    expect(Array.isArray(res.body.error.details)).toBe(true)
    expect(res.body.error.details[0].path).toBe('label')
  })

  it('returns NOT_FOUND for an unknown id', async () => {
    const res = await request(testApp()).get('/api/demo-records/00000000-0000-4000-8000-000000000000')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('rejects a non-uuid id', async () => {
    const res = await request(testApp()).get('/api/demo-records/not-a-uuid')

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_FAILED')
  })

  it('includes a request id in every error body', async () => {
    const res = await request(testApp())
      .get('/api/demo-records/00000000-0000-4000-8000-000000000000')
      .set('X-Request-Id', 'trace-99')

    expect(res.body.error.requestId).toBe('trace-99')
  })

  it('persists a record across a backend restart', async () => {
    await request(testApp()).post('/api/demo-records').send({ label: 'Durable' })

    const res = await request(testApp()).get('/api/demo-records')

    expect(res.body.items[0].label).toBe('Durable')
  })
})
