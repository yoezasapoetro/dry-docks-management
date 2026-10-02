import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { demoRecordListSchema, type DemoRecord, type DemoRecordList } from '@limin/contracts'

const BASE = '/api'

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message ?? `Request failed with ${response.status}`)
  }
  return response.json()
}

// Responses are parsed through the shared zod schemas, so a contract drift
// surfaces as a thrown parse error rather than an undefined field at the call site.
export function useDemoRecords() {
  const queryClient = useQueryClient()

  const list = useQuery({
    queryKey: ['demo-records'],
    queryFn: async (): Promise<DemoRecordList> => {
      const data = await readJson(await fetch(`${BASE}/demo-records`))
      return demoRecordListSchema.parse(data)
    }
  })

  const createRecord = useMutation({
    mutationFn: async (body: { label: string; note?: string }): Promise<DemoRecord> => {
      const data = await readJson(
        await fetch(`${BASE}/demo-records`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
        })
      )
      return data as DemoRecord
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['demo-records'] })
  })

  const updateRecord = useMutation({
    mutationFn: async ({ id, ...body }: { id: string; label: string; note?: string }) => {
      const data = await readJson(
        await fetch(`${BASE}/demo-records/${id}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
        })
      )
      return data as DemoRecord
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['demo-records'] })
  })

  const attach = useMutation({
    mutationFn: async ({ id, key }: { id: string; key: string }) => {
      return readJson(
        await fetch(`${BASE}/demo-records/${id}/attachment`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ key })
        })
      )
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['demo-records'] })
  })

  return { list, createRecord, updateRecord, attach }
}