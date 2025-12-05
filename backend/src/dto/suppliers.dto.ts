import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  products: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
