import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
  Min,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

class Variation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  options: Array<string>;
}

class Sku {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  sku_tier_idx: Array<number>;

  @IsNotEmpty()
  @IsNumber()
  sku_price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sku_stock: number;
}

export class SpuDTO {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsString()
  product_thumb: string;

  @IsOptional()
  @IsString()
  product_description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  product_price: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((id: string) => new Types.ObjectId(id)))
  product_category: Types.ObjectId[];

  @IsNotEmpty()
  @IsString()
  product_shop: string;

  @IsOptional()
  product_attributes: object;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  product_quantity: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variation) // Dùng nếu object cụ thể, bạn có thể định nghĩa class riêng
  product_variations: Array<Variation>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Sku) // Dùng nếu object cụ thể, bạn có thể định nghĩa class riêng
  sku_list?: Array<Sku>;
}
