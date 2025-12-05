import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateContractDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  documentUrl?: string;
}
