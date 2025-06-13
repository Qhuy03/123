import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlaceOrderStep } from './saga/place-order.step';
import { CreateOrderSaga } from './create-order.saga';
import { UpdateStockStep } from './saga/update-stock.step';
import { AuthorizePaymentStep } from './saga/process-payment.step';
import { ConfirmOrderStep } from './saga/confirm-order.step';

@Module({
  imports: [
    ClientsModule.register([
      // {
      //   name: 'CARTS_SERVICE',
      //   transport: Transport.TCP,
      //   options: {
      //     port: 3002,
      //   }
      // },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3003,
        },
      },
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      },
      {
        name: 'CARTS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
      {
        name: 'PRODUCTS_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
          queue: 'product_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'ORDER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
          queue: 'order_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'PAYMENT_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL || 'amqp://localhost:5672'],
          queue: 'payment_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: 'place-order-step',
      useClass: PlaceOrderStep,
    },
    {
      provide: 'update-stock',
      useClass: UpdateStockStep,
    },
    {
      provide: 'authorize-payment',
      useClass: AuthorizePaymentStep,
    },
    {
      provide: 'confirm-order',
      useClass: ConfirmOrderStep,
    },
    {
      provide: 'create-order-saga',
      useClass: CreateOrderSaga,
    },
  ],
})
export class CheckoutModule {}
