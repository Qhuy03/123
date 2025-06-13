import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QueryDTO } from 'y/dtos/query.dto';
import { LoginDTO } from 'y/dtos/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @MessagePattern('users.findAll')
  findAll(@Payload() query: QueryDTO) {
    return this._usersService.findAll(query);
  }

  @MessagePattern('users.register')
  register(@Payload() dto: LoginDTO) {
    return this._usersService.register(dto);
  }

  @MessagePattern('users.verify')
  verify(@Payload() token: string) {
    return this._usersService.verify(token);
  }

  @MessagePattern('users.login')
  login(@Payload() dto: LoginDTO) {
    return this._usersService.login(dto);
  }

  @MessagePattern('users.logout')
  logout(@Payload() refresh_token: string) {
    return this._usersService.logout(refresh_token);
  }

  @MessagePattern('users.authenticated')
  authenticated(@Payload() user_id: string) {
    return this._usersService.authenticated(user_id);
  }

  @MessagePattern('users.refresh')
  refresh(@Payload() refresh_token: string) {
    return this._usersService.refresh(refresh_token);
  }
}
