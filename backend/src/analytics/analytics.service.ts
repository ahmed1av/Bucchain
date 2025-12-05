import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { UserBehavior } from '../entities/user-behavior.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(UserBehavior)
    private userBehaviorRepository: Repository<UserBehavior>,
  ) {}

  async getMetrics() {
    const totalProducts = await this.productsRepository.count();
    const totalSuppliers = await this.suppliersRepository.count();

    const products = await this.productsRepository.find();
    const inStockCount = products.filter((p) => p.status === 'In Stock').length;
    const inTransitCount = products.filter(
      (p) => p.status === 'In Transit',
    ).length;
    const lowStockCount = products.filter(
      (p) => p.status === 'Low Stock',
    ).length;

    const metrics = {
      overview: {
        totalProducts,
        totalSuppliers,
        activeShipments: inTransitCount,
        onTimeRate: 98.2,
      },
      inventory: {
        inStock: inStockCount,
        lowStock: lowStockCount,
        inTransit: inTransitCount,
        outOfStock:
          totalProducts - inStockCount - lowStockCount - inTransitCount,
      },
      performance: {
        orderAccuracy: 99.7,
        deliveryTime: 2.1,
        inventoryTurnover: 8.5,
        supplierPerformance: 94.8,
      },
    };

    return {
      status: 'success',
      data: metrics,
      meta: {
        generatedAt: new Date().toISOString(),
        source: 'AI Analytics Engine',
      },
    };
  }

  async getPredictions() {
    const predictions = [
      {
        id: 1,
        type: 'demand_forecast',
        title: 'High Demand Expected',
        description: 'Predicted 25% increase in product demand for Q1 2024',
        confidence: 87,
        impact: 'high',
        timeframe: 'next_quarter',
      },
      {
        id: 2,
        type: 'supply_risk',
        title: 'Shipping Delay Alert',
        description:
          'Potential 2-3 day delays in shipping routes due to weather',
        confidence: 92,
        impact: 'medium',
        timeframe: 'next_week',
      },
      {
        id: 3,
        type: 'price_fluctuation',
        title: 'Price Optimization Opportunity',
        description: 'Recommended 5% price adjustment for optimal margins',
        confidence: 78,
        impact: 'low',
        timeframe: 'immediate',
      },
    ];

    return {
      status: 'success',
      data: predictions,
      meta: {
        model: 'neural_ai_v2',
        accuracy: 94.2,
        lastTraining: '2024-01-15',
      },
    };
  }

  async getAlerts() {
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'MacBook Pro M3 inventory below safety threshold',
        severity: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionRequired: true,
      },
      {
        id: 2,
        type: 'info',
        title: 'New Supplier Onboarded',
        message: 'Foxconn Quantum Tech has been successfully integrated',
        severity: 'low',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        actionRequired: false,
      },
      {
        id: 3,
        type: 'success',
        title: 'Shipment Completed',
        message: 'Order #BUC-2847 has arrived at destination',
        severity: 'low',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        actionRequired: false,
      },
    ];

    return {
      status: 'success',
      data: alerts,
      meta: {
        activeAlerts: alerts.filter((a) => a.actionRequired).length,
        totalAlerts: alerts.length,
      },
    };
  }

  async getDashboard() {
    const [metrics, predictions, alerts] = await Promise.all([
      this.getMetrics(),
      this.getPredictions(),
      this.getAlerts(),
    ]);

    return {
      status: 'success',
      data: {
        metrics: metrics.data,
        predictions: predictions.data,
        alerts: alerts.data,
      },
      meta: {
        ...metrics.meta,
        predictionsCount: predictions.data.length,
        alertsCount: alerts.data.length,
      },
    };
  }

  async logBehavior(userId: string | null, action: string, metadata: any = {}) {
    const behavior = this.userBehaviorRepository.create({
      userId: userId || undefined,
      action,
      metadata,
      sessionId: userId ? undefined : 'anonymous', // Simple fallback
    });

    await this.userBehaviorRepository.save(behavior);

    return {
      status: 'success',
      message: 'Behavior logged',
    };
  }

  async getUserAnalytics(userId: string) {
    const behaviors = await this.userBehaviorRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: 50,
    });

    const actionCounts = behaviors.reduce(
      (acc: Record<string, number>, curr) => {
        acc[curr.action] = (acc[curr.action] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      status: 'success',
      data: {
        recentActivity: behaviors,
        summary: actionCounts,
      },
    };
  }
}
