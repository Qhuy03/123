import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentMethodDTO } from 'y/dtos';

@Controller('payment')
export class PaymentController {
  constructor(private readonly _paymentService: PaymentService) {}

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
    return this._paymentService.setupPayment();
  }
}
