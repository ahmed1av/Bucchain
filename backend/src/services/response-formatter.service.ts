import { Injectable } from '@nestjs/common';

export interface SuccessResponse<T> {
  status: 'success';
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
    executionTime?: number;
  };
  _links?: {
    self: string;
    next?: string;
    prev?: string;
  };
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
    executionTime?: number;
  };
  _links: {
    self: string;
    next?: string;
    prev?: string;
    first: string;
    last: string;
  };
}

@Injectable()
export class ResponseFormatterService {
  formatSuccess<T>(
    data: T,
    options: {
      message?: string;
      executionTime?: number;
      links?: { self: string; next?: string; prev?: string };
    } = {},
  ): SuccessResponse<T> {
    const response: SuccessResponse<T> = {
      status: 'success',
      data: this.addStyling(data),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        version: '1.0.0',
        executionTime: options.executionTime,
      },
    };

    if (options.links) {
      response._links = options.links;
    }

    return response;
  }

  formatPaginated<T>(
    data: T[],
    pagination: { page: number; limit: number; total: number },
    basePath: string,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    const links: any = {
      self: `${basePath}?page=${pagination.page}&limit=${pagination.limit}`,
      first: `${basePath}?page=1&limit=${pagination.limit}`,
      last: `${basePath}?page=${totalPages}&limit=${pagination.limit}`,
    };

    if (pagination.page < totalPages) {
      links.next = `${basePath}?page=${pagination.page + 1}&limit=${pagination.limit}`;
    }

    if (pagination.page > 1) {
      links.prev = `${basePath}?page=${pagination.page - 1}&limit=${pagination.limit}`;
    }

    return {
      status: 'success',
      data: {
        items: data.map((item) => this.addStyling(item)),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          pages: totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        version: '1.0.0',
      },
      _links: links,
    };
  }

  formatError(error: {
    code: string;
    message: string;
    details?: any;
    documentation_url?: string;
  }): any {
    const emojiMap: Record<string, string> = {
      NOT_FOUND: '🔍',
      VALIDATION_ERROR: '⚡',
      AUTH_ERROR: '🔐',
      RATE_LIMIT: '🚦',
      SERVER_ERROR: '🚨',
      NETWORK_ERROR: '📡',
      TIMEOUT: '⏰',
    };

    const emoji = emojiMap[error.code] || '❌';

    return {
      status: 'error',
      error: {
        code: error.code,
        message: `${emoji} ${error.message}`,
        details: error.details,
        documentation_url:
          error.documentation_url || 'https://docs.bucchain.com/errors',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        version: '1.0.0',
      },
    };
  }

  private addStyling<T>(data: T): T {
    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        _style: {
          rendered_at: new Date().toISOString(),
          format: 'standard',
          version: '1.0.0',
        },
      };
    }
    return data;
  }

  private generateRequestId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `req_${timestamp}_${random}`.toUpperCase();
  }
}
