import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateDemoRecordDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  label!: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null
}