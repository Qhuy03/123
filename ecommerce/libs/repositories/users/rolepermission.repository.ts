import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Prisma, role_permission } from 'y/prisma/generated/auth';

@Injectable()
export class RolePermissionRepository extends MySQLBaseRepository<
  role_permission,
  Prisma.role_permissionFindManyArgs,
  Prisma.role_permissionFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    console.log('role_permission', prisma);
    super(prisma.AuthClient as any, prisma.AuthClient.role_permission);
  }
}
