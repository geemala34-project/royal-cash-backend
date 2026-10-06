import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/ticker')
export class TickerController {
  constructor(private tickerService: TickerService) {}

  @Get(':position')
  getTicker(@Param('position') position: string) {
    return this.tickerService.getTicker(position);
  }

  @Put(':position')
  @UseGuards(AdminGuard)
  updateTicker(
    @Param('position') position: string,
    @Body() body: { content: string },
  ) {
    return this.tickerService.updateTicker(position, body.content);
  }
}
