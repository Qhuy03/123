import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDTO } from 'y/dtos';

@Controller('order')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  // @MessagePattern('order.create')
  // async createOrder(data: any) {
  //     return await this._orderService.createOrder(data);
  // }

  @MessagePattern('order.pending')
  async createOrder(@Payload() data: OrderDTO) {
    return await this._orderService.createOrder(data);
  }

  @MessagePattern('order.cancel')
  async cancelOrder(@Payload() data: any) {
    return true;
  }

  // @MessagePattern('order.get')
  // async getOrder() {
  //     return await this._orderService.getOrder();
  // }

  // @MessagePattern('order.findById')
  // async getOrderById(@Payload() user_id: any) {
  //     return await this._orderService.getOrderById(user_id);
  // }

  @MessagePattern('order.update')
  async updateOrder(@Payload() status: string) {
    return await this._orderService.updateOrder(status);
  }

  // @MessagePattern('order.delete')
  // async deleteOrder(@Payload() id: string) {
  //     return await this._orderService.deleteOrder(id);
  // }
}
