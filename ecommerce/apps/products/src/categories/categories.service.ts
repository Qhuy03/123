import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'libs/repositories/products/category.repository';
import { CategoryDto } from './category.dto';
import { Category } from 'y/prisma/schemas/category.schema';
import { Types } from 'mongoose';
// import categoriesData from './data/nha_sach_tiki.json'; // Import file JSON
import categoriesData from './data/tui_thoi_trang_nu.json'; // Import file JSON
// import categoriesData from './data/laptop.json'; // Import file JSON

@Injectable()
export class CategoriesService {
  constructor(private _categoryRepository: CategoryRepository) {}
  private count = 0;
  async create(createDto: CategoryDto): Promise<Category> {
    const created = await this._categoryRepository.create({
      ...createDto,
      parent_category: createDto.parent_category
        ? new Types.ObjectId(createDto.parent_category)
        : null,
    });
    return created;
  }

  async findAll(): Promise<Category[]> {
    return await this._categoryRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this._categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  //   async update(id: string, updateDto: CategoryDto): Promise<Category> {
  //     const updated = await this._categoryRepository.findByIdAndUpdate(
  //       id,
  //       {
  //         ...updateDto,
  //         ...(updateDto.parent_category && { parent_category: new Types.ObjectId(updateDto.parent_category) }),
  //       },
  //       { new: true },
  //     );
  //     if (!updated) {
  //       throw new NotFoundException('Category not found');
  //     }
  //     return updated;
  //   }

  async findByParent(parentId: string | null) {
    // Điều kiện để lọc danh mục dựa trên parentId
    const condition = parentId
      ? { parent_category: new Types.ObjectId(parentId) }
      : { parent_category: null };

    // Tìm danh mục với điều kiện trên
    const categories = await this._categoryRepository.findAll({
      filter: condition,
      perPage: 100,
    });

    // Nếu có parentId, tìm tất cả danh mục con của các category
    const categoriesWithChildren = await Promise.all(
      categories.map(async (category) => {
        // Nếu có parentId, tìm danh mục con
        const category_children = parentId
          ? await this._categoryRepository.findAll({
              filter: { parent_category: category._id },
              perPage: 100,
            })
          : [];

        return {
          category_name: category.category_name,
          category_thumb: category.category_thumb,
          category_path: `${category.category_slug}/${category._id}`, // Tạo category_path
          category_children: category_children.map((child) => ({
            category_name: child.category_name,
            category_thumb: child.category_thumb,
            category_path: `${child.category_slug}/${child._id}`, // Tạo category_path cho category con
          })),
        };
      }),
    );

    return categoriesWithChildren;
  }

  async seedCategories(data: any, parentId: Types.ObjectId | null = null) {
    for (const categoryData of data) {
      try {
        const categoryExists = await this._categoryRepository.findOne({
          category_name: categoryData.text,
        });

        if (categoryExists) {
          continue;
        }

        if (!categoryData.text) {
          continue;
        }

        const createdCategory = await this._categoryRepository.create({
          category_name: categoryData.text,
          category_thumb: categoryData.icon_url,
          parent_category: parentId,
          isActive: true,
        });
        this.count++;
        if (categoryData.children && categoryData.children.length > 0) {
          await this.seedCategories(
            categoryData.children,
            createdCategory._id as Types.ObjectId,
          );
        }
        console.log("Success")
        console.log(this.count)
      } catch (error) {}
    }
  }

  async startSeeding() {
    const data = categoriesData;
    await this.seedCategories(data);
  }
}
