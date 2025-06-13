import { Module } from '@nestjs/common';
import { DatabaseProvider, PrismaService } from 'y/prisma';
import { SpuRepository } from '../products/spu.repository';
import { SkuRepository } from '../products/sku.repository';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Spu, SpuSchema } from 'y/prisma/schemas/spus.schema';
import { Sku, SkuSchema } from 'y/prisma/schemas/skus.schema';
import { OrderRepository } from '../orders/order.repository';
import { OrderDetailRepository } from '../orders/order.item.repository';
import { PaymentMethodRepository } from '../orders/payment.repository';
import { Category, CategorySchema } from 'y/prisma/schemas/category.schema';
import { UsersModule } from './users.module';
import { CartsModule } from './carts.module';
import { ProductsModule } from './products.module';
import { OdersModule } from './oders.module';

const modules = [UsersModule, CartsModule, ProductsModule, OdersModule];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ...modules,
  ],
  providers: [],
  exports: [...modules],
})
export class RepositoriesModule {}
