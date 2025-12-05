import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatterService } from '../services/response-formatter.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(ResponseFormatterService)
    private responseFormatter: ResponseFormatterService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: any = {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        error = { code: 'HTTP_ERROR', message: exceptionResponse };
      } else if (typeof exceptionResponse === 'object') {
        error = {
          code: (exceptionResponse as any).code || 'HTTP_ERROR',
          message: (exceptionResponse as any).message || 'Error occurred',
          details: (exceptionResponse as any).details,
        };
      }
    } else if (exception instanceof Error) {
      error = { code: 'UNKNOWN_ERROR', message: exception.message };
    }

    const formattedResponse = this.responseFormatter.formatError(error);

    response.status(status).json(formattedResponse);
  }
}
