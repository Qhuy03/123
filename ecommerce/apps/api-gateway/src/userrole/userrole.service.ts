import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserroleService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _userClient: ClientProxy,
  ) {}
  async create(createUserroleDto: { user_id: string, role_id: string}) {
    return await firstValueFrom(
      this._userClient.send('userrole.create', createUserroleDto)
    );
  }

  async findAll() {
    return await firstValueFrom(
      this._userClient.send('userrole.findAll', {})
    );
  }

}
