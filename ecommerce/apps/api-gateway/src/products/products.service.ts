import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SpuDTO, SpuQueryDTO } from 'y/dtos';

@Injectable()
export class ProductsService {
  constructor(@Inject('PRODUCTS_SERVICE') private readonly _productClient: ClientProxy) {}
  async create(createProductDto: SpuDTO) {
    return await firstValueFrom(
      this._productClient.send('product.create', createProductDto)
    );
  }

  async findAll(params: SpuQueryDTO) {
    return await firstValueFrom(
      this._productClient.send('product.findAll', params)
    );
  }

  async getSkuById(id: string) {
    return await firstValueFrom(
      this._productClient.send('product.getSkuById', id)
    );
  }
  
  async publishProductByShop(id: string) {
    return await firstValueFrom(
      this._productClient.send('product.publishProductByShop', id)
    );
  }

  async unPublishProductByShop(id: string) {
    return await firstValueFrom(
      this._productClient.send('product.unPublishProductByShop', id)
    );
  }

  async findAllSkuBySpu(id: string) {
    return await firstValueFrom(
      this._productClient.send('product.findAllSkuBySpu', id)
    );
  }

}
