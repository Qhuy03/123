import { NestFactory } from '@nestjs/core';
import { CheckoutModule } from './checkout.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const PORT = parseInt(process.env.CHECKOUT_PORT) || 3003;
  // const app = await NestFactory.createMicroservice(CheckoutModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: PORT,
  //   },
  // });
  const app = await NestFactory.create(CheckoutModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: PORT,
    }
  })
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
      queue: 'order_queue',
      queueOptions: { durable: true },
    }
  })

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
      queue: 'payment_queue',
      queueOptions: { durable: true },
    }
  })

  await app.startAllMicroservices();
  // await app.listen();
  console.log(`Checkout service is running on: ${PORT}`);
}
bootstrap();
