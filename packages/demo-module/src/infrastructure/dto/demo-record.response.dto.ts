import { IsString, IsUUID, MaxLength } from 'class-validator'

export class DemoRecordIdDto {
  @IsUUID()
  id!: string
}

export class AttachRequestDto {
  @IsString()
  @MaxLength(512)
  key!: string
}