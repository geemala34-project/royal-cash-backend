import { Module } from '@nestjs/common';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PassportModule,
  ],

  controllers: [
    SubscriptionController,
  ],

  providers: [
    SubscriptionService,
  ],
})
export class SubscriptionModule {}