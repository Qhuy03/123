import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Prisma, UserAddress } from 'y/prisma/generated/auth';

@Injectable()
export class UserAddressRepository extends MySQLBaseRepository<
  UserAddress,
  Prisma.UserAddressFindManyArgs,
  Prisma.UserAddressFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.AuthClient as any, prisma.AuthClient.userAddress);
  }
}
