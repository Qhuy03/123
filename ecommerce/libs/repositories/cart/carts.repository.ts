import { Carts, Prisma } from 'y/prisma/generated/cart';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartsRepository extends MySQLBaseRepository<
  Carts,
  Prisma.CartsFindUniqueArgs,
  Prisma.CartsFindManyArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.CartClient as any, prisma.CartClient.carts);
  }
}
