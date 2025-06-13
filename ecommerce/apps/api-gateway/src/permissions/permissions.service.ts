import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PermissionsDTO } from 'y/dtos';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _userClient: ClientProxy,
  ) {}
  async create(createPermissionDto: PermissionsDTO) {
    return await firstValueFrom(
      this._userClient.send('permission.create', createPermissionDto),
    );
  }

  async findAll() {
    return await firstValueFrom(
      this._userClient.send('permission.findAll', {}),
    );
  }

  async findOne(id: string) {
    return await firstValueFrom(
      this._userClient.send('permission.findById', id),
    );
  }

  async update(updatePermissionDto: PermissionsDTO) {
    return await firstValueFrom(
      this._userClient.send('permission.update', updatePermissionDto),
    );
  }

  async remove(id: string) {
    return await firstValueFrom(
      this._userClient.send('permission.remove', id),
    );
  }
}
