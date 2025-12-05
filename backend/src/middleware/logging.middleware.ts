import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] || `req_${Date.now()}`;

    const startTime = Date.now();

    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - ${ip} - ${userAgent}`,
    );

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`,
      );
    });

    next();
  }
}
