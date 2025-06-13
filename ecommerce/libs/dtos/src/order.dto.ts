import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDetailDTO } from './order-detail.dto';
import { CartDTO, ShopOrderDTO } from './carts.dto';
import { UserAddress } from './address.dto';

export enum STATUS {
  PENDING = 'PENDING',
  PAID = 'PAID',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
}
export class OrderDTO implements CartDTO {
  order_id?: string;
  cart_id: string;
  user_id: string;
  shop_order_ids: ShopOrderDTO[];
  // user_address: {
  //   address: string;
  //   city: string;
  //   country: string;
  //   phone: string;
  //   name: string;
  // };
  user_address: UserAddress;
  // user_payment: any;
  user_payment: {
    id: string;
    method_name: string;
  };
  checkout_order?: any;
}
