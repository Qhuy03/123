import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter, ResponseInterceptor } from 'y/configs';
dotenv.config();
async function bootstrap() {
  const PORT = process.env.USERS_PORT || 5000;
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: PORT,
  //   }
  // });
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: PORT,
    },
  });
  await app.startAllMicroservices();
  // app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalFilters(new AllExceptionsFilter());

  // await app.listen();
  console.log(`Users service is running on: ${PORT}`);
}
bootstrap();
