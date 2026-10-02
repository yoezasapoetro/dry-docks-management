import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { closeTestDataSource, resetRecords, testApp, testDataSource } from './harness.js'

describe('attachment storage', () => {
  beforeAll(async () => {
    await testDataSource()
  })

  beforeEach(async () => {
    await resetRecords()
  })

  afterAll(async () => {
    await closeTestDataSource()
  })

  it('records an attachment against an existing record', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'With file' })

    const res = await request(testApp())
      .post(`/api/demo-records/${created.body.id}/attachment`)
      .send({ key: 'attachments/survey.pdf' })

    expect(res.status).toBe(200)
    expect(res.body.attachmentKey).toBe('attachments/survey.pdf')
  })

  it('returns NOT_FOUND when attaching to an unknown record', async () => {
    const res = await request(testApp())
      .post('/api/demo-records/00000000-0000-4000-8000-000000000000/attachment')
      .send({ key: 'attachments/orphan.pdf' })

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('stores a key rather than a URL, so the value survives an environment change', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'Portable' })

    const res = await request(testApp())
      .post(`/api/demo-records/${created.body.id}/attachment`)
      .send({ key: 'attachments/portable.png' })

    expect(res.body.attachmentKey).not.toMatch(/^[a-z][a-z0-9+.-]*:\/\//i)
    expect(res.body.attachmentKey).toBe('attachments/portable.png')
  })

  it('rejects a URL as an attachment key', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'Url reject' })

    const res = await request(testApp())
      .post(`/api/demo-records/${created.body.id}/attachment`)
      .send({ key: 'https://example.com/a.png' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_FAILED')
  })

  it('rejects a key that would traverse outside the configured prefix', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'Traversal' })

    const res = await request(testApp())
      .post(`/api/demo-records/${created.body.id}/attachment`)
      .send({ key: '../../etc/passwd' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_FAILED')
  })

  it('retains the attachment when the record is read back', async () => {
    const created = await request(testApp()).post('/api/demo-records').send({ label: 'Read back' })
    await request(testApp())
      .post(`/api/demo-records/${created.body.id}/attachment`)
      .send({ key: 'attachments/readback.txt' })

    const res = await request(testApp()).get(`/api/demo-records/${created.body.id}`)

    expect(res.body.attachmentKey).toBe('attachments/readback.txt')
  })
})
