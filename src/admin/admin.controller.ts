import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @UseGuards(AdminGuard)
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  getStats() {
    return this.adminService.getStats();
  }

  @Put('profile')
  @UseGuards(AdminGuard)
  updateProfile(@Req() req: any, @Body() body: { name?: string; email?: string }) {
    return this.adminService.updateProfile(req.user.id, body);
  }
}
