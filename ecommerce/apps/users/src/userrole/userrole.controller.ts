import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserroleService } from './userrole.service';

@Controller()
export class UserroleController {
  constructor(private readonly userroleService: UserroleService) {}

  @MessagePattern('userrole.create')
  create(@Payload() createUserroleDto: { user_id: string, role_id: string}) {
    return this.userroleService.create(createUserroleDto);
  }

  @MessagePattern('userrole.findAll')
  findAll() {
    return this.userroleService.findAll();
  }
}
