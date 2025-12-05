import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/products.dto';
import { Tracking } from '../entities/tracking.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto } from './dto/review.dto';
import { AiService } from '../ai/ai.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private aiService: AiService,
    private blockchainService: BlockchainService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async findAll() {
    const cacheKey = 'products_all';
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const products = await this.productsRepository.find({
      relations: ['supplier', 'tracking', 'reviews'],
      order: { createdAt: 'DESC' },
    });

    const result = {
      status: 'success',
      data: products,
      meta: {
        count: products.length,
        timestamp: new Date().toISOString(),
      },
    };

    await this.cacheManager.set(cacheKey, result, 60000); // Cache for 1 minute
    return result;
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['supplier', 'tracking'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Verify with blockchain
    let blockchainData = null;
    try {
      if (product.trackingId) {
        blockchainData = await this.blockchainService.verifyProduct(
          product.trackingId,
        );
      }
    } catch (e) {
      console.warn('Blockchain verification failed:', e.message);
    }

    return {
      status: 'success',
      data: {
        ...product,
        blockchainVerification: blockchainData,
      },
    };
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create({
      ...createProductDto,
      trackingId: `BUC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });

    const savedProduct = await this.productsRepository.save(product);

    // Record on Blockchain
    try {
      await this.blockchainService.registerProduct({
        trackingId: savedProduct.trackingId,
        name: savedProduct.name,
        manufacturer: 'VeriChain Inc.', // Should come from supplier
        description: savedProduct.description,
      });
    } catch (e) {
      console.warn('Failed to record on blockchain:', e.message);
    }

    return {
      status: 'success',
      data: savedProduct,
      message: 'Product created successfully',
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productsRepository.save(product);

    // Update on Blockchain if status or location changed
    if (updateProductDto.status || updateProductDto.location) {
      try {
        await this.blockchainService.updateProduct({
          trackingId: product.trackingId,
          status: updateProductDto.status || product.status,
          location: updateProductDto.location || product.location,
          notes: 'Updated via API',
        });
      } catch (e) {
        console.warn('Failed to update on blockchain:', e.message);
      }
    }

    return {
      status: 'success',
      data: updatedProduct,
      message: 'Product updated successfully',
    };
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productsRepository.remove(product);

    return {
      status: 'success',
      message: 'Product deleted successfully',
    };
  }

  async getProductTracking(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['tracking'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const trackingHistory = product.tracking.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return {
      status: 'success',
      data: {
        product: {
          id: product.id,
          name: product.name,
          trackingId: product.trackingId,
        },
        tracking: trackingHistory,
      },
    };
  }

  async addReview(
    productId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      productId,
      userId,
    });

    await this.reviewsRepository.save(review);

    return {
      status: 'success',
      data: review,
      message: 'Review added successfully',
    };
  }

  async getReviews(productId: string) {
    const reviews = await this.reviewsRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        : 0;

    return {
      status: 'success',
      data: {
        reviews,
        averageRating,
        totalReviews: reviews.length,
      },
    };
  }

  async addToWishlist(userId: string, productId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['wishlist'],
    });
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    if (!user.wishlist.some((p) => p.id === productId)) {
      user.wishlist.push(product);
      await this.usersRepository.save(user);
    }

    return {
      status: 'success',
      message: 'Product added to wishlist',
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['wishlist'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.wishlist = user.wishlist.filter((p) => p.id !== productId);
    await this.usersRepository.save(user);

    return {
      status: 'success',
      message: 'Product removed from wishlist',
    };
  }

  async getWishlist(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['wishlist'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      data: user.wishlist,
    };
  }

  createSampleData() {
    // This method is for development only
    return {
      status: 'success',
      message: 'Sample data creation skipped in this environment',
    };
  }
}
