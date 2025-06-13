import { Controller, Get } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginResponseDto } from 'y/dtos';

@Controller()
export class NotifyController {
  constructor(private readonly _notifyService: NotifyService) {}

  @MessagePattern('noti.register')
  async sendEmailToken(payload: LoginResponseDto) {
    console.log(payload);
    return await this._notifyService.sendEmailToken(payload);
  }

  @MessagePattern('noti.verify')
  async sendEmailVerify(payload: LoginResponseDto) {
    return await this._notifyService.sendEmailPassword(payload);
  }
}
