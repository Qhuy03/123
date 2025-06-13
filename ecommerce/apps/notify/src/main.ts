import { NestFactory } from '@nestjs/core';
import { NotifyModule } from './notify.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotifyModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: true },
    },
  });

  await app.listen();
  console.log('Notify Microservice is running');
}
bootstrap();
