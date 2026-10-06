import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TickerService {
  constructor(private prisma: PrismaService) {}

  async getTicker(position: string) {
    const ticker = await this.prisma.ticker.findUnique({
      where: { position },
    });
    return {
      content: ticker?.content || '',
      isActive: ticker?.isActive ?? true,
    };
  }

  async updateTicker(position: string, content: string) {
    return this.prisma.ticker.upsert({
      where: { position },
      update: { content },
      create: { position, content, isActive: true },
    });
  }
}
