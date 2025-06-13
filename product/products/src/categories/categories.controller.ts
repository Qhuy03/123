import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly _service: CategoriesService) {}
  @Get(':name')
  async get(@Param('name') name: string) {
    console.log(name);
    return await this._service.findCategoryNameById(name);
  }
}
