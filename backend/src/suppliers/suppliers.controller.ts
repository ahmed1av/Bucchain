import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('suppliers')
@Roles('admin')
export class SuppliersController {
  @Public()
  @Get()
  getAllSuppliers() {
    return {
      suppliers: [
        {
          id: 1,
          name: 'Foxconn Technology',
          country: 'Taiwan',
          rating: '4.8/5',
          products: 'Electronics',
          status: 'Active',
        },
        {
          id: 2,
          name: 'TSMC',
          country: 'Taiwan',
          rating: '4.9/5',
          products: 'Semiconductors',
          status: 'Active',
        },
        {
          id: 3,
          name: 'Samsung Electronics',
          country: 'South Korea',
          rating: '4.7/5',
          products: 'Components',
          status: 'Active',
        },
        {
          id: 4,
          name: 'Intel Corporation',
          country: 'USA',
          rating: '4.6/5',
          products: 'Processors',
          status: 'Pending',
        },
      ],
    };
  }
}
