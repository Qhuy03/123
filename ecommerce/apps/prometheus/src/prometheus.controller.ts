import { Controller, Get, Header } from '@nestjs/common';
import { Registry } from 'prom-client';

@Controller('metrics')
export class PrometheusController {
    constructor(private readonly registry: Registry) {}

    @Get()
    @Header('Content-Type', 'text/plain; charset=utf-8')
    async getMetrics() {
      const metrics = await this.registry.metrics();
      return metrics;
    }
}
