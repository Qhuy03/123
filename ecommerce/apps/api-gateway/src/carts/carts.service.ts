import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CartCreateDTO, UpdateCartDTO } from 'y/dtos';

@Injectable()
export class CartsService {
  constructor(
    @Inject('CARTS_SERVICE') private readonly _cartClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly _productClient: ClientProxy,
  ) {}

  async addToCart(data: CartCreateDTO) {
    const { product_id, sku_id } = data;

    const product = await firstValueFrom(
      this._productClient.send('product.getSkuById', { sku_id, product_id }),
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await firstValueFrom(this._cartClient.send('cart.add', data));
  }
  async getCartByUser(user_id: string) {
    const carts = await firstValueFrom(
      this._cartClient.send('cart.get', user_id),
    );
    let total = 0;
    carts.shop_order_ids = await Promise.all(
      carts.shop_order_ids.map(async (shop) => {
        shop.item_products = await Promise.all(
          shop.item_products.map(async (item: any) => {
            const product = await firstValueFrom(
              this._productClient.send('product.getSkuById', {
                sku_id: item.sku_id,
                product_id: item.product_id,
              }),
            );
            if (item.sku_id) {
              if (item?.isSelected) {
                total += product.sku_price * item.quantity;
              }
              return {
                ...item,
                product_thumb: product.product_info?.product_thumb[0],
                product_name: product.product_info.product_name,
                product_price: product.sku_price,
                product_tier_idx: product.sku_tier_idx,
                product_total: product.sku_price * item.quantity,
                product_variations: product.product_info.product_variations,
              };
            }

            if (item.isSelected) {
              total += product[0].product_price * item.quantity;
            }

            return {
              ...item,
              product_thumb: product[0]?.product_thumb,
              product_name: product[0]?.product_name,
              product_price: product[0]?.product_price,
              product_total: product[0]?.product_price * item.quantity,
            };
          }),
        );
        return shop;
      }),
    );

    return {
      ...carts,
      total,
    };
  }

  async update(updateCartDto: UpdateCartDTO) {
    return await firstValueFrom(
      this._cartClient.send('cart.update', updateCartDto),
    );
  }

  async selected(data: any) {
    return await firstValueFrom(this._cartClient.send('cart.selected', data));
  }

  async delete(id: string) {
    return await firstValueFrom(this._cartClient.send('cart.delete', id));
  }
}
