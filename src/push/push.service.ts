import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';

@Injectable()
export class PushService {
  constructor(private prisma: PrismaService) {
    try {
      if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
          process.env.VAPID_SUBJECT || 'mailto:support.royalcash@gmail.com',
          process.env.VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY,
        );
      }
    } catch (e) { console.log('VAPID setup skipped:', e.message); }
  }

  async subscribe(userId: string | number | null, subscription: any) {
    const endpoint = subscription.endpoint;
    const uid = userId != null ? String(userId) : null;
    return this.prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { subscription: JSON.stringify(subscription), userId: uid },
      create: { endpoint, subscription: JSON.stringify(subscription), userId: uid },
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
      } catch (e: any) {
        // Remove dead subscriptions (410/404)
        if (e.statusCode === 410 || e.statusCode === 404) {
          await this.prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        }
      }
    }
    return { total: subs.length, sent };
  }
}
