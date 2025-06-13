import { IsDecimal, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class OrderDetailDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: string; // Decimal được lưu trữ dưới dạng string trong TypeScript
}
