import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginResponseDto } from 'y/dtos';
import { LoginDTO } from 'y/dtos/login.dto';
import { QueryDTO } from 'y/dtos/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _userClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly _notificationClient: ClientProxy,
  ) {}

  findAll(query: QueryDTO) {
    return this._userClient.send('users.findAll', query);
  }

  async register(dto: LoginDTO) {
    const userData = await firstValueFrom(
      this._userClient.send('users.register', dto),
    );
    console.log(userData)
    try {
      const data = (await firstValueFrom(
        this._notificationClient.send('noti.register', userData),
      )) as Boolean;
      return 'Vui lòng xác nhận địa chỉ email đăng ký Shopping!';
    } catch (err) {
      throw new BadRequestException('Có lỗi xảy ra khi gửi email!');
    }
  }

  async verify(token: string) {
    const userInfo = (await firstValueFrom(
      this._userClient.send('users.verify', token),
    )) as LoginDTO;


    const result = (await firstValueFrom(
      this._notificationClient.send('noti.verify', userInfo),
    )) as Boolean;

    if (!result) throw new BadRequestException('Có lỗi xảy ra khi gửi email!');

    return 'Mật khẩu của bạn đã được gửi thông qua email!';
  }

  async login(dto: LoginDTO) {
    const userData = await firstValueFrom(
      this._userClient.send('users.login', dto),
    );
    return userData;
  }

  async logout(refresh_token: string) {
    if (!refresh_token) throw new ForbiddenException();
    return await firstValueFrom(
      this._userClient.send('users.logout', refresh_token),
    );
  }

  async authenticated(user_id: string) {
    const res = await firstValueFrom(
      this._userClient.send('users.authenticated', user_id),
    );
    return res;
  }

  async refresh(refresh_token: string) {
    return await firstValueFrom(
      this._userClient.send('users.refresh', refresh_token),
    );
  }
}
