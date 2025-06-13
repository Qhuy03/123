import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { UserAddress } from 'y/dtos';

@Controller('address')
export class AddressController {
  constructor(private readonly _addressService: AddressService) {}

  @Post('')
  create(@Body() data: UserAddress) {
    return this._addressService.create(data);
  }

  @Post('update')
  update(@Body() data: UserAddress) {
    return this._addressService.update(data);
  }

  @Post('delete')
  delete(@Body('id') id: string) {
    return this._addressService.delete(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this._addressService.findById(id);
  }

  @Get('')
  findAll() {
    return this._addressService.findAll();
  }
}
