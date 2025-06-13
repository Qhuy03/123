import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { decrypt, verifyToken } from 'y/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  //   constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user_login_ip = request.ip;
    const user_agent = request.get('User-Agent');
    const user_id = request.headers['x-client-id'];

    const { accessToken: token, publicKey: user_public_key } =
      this.extractTokenFromHeader(request);
    try {
      console.log('public key: ', user_public_key);
      console.log('token', token);
      const data = await verifyToken(token, user_public_key);
      console.log(data);
      console.log(user_id);
      if (data.user_id !== user_id) throw new ForbiddenException();
      request['user'] = data;
      request.body = { ...request.body, user_login_ip, user_agent };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token expired');
      } else {
        throw new ForbiddenException('Invalid access token');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    console.log('get token from header');
    console.log(request.cookies);
    console.log(request.cookies['token']);
    const token = request.cookies['token'];
    if (!token) throw new ForbiddenException('Not authorized');

    const accessToken = decrypt(token, process.env.SECRET_KEY_HASH);
    const data = JSON.parse(accessToken);
    return data;
  }
}
