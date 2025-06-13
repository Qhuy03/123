import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly _cateModel: Model<Category>,
  ) {}
  async findCategoryNameById(category_name: any) {
    try {
      // Tìm category theo category_id
      const categories = await this._cateModel.findOne({
        category_name: category_name,
      });

      if (!categories) {
        return null; // Nếu không tìm thấy category
      }

      return categories;
    } catch (error) {
      console.error('Error finding category:', error);
      throw new Error('Error while finding category by ID');
    }
  }
}
