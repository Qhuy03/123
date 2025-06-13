import { Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  providers: [SkusService],
  controllers: [SkusController],
  exports: [SkusService]
})
export class SkusModule {}
