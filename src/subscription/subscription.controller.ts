import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('subscription')
export class SubscriptionController {

  constructor(
    private subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('subscribe')
  subscribe(@Req() req: any) {

    const userId = req.user.id;

    return this.subscriptionService.subscribe(userId);
  }
}