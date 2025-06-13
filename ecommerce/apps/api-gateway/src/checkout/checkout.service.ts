import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Client,
  ClientProxy,
  ClientRMQ,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { OrderDTO, ShopOrderDTO } from 'y/dtos';
import { CreateOrderSaga } from './create-order.saga';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject('CARTS_SERVICE') private readonly _cartClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly _productClient: ClientProxy,
    // @Inject('PRODUCTS_QUEUE') private readonly _productQueue: ClientRMQ,
    @Inject('ORDER_SERVICE') private readonly _orderClient: ClientProxy,
    @Inject('create-order-saga')
    private readonly _createOrderSaga: CreateOrderSaga,
  ) {}

  async checkout(order: OrderDTO) {
    console.log('Starting');
    const {
      cart_id,
      user_id,
      shop_order_ids,
      user_address,
      user_payment,
      checkout_order: checkout_order_client,
    } = order;

    // check user_address and user_payment
    if (!user_address || !user_payment)
      throw new BadRequestException('Address and payment are required!');

    // check lại tồn kho.
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
      cart_id,
      user_id,
      shop_order_ids,
    });

    const Order: OrderDTO = {
      cart_id,
      user_id,
      shop_order_ids: shop_order_ids_new,
      user_address,
      user_payment,
      checkout_order: checkout_order_client,
    };
    try {
      await this._createOrderSaga.execute(Order);
      return 'Order created';
    } catch (error) {
      throw error;
    }
  }
  async checkoutReview(dto: {
    cart_id: string;
    user_id: string;
    shop_order_ids: ShopOrderDTO[];
  }) {
    // check cartId có tồn tại không
    const { cart_id, user_id, shop_order_ids } = dto;
    const foundCart = await firstValueFrom(
      this._cartClient.send('cart.get', user_id),
    );
    if (
      !foundCart ||
      foundCart.cart_id !== cart_id ||
      foundCart.user_id !== user_id
    )
      throw new NotFoundException('Not found cart');

    const checkout_order = {
      totalPrice: 0, // tổng tiền hàng
      feeShip: 0, // phí vận chuyển
      totalDiscount: 0, // tổng tiền giảm giá
      totalCheckout: 0, // tổng thanh toán
    };
    const shop_order_ids_new = [];

    for (let i = 0; i < dto.shop_order_ids.length; i++) {
      const {
        shop_id,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product có tồn tại không
      const foundProducts = await lastValueFrom(
        this._productClient.send('product.findByIds', item_products),
      );
      const hasInvalidItem = foundProducts.some((item) => !item);
      if (hasInvalidItem)
        throw new BadRequestException(
          'Kiểm tra lại số lượng sản phẩm trong giỏ hàng!',
        );

      const checkoutPrice = foundProducts.reduce((acc, cur) => {
        return acc + cur.product_price * cur.quantity;
      }, 0);

      // Tổng tiền trước khi xử lý
      checkout_order.totalPrice = +checkoutPrice;
      const itemCheckout = {
        shop_id,
        shop_discount,
        priceRaw: checkoutPrice, // tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice,
        item_products: foundProducts,
      };

      // tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      cart_id,
      user_id,
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

    async getOrders(user_id: string) {
    const orders = await lastValueFrom(
      this._orderClient.send('order.get', user_id),
    );
    return orders;
  }

  async getOrderById(order_id: string) {
    const order = await lastValueFrom(
      this._orderClient.send('order.getById', order_id),
    );
    return order;
  }
}
