import 'reflect-metadata'
import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import { createExpressServer } from 'routing-controllers'
import { DemoRecordController } from '@limin/demo-module'
import { correlationId, CORRELATION_HEADER } from './correlation-id.js'
import { toErrorBody } from './errors.js'
import { HealthController } from './health.controller.js'

export const CONTROLLERS = [HealthController, DemoRecordController]

export function buildApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(correlationId)
  app.use(
    createExpressServer({
      controllers: CONTROLLERS,
      routePrefix: '/api',
      classTransformer: true,
      defaultErrorHandler: false,
      validation: { whitelist: true, forbidNonWhitelisted: false }
    })
  )

  app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(error)
      return
    }
    const status = (error as { status?: number }).status ?? (toErrorBody(error, req.requestId).error.code === 'VALIDATION_FAILED' ? 400 : 500)
    const body = toErrorBody(error, req.requestId)
    res.status(status).json(body)
  })

  return app
}

export { CORRELATION_HEADER }
