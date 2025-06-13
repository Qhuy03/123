import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderDTO } from 'y/dtos';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PlaceOrderStep extends Step<OrderDTO, void> {
  constructor(@Inject('ORDER_QUEUE') private _orderClient: ClientRMQ) {
    super();
    this.name = 'Place Order Step';
  }

  async invoke(order: OrderDTO): Promise<void> {
    try {
      const result = await lastValueFrom(
        this._orderClient.send('order.pending', order),
      );

      if (!result) {
        throw new BadRequestException({
          message: 'Order failed',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async withCompenstation(order: OrderDTO): Promise<void> {
    try {
      const result = await lastValueFrom(
        this._orderClient.send('order.cancel', order),
      );
      if (!result) {
        throw new BadRequestException({
          message: 'Order failed',
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
