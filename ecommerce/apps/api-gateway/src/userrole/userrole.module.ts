import { Module } from '@nestjs/common';
import { UserroleService } from './userrole.service';
import { UserroleController } from './userrole.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 5000,
        },
      },
    ]),
  ],
  controllers: [UserroleController],
  providers: [UserroleService],
})
export class UserroleModule {}
