import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Tracking } from '../entities/tracking.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { AiModule } from '../ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Tracking, Review, User]),
    AiModule,
    BlockchainModule,
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
