import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // URL của RabbitMQ
      queue: 'task_queue', // Tên queue bạn muốn lắng nghe
      queueOptions: {
        durable: true, // Đảm bảo các tin nhắn không bị mất
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 9999);
}
bootstrap();
