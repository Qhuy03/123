import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('task_queue.results')
  async handleCreateProduct(@Payload() data: any) {
    return this.appService.create(data);
  }

  @Get()
  async geT() {
    {
      return await this.appService.getSpuById(
        '75e6a0e9-7883-4411-8276-6f4fc22cd5cd',
      );
    }
  }
}
