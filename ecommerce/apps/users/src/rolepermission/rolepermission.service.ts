import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from 'libs/repositories/users/rolepermission.repository';

@Injectable()
export class RolepermissionService {
  constructor(
    private readonly _rolepermissionRepository: RolePermissionRepository,
  ) {}
  async create(createRolepermissionDto: {
    role_id: string;
    permission_id: string;
  }) {
    return await this._rolepermissionRepository.create(createRolepermissionDto);
  }

  async findAll() {
    return await this._rolepermissionRepository.findAll();
  }
}
