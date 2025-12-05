import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterProductOnChainDto {
  @ApiProperty({
    example: 'TRACK-123456',
    description: 'Unique tracking ID for the product',
  })
  @IsString()
  @IsNotEmpty()
  trackingId: string;

  @ApiProperty({
    example: 'Organic Coffee Beans',
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Manufacturer/Supplier name',
  })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiPropertyOptional({
    example: 'Premium organic coffee',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductOnChainDto {
  @ApiProperty({
    example: 'TRACK-123456',
    description: 'Product tracking ID',
  })
  @IsString()
  @IsNotEmpty()
  trackingId: string;

  @ApiProperty({
    example: 'shipped',
    description: 'New status for the product',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 'Warehouse B',
    description: 'Current location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({
    example: 'In transit to distribution center',
    description: 'Additional notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class VerifyProductDto {
  @ApiProperty({
    example: 'TRACK-123456',
    description: 'Product tracking ID to verify',
  })
  @IsString()
  @IsNotEmpty()
  trackingId: string;
}
