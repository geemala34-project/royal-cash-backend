import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PushService } from './push.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/push')
export class PushController {
  constructor(private pushService: PushService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { subscription: any; userId?: string }) {
    return this.pushService.subscribe(body.userId || null, body.subscription);
  }

  @Post('send')
  @UseGuards(AdminGuard)
  async send(@Body() body: { title: string; body: string; url?: string }) {
    return this.pushService.sendToAll(body.title, body.body, body.url);
  }
}
