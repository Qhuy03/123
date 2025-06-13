import { Injectable } from '@nestjs/common';
import { RolesDTO } from 'y/dtos';
import { RolesRepository } from 'libs/repositories/users/roles.repository';

@Injectable()
export class RolesService {
  constructor(private _roleRepository: RolesRepository) {}
  async create(createRoleDto: RolesDTO) {
    return await this._roleRepository.create(createRoleDto);
  }

  async findAll() {
    return await this._roleRepository.findAll();
  }

  async findOne(id: string) {
    return await this._roleRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(dto: RolesDTO) {
    const { id, ...rest } = dto;
    return await this._roleRepository.update(id, rest);
  }

  async remove(id: string) {
    return await this._roleRepository.softDelete(id);
  }
}
