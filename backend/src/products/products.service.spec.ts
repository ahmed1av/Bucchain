import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Tracking } from '../entities/tracking.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { AiService } from '../ai/ai.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepo: any;
  let mockTrackingRepo: any;
  let mockReviewRepo: any;
  let mockUserRepo: any;
  let mockAiService: any;
  let mockBlockchainService: any;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockProductRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockTrackingRepo = {
      find: jest.fn(),
    };

    mockReviewRepo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUserRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockAiService = {
      analyzeProduct: jest.fn(),
    };

    mockBlockchainService = {
      verifyProduct: jest.fn(),
      registerProduct: jest.fn(),
      updateProduct: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(Tracking),
          useValue: mockTrackingRepo,
        },
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached products if available', async () => {
      const cachedData = {
        status: 'success',
        data: [],
        meta: { count: 0, timestamp: new Date().toISOString() },
      };
      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.findAll();

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalledWith('products_all');
      expect(mockProductRepo.find).not.toHaveBeenCalled();
    });

    it('should fetch and cache products if not cached', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          supplier: null,
          tracking: [],
          reviews: [],
        },
        {
          id: '2',
          name: 'Product 2',
          supplier: null,
          tracking: [],
          reviews: [],
        },
      ];
      mockCacheManager.get.mockResolvedValue(null);
      mockProductRepo.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(mockCacheManager.get).toHaveBeenCalledWith('products_all');
      expect(mockProductRepo.find).toHaveBeenCalledWith({
        relations: ['supplier', 'tracking', 'reviews'],
        order: { createdAt: 'DESC' },
      });
      expect((result as any).status).toBe('success');
      expect((result as any).data).toEqual(mockProducts);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        trackingId: 'TEST123',
        supplier: null,
        tracking: [],
      };
      mockProductRepo.findOne.mockResolvedValue(mockProduct);
      mockBlockchainService.verifyProduct.mockResolvedValue({ verified: true });

      const result = await service.findOne('1');

      expect((result as any).status).toBe('success');
      expect((result as any).data.name).toBe('Test Product');
      expect(mockProductRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['supplier', 'tracking'],
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product and register on blockchain', async () => {
      const createDto = {
        name: 'New Product',
        description: 'Test Description',
        price: 99.99,
        quantity: 10,
        manufacturer: 'Test Mfg',
      };
      const savedProduct = {
        id: '1',
        ...createDto,
        trackingId: 'BUC-ABC123',
      };

      mockProductRepo.create.mockReturnValue(savedProduct);
      mockProductRepo.save.mockResolvedValue(savedProduct);
      mockBlockchainService.registerProduct.mockResolvedValue({
        success: true,
        txHash: '0x123',
        productId: 1,
      });

      const result = await service.create(createDto as any);

      expect((result as any).status).toBe('success');
      expect((result as any).data.name).toBe('New Product');
      expect(mockProductRepo.create).toHaveBeenCalled();
      expect(mockProductRepo.save).toHaveBeenCalled();
      expect(mockBlockchainService.registerProduct).toHaveBeenCalled();
    });
  });
});
