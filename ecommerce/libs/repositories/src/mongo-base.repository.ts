import { Model, Types } from 'mongoose';
import { IBaseRepository } from './interfaces/base-repository.interface';

export class MongoBaseRepository<T, FindUniqueArgs, FindManyArgs>
  implements IBaseRepository<T, FindUniqueArgs, FindManyArgs>
{
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(args?: {
    filter?: object;
    page?: number;
    perPage?: number;
  }): Promise<T[]> {
    const { filter, page, perPage } = args;
    return (
      this.model
        .find(filter || {})
        .sort({ updateAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        // .populate('Category')
        .lean()
        .exec() as Promise<T[]>
    ); // Truy vấn tất cả các kết quả theo điều kiện (nếu có)
  }

  async findOne(args: FindUniqueArgs): Promise<T | null> {
    return this.model.findOne(args || {}).exec(); // Truy vấn một kết quả duy nhất
  }

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    return createdDocument.save() as unknown as T; // Tạo mới bản ghi
  }

  async update(
    id: string | number | Types.ObjectId,
    data: Partial<T>,
  ): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true }) // Trả về bản ghi đã được cập nhật
      .exec();
  }

  async delete(id: string | number): Promise<T> {
    return this.model.findByIdAndDelete(id).exec(); // Xóa bản ghi theo id
  }
}
