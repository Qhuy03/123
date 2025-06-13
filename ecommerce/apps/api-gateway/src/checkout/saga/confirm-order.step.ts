import { Inject, Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderDTO } from 'y/dtos';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ConfirmOrderStep extends Step<OrderDTO, void> {
  constructor(@Inject('ORDER_QUEUE') private _orderClient: ClientRMQ) {
    super();
    this.name = 'Confirm Order Step';
  }

  async invoke(order: OrderDTO): Promise<void> {
    const result = await lastValueFrom(
      this._orderClient.send('order.created', order),
    );
    if (!result) {
      throw new Error("Couldn't create order");
    }
  }

  async withCompenstation(order: OrderDTO): Promise<void> {
    return await lastValueFrom(this._orderClient.send('order.cancel', order));
  }
}
