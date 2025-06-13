import { Module } from '@nestjs/common';
import { RolepermissionService } from './rolepermission.service';
import { RolepermissionController } from './rolepermission.controller';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [RolepermissionController],
  providers: [RolepermissionService],
})
export class RolepermissionModule {}
