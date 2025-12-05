import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product UUID',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'shipped',
    description: 'Tracking status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 'Warehouse A',
    description: 'Current location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({
    example: 'Package left facility',
    description: 'Additional notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTrackingDto {
  @ApiPropertyOptional({
    example: 'delivered',
    description: 'Tracking status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: 'Customer Location',
    description: 'Current location',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    example: 'Delivered to recipient',
    description: 'Additional notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
