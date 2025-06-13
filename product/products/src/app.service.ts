import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  ClientRMQ,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Spu, SpuModel } from './schemas/spus.schema';
import { Model, Types } from 'mongoose';
import { Sku, SkuModel } from './schemas/skus.schema';
import { randomUUID } from 'crypto';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConfirmChannel } from 'amqplib';
import { Category, CategoryModel } from './schemas/category.schema';
import { CategoriesService } from './categories/categories.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Spu.name) private readonly _spuModel: Model<Spu>,
    @InjectModel(Sku.name) private readonly _skuModel: Model<Sku>,
  ) {}

  async create(dto: any) {
    console.log();
    const categoryObjectIds = dto.product_category.map((categoryId: string) => {
      return new Types.ObjectId(categoryId); // Chuyển string thành ObjectId
    });
    try {
      const newSpu = await this._spuModel.create({
        product_name: dto.product_name,
        product_thumb: dto.product_thumb,
        product_description: dto.product_description,
        product_price: dto.product_price,
        product_category: categoryObjectIds, // Đây là mảng ObjectId tham chiếu đến Categories
        product_quantity: dto.product_quantity,
        product_attributes: dto.product_attributes,
        product_variations: dto.product_variations,
      });
      if (newSpu && dto.sku_list?.length > 0) {
        const convertSkuList = dto.sku_list.map((sku) => {
          return {
            ...sku,
            product_id: newSpu.product_id,
            sku_id: randomUUID(),
          };
        });
        await this._skuModel.create(convertSkuList);
      }

      return newSpu;
    } catch (error) {
      console.error('Error creating SPU:', error);
      throw new Error('Error while creating SPU: ' + error.message);
    }
  }

  async getSpuById(spu_id: string) {
    const spu = await this._spuModel.aggregate([
      {
        $match: {
          product_id: spu_id,
        },
      },
      {
        $lookup: {
          from: 'Categories', // Tên collection Categories
          localField: 'product_category', // Trường product_category trong Spu chứa các ObjectId
          foreignField: '_id', // Tham chiếu đến trường _id trong collection Categories
          as: 'product_category', // Đặt tên cho mảng chứa thông tin Categories
        },
      },
      {
        $unwind: {
          path: '$categories_info', // Chuyển mảng categories_info thành một đối tượng đơn để dễ thao tác
          preserveNullAndEmptyArrays: true, // Nếu không có category, vẫn giữ giá trị null
        },
      },
      {
        $lookup: {
          from: 'Skus',
          localField: 'product_id',
          foreignField: 'product_id',
          as: 'sku_list',
        },
      },
      {
        $project: {
          isDraft: 0,
          isPublished: 0,
          isDeleted: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          'sku.isDraft': 0,
          'sku.isPublished': 0,
          'sku.isDeleted': 0,
          'sku.__v': 0,
          'sku.createdAt': 0,
          'sku.updatedAt': 0,
          'sku_list.isDraft': 0,
          'sku_list.isPublished': 0,
          'sku_list.isDeleted': 0,
          'sku_list.__v': 0,
        },
      },
    ]);
    return spu;
  }
}
