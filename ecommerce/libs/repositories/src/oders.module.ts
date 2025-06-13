import { Module } from '@nestjs/common';
import { PrismaService } from 'y/prisma';
import { ConfigModule } from '@nestjs/config';
import { OrderRepository } from '../orders/order.repository';
import { OrderDetailRepository } from '../orders/order.item.repository';
import { PaymentMethodRepository } from '../orders/payment.repository';

const repository = [
  OrderRepository,
  OrderDetailRepository,
  PaymentMethodRepository,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [PrismaService, ...repository],
  exports: [...repository],
})
export class OdersModule {}
