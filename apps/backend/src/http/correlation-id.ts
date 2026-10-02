import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

export const CORRELATION_HEADER = 'X-Request-Id'

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string
  }
}

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id']
  const requestId = typeof incoming === 'string' && incoming.trim() !== ''
    ? incoming
    : randomUUID()

  req.requestId = requestId
  res.setHeader(CORRELATION_HEADER, requestId)
  next()
}