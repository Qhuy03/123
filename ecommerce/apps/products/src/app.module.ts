import { Module } from '@nestjs/common';
import { SpusModule } from './spus/spus.module';
import { SkusModule } from './skus/skus.module';
import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [SpusModule, SkusModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
