import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Step } from './step';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderDTO } from 'y/dtos';

@Injectable()
export class AuthorizePaymentStep extends Step<OrderDTO, void> {
  constructor(@Inject('PAYMENT_QUEUE') private _paymentClient: ClientRMQ) {
    super();
    this.name = 'Authorize Payment Step';
  }

  async invoke(order: OrderDTO): Promise<any> {
    const paymnetAuthorization = await lastValueFrom(
      this._paymentClient.send('payment.authorize', order),
    );

    if (!paymnetAuthorization) {
      throw new BadRequestException('The payment unsuccessful');
    }
  }

  async withCompenstation(order: OrderDTO): Promise<any> {
    try {
      const result = await lastValueFrom(
        this._paymentClient.send('payment.refund', order),
      );
      if (!result) {
        throw new BadRequestException({
          message: 'PAYMENT REFUND FAILER',
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
