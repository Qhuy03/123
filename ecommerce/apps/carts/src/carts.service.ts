import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CartCreateDTO,
  CartDTO,
  ShopOrderDTO,
  UpdateCartDTO,
  UpdateCartItemDTO,
} from 'y/dtos';
import { CartItemRepository } from 'libs/repositories/cart/cart.item.repository';
import { CartsRepository } from 'libs/repositories/cart/carts.repository';

@Injectable()
export class CartsService {
  constructor(
    protected readonly _cartsRepository: CartsRepository,
    protected readonly _cartItemRepository: CartItemRepository,
  ) {}
  async createCart(user_id: string) {
    const cart = await this._cartsRepository.create({ user_id });
    return { ...cart, cart_items: [] };
  }

  async getCartByUser(user_id: string) {
    let cart = (await this._cartsRepository.findOne({
      where: { user_id },
      include: {
        cart_items: {
          // Chắc chắn rằng Prisma nhận diện quan hệ
          where: { isDeleted: false },
          select: {
            id: true,
            sku_id: true,
            product_shop: true,
            product_id: true,
            quantity: true,
            isSelected: true,
          },
        },
      },
    })) as {
      id: string;
      user_id: string;
      created_at: Date;
      updated_at: Date;
      cart_items: any[];
    } | null;
    if (!cart) {
      cart = await this.createCart(user_id);
    }

    const shopOrdersMap = new Map<string, ShopOrderDTO>();

    for (const item of cart.cart_items) {
      const product_shop = item.product_shop;
      if (!shopOrdersMap.has(product_shop)) {
        shopOrdersMap.set(product_shop, {
          shop_id: product_shop,
          shop_discount: [], // Bạn cần fetch dữ liệu giảm giá nếu có
          item_products: [],
          version: '1.0', // Giả sử có version mặc định
        });
      }

      shopOrdersMap.get(product_shop).item_products.push({
        quantity: item.quantity,
        price: item.price,
        shop_id: item.product_shop,
        product_id: item.product_id,
        sku_id: item.sku_id,
        isSelected: item.isSelected,
        id: item.id,
      });
    }

    const response: CartDTO = {
      cart_id: cart.id,
      user_id: user_id,
      shop_order_ids: Array.from(shopOrdersMap.values()),
    };

    return response;
  }

  async selected(data: { id: string; isSelected: boolean }) {
    return await this._cartItemRepository.updateItem(
      {
        id: data.id,
      },
      {
        isSelected: data.isSelected,
      },
    );
  }

  async updateCart(data: UpdateCartDTO) {
    const { user_id, cart_id, quantity, cart_item_id } = data;
    const cart = await this.getCartByUser(user_id);
    if (!cart)
      throw new RpcException({
        code: '404',
        message: 'Cart not found!',
      });
    if (cart.cart_id !== cart_id) throw new RpcException('Cart not match!');

    if (quantity === 0) return await this.removeItem(cart_item_id);

    return await this.updateQuantities(cart_item_id, quantity);
  }
  async removeItem(id: string) {
    const cartItem = await this._cartItemRepository.findByKey(id);
    if (!cartItem) throw new RpcException(`Item with ID ${id} not found!`);

    const state = await this._cartItemRepository.updateItem(
      { id: id },
      { isDeleted: true },
    );

    if (!state) throw new RpcException(`Failed to delete product ID ${id}`);
    return state;
  }
  async updateQuantities(cart_item_id: string, quantity: number) {
    // Kiểm tra xem sản phẩm có tồn tại không
    const cartItem = await this._cartItemRepository.findByKey(cart_item_id);
    if (!cartItem)
      throw new RpcException(`Item with ID ${cart_item_id} not found!`);

    // Cập nhật số lượng
    const state = await this._cartItemRepository.updateItem(
      { id: cart_item_id },
      { quantity },
    );

    if (!state)
      throw new RpcException(
        `Failed to update quantity for product ID ${cart_item_id}`,
      );
    return state;
  }
  async addToCart(data: CartCreateDTO) {
    const { user_id, product_id, quantity, product_shop, sku_id } = data;
    // Lấy giỏ hàng của user
    const cart = await this.getCartByUser(user_id);
    const cartItems = await this._cartItemRepository.findAll({
      where: {
        product_id: product_id,
        sku_id: sku_id,
        product_shop: product_shop,
        isDeleted: false,
      },
    });
    if (cartItems.length === 0) {
      // Tạo mới cart item
      return await this._cartItemRepository.create({
        cart_id: cart.cart_id,
        product_id,
        sku_id: sku_id,
        quantity,
        product_shop,
        isDeleted: false,
      });
    }

    if (cartItems[0].isDeleted) {
      return await this._cartItemRepository.updateItem(
        {
          id: cartItems[0].id,
        },
        {
          quantity,
          isDeleted: false,
        },
      );
    }

    return await this._cartItemRepository.updateItem(
      {
        id: cartItems[0].id,
      },
      {
        quantity: cartItems[0].quantity + quantity,
      },
    );
  }
}
