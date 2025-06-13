import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionsService } from './permissions.service';
import { PermissionsDTO } from 'y/dtos';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @MessagePattern('permission.create')
  create(@Payload() createPermissionDto: PermissionsDTO) {
    return this.permissionsService.create(createPermissionDto);
  }

  @MessagePattern('permission.findAll')
  findAll() {
    return this.permissionsService.findAll();
  }

  @MessagePattern('permission.findById')
  findOne(@Payload() id: string) {
    return this.permissionsService.findOne(id);
  }

  @MessagePattern('permission.update')
  update(@Payload() updatePermissionDto: PermissionsDTO) {
    return this.permissionsService.update(updatePermissionDto);
  }

  @MessagePattern('permission.remove')
  remove(@Payload() id: string) {
    return this.permissionsService.remove(id);
  }
}
