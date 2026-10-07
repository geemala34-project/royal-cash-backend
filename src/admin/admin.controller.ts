import { Controller, Get, UseGuards } from '@nestjs/common';
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
}

