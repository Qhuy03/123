import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RepositoriesModule } from 'y/repositories';
import { KeysModule } from '../keys/keys.module';
@Module({
  imports: [
    RepositoriesModule,
    KeysModule,
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
