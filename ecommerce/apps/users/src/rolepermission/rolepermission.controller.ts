import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolepermissionService } from './rolepermission.service';

@Controller()
export class RolepermissionController {
  constructor(private readonly rolepermissionService: RolepermissionService) {}

  @MessagePattern('rolepermission.create')
  create(@Payload() createRolepermissionDto: { role_id: string, permission_id: string}) {
    return this.rolepermissionService.create(createRolepermissionDto);
  }

  @MessagePattern('rolepermission.findAll')
  findAll() {
    return this.rolepermissionService.findAll();
  }

}
