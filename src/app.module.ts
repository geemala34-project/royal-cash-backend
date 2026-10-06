import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TickerModule } from './ticker/ticker.module';
import { SliderModule } from './slider/slider.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    SubscriptionModule,
    TickerModule,
    SliderModule,
    OfferModule,

  ],
})
export class AppModule {}
