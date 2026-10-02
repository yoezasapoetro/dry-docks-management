export type ModuleErrorCode =
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'DEPENDENCY_UNAVAILABLE'

export interface ModuleErrorDetail {
  path: string
  message: string
}

export class ModuleError extends Error {
  readonly code: ModuleErrorCode
  readonly status: number
  readonly details?: ModuleErrorDetail[]

  constructor(code: ModuleErrorCode, status: number, message: string, details?: ModuleErrorDetail[]) {
    super(message)
    this.name = 'ModuleError'
    this.code = code
    this.status = status
    this.details = details
  }
}
