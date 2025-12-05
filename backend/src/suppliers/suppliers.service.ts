import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Order } from '../entities/order.entity';
import { Contract } from '../entities/contract.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}

  async findAll() {
    const suppliers = await this.suppliersRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      status: 'success',
      data: suppliers,
      meta: {
        count: suppliers.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async findOne(id: string) {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return {
      status: 'success',
      data: supplier,
    };
  }

  async getSupplierPerformance(id: string) {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    const performance = {
      onTimeDelivery: Math.random() * 20 + 80,
      qualityRating: Math.random() * 10 + 90,
      responseTime: Math.random() * 2 + 1,
      overallScore: supplier.rating,
    };

    return {
      status: 'success',
      data: {
        supplier,
        performance,
      },
    };
  }

  async createOrder(supplierId: string, createOrderDto: CreateOrderDto) {
    const supplier = await this.suppliersRepository.findOne({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    const order = this.ordersRepository.create({
      ...createOrderDto,
      supplierId,
    });

    await this.ordersRepository.save(order);

    return {
      status: 'success',
      data: order,
      message: 'Order created successfully',
    };
  }

  async getOrders(supplierId: string) {
    const orders = await this.ordersRepository.find({
      where: { supplierId },
      order: { createdAt: 'DESC' },
    });

    return {
      status: 'success',
      data: orders,
    };
  }

  async createContract(
    supplierId: string,
    createContractDto: CreateContractDto,
  ) {
    const supplier = await this.suppliersRepository.findOne({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    const contract = this.contractsRepository.create({
      ...createContractDto,
      supplierId,
    });

    await this.contractsRepository.save(contract);

    return {
      status: 'success',
      data: contract,
      message: 'Contract created successfully',
    };
  }

  async getContracts(supplierId: string) {
    const contracts = await this.contractsRepository.find({
      where: { supplierId },
      order: { createdAt: 'DESC' },
    });

    return {
      status: 'success',
      data: contracts,
    };
  }

  async createSampleData() {
    const sampleSuppliers = [
      {
        name: 'Foxconn Quantum Tech',
        country: 'Taiwan',
        rating: 4.8,
        productTypes: 'Electronics Components',
        status: 'active',
        contactEmail: 'contact@foxconn-quantum.com',
        phone: '+886-2-1234-5678',
      },
      {
        name: 'TSMC Neural Foundry',
        country: 'Taiwan',
        rating: 4.9,
        productTypes: 'Semiconductors',
        status: 'active',
        contactEmail: 'info@tsmc-neural.com',
        phone: '+886-3-1234-5678',
      },
      {
        name: 'Samsung Quantum Division',
        country: 'South Korea',
        rating: 4.7,
        productTypes: 'Memory & Displays',
        status: 'active',
        contactEmail: 'quantum@samsung.com',
        phone: '+82-2-1234-5678',
      },
      {
        name: 'Intel Quantum Labs',
        country: 'USA',
        rating: 4.6,
        productTypes: 'Processors & AI Chips',
        status: 'pending',
        contactEmail: 'quantum@intel.com',
        phone: '+1-408-123-4567',
      },
    ];

    for (const supplierData of sampleSuppliers) {
      const exists = await this.suppliersRepository.findOne({
        where: { name: supplierData.name },
      });

      if (!exists) {
        const supplier = this.suppliersRepository.create(supplierData);
        await this.suppliersRepository.save(supplier);
      }
    }

    return {
      status: 'success',
      message: 'Sample suppliers data created successfully',
    };
  }
}
