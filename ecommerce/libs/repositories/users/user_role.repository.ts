import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Prisma, user_role } from 'y/prisma/generated/auth';

@Injectable()
export class UserRoleRepository extends MySQLBaseRepository<
  user_role,
  Prisma.user_roleFindManyArgs,
  Prisma.user_roleFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.AuthClient as any, prisma.AuthClient.user_role);
  }
}
