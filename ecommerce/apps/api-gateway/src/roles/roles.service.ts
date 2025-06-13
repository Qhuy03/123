import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RolesDTO } from 'y/dtos';

@Injectable()
export class RolesService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _userClient: ClientProxy,
  ) {}
  async create(createRoleDto: RolesDTO) {
    return await firstValueFrom(
      this._userClient.send('role.create', createRoleDto),
    );
  }

  async findAll() {
    return await firstValueFrom(
      this._userClient.send('role.findAll', {}),
    );
  }

  async findOne(id: string) {
    return await firstValueFrom(
      this._userClient.send('role.findById', id),
    );
  }

  async update(updateRoleDto: RolesDTO) {
    return await firstValueFrom(
      this._userClient.send('role.update', updateRoleDto),
    );
  }

  async remove(id: string) {
    return await firstValueFrom(
      this._userClient.send('role.remove', id)
    );
  }
}
