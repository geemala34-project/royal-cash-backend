import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepositService {
  constructor(private prisma: PrismaService) {}

  async createDeposit(userId: number, data: any) {
    return this.prisma.depositRequest.create({
      data: {
        userId,
        paymentMethodId: data.paymentMethodId,
        amount: data.amount,
        transactionId: data.transactionId,
        screenshotUrl: data.screenshotUrl,
        status: 'pending',
      },
    });
  }

  async getMyDeposits(userId: number) {
    return this.prisma.depositRequest.findMany({
      where: { userId },
      include: { paymentMethod: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingDeposits() {
    return this.prisma.depositRequest.findMany({
      where: { status: 'pending' },
      include: { user: true, paymentMethod: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveDeposit(id: string) {
    const deposit = await this.prisma.depositRequest.findUnique({ where: { id } });
    if (!deposit) throw new NotFoundException('Deposit not found');
    if (deposit.status !== 'pending') throw new BadRequestException('Already processed');

    return this.prisma.$transaction(async (tx) => {
      await tx.depositRequest.update({
        where: { id },
        data: { status: 'approved' },
      });

      await tx.user.update({
        where: { id: deposit.userId },
        data: { walletBalance: { increment: deposit.amount } },
      });

      await tx.notification.create({
        data: {
          userId: deposit.userId,
          title: 'Deposit Approved ✅',
          message: `Your deposit of $${deposit.amount} has been approved and added to your wallet!`,
        },
      });

      return { message: 'Deposit approved and wallet credited!' };
    });
  }

  async rejectDeposit(id: string) {
    const deposit = await this.prisma.depositRequest.findUnique({ where: { id } });
    if (!deposit) throw new NotFoundException('Deposit not found');
    if (deposit.status !== 'pending') throw new BadRequestException('Already processed');

    await this.prisma.depositRequest.update({
      where: { id },
      data: { status: 'rejected' },
    });

    await this.prisma.notification.create({
      data: {
        userId: deposit.userId,
        title: 'Deposit Rejected ❌',
        message: `Your deposit of $${deposit.amount} was rejected. Please contact support.`,
      },
    });

    return { message: 'Deposit rejected' };
  }
}
