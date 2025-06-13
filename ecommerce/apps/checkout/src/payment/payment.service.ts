import { Injectable } from '@nestjs/common';
import { PaymentMethodDTO } from 'y/dtos';
import { PaymentMethodRepository } from 'libs/repositories/orders/payment.repository';

@Injectable()
export class PaymentService {
  constructor(private readonly _paymentRepository: PaymentMethodRepository) {}

  async createPayment(data: PaymentMethodDTO) {
    return await this._paymentRepository.create(data);
  }
  async getPayment(id: string) {
    return await this._paymentRepository.findOne({
      where: { id, is_active: true },
    });
  }
  async getAllPayments() {
    return await this._paymentRepository.findAll({
      where: { is_active: true },
    });
  }
  async removePayment(id: string) {
    return await this._paymentRepository.update(id, { is_active: false });
  }
  async updatePayment(data: PaymentMethodDTO) {
    const { id, ...rest } = data;
    return await this._paymentRepository.update(id, rest);
  }

  async setupPayment() {
    const data: PaymentMethodDTO[] = [
      {
        id: '1',
        method_name: 'Thanh toán khi nhận hàng',
        is_active: true,
      },
      {
        id: '2',
        method_name: 'Qr Code',
        is_active: true,
      },
      {
        id: '3',
        method_name: 'Thanh toán qua thẻ',
        is_active: true,
      },
    ];
    return await this._paymentRepository.createMany(data);
  }
}
