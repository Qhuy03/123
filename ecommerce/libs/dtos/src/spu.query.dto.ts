import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class SpuQueryDTO {
  @IsOptional()
  @IsString()
  shop?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0) // Giá tối thiểu không thể nhỏ hơn 0
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) // Giá tối đa không thể nhỏ hơn 0
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) // Giá trị đánh giá nhỏ nhất là 1
  @Max(5) // Giá trị đánh giá lớn nhất là 5
  rate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) // Trang bắt đầu từ 1
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) // Số lượng bản ghi trên mỗi trang ít nhất là 1
  perPage?: number;
}
