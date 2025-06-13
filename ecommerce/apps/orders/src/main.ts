import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const PORT = parseInt(process.env.CHECKOUT_PORT) || 3003;
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: PORT,
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
      queue: 'order_queue',
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
      queue: 'payment_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  // await app.listen(process.env.port ?? 3000);
  console.log(`Orders service is running on: ${PORT}`);
}
bootstrap();
