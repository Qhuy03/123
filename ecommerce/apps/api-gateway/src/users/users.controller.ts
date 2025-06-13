import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryDTO } from 'y/dtos/index';

import { LoginDTO } from 'y/dtos/login.dto';
import { Request, Response } from 'express';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from 'y/constants';
import { encrypt } from 'y/utils';
import { AuthGuard } from 'y/guards';

export interface CustomRequest extends Request {
  user?: any; // Thêm thuộc tính user tùy chỉnh
}
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryDTO) {
    return this._usersService.findAll(query);
  }

  @Post('register')
  async register(@Body() dto: LoginDTO) {
    return await this._usersService.register(dto);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    return await this._usersService.verify(token);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO, @Res() res: Response) {
    const data = await this._usersService.login(dto);
    // res.cookie('refresh_token', data.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    //   maxAge: REFRESH_TOKEN_EXPIRATION,
    // });
    const value = {
      accessToken: data.accessToken,
      publicKey: data.user_public_key,
    };

    const text = JSON.stringify(value);
    const secretKey = process.env.SECRET_KEY_HASH;
    const encryptedData = encrypt(text, secretKey);

    // res.cookie('token', encryptedData, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    //   maxAge: ACCESS_TOKEN_EXPIRATION,
    // });

    res.status(200).json({
      data: {
        user_id: data.user_id,
        token: encryptedData,
        refresh_token: data.refreshToken,
      },
    });
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'] as string;
    const result = await this._usersService.logout(refresh_token);
    if (!result) throw new BadRequestException('Something went wrong');

    res.clearCookie('refresh_token');
    res.clearCookie('token');
    res.status(200).json({
      message: 'Logout successfully',
      result,
    });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    const data = await this._usersService.refresh(refreshToken);
    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });

    const text = JSON.stringify({
      data: { accessToken: data.accessToken, publicKey: data.publicKey },
    });
    const secretKey = process.env.SECRET_KEY_HASH;
    const encryptedData = encrypt(text, secretKey);

    res.cookie('token', encryptedData, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: ACCESS_TOKEN_EXPIRATION,
    });

    res.status(200).json({
      data,
    });
  }

  @UseGuards(AuthGuard)
  @Post('authenticated')
  async authenticated(@Req() req: CustomRequest) {
    return await this._usersService.authenticated(req.user.user_id);
  }
  @Get(':user_id')
  async getUserById(@Param('user_id') user_id: string) {
    return await this._usersService.authenticated(user_id);
  }
}
