import { describe, expect, it } from 'vitest'
import { AppError, toErrorBody, type ErrorBody } from '../../src/http/errors.js'

describe('toErrorBody', () => {
  it('maps VALIDATION_FAILED with its detail list', () => {
    const error = new AppError('VALIDATION_FAILED', 400, 'Request body is invalid.', [
      { path: 'label', message: 'Required.' }
    ])

    const body: ErrorBody = toErrorBody(error, 'req-1')

    expect(body.error.code).toBe('VALIDATION_FAILED')
    expect(body.error.message).toBe('Request body is invalid.')
    expect(body.error.details).toEqual([{ path: 'label', message: 'Required.' }])
    expect(body.error.requestId).toBe('req-1')
  })

  it('maps NOT_FOUND without a details key when none was supplied', () => {
    const body = toErrorBody(new AppError('NOT_FOUND', 404, 'No such record.'), 'req-2')

    expect(body.error.code).toBe('NOT_FOUND')
    expect(body.error.details).toBeUndefined()
    expect('details' in body.error).toBe(false)
  })

  it('maps DEPENDENCY_UNAVAILABLE', () => {
    const body = toErrorBody(new AppError('DEPENDENCY_UNAVAILABLE', 503, 'Store is down.'), 'r')

    expect(body.error.code).toBe('DEPENDENCY_UNAVAILABLE')
    expect(body.error.message).toBe('Store is down.')
  })

  it('produces a stable INTERNAL_ERROR shape for an unknown throwable', () => {
    const body = toErrorBody(new Error('connection string leaked here'), 'req-3')

    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(body.error.requestId).toBe('req-3')
  })

  it('does not leak the cause of an unknown throwable', () => {
    const secret = 'postgres://user:hunter2@db.internal:5432'
    const body = toErrorBody(new Error(secret), 'req-4')

    expect(JSON.stringify(body)).not.toContain('hunter2')
    expect(body.error.message).toBe('An unexpected error occurred.')
  })

  it('always carries a requestId so a failure is traceable', () => {
    const cases = [
      new AppError('VALIDATION_FAILED', 400, 'x'),
      new AppError('NOT_FOUND', 404, 'x'),
      new Error('boom'),
      'a bare string'
    ]

    for (const thrown of cases) {
      expect(toErrorBody(thrown, 'trace-me').error.requestId).toBe('trace-me')
    }
  })

  it('produces a body that serialises to JSON without loss', () => {
    const body = toErrorBody(
      new AppError('VALIDATION_FAILED', 400, 'Bad.', [{ path: 'a', message: 'Required.' }]),
      'r'
    )

    expect(JSON.parse(JSON.stringify(body))).toEqual(body)
  })
})