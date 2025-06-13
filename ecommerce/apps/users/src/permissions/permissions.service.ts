import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from 'libs/repositories/users/permissions.repository';
import { PermissionsDTO } from 'y/dtos';

@Injectable()
export class PermissionsService {
  constructor(private readonly _permissionsRepository: PermissionsRepository) {}
  async create(createPermissionDto: PermissionsDTO) {
    return await this._permissionsRepository.create(createPermissionDto);
  }

  async findAll() {
    return await this._permissionsRepository.findAll();
  }

  async findOne(id: string) {
    return await this._permissionsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(updatePermissionDto: PermissionsDTO) {
    const { id, ...rest } = updatePermissionDto;
    return await this._permissionsRepository.update(id, rest);
  }

  async remove(id: string) {
    return await this._permissionsRepository.softDelete(id);
  }
}
