import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('test')
  getTest() {
    return {
      message: '✅ BUCChain API is working!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'BUCChain API',
      timestamp: new Date().toISOString(),
    };
  }
}
