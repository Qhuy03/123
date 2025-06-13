import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
