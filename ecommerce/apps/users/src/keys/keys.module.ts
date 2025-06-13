import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule,
  ],
  controllers: [],
  providers: [KeysService],
  exports: [KeysService]
})
export class KeysModule {}
