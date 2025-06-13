import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderDTO } from 'y/dtos';
import { Step } from './saga/step';
import { PlaceOrderStep } from './saga/place-order.step';
import { UpdateStockStep } from './saga/update-stock.step';
import { AuthorizePaymentStep } from './saga/process-payment.step';
import { ConfirmOrderStep } from './saga/confirm-order.step';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class CreateOrderSaga {
  private steps: Step<OrderDTO, void>[] = [];
  private successfulSteps: Step<OrderDTO, void>[] = [];

  constructor(
    @Inject('place-order-step') step1: PlaceOrderStep,
    @Inject('update-stock') step2: UpdateStockStep,
    @Inject('authorize-payment') step3: AuthorizePaymentStep,
    @Inject('confirm-order') step4: ConfirmOrderStep,
  ) {
    this.steps = [step1, step2, step3, step4];
  }

  async execute(order: OrderDTO) {
    const orderId = uuidv7();
    this.successfulSteps = [];
    order.order_id = orderId;
    for (let step of this.steps) {
      try {
        console.info(`Invoking: ${step.name} ...`);
        await step.invoke(order);
        this.successfulSteps.unshift(step);
      } catch (error) {
        console.error(`Failed Step: ${step.name} !!`);
        this.successfulSteps.forEach(async (s) => {
          console.info(`Rollbacking: ${s.name} ...`);
          await s.withCompenstation(order);
        });
        throw new BadRequestException(error);
      }
    }
    console.info('Order Creation Transaction ended successfuly');
  }
}
