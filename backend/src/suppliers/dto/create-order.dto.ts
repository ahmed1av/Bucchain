import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  orderNumber: string;

  @IsNumber()
  totalAmount: number;

  @IsString()
  status: string;

  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: Date;

  @IsArray()
  items: any[];
}
