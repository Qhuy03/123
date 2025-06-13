import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { RolesDTO } from 'y/dtos';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('role.create')
  create(@Payload() createRoleDto: RolesDTO) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern('role.findAll')
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern('role.findById')
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern('role.update')
  update(@Payload() updateRoleDto: RolesDTO ) {
    return this.rolesService.update(updateRoleDto);
  }

  @MessagePattern('role.remove')
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}
