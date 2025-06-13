import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { KeysDTO } from 'y/dtos';
import { PartialType } from '@nestjs/mapped-types';
import { KeysRepository } from 'libs/repositories/users/keys.repository';

export class BaseParamsDTO {
  @IsString()
  user_refresh_token: string;

  @IsString()
  user_public_key: string;

  @IsString()
  user_private_key: string;
}

export class ParamsDTO extends PartialType(BaseParamsDTO) {}

@Injectable()
export class KeysService {
  constructor(private _keysRepository: KeysRepository) {}

  async create(createKeyDto: KeysDTO) {
    return await this._keysRepository.create(createKeyDto);
  }

  async findAll() {
    return await this._keysRepository.findAll();
  }

  async findOne(params: ParamsDTO) {
    // Xây dựng điều kiện `where` linh hoạt
    const where: any = {
      is_active: true,
      expiration: {
        gte: new Date(),
      },
    };

    if (params.user_refresh_token) {
      where.user_refresh_token = params.user_refresh_token;
    }

    if (params.user_public_key) {
      where.user_public_key = params.user_public_key;
    }

    if (params.user_private_key) {
      where.user_private_key = params.user_private_key;
    }

    // Thực hiện truy vấn
    return await this._keysRepository.findOne({
      where,
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateKeyDto: KeysDTO) {
    return await this._keysRepository.update(id, updateKeyDto);
  }

  async softDelete(refresh_token: string) {
    return await this._keysRepository.softDelete(refresh_token);
  }

  remove(id: number) {
    return `This action removes a #${id} key`;
  }
}
