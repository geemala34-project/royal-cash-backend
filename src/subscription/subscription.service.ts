import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async subscribe(userId: number) {

    // Check if user already subscribed
    const existingSubscription =
      await this.prisma.subscription.findUnique({
        where: {
          userId,
        },
      });

    if (existingSubscription) {
      return {
        message: 'Already subscribed',
        subscription: existingSubscription,
      };
    }

    // Create new subscription
    const subscription =
      await this.prisma.subscription.create({
        data: {
          userId,
        },
      });

    return {
      message: 'Subscription successful',
      subscription,
    };
  }
}