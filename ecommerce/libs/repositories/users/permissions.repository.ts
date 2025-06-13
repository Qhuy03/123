import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { permissions, Prisma } from 'y/prisma/generated/auth';

@Injectable()
export class PermissionsRepository extends MySQLBaseRepository<
  permissions,
  Prisma.permissionsFindManyArgs,
  Prisma.permissionsFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.AuthClient as any, prisma.AuthClient.permissions);
  }

  async softDelete(permission_id: string) {
    return await this.modelDelegate.updateMany({
      where: {
        id: permission_id,
        is_deleted: true,
      },
      data: {
        is_deleted: false,
      },
    });
  }
}
