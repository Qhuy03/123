import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDTO } from 'y/dtos';

@Controller()
export class OrdersController {
  constructor(private readonly _orderService: OrdersService) {}

  @MessagePattern('order.pending')
  async createOrder(@Payload() data: OrderDTO) {
    const res = await this._orderService.createOrder(data);
    return res;
  }

  @MessagePattern('order.cancel')
  async cancelOrder(@Payload() data: OrderDTO) {
    return await this._orderService.cancelOrder(data);
  }

  @MessagePattern('order.created')
  async createdOrder(@Payload() data: OrderDTO) {
    return await this._orderService.createdOrder(data);
  }

    @MessagePattern('order.get')
  async getOrder(@Payload() user_id: string) {
    return await this._orderService.getOrder(user_id);
  }

  @MessagePattern('order.getById')
  async getOrderById(@Payload() order_id: string) {
    return await this._orderService.getOrderById(order_id);
  }
}
