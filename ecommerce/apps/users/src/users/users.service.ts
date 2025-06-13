import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDTO, QueryDTO } from 'y/dtos';
import { UserRepository } from 'libs/repositories/users/user.repository';
import {
  generateToken,
  unGetSelectDataFromObject,
  updateNestedArrayParser,
  verifyToken,
} from 'y/utils';
import {
  ACCESS_TOKEN_EXPIRATION,
  DEFAULT_TIME_EXPIRATION_EMAIL,
  REFRESH_TOKEN_EXPIRATION,
} from 'y/constants';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import { KeysService } from '../keys/keys.service';

@Injectable()
export class UsersService {
  constructor(
    private _userRepository: UserRepository,
    private _keyService: KeysService,
  ) {}

  async findAll(query: QueryDTO) {
    const { search, page, perPage, sortBy, sortOrder } = query;

    const pageNumber = parseInt(page.toString(), 10);
    const perPageNumber = parseInt(perPage.toString(), 10);

    const skip = (pageNumber - 1) * perPageNumber;
    const take = perPageNumber;

    return await this._userRepository.findAll({
      skip,
      take,
    });
  }

  async register(dto: LoginDTO) {
    const { user_email } = dto;
    const foundUser = await this._userRepository.findOne({
      where: {
        user_email,
      },
    });

    if (foundUser) {
      // throw new BadRequestException('User already exists');
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const token = await generateToken(
      { user_email },
      process.env.SECRET_KEY_OTP,
      DEFAULT_TIME_EXPIRATION_EMAIL.toString(),
    );

    const data = {
      user_email: user_email,
      token,
    };

    return data;
  }

  async verify(token: string) {
    const payload = await verifyToken(token, process.env.SECRET_KEY_OTP);

    const { user_email } = payload;

    const foundUser = await this._userRepository.findOne({
      where: {
        user_email,
      },
    });

    if (foundUser) {
      // throw new BadRequestException('User already exists');
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(user_email, salt);

    const newUser = await this._userRepository.create({
      user_email,
      user_password: password,
      user_salt: salt,
    });

    // if(!newUser) throw new BadRequestException('Create user failed! Please try again');
    if (!newUser)
      throw new RpcException({
        statusCode: 400,
        message: 'Create user failed! Please try again',
      });

    const data = {
      user_email: user_email,
      user_password: user_email,
    };

    return data;
  }

  async login(dto: LoginDTO) {
    const { user_email, user_password } = dto;

    let user_roles: {
      include: {
        role: {
          include: {
            role_permissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
    const foundUser = await this._userRepository.findByEmail(user_email, {
      user_roles,
    });

    if (!foundUser)
      throw new RpcException({
        statusCode: 400,
        message: 'User not found',
      });

    const isMatch = await bcrypt.compare(
      user_password,
      foundUser.user_password,
    );

    if (!isMatch)
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });

    const publicKey = randomBytes(64).toString('hex');
    const privateKey = randomBytes(64).toString('hex');

    // if(!foundUser?.user_roles) return [];

    const roles = updateNestedArrayParser(foundUser.user_roles);

    const payload = {
      user_id: foundUser.id,
      roles,
    };

    const refreshToken = await generateToken(
      payload,
      privateKey,
      REFRESH_TOKEN_EXPIRATION.toString(),
    );

    const accessToken = await generateToken(
      payload,
      publicKey,
      ACCESS_TOKEN_EXPIRATION.toString(),
    );

    const keys = await this._keyService.create({
      user_id: foundUser.id,
      user_agent: dto.user_agent,
      user_login_ip: dto.user_login_ip,
      user_private_key: privateKey,
      user_public_key: publicKey,
      user_refresh_token: refreshToken,
      expiration: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
    });

    if (!keys)
      throw new RpcException({
        statusCode: 400,
        message: 'Create key failed! Please try again',
      });
    return {
      user_id: foundUser.id,
      accessToken,
      refreshToken,
      user_public_key: publicKey,
    };
  }

  async logout(refresh_token: string) {
    const foundKey = await this._keyService.findOne({
      user_refresh_token: refresh_token,
    });

    if (!foundKey)
      throw new RpcException({
        statusCode: 400,
        message: 'NOT_FOUND',
      });

    const result = await this._keyService.softDelete(
      foundKey.user_refresh_token,
    );
    return result ? true : false;
  }

  async authenticated(user_id: string) {
    const user = await this._userRepository.findOne({
      where: { id: user_id },
    });
    if (!user)
      throw new RpcException({
        statusCode: 401,
        message: 'Unauthorized',
      });

    const selectUser = unGetSelectDataFromObject(user, [
      'user_password',
      'user_salt',
      'created_at',
      'updated_at',
    ]);

    return selectUser;
  }

  async refresh(refresh_token: string) {
    const keyStore = await this._keyService.findOne({
      user_refresh_token: refresh_token,
    });

    if (!keyStore)
      throw new RpcException({
        statusCode: 400,
        message: 'NOT_FOUND',
      });

    const decoded = await verifyToken(refresh_token, keyStore.user_private_key);
    if (!decoded)
      throw new RpcException({
        statusCode: 400,
        message: 'INVALID_TOKEN',
      });

    const { iat, exp, ...payload } = decoded;

    const publicKey = randomBytes(64).toString('hex');
    const privateKey = randomBytes(64).toString('hex');

    const newRefreshToken = await generateToken(
      payload,
      privateKey,
      new Date(keyStore.expiration).getTime().toString(),
    );
    const newAccessToken = await generateToken(
      payload,
      publicKey,
      ACCESS_TOKEN_EXPIRATION.toString(),
    );

    const updateTokenUsed = await this._keyService.softDelete(refresh_token);
    if (updateTokenUsed) {
      const newKeys = await this._keyService.create({
        user_id: keyStore.user_id,
        user_agent: keyStore.user_agent,
        user_login_ip: keyStore.user_login_ip,
        user_private_key: privateKey,
        user_public_key: publicKey,
        user_refresh_token: newRefreshToken,
        expiration: keyStore.expiration,
      });

      if (!newKeys)
        throw new RpcException({
          statusCode: 400,
          message: 'Create key failed! Please try again',
        });

      return {
        user_id: keyStore.user_id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user_public_key: publicKey,
      };
    }
  }
}
