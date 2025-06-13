import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RpcExceptionsCustom } from 'y/configs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PRODUCT_PORT || 3001;

  // const app = await NestFactory.createMicroservice(AppModule,  {
  //   transport: Transport.TCP,
  //   options: {
  //     port: PORT,
  //   },
  // });
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new RpcExceptionsCustom());

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
      queue: 'product_queue',
      queueOptions: { durable: true },
    },
  });

  // await app.listen();
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3008);
  console.log(`Product service is running on: ${PORT}`);
}
bootstrap();
