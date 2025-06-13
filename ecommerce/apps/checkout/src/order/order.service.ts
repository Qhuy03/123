import { Injectable } from '@nestjs/common';
import { OrderDTO } from 'y/dtos';
import { OrderDetailRepository } from 'libs/repositories/orders/order.item.repository';
import { OrderRepository } from 'libs/repositories/orders/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _orderDetailRepository: OrderDetailRepository,
  ) {}

  async createOrder(data: OrderDTO) {
    const { user_address } = data;
    const shipping_address =
      user_address.street +
      ' ' +
      user_address.district +
      ' ' +
      user_address.city;
    try {
      const transaction = this._orderRepository.startTransaction();
      transaction.$transaction(async () => {});
      const order = await this._orderRepository.create({
        id: data.order_id,
        user_id: data.user_id,
        order_total: data.checkout_order.totalCheckout,
        order_status: 'PENDING',
        payment_method:
          data.user_payment.method_name || 'Thanh toán khi nhận hàng',
        shipping_address: shipping_address,
        user_email: data.user_address.user_phone,
        user_name: data.user_address.user_name,
      });
    } catch (error) {}
  }

  async updateOrder(status: string) {}
}
