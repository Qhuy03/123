import { Module } from '@nestjs/common';
import { RolepermissionService } from './rolepermission.service';
import { RolepermissionController } from './rolepermission.controller';
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
  controllers: [RolepermissionController],
  providers: [RolepermissionService],
})
export class RolepermissionModule {}
