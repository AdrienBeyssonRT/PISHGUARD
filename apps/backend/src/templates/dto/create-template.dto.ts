import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsString()
  htmlBody: string;

  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;
}


