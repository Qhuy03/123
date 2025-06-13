import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolepermissionService } from './rolepermission.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('rolepermission')
export class RolepermissionController {
  constructor(private readonly rolepermissionService: RolepermissionService) {}

  @Post()
  create(@Payload() createRolepermissionDto: { role_id: string, permission_id: string}) {
    return this.rolepermissionService.create(createRolepermissionDto);
  }

  @Get()
  findAll() {
    return this.rolepermissionService.findAll();
  }

}
