import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
