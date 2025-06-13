import {
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CartCreateDTO {
  @IsOptional()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsOptional()
  @IsString()
  sku_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  product_shop: string;
}

export interface ItemProductDTO {
  id: number | string;
  quantity: number;
  price: number;
  shop_id: string;
  product_id: string;
  product_name?: string;
  product_thumb?: string;
  sku_id: any;
  product_options?: string;
  isSelected: boolean;
}

export interface ShopDiscountDTO {
  discount_id: string;
  shop_id: number;
  code: string;
}

export interface ShopOrderDTO {
  shop_id: string;
  shop_discount?: ShopDiscountDTO[];
  item_products: ItemProductDTO[];
  version?: string;
}

export interface CartDTO {
  cart_id: string;
  user_id: string;
  shop_order_ids: ShopOrderDTO[];
}
