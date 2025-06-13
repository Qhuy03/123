// login-response.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginResponseDto {
  @IsOptional()
  @IsString()
  readonly user_id: String;

  @IsOptional()
  @IsEmail({}, { message: 'email người dùng không hợp lệ.' })
  readonly user_email: string;

  @IsString()
  readonly token: string;
}
