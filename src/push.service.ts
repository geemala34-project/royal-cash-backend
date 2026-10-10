import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';

@Injectable()
export class PushService {
  constructor(private prisma: PrismaService) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:support.royalcash@gmail.com',
      process.env.VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || '',
    );
  }

  async subscribe(userId: string | null, subscription: any) {
    const endpoint = subscription.endpoint;
    return this.prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { subscription: JSON.stringify(subscription), userId },
      create: { endpoint, subscription: JSON.stringify(subscription), userId },
    });
  }

  async sendToAll(title: string, body: string, url = '/') {
    const subs = await this.prisma.pushSubscription.findMany();
    const payload = JSON.stringify({ title, body, url, icon: '/royal-cash-logo.png' });
    let sent = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification(JSON.parse(s.subscription), payload);
        sent++;
      } catch (e) {
        // Remove dead subscriptions (410/404)
        if (e.statusCode === 410 || e.statusCode === 404) {
          await this.prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        }
      }
    }
    return { total: subs.length, sent };
  }
}
