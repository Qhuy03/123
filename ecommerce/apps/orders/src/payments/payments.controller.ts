import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDTO, PaymentMethodDTO } from 'y/dtos';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly _paymentService: PaymentsService) {}

  @MessagePattern('payment.create')
  createPayment(@Payload() data: PaymentMethodDTO) {
    return this._paymentService.createPayment(data);
  }
  @MessagePattern('payment.get')
  getPayment(@Payload() id: string) {
    return this._paymentService.getPayment(id);
  }
  @MessagePattern('payment.getAll')
  getAllPayments() {
    return this._paymentService.getAllPayments();
  }
  @MessagePattern('payment.remove')
  removePayment(id: string) {
    return this._paymentService.removePayment(id);
  }
  @MessagePattern('payment.update')
  updatePayment(@Payload() data: PaymentMethodDTO) {
    return this._paymentService.updatePayment(data);
  }
  @MessagePattern('payment.setup')
  setupPayment() {
    console.log("set up payment")
    return this._paymentService.setupPayment();
  }

  @MessagePattern('payment.authorize')
  authorize(@Payload() data: OrderDTO) {
    return this._paymentService.authorize(data);
  }

  @MessagePattern('payment.refund')
  refund(@Payload() data: OrderDTO) {
    return this._paymentService.refund(data);
  }
}
