import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CARTS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        }
      },
    ]),
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001
        }
      },
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
