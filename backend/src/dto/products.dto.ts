import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Organic Coffee Beans',
    description: 'Product name',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    example: 'Premium organic coffee beans from Ethiopia',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 29.99,
    description: 'Product price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Product quantity in stock',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 'in_stock',
    description: 'Product status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 'Warehouse A, Section B3',
    description: 'Product location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Supplier UUID',
  })
  @IsString()
  @IsNotEmpty()
  supplierId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Organic Coffee Beans - Updated',
    description: 'Product name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 34.99,
    description: 'Product price',
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Product quantity',
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 'low_stock',
    description: 'Product status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: 'Warehouse B, Section A1',
    description: 'Product location',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
