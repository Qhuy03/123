import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// export class UserAddressDTO {
//   @IsUUID()
//   @IsOptional()
//   id: string;

//   @IsString()
//   @IsNotEmpty()
//   user_name: string;

//   @IsString()
//   @IsNotEmpty()
//   user_phone: string;

//   @IsString()
//   @IsNotEmpty()
//   user_id: string;

//   @IsString()
//   @IsNotEmpty()
//   street: string;

//   @IsString()
//   @IsNotEmpty()
//   district: string;

//   @IsString()
//   @IsNotEmpty()
//   city: string;

//   @IsDateString()
//   @IsOptional()
//   createdAt?: Date;

//   @IsDateString()
//   @IsOptional()
//   updatedAt?: Date;

//   @IsBoolean()
//   @IsOptional()
//   isDeleted?: boolean;
// }

export interface UserAddress {
  id?: string; // UUID là chuỗi, có thể optional
  user_name: string;
  user_phone: string;
  user_id: string;
  street: string;
  district: string;
  city: string;
  type: string;
  isDefault?: boolean;
  createdAt?: Date; // Optional Date
  updatedAt?: Date; // Optional Date
  isDeleted?: boolean; // Optional boolean
}
