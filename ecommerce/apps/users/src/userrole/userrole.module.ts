import { Module } from '@nestjs/common';
import { UserroleService } from './userrole.service';
import { UserroleController } from './userrole.controller';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [UserroleController],
  providers: [UserroleService],
})
export class UserroleModule {}
