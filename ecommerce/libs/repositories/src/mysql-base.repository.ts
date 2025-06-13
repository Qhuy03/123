import { PrismaClient } from 'y/prisma/generated/order';
import { IBaseRepository } from './interfaces/base-repository.interface';
export class MySQLBaseRepository<T, FindManyArgs, FindUniqueArgs>
  implements IBaseRepository<T, FindUniqueArgs, FindManyArgs>
{
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelDelegate: any, // Delegate đại diện cho model trong Prisma
  ) {}

  async findAll(args?: any): Promise<T[]> {
    return this.modelDelegate.findMany(args) as Promise<T[]>;
  }

  async findOne(args: FindUniqueArgs): Promise<T | null> {
    return this.modelDelegate.findUnique(args) as Promise<T | null>;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.modelDelegate.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.modelDelegate.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<T> {
    return this.modelDelegate.delete({
      where: { id },
    });
  }
}
