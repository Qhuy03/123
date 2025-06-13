import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Prisma, roles } from 'y/prisma/generated/auth';

@Injectable()
export class RolesRepository extends MySQLBaseRepository<
  roles,
  Prisma.rolesFindManyArgs,
  Prisma.rolesFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.AuthClient as any, prisma.AuthClient.roles);
  }

  async softDelete(role_id: string) {
    return await this.modelDelegate.updateMany({
      where: {
        id: role_id,
        is_deleted: true,
      },
      data: {
        is_deleted: false,
      },
    });
  }
}
