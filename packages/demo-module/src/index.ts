export {
  createDemoRecord,
  toAttachmentKey,
  DomainError,
  type CreateDemoRecordInput,
  type DemoRecord as DemoRecordDomain
} from './domain/demo-record.js'

export {
  DemoRecordUseCases,
  type ListResult
} from './application/demo-record.use-cases.js'

export { ModuleError, type ModuleErrorCode, type ModuleErrorDetail } from './application/errors.js'

export {
  DemoRecordController,
  setContractVersion,
  currentContractVersion
} from './infrastructure/demo-record.controller.js'

export { DemoRecordEntity } from './infrastructure/demo-record.entity.js'

export {
  DemoRecordRepository,
  type DemoRecordView
} from './infrastructure/demo-record.repository.js'

export { DATA_SOURCE, OBJECT_STORE, type ObjectStoreLike } from './infrastructure/tokens.js'

export { CreateDemoRecordDto, AttachRequestDto } from './infrastructure/dto/index.js'

import 'reflect-metadata'
