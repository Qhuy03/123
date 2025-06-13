import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { SpuDTO, SpuQueryDTO } from 'y/dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: SpuDTO) {
    return this.productsService.create(createProductDto);
  }
  @Get()
  findAll(@Query() params: SpuQueryDTO) {
    return this.productsService.findAll(params);
  }
  @Get(':id')
  findAllSkuBySpu(@Param('id') id: string) {
    return this.productsService.findAllSkuBySpu(id);
  }
  @Get(':id')
  getSkuById(@Param('id') id: string) {
    return this.productsService.getSkuById(id);
  }

  @Post(':id/publish')
  publishProductByShop(@Param('id') id: string) {
    return this.productsService.publishProductByShop(id);
  }
  @Post(':id/unpublish')
  unPublishProductByShop(@Param('id') id: string) {
    return this.productsService.unPublishProductByShop(id);
  }
}
