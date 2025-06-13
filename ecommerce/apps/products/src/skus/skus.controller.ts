import { Controller, Get, Param, Query } from '@nestjs/common';
import { SkusService } from './skus.service';

@Controller('skus')
export class SkusController {
  constructor(private _skusService: SkusService) {}

  @Get()
  async findAll() {
    return this._skusService.findAll();
  }

  @Get('set')
  async set() {
    return this._skusService.updateProductIds();
  }

  @Get(':spu_id')
  async getSkuBySpuId(@Param('spu_id') spu_id: string) {
    return this._skusService.allSkuBySpuId({ product_id: spu_id });
  }

  @Get('one/:sku_id')
  async getOneSku(@Param('sku_id') sku_id: string) {
    return this._skusService.oneSku({ sku_id });
  }
}
