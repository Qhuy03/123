import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SpusService } from './spus.service';
import { Request } from 'express';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { SpuDTO, SpuQueryDTO } from 'y/dtos';

@Controller('spus')
export class SpusController {
  constructor(private _spusService: SpusService) {}
  // get all products from the spus service
  // @MessagePattern('product.findAll')
  @Get()
  async findAll(@Query() dto: SpuQueryDTO) {
    console.log("get products")
    return await this._spusService.findAll(dto);
  }

  @MessagePattern('product.findByIds')
  async findByIds(@Payload() products: any[]) {
    return await this._spusService.findByIds(products);
  }

  // get product by id from the spus service
  @Get(':spu_id')
  @MessagePattern('product.findAllSkuBySpu')
  async getSpuById(@Param('spu_id') spu_id: string) {
    return await this._spusService.getSpuById(spu_id);
  }

  @MessagePattern('product.getSkuById')
  async getSkuById(@Payload() dto: { sku_id: string; product_id: string }) {
    if (dto.sku_id) return await this._spusService.getSkuById(dto.sku_id);
    else {
      return await this._spusService.getSpuById(dto.product_id);
    }
  }

  // create a new product in the spus service
  // @Post()
  @MessagePattern('product.create')
  async create(@Payload() data: SpuDTO) {
    return await this._spusService.create(data);
  }

  // get published product by shop from the spus service
  // @Get('published/all')
  // async findAllPublishForShop(@Req() req: Request) {
  //   const product_shop = req.params['x-client-id'];
  //   return await this._spusService.findAllPublishForShop(product_shop);
  // }

  // publish a product by shop from the spus service
  // @Post('publish/:spu_id')
  @MessagePattern('product.publishProductByShop')
  async publishProductByShop(@Payload() spu_id: string) {
    return await this._spusService.publishProductByShop(spu_id);
  }

  @Get('published/all')
  async publishAllProduct() {
    return await this._spusService.publishAllProduct();
  }

  // unpublish a product by shop from the spus service
  // @Post('unpublish/:spu_id')
  @MessagePattern('product.unPublishProductByShop')
  async unpublishProductByShop(@Payload() spu_id: string) {
    return await this._spusService.unpublishProductByShop(spu_id);
  }

  @Patch(':spu_id')
  async updateProduct(@Param('spu_id') spu_id: string, @Body() data: SpuDTO) {
    // return await this._spusService.updateProduct(spu_id, data);
  }

  // @MessagePattern('product.updateInventory')
  // async reduceStockQuantity(@Payload() shop_order_ids: any[]) {
  //     return await this._spusService.reduceStockQuantity(shop_order_ids);
  // }

  @MessagePattern('product.stock.reduce')
  async reduceStockQuantity(@Payload() shop_order_ids: any[]) {
    console.log(shop_order_ids);
    return await this._spusService.reduceStockQuantity(shop_order_ids);
  }

  @MessagePattern('product.stock.restock')
  async restockStockQuantity(@Payload() shop_order_ids: any[]) {
    return await this._spusService.restock(shop_order_ids);
  }

  // @GrpcMethod('ProductService', 'CheckProductExists')
  // async CheckProductExists(data: { productId: string }): Promise<{ exists: boolean }> {
  //     console.log("Controller -> ProductService -> CheckProductExists -> data", data);
  //     return await this._spusService.CheckProductExists(data.productId);
  // }
}
