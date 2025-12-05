import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';

class RegisterProductOnChainDto {
  name: string;
  description: string;
  manufacturer: string;
  timestamp: number;
  trackingId?: string;
}

class UpdateProductOnChainDto {
  trackingId: string;
  status: string;
  location: string;
}

class VerifyProductDto {
  trackingId: string;
}

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get blockchain connection status' })
  @ApiResponse({ status: 200, description: 'Blockchain status retrieved' })
  async getStatus() {
    return this.blockchainService.getConnectionStatus();
  }

  @Post('products/register')
  @ApiOperation({ summary: 'Register product on blockchain' })
  @ApiResponse({ status: 201, description: 'Product registered on blockchain' })
  async registerProduct(@Body() dto: RegisterProductOnChainDto) {
    // إضافة timestamp إذا لم يكن موجوداً
    const productData = {
      ...dto,
      trackingId:
        dto.trackingId ||
        'TRACK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: dto.timestamp || Math.floor(Date.now() / 1000),
    };
    return this.blockchainService.registerProduct(productData);
  }

  @Post('products/update')
  @ApiOperation({ summary: 'Update product on blockchain' })
  @ApiResponse({ status: 200, description: 'Product updated on blockchain' })
  async updateProduct(@Body() dto: UpdateProductOnChainDto) {
    return this.blockchainService.updateProduct(dto);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product from blockchain' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved from blockchain',
  })
  async getProduct(@Param('id') productId: string) {
    const id = parseInt(productId, 10);
    return this.blockchainService.getProduct(id);
  }

  @Get('products/:id/history')
  @ApiOperation({ summary: 'Get product history from blockchain' })
  @ApiResponse({ status: 200, description: 'Product history retrieved' })
  async getProductHistory(@Param('id') productId: string) {
    const id = parseInt(productId, 10);
    return this.blockchainService.getProductHistory(id);
  }

  @Post('products/verify')
  @ApiOperation({ summary: 'Verify product on blockchain' })
  @ApiResponse({ status: 200, description: 'Product verification result' })
  async verifyProduct(@Body() dto: VerifyProductDto) {
    return this.blockchainService.verifyProduct(dto.trackingId);
  }

  @Get('products/:id/track')
  @ApiOperation({ summary: 'Track product on blockchain' })
  @ApiResponse({ status: 200, description: 'Product tracking data' })
  async trackProduct(@Param('id') productId: string) {
    const id = parseInt(productId, 10);
    return this.blockchainService.trackProduct(id);
  }
}
