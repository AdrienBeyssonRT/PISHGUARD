import { IsString, IsInt, IsArray, IsDateString, IsOptional } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsInt()
  templateId: number;

  @IsArray()
  @IsInt({ each: true })
  employeeIds: number[];

  @IsDateString()
  @IsOptional()
  startAt?: string;
}


