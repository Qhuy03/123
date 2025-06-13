import { NestFactory } from '@nestjs/core';
import { PrometheusModule } from './prometheus.module';

async function bootstrap() {
  const app = await NestFactory.create(PrometheusModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
