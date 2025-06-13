import { Module } from '@nestjs/common';
import { PrismaService } from 'y/prisma';
import { ConfigModule } from '@nestjs/config';
import { CartsRepository } from '../cart/carts.repository';
import { CartItemRepository } from '../cart/cart.item.repository';

const repository = [CartsRepository, CartItemRepository];
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
export class CartsModule {}
