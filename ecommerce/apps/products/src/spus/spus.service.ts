import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SkusService } from '../skus/skus.service';
import { SpuDTO, SpuQueryDTO } from 'y/dtos';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RpcException } from '@nestjs/microservices';
import { Connection, Types } from 'mongoose';
import { SpuRepository } from 'libs/repositories/products/spu.repository';
import { SkuRepository } from 'libs/repositories/products/sku.repository';
import { InjectConnection } from '@nestjs/mongoose';
// import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class SpusService {
  constructor(
    private _spusRepository: SpuRepository,
    private _skuService: SkusService,
    private _skusRepository: SkuRepository,
    @InjectRedis() private readonly _redisService: Redis,
    @InjectConnection() private connection: Connection,
  ) {}

  async findAll(dto: SpuQueryDTO) {
    const filter: any = {};
    if (dto.category) {
      filter.product_category = { $in: new Types.ObjectId(dto.category) };
    }

    // if (dto.shop) {
    //   filter.product_shop = dto.shop;
    // }

    // if (dto.minPrice) {
    //   filter.product_price = { $gte: dto.minPrice };
    // }

    // if (dto.maxPrice) {
    //   filter.product_price = { ...filter.product_price, $lte: dto.maxPrice };
    // }

    // if (dto.rate) {
    //   filter.product_rate = dto.rate;
    // }

    // filter.isPublished = true;

    const { page = 1, perPage = 40 } = dto;
    return await this._spusRepository.findAll({ filter, page, perPage });
  }

  async create(dto: SpuDTO) {
    const newSpu = await this._spusRepository.create(dto);
    if (newSpu && dto.sku_list.length > 0) {
      const convertSkuList = dto.sku_list.map((sku) => {
        return {
          ...sku,
          product_id: newSpu.product_id,
          sku_id: randomUUID(),
        };
      });

      await this._skuService.createMany(convertSkuList);
    }

    return newSpu;
  }

  async findByIds(products: any[]) {
    return await Promise.all(
      products.map(async (product) => {
        if (product.sku_id) {
          const foundProduct = await this.getSkuByIdV1(
            product.sku_id,
            product.quantity,
          );
          if (foundProduct) {
            return {
              price: foundProduct.sku_price,
              sku_id: foundProduct.sku_id,
              product_options: product.product_options,
              product_thumb: product.product_thumb,
              product_name: product.product_name,
              quantity: product.quantity,
              product_id: product.product_id,
            };
          }
          return false;
        } else {
          const foundProduct = await this.getSpuById(
            product.product_id,
            product.quantity,
          );
          if (foundProduct.length > 0) {
            return {
              price: foundProduct[0].product_price,
              quantity: product.quantity,
              product_options: '',
              product_thumb: foundProduct[0].product_thumb[0],
              product_name: foundProduct[0].product_name,
              product_id: product.product_id,
              sku_id: null,
            };
          } else {
            return false;
          }
        }
      }),
    );
  }

  async getSpuById(spu_id: string, quantity?: number) {
    const matchCondition: any = {
      product_id: spu_id,
    };

    if (quantity !== undefined) {
      matchCondition.product_quantity = { $gte: quantity }; // Thêm điều kiện kiểm tra product_quantity >= quantity
    }
    const spu = await this._spusRepository.aggregate([
      {
        $match: matchCondition,
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
    console.log('FROM DB::', new Date().getTime());
    return spu;
  }

  // async getSpuById(spu_id: string) {
  //   const keys = 'PRO_TICKET:ITEM:' + spu_id;
  //   // 1. Get data from cache
  //   const result = await this._redisService.get(keys);
  //   // 2. YES -> Hit cache
  //   if (result) {
  //     console.log('FROM CACHE::', new Date().getTime());
  //     return JSON.parse(result);
  //   }

  //   // const locker = this._redisService.setnx()
  //   // 3. NO -> Miss cache
  //   // 4. Get data from DB
  //   const spu = [];
  //   console.log('FROM DB::', new Date().getTime());
  //   // 5. Save data to cache
  //   await this._redisService.set(keys, JSON.stringify(spu), 'EX', 60);
  //   return spu;
  // }

  async publishProductByShop(spu_id: string) {
    return !!(await this._spusRepository.updateProductId({
      product_id: spu_id,
      data: {
        isPublished: true,
        isDraft: false,
      },
    }));
  }

  async publishAllProduct() {
    return !!(await this._spusRepository.updateMany({
      update: {
        isPublished: true,
        isDraft: false,
      },
    }));
  }

  async unpublishProductByShop(spu_id: string) {
    return !!(await this._spusRepository.updateProductId({
      product_id: spu_id,
      data: { isPublished: false, isDraft: true },
    }));
  }

  async findAllPublishForShop(shop_id: string) {
    return await this._spusRepository.findAll({
      filter: { product_shop: shop_id, isPublished: true },
    });
  }

  async findAllDraftsForShop(shop_id: string) {
    return await this._spusRepository.findAll({
      filter: { product_shop: shop_id, isDraft: true },
    });
  }

  async getSkuById(product_id: string) {
    const foundProduct = await this._skuService.oneSku({ sku_id: product_id });
    return foundProduct[0];
  }

  async getSkuByIdV1(product_id: string, quantity: number) {
    const foundProduct = await this._skuService.oneSkuV1({
      sku_id: product_id,
      quantity,
    });
    return foundProduct[0];
  }

  async reduceStockQuantity(shop_order_ids: any[]) {
    console.log('Reducing stock for products...');
    let timeRetry = 3;
    let expireTime = 5000;
    const products = shop_order_ids.flatMap((order) => order.item_products);
    console.log('Products to reduce: ', products);

    const rollbackData = []; // Dùng để lưu trữ thông tin rollback

    try {
      // First lock the products in Redis
      for (let i = 0; i < products.length; i++) {
        let keys = `lock_${products[i].product_id}`;
        for (let count = 1; count <= timeRetry; count++) {
          const result = await this._redisService.setnx(keys, 1);
          console.log(`retry ${count} - ${result}`);
          if (result === 1) break;
          if (result === 0) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }
      }

      // Reducing stock for each product
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let result;

        if (product.sku_id) {
          result = await this._skusRepository.updateOne(
            { sku_id: product.sku_id, sku_stock: { $gte: product.quantity } },
            { $inc: { sku_stock: -product.quantity } },
          );

          // Save data to rollback if necessary
          rollbackData.push({
            sku_id: product.sku_id,
            quantity: product.quantity,
            isProduct: false,
          });

          if (result.modifiedCount === 0) {
            throw new RpcException(
              `Insufficient stock for SKU ${product.sku_id}`,
            );
          }
        } else if (product.product_id) {
          result = await this._spusRepository.updateOne(
            {
              product_id: product.product_id,
              product_quantity: { $gte: product.quantity },
            },
            { $inc: { product_quantity: -product.quantity } },
          );

          // Save data to rollback if necessary
          rollbackData.push({
            product_id: product.product_id,
            quantity: product.quantity,
            isProduct: true,
          });

          if (result.modifiedCount === 0) {
            throw new RpcException(
              `Insufficient stock for SPU ${product.product_id}`,
            );
          }
        }
      }

      // If all operations were successful, set expire time for Redis keys
      for (let i = 0; i < products.length; i++) {
        this._redisService.pexpire(
          `lock_${products[i].product_id}`,
          expireTime,
        );
      }

      // Remove Redis locks after operations
      const promises = products.map(async (product) => {
        await this._redisService.unlink(`lock_${product.product_id}`);
      });
      await Promise.all(promises);

      return true;
    } catch (error) {
      // Rollback logic if anything goes wrong
      console.error('Rolling back changes due to error:', error.message);
      for (const rollback of rollbackData.reverse()) {
        if (rollback.isProduct) {
          // Restore product quantity
          await this._spusRepository.updateOne(
            { product_id: rollback.product_id },
            { $inc: { product_quantity: rollback.quantity } },
          );
        } else {
          // Restore SKU quantity
          await this._skusRepository.updateOne(
            { sku_id: rollback.sku_id },
            { $inc: { sku_stock: rollback.quantity } },
          );
        }
      }

      // Make sure Redis keys are removed even if there is an error
      const promises = products.map(async (product) => {
        await this._redisService.unlink(`lock_${product.product_id}`);
      });
      await Promise.all(promises);

      throw error; // Rethrow error after rollback
    }
  }

  async restock(shop_order_ids: any[]) {
    console.log('Restocking products...');

    const products = shop_order_ids.flatMap((order) => order.item_products);
    console.log('Products to restock: ', products);

    // Bắt đầu session MongoDB
    const session = await this._skuService.startSession();
    session.startTransaction();

    try {
      for (const product of products) {
        if (product.sku_id) {
          // Nếu có `sku_id`, thì xử lý với SKU
          const sku = await this.getSkuById(product.sku_id);
          if (!sku) {
            throw new RpcException(`SKU with ID ${product.sku_id} not found`);
          }

          console.log('sku before restock', sku.sku_stock);

          // Tăng số lượng tồn kho cho SKU
          await this._skusRepository.update(sku._id, {
            sku_stock: sku.sku_stock + product.quantity,
          });

          const newsku = await this.getSkuById(product.sku_id);
          console.log('sku after restock', newsku.sku_stock);
        } else if (product.product_id) {
          // Nếu có `product_id`, thì xử lý với SPU
          const spu = await this.getSpuById(product.product_id);
          if (!spu) {
            throw new RpcException(
              `Product with ID ${product.product_id} not found`,
            );
          }

          console.log('spu before restock', spu[0].product_quantity);

          // Tăng số lượng tồn kho cho SPU
          await this._spusRepository.updateProductId({
            product_id: spu[0].product_id,
            data: {
              product_quantity: spu[0].product_quantity + product.quantity,
            },
          });

          const newspu = await this.getSpuById(product.product_id);
          console.log('spu after restock', newspu[0].product_quantity);
        }
      }
      // Commit transaction sau khi tất cả các thao tác hoàn thành
      await session.commitTransaction();
    } catch (err) {
      // Nếu có lỗi, rollback transaction
      await session.abortTransaction();
      console.log('Error restocking:', err);
      throw new RpcException('Error restocking, transaction rolled back');
    } finally {
      // Kết thúc session
      session.endSession();
    }

    return true; // Trả về true khi tăng số lượng thành công
  }
}
