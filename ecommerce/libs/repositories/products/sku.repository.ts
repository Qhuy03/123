import { MongoBaseRepository } from '../src/mongo-base.repository';
import { PrismaService } from 'y/prisma';
import { Injectable } from '@nestjs/common';
import { Sku, SkuModel } from 'y/prisma/schemas/skus.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  Connection,
  Model,
  Types,
  startSession,
} from 'mongoose';
// import * as mongoose from 'mongoose';
@Injectable()
export class SkuRepository extends MongoBaseRepository<Sku, any, any> {
  constructor(@InjectModel(Sku.name) private readonly sku: Model<Sku>) {
    super(sku); // Truyền UserModel vào repository cơ bản
  }

  async createMany(data: Array<any>) {
    return await this.model.insertMany(data);
  }

  async finOneAndPopulate({ sku_id }: { sku_id: string }) {
    return await this.model.aggregate([
      { $match: { sku_id: sku_id } },
      {
        $lookup: {
          from: 'Spus',
          localField: 'product_id', // sku.product_id (string)
          foreignField: 'product_id', // spu.product_id (string)
          as: 'product_info',
        },
      },
      { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },
    ]);
  }

  async finOneAndPopulateV1({
    sku_id,
    quantity,
  }: {
    sku_id: string;
    quantity?: number;
  }) {
    return await this.model.aggregate([
      {
        $match: {
          $and: [
            { sku_id: sku_id },
            {
              sku_stock: { $gte: quantity },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'Spus',
          localField: 'product_id', // sku.product_id (string)
          foreignField: 'product_id', // spu.product_id (string)
          as: 'product_info',
        },
      },
      { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },
    ]);
  }

  async updateOne(filter: any, data: any, session?: ClientSession) {
    const options = session ? { session } : {};

    return await this.model.updateOne(filter, data, options);
  }

  // async updateQuantitySku(product_id: any, data: any) {
  //   return await this.model.updateOne();
  // }

  async startSession() {
    return startSession();
    // return await this.model.db.startSession();
  }

  async transaction(
    connection: Connection,
    cb: (session: ClientSession) => Promise<any>,
  ) {
    const session = await connection.startSession();

    try {
      session.startTransaction();
      const result = await cb(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async reduceStockQuantity(sku_id: string, quantity: number) {
    return await this.model.updateOne(
      { sku_id: sku_id },
      { $inc: { sku_stock: -quantity } },
    );
  }

  async restockQuantity(sku_id: string, quantity: number) {
    return await this.model.updateOne(
      { sku_id: sku_id },
      { $inc: { sku_stock: quantity } },
    );
  }
}
