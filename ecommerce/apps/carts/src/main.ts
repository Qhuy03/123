import { NestFactory } from '@nestjs/core';
import { CartsModule } from './carts.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const PORT = process.env.CART_PORT || 3002;

  // const app = await NestFactory.createMicroservice(CartsModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: PORT,
  //   }
  // });

  const app = await NestFactory.create(CartsModule);
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
      queue: 'cart_queue',
      queueOptions: { durable: true },
    }
  })
  await app.startAllMicroservices();
  // await app.listen();
  console.log(`Carts service is running on: ${PORT}`);
}
bootstrap();
