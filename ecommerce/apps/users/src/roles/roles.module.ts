import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
