import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  manufacturer: string;

  @IsString()
  @IsOptional()
  batchNumber?: string;

  @IsDateString()
  @IsOptional()
  productionDate?: Date;

  @IsUUID()
  supplierId: string;

  @IsString()
  @IsOptional()
  category?: string;
}
