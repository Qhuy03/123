import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CategoryDto {
  @IsString()
  category_name: string;

  @IsOptional()
  @IsString()
  category_description?: string;

  @IsOptional()
  @IsString()
  category_thumb?: string;

  @IsOptional()
  @IsString()
  parent_category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
