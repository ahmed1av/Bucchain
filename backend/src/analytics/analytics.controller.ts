import { Controller, Get } from '@nestjs/common';

@Controller('analytics')
export class AnalyticsController {
  @Get('metrics')
  getMetrics() {
    return {
      metrics: [
        {
          name: 'On-Time Delivery',
          value: '98.2%',
          change: '+2.1%',
          positive: true,
        },
        {
          name: 'Order Accuracy',
          value: '99.7%',
          change: '+0.3%',
          positive: true,
        },
        {
          name: 'Inventory Turnover',
          value: '8.5x',
          change: '+1.2x',
          positive: true,
        },
        {
          name: 'Supplier Performance',
          value: '94.8%',
          change: '-0.5%',
          positive: false,
        },
      ],
    };
  }

  @Get('dashboard')
  getDashboard() {
    return {
      stats: {
        totalProducts: 1247,
        activeShipments: 89,
        supplierNetwork: 156,
        onTimeRate: '98.2%',
      },
    };
  }

  @Get('predictions')
  getPredictions() {
    return {
      predictions: [
        {
          insight: 'High demand predicted for Q1',
          confidence: '87%',
          impact: 'High',
        },
        {
          insight: 'Shipping delay expected',
          confidence: '92%',
          impact: 'Medium',
        },
        {
          insight: 'New supplier opportunity',
          confidence: '78%',
          impact: 'Low',
        },
      ],
    };
  }
}
