import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RepositoriesModule } from 'y/repositories';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from 'y/prisma/schemas/category.schema';

@Module({
  imports: [RepositoriesModule, CategoryModel],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
