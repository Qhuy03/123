import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PaymentModule, OrderModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
