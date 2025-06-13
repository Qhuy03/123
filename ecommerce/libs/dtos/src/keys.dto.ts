import { IsString, IsNotEmpty, IsDate, IsOptional, IsIP } from 'class-validator';
import { Type } from 'class-transformer';

export class KeysDTO {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  user_refresh_token: string;

  @IsString()
  @IsNotEmpty()
  user_private_key: string;

  @IsString()
  @IsNotEmpty()
  user_public_key: string;

  @IsIP()
  @IsOptional() // Có thể để tùy chọn nếu cần
  user_login_ip?: string;

  @IsString()
  @IsOptional() // Có thể để tùy chọn nếu cần
  user_agent?: string;

  @IsDate()
  @Type(() => Date) // Chuyển đổi chuỗi thành kiểu Date
  expiration: Date;
}
