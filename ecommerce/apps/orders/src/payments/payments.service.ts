import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PaymentMethodRepository } from 'libs/repositories/orders/payment.repository';
import { OrderDTO, PaymentMethodDTO } from 'y/dtos';

@Injectable()
export class PaymentsService {
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
        method_thumbnail:
          'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
        is_active: true,
      },
      {
        id: '2',
        method_name: 'Viettel Money',
        method_thumbnail:
          'https://salt.tikicdn.com/ts/upload/5f/f9/75/d7ac8660aae903818dd7da8e4772e145.png',
        is_active: true,
      },
      {
        id: '4',
        method_name: 'Ví Momo',
        method_thumbnail:
          'https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg',
        is_active: true,
      },
      {
        id: '5',
        method_name: 'Ví ZaloPay',
        method_thumbnail:
          'https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png',
        is_active: true,
      },
      {
        id: '6',
        method_name: 'VNPAY',
        method_thumbnail:
          '	https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
        is_active: true,
      },
    ];
    return await this._paymentRepository.createMany(data);
  }

  async authorize(data: OrderDTO) {
    try {
      const {
        order_id,
        checkout_order,
        user_payment: { id, method_name },
      } = data;

      if (method_name === 'Thanh toán khi nhận hàng' || id === '1') {
        const transaction = this._paymentRepository.startTransaction();
        const payments = transaction.$transaction(async (prisma) => {
          const payment = await prisma.transactions.create({
            data: {
              amount: checkout_order.totalCheckout,
              order_id: order_id,
              status: 'AUTHORIZED',
              payment_method_id: id,
            },
          });

          return payment;
        });
        console.log('AUTHORIZE');
        return payments;
      } else {
      }
    } catch (error) {
      console.log('Failed to create transaction:', error);
      throw new RpcException('Failed to create transaction');
    }
  }

  async refund(data: OrderDTO) {
    try {
      const { order_id } = data;

      const transaction = this._paymentRepository.startTransaction();
      const payments = transaction.$transaction(async (prisma) => {
        const payment = await prisma.transactions.update({
          where: {
            order_id: order_id,
          },
          data: {
            status: 'CANCELED',
          },
        });
        return payment;
      });

      console.log('REFUNING');
      return payments;
    } catch (error) {
      console.log('Failed to refund transaction:', error);
      throw new RpcException('Failed to refund transaction');
    }
  }
}
