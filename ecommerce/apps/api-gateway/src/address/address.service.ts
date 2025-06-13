import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserAddress } from 'y/dtos';

@Injectable()
export class AddressService {
  constructor(
    @Inject('USERS_SERVICE') private readonly _usersService: ClientProxy,
  ) {}
  async create(data: UserAddress) {
    return await firstValueFrom(
      this._usersService.send('address.create', data),
    );
  }

  async update(data: any) {
    return await firstValueFrom(
      this._usersService.send('address.update', data),
    );
  }

  async delete(id: string) {
    return await firstValueFrom(this._usersService.send('address.delete', id));
  }

  async findAll() {
    return await firstValueFrom(this._usersService.send('address.findAll', ''));
  }

  async findById(id: string) {
    return await firstValueFrom(
      this._usersService.send('address.findById', id),
    );
  }
}
