import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { UserBehavior } from '../entities/user-behavior.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier, UserBehavior])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
