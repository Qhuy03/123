import { Injectable } from '@nestjs/common';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Order, Prisma } from 'y/prisma/generated/order';

@Injectable()
export class OrderRepository extends MySQLBaseRepository<
  Order,
  Prisma.OrderFindManyArgs,
  Prisma.OrderFindUniqueArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.OrderClient as any, prisma.OrderClient.order);
  }

  startTransaction() {
    return this.prisma;
  }

  async createOrderWithDetailsAndTransaction(
    orderData: Prisma.OrderCreateInput,
    orderDetailsData: Prisma.OrderDetailCreateInput[],
    transactionData: Prisma.TransactionsCreateInput,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      // Tạo Order
      const order = await prisma.order.create({
        data: orderData,
      });

      // Tạo OrderDetails cho Order đã tạo
      const orderDetails = await prisma.orderDetail.createMany({
        data: orderDetailsData.map((detail) => ({
          ...detail,
          order_id: order.id,
        })),
      });

      // Tạo Transaction
      // Tạo Transaction cho Order
      const transaction = await prisma.transactions.create({
        data: {
          ...transactionData,
          orders: { connect: { id: order.id } }, // Liên kết Transaction với Order
        },
      });
    });
  }
}
