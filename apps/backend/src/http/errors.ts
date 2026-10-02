export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'DEPENDENCY_UNAVAILABLE'

export interface ErrorDetail {
  path: string
  message: string
}

export interface ErrorBody {
  error: {
    code: ErrorCode
    message: string
    details?: ErrorDetail[]
    requestId: string
  }
}

export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly details?: ErrorDetail[]

  constructor(code: ErrorCode, status: number, message: string, details?: ErrorDetail[]) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}

interface RoutingValidationError {
  name?: string
  targetName?: string
  targetMethod?: string
  property?: string
  constraints?: Record<string, string>
  errors?: Array<{ property?: string; constraints?: Record<string, string> }>
}

function asValidationError(error: unknown): ErrorDetail[] | null {
  if (typeof error !== 'object' || error === null) return null

  const candidate = error as RoutingValidationError
  if (candidate.constraints !== undefined) {
    return Object.values(candidate.constraints).map((message) => ({
      path: candidate.property ?? 'body',
      message
    }))
  }

  if (Array.isArray(candidate.errors) && candidate.errors.length > 0) {
    return candidate.errors.flatMap((entry) =>
      Object.entries(entry.constraints ?? {}).map(([path, message]) => ({
        path: entry.property ?? path,
        message
      }))
    )
  }

  return null
}

export function toErrorBody(error: unknown, requestId: string): ErrorBody {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
        requestId
      }
    }
  }

  const moduleError = error as { name?: string; code?: ErrorCode; message?: string; details?: ErrorDetail[] }
  if (moduleError?.name === 'ModuleError' && typeof moduleError.code === 'string') {
    return {
      error: {
        code: moduleError.code,
        message: moduleError.message ?? 'Request failed.',
        ...(moduleError.details ? { details: moduleError.details } : {}),
        requestId
      }
    }
  }

  const details = asValidationError(error)
  if (details !== null) {
    return {
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Request failed validation.',
        ...(details.length > 0 ? { details } : {}),
        requestId
      }
    }
  }

  const domainError = error as { name?: string; field?: string; message?: string }
  if (domainError?.name === 'DomainError' && typeof domainError.field === 'string') {
    return {
      error: {
        code: 'VALIDATION_FAILED',
        message: domainError.message ?? 'Request failed validation.',
        details: [{ path: domainError.field, message: domainError.message ?? 'Invalid.' }],
        requestId
      }
    }
  }

  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
      requestId
    }
  }
}
