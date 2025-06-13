import { Module } from '@nestjs/common';
import { SpusService } from './spus.service';
import { SpusController } from './spus.controller';
import { SkusModule } from '../skus/skus.module';
import { RepositoriesModule } from 'y/repositories';
import { RedisModule } from '@nestjs-modules/ioredis';
@Module({
  imports: [
    SkusModule,
    RepositoriesModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
      options: {
        keepAlive: 30000,
        maxRetriesPerRequest: null,
        enableAutoPipelining: true,
      },
    }),
  ],
  providers: [SpusService],
  controllers: [SpusController],
})
export class SpusModule {}
