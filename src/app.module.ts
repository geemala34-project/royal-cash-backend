import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TickerModule } from './ticker/ticker.module';
import { SliderModule } from './slider/slider.module';
import { OfferModule } from './offer/offer.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DepositModule } from './deposit/deposit.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';

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
PaymentMethodModule,
DepositModule,
NotificationModule,
AdminModule,

  ],
})
export class AppModule {}
