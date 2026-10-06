import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/deposits')
export class DepositController {
  constructor(private depositService: DepositService) {}

  @Post()
  @UseGuards(JwtGuard)
  createDeposit(@Req() req: any, @Body() body: any) {
    return this.depositService.createDeposit(req.user.id, body);
  }

  @Get('mine')
  @UseGuards(JwtGuard)
  getMyDeposits(@Req() req: any) {
    return this.depositService.getMyDeposits(req.user.id);
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  getPendingDeposits() {
    return this.depositService.getPendingDeposits();
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  approveDeposit(@Param('id') id: string) {
    return this.depositService.approveDeposit(id);
  }

  @Put(':id/reject')
  @UseGuards(AdminGuard)
  rejectDeposit(@Param('id') id: string) {
    return this.depositService.rejectDeposit(id);
  }
}
