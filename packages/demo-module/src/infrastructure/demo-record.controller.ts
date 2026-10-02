import { Body, Controller, Get, HttpCode, Param, Post, QueryParam } from 'routing-controllers'
import { DemoRecordUseCases } from '../application/demo-record.use-cases.js'
import { AttachRequestDto, CreateDemoRecordDto } from './dto/index.js'

let contractVersion = '1.0.0'

export function setContractVersion(version: string): void {
  contractVersion = version
}

export function currentContractVersion(): string {
  return contractVersion
}

@Controller('/demo-records')
export class DemoRecordController {
  constructor(private readonly useCases: DemoRecordUseCases) {}

  @Get()
  async list(@QueryParam('limit') limit?: string, @QueryParam('offset') offset?: string) {
    const result = await this.useCases.list(clamp(limit, 20, 1, 100), clamp(offset, 0, 0, 1_000_000))
    return { ...result, contractVersion: currentContractVersion() }
  }

  @Post()
  @HttpCode(201)
  async create(@Body({ validate: true }) body: CreateDemoRecordDto) {
    const created = await this.useCases.create(body.label, body.note ?? null)
    return { ...created, contractVersion: currentContractVersion() }
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const found = await this.useCases.get(id)
    return { ...found, contractVersion: currentContractVersion() }
  }

  @Post('/:id/attachment')
  @HttpCode(200)
  async attach(@Param('id') id: string, @Body({ validate: true }) body: AttachRequestDto) {
    const updated = await this.useCases.attach(id, body.key)
    return { ...updated, contractVersion: currentContractVersion() }
  }
}

function clamp(raw: string | undefined, fallback: number, min: number, max: number): number {
  if (raw === undefined) return fallback
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(Math.trunc(parsed), min), max)
}
