import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Order, OrderDetail, Prisma } from 'y/prisma/generated/order';

@Injectable()
export class OrderDetailRepository extends MySQLBaseRepository<
  OrderDetail,
  Prisma.OrderDetailFindManyArgs,
  Prisma.OrderDetailFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.OrderClient as any, prisma.OrderClient.orderDetail);
  }
}
