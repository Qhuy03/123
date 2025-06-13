import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolepermissionService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _userClient: ClientProxy,
  ) {} 
  async create(createRolepermissionDto: { role_id: string, permission_id: string}) {
    return await firstValueFrom(
      this._userClient.send('rolepermission.create', createRolepermissionDto),
    );
  }

  async findAll() {
    return await firstValueFrom(
      this._userClient.send('rolepermission.findAll', {}),  
    );
  }
}
