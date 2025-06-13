import { Step } from './step';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { OrderDTO } from 'y/dtos';

@Injectable()
export class UpdateStockStep extends Step<OrderDTO, void> {
  constructor(@Inject('PRODUCTS_QUEUE') private _productsService: ClientRMQ) {
    super();
    this.name = 'Update Stock Step';
  }

  async invoke(orders: OrderDTO): Promise<void> {
    const products = orders.shop_order_ids;
    const stockUpdate = await firstValueFrom(
      this._productsService.send('product.stock.reduce', products),
    );
    if (!stockUpdate) {
      throw new Error("Couldn't update stock");
    }
  }

  async withCompenstation(orders: OrderDTO): Promise<void> {
    const products = orders.shop_order_ids;
    // const stockUpdate = await lastValueFrom(
    //   this._productsService.send('product.stock.restock', products),
    // );
    // if (!stockUpdate) {
    //   throw new Error("Couldn't update stock");
    // }
  }
}
