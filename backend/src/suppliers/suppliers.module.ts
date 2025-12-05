import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Supplier } from '../entities/supplier.entity';
import { Order } from '../entities/order.entity';
import { Contract } from '../entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Order, Contract])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
