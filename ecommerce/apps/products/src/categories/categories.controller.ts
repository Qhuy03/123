import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  create(@Body() createDto: CategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('parent')
  findParent() {
    return this.categoryService.findByParent(null);
  }
  @Get('parent/:parentId')
  findByParent(@Param('parentId') parentId: string) {
    return this.categoryService.findByParent(parentId);
  }
  @Get('categories')
  async seedCategories() {
    await this.categoryService.startSeeding();
    return 'Categories seeded successfully!';
  }
}
