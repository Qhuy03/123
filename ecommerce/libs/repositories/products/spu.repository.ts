import { MongoBaseRepository } from '../src/mongo-base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Spu, SpuModel } from 'y/prisma/schemas/spus.schema';

@Injectable()
export class SpuRepository extends MongoBaseRepository<Spu, any, any> {
  constructor(@InjectModel(Spu.name) private readonly spus: Model<Spu>) {
    super(spus); // Truyền UserModel vào repository cơ bản
  }

  async aggregate(pipeline: Array<any>) {
    return await this.model.aggregate(pipeline);
  }

  async updateProductId({
    product_id,
    data,
  }: {
    product_id: string;
    data: any;
  }) {
    return await this.model.findOneAndUpdate({ product_id: product_id }, data);
  }

  // Trong repository của bạn
  async updateOne(filter: any, data: any, session?: ClientSession) {
    // Kiểm tra nếu session có tồn tại thì sử dụng session, nếu không thì không sử dụng session
    const options = session ? { session } : {};
    return await this.model.updateOne(filter, data, options); // Thêm options vào nếu session tồn tại
  }

  async updateMany({
    filter,
    update,
    options,
  }: {
    filter?: object;
    update: object;
    options?: object;
  }) {
    return await this.model.updateMany(filter, update, options);
  }
}
