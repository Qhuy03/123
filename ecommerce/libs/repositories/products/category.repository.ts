import { MongoBaseRepository } from '../src/mongo-base.repository';
import { PrismaService } from 'y/prisma';
import { Injectable } from '@nestjs/common';
import { Sku, SkuModel } from 'y/prisma/schemas/skus.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'y/prisma/schemas/category.schema';

@Injectable()
export class CategoryRepository extends MongoBaseRepository<
  Category,
  any,
  any
> {
  constructor(
    @InjectModel(Category.name) private readonly category: Model<Category>,
  ) {
    super(category); // Truyền UserModel vào repository cơ bản
  }

  async createMany(data: Array<any>) {
    return await this.model.insertMany(data);
  }
}
