import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Supplier company name',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Supplier email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+1-555-0123',
    description: 'Supplier phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: '123 Business St, City, Country',
    description: 'Supplier address',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateSupplierDto {
  @ApiPropertyOptional({
    example: 'Acme Corporation Updated',
    description: 'Supplier company name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    example: 'newemail@acme.com',
    description: 'Supplier email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '+1-555-9999',
    description: 'Supplier phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: '456 New Address, City, Country',
    description: 'Supplier address',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
