import { Injectable } from '@nestjs/common';
import { UserRoleRepository } from 'libs/repositories/users/user_role.repository';

@Injectable()
export class UserroleService {
  constructor(private readonly _userRoleRepository: UserRoleRepository) {}
  async create(createUserroleDto: { user_id: string; role_id: string }) {
    console.log(createUserroleDto);
    return await this._userRoleRepository.create(createUserroleDto);
  }

  async findAll() {
    return await this._userRoleRepository.findAll();
  }
}
