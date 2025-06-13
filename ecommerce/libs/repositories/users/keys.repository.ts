import { Injectable } from '@nestjs/common';
import { PrismaService } from 'y/prisma';
import { Prisma, user_tokens } from 'y/prisma/generated/auth';
import { MySQLBaseRepository } from 'y/repositories/mysql-base.repository';

@Injectable()
export class KeysRepository extends MySQLBaseRepository<
  user_tokens,
  Prisma.user_tokensFindManyArgs,
  Prisma.user_tokensFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.AuthClient as any, prisma.AuthClient.user_tokens);
  }

  async softDelete(refresh_token: string) {
    return await this.modelDelegate.updateMany({
      where: {
        user_refresh_token: refresh_token,
        is_active: true,
      },
      data: {
        is_active: false,
      },
    });
  }
}
