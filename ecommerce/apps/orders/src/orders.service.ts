import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderDetailRepository } from 'libs/repositories/orders/order.item.repository';
import { OrderRepository } from 'libs/repositories/orders/order.repository';
import { OrderDTO } from 'y/dtos';

@Injectable()
export class OrdersService {
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
      const order = transaction.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            id: data.order_id,
            user_id: data.user_id,
            order_total: data.checkout_order.totalCheckout,
            order_status: 'PENDING',
            payment_method:
              data.user_payment.method_name || 'Thanh toán khi nhận hàng',
            shipping_address: shipping_address,
            user_email: data.user_address.user_phone,
            user_name: data.user_address.user_name,
          },
        });
        // insert into orderdetail
        // Insert vào bảng OrderDetail cho từng sản phẩm trong đơn hàng
        for (const shopOrder of data.shop_order_ids) {
          for (const item of shopOrder.item_products) {
            await prisma.orderDetail.create({
              data: {
                order_id: order.id, // Liên kết với order đã tạo
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                product_name: item.product_name,
                product_thumb: item.product_thumb,
                product_variant: item.product_options,
              },
            });
          }
        }

        return order;
      });
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new RpcException('Failed to create order');
    }
  }

  async cancelOrder(data: OrderDTO) {
    try {
      // const transaction = this._orderRepository.startTransaction();
      // const order = transaction.$transaction(async (prisma) => {
      //   const updateOrder = prisma.order.update({
      //     where: {
      //       id: data.order_id,
      //     },
      //     data: {
      //       order_status: 'CANCELLED',
      //     },
      //   });
      //   return updateOrder;
      // });
      // return order;
      const order = await this._orderRepository.findOne({
        where: {
          id: data.order_id,
        },
      });

      if (!order) throw new RpcException('Order not found ' + data.order_id);

      const cancel = this._orderRepository.update(data.order_id, {
        order_status: 'CANCELLED',
      });
      console.log('ORDER CANCEL: ' + data.order_id);
      return cancel;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }
  }

  async createdOrder(data: OrderDTO) {
    try {
      // const transaction = this._orderRepository.startTransaction();
      // const order = transaction.$transaction(async (prisma) => {
      //   const updateOrder = prisma.order.update({
      //     where: {
      //       id: data.order_id,
      //     },
      //     data: {
      //       order_status: 'APPROVED',
      //     },
      //   });
      //   return updateOrder;
      // });
      // return order;
      const order = await this._orderRepository.findOne({
        where: {
          id: data.order_id,
        },
      });

      if (!order)
        throw new RpcException('ORDER CREATED NOT FOUND ' + data.order_id);

      const cancel = this._orderRepository.update(data.order_id, {
        order_status: 'APPROVED',
      });
      console.log('ORDER CREATED CANCEL: ' + data.order_id);
      return cancel;
    } catch (error) {
      console.error('Error updating order created:', error);
      throw new RpcException('Failed to update order created');
    }
  }

    async getOrder(user_id: string) {
    try {
      const order = await this._orderRepository.findAll({
        where: {
          user_id: user_id,
        },
        select: {
          id: true,
          order_total: true,
          order_status: true,
          OrderDetails: true,
          Transactions: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return order;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new RpcException('Failed to get orders');
    }
  }

  async getOrderById(order_id: string) {
    try {
      const order = await this._orderRepository.findOne({
        where: {
          id: order_id,
        },
        // select: {
        //   id: true,
        //   order_total: true,
        //   order_status: true,
        //   OrderDetails: true,
        //   // Transactions: true,
        // },
        include: {
          OrderDetails: true,
          Transactions: {
            include: {
              payment_methods: true,
            },
          },
        },
      });
      return order;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      throw new RpcException('Failed to get order by ID');
    }
  }
}
