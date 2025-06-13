import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserroleService } from './userrole.service';

@Controller('userrole')
export class UserroleController {
  constructor(private readonly userroleService: UserroleService) {}

  @Post()
  create(@Body() createUserroleDto: { user_id: string, role_id: string}) {
    return this.userroleService.create(createUserroleDto);
  }

  @Get()
  findAll() {
    return this.userroleService.findAll();
  }

}
