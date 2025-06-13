import { IsEmail, IsString, IsOptional, MinLength, IsIP } from 'class-validator';
import { InfoDTO } from './info.dto';

export class LoginDTO implements InfoDTO {
  @IsEmail()
  user_email: string;

  @IsOptional()  
  @IsString()
  @MinLength(6)
  user_password?: string;

  @IsIP()
  @IsOptional()
  user_login_ip?: string;

  @IsString()
  @IsOptional()
  user_agent?: string;
}
