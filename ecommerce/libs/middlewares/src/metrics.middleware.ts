import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly requestCounter: Counter<string>;

  constructor() {
    // Khởi tạo counter trong constructor
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'], // Các nhãn cần thiết
    });
  }

  use = (req: any, res: any, next: () => void): void => {
    // Đảm bảo requestCounter được khởi tạo
    if (!this.requestCounter) {
      console.error('requestCounter is undefined');
      next();
      return;
    }

    const { method, path } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.requestCounter.inc({
        method,
        path,
        status_code: statusCode.toString(),
      });
    });

    next();
  };
}
