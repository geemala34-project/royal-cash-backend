import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletBalance: true,
        activityScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [totalUsers, pendingDeposits, approvedDeposits, activeOffers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.depositRequest.count({ where: { status: 'pending' } }),
      this.prisma.depositRequest.count({ where: { status: 'approved' } }),
      this.prisma.offer.count({ where: { isActive: true } }),
    ]);

    const sum = await this.prisma.depositRequest.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true },
    });

    return {
      totalUsers,
      pendingDeposits,
      approvedDeposits,
      activeOffers,
      totalDeposited: sum._sum.amount || 0,
    };
  }
}
