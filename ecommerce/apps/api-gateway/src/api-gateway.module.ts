import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserroleModule } from './userrole/userrole.module';
import { RolepermissionModule } from './rolepermission/rolepermission.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true, // Enable default metrics
      },
    }),

    ClientsModule.register([
      {
        name: 'CHECKOUT_SERVICE',
        transport: Transport.TCP,
        options: {
          port: parseInt(process.env.CHECKOUT_PORT) || 3003,
        },
      },
    ]),

    UsersModule,
    RolesModule,
    PermissionsModule,
    UserroleModule,
    RolepermissionModule,
    ProductsModule,
    CartsModule,
    CheckoutModule,
    AddressModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
