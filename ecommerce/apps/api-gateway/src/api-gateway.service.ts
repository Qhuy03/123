import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(@Inject('CHECKOUT_SERVICE') private readonly _checkoutService: ClientProxy ) {};

  async createPayment(data: any) {
    return await firstValueFrom(
      this._checkoutService.send('payment.create', data)
    );
  }

  async setupPayment() {
    console.log("hehehehe")
    return await firstValueFrom(
      this._checkoutService.send('payment.setup', {})
    );
  }

  async getPaymentById(id: string) {
    return await firstValueFrom(
      this._checkoutService.send('payment.get', id)
    )
  }

  async getAllPayments() {
    return await firstValueFrom(
      this._checkoutService.send('payment.getAll', {})
    )
  }

}
