import { Controller, Get, Param } from '@nestjs/common';

@Controller('track')
export class TrackingController {
  @Get(':id')
  trackProduct(@Param('id') id: string) {
    const trackingData = [
      {
        id: '1',
        location: 'Factory - Shenzhen',
        status: 'Manufactured',
        timestamp: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        description: 'Product manufacturing completed',
      },
      {
        id: '2',
        location: 'Port - Shanghai',
        status: 'Shipped',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Product shipped from origin port',
      },
      {
        id: '3',
        location: 'Customs - Singapore',
        status: 'Customs Clearance',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Clearing customs inspection',
      },
      {
        id: '4',
        location: 'Port - Los Angeles',
        status: 'Arrived',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Arrived at destination port',
      },
      {
        id: '5',
        location: 'Warehouse - California',
        status: 'In Storage',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Product in storage awaiting distribution',
      },
    ];

    return {
      product: {
        id: id,
        name: `Product ${id}`,
        status: 'In Storage',
        location: 'Warehouse - California, USA',
        description:
          'Quantum-enhanced supply chain product with blockchain verification',
      },
      tracking: trackingData,
    };
  }
}
