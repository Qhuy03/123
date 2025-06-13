import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Registry } from 'prom-client';
import { PrometheusController } from './prometheus.controller';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true, // Enable default metrics
      },
    }),
  ],
  controllers: [PrometheusController],
  providers: [
    {
      provide: Registry, // Make the Registry available
      useValue: new Registry(),
    },
  ],
})
export class PrometheusMetricsModule {}
