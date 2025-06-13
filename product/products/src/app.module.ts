import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Spu, SpuModel, SpuSchema } from './schemas/spus.schema';
import { Sku, SkuModel, SkuSchema } from './schemas/skus.schema';
import { CategoryModel, CategorySchema } from './schemas/category.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27018/productdb'), // Kết nối MongoDB
    MongooseModule.forFeature([
      { name: Spu.name, schema: SpuSchema },
      { name: Sku.name, schema: SkuSchema },
    ]),

    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'task_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),

    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
