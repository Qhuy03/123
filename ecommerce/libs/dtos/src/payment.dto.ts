import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PaymentMethodDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  method_name: string;

  @IsString()
  @IsOptional()
  method_description?: string;

  @IsString()
  @IsOptional()
  method_thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsDateString()
  @IsOptional()
  created_at?: Date;

  @IsDateString()
  @IsOptional()
  updated_at?: Date;
}
