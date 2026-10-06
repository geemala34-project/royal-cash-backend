import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async getOffers() {
    return this.prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer(data: { type: string; content?: string; imageUrl?: string }) {
    return this.prisma.offer.create({
      data: {
        type: data.type || 'text',
        content: data.content,
        imageUrl: data.imageUrl,
        isActive: true,
      },
    });
  }

  async updateOffer(id: string, data: any) {
    return this.prisma.offer.update({
      where: { id },
      data,
    });
  }

  async deleteOffer(id: string) {
    return this.prisma.offer.delete({
      where: { id },
    });
  }
}
