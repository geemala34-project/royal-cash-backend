import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserGuard } from '../auth/guards/user.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(UserGuard)
  getMyNotifications(@Req() req: any) {
    return this.notificationService.getMyNotifications(req.user.id);
  }

  @Put(':id/read')
  @UseGuards(UserGuard)
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('broadcast')
  @UseGuards(AdminGuard)
  broadcast(@Body() body: { title: string; message: string }) {
    return this.notificationService.broadcast(body.title, body.message);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getAll() {
    return this.notificationService.getAll();
  }
}
