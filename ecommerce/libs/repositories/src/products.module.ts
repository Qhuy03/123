import { Module } from '@nestjs/common';
import { DatabaseProvider, PrismaService } from 'y/prisma';
import { ConfigModule } from '@nestjs/config';
import { SpuRepository } from '../products/spu.repository';
import { SkuRepository } from '../products/sku.repository';
import { CategoryRepository } from '../products/category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Spu, SpuSchema } from 'y/prisma/schemas/spus.schema';
import { Sku, SkuSchema } from 'y/prisma/schemas/skus.schema';
import { Category, CategorySchema } from 'y/prisma/schemas/category.schema';

const repository = [SpuRepository, SkuRepository, CategoryRepository];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseProvider,
    MongooseModule.forFeature([
      { name: Spu.name, schema: SpuSchema },
      { name: Sku.name, schema: SkuSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [PrismaService, ...repository],
  exports: [...repository],
})
export class ProductsModule {}
