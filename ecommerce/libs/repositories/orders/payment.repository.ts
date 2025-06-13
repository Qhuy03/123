import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Prisma, PaymentMethod } from 'y/prisma/generated/order';

@Injectable()
export class PaymentMethodRepository extends MySQLBaseRepository<
  PaymentMethod,
  Prisma.PaymentMethodFindManyArgs,
  Prisma.PaymentMethodFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.OrderClient as any, prisma.OrderClient.paymentMethod);
  }

  startTransaction() {
    return this.prisma;
  }

  async createMany(data) {
    return await this.modelDelegate.createMany({ data });
  }
}
