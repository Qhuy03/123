import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AllExceptionsFilter, ResponseInterceptor } from 'y/configs';

import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { MetricsMiddleware } from 'y/middlewares';
dotenv.config();
async function bootstrap() {
  const PORT = process.env.GATEWAY_PORT || 8080;
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL],
      queue: 'auth_queue',
      queueOptions: { durable: true },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000', // URL của frontend (client)
    credentials: true, // Cho phép gửi và nhận cookies
  });
  app.use(cookieParser());
  app.use(new MetricsMiddleware().use);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.startAllMicroservices();
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', await promise, 'reason:', reason);
    // Bạn có thể quyết định khởi động lại ứng dụng hoặc log thêm thông tin
  });
  await app.listen(PORT);

  console.log(`Api Gateway is running on: ${PORT}`);
}
bootstrap();
