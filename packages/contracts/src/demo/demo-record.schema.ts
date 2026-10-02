import { z } from 'zod'
import { CONTRACT_VERSION } from '../version.js'

export const demoRecordSchema = z.object({
  id: z.uuid(),
  label: z.string().min(1).max(120),
  note: z.string().max(500).nullish(),
  attachmentKey: z.string().max(512).nullish(),
  createdAt: z.string(),
  contractVersion: z.literal(CONTRACT_VERSION)
})

export const demoRecordListSchema = z.object({
  items: z.array(demoRecordSchema),
  total: z.number().int().nonnegative(),
  contractVersion: z.literal(CONTRACT_VERSION)
})

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: z.enum(['up', 'down', 'unknown']),
  objectStore: z.enum(['up', 'down', 'unknown']),
  contractVersion: z.literal(CONTRACT_VERSION)
})

export const errorSchema = z.object({
  error: z.object({
    code: z.enum([
      'VALIDATION_FAILED',
      'NOT_FOUND',
      'INTERNAL_ERROR',
      'DEPENDENCY_UNAVAILABLE'
    ]),
    message: z.string(),
    details: z
      .array(z.object({ path: z.string(), message: z.string() }))
      .optional(),
    requestId: z.string()
  })
})

export type DemoRecord = z.infer<typeof demoRecordSchema>
export type DemoRecordList = z.infer<typeof demoRecordListSchema>
export type Health = z.infer<typeof healthSchema>
export type ApiError = z.infer<typeof errorSchema>

// Form schema for the create/edit drawers. Mirrors the backend DTO constraints.
export const demoRecordFormSchema = z.object({
  label: z.string().min(1, 'Label is required').max(120, 'At most 120 characters'),
  note: z.string().max(500, 'At most 500 characters').optional()
})

export type DemoRecordForm = z.infer<typeof demoRecordFormSchema>
