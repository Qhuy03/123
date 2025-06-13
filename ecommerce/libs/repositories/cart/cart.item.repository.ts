import { CartItem, Carts, Prisma } from 'y/prisma/generated/cart';
import { MySQLBaseRepository } from '../src/mysql-base.repository';
import { PrismaService } from 'y/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartItemRepository extends MySQLBaseRepository<
  CartItem,
  Prisma.CartItemFindUniqueArgs,
  Prisma.CartItemFindManyArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma.CartClient as any, prisma.CartClient.cartItem);
  }

  async findByKey(id: string) {
    return await this.modelDelegate.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateItem(
    where: Prisma.CartItemWhereUniqueInput,
    data: Prisma.CartItemUpdateInput,
  ) {
    return await this.modelDelegate.update({
      where,
      data,
    });
  }
}
