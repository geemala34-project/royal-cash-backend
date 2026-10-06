import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentMethodService {
  constructor(private prisma: PrismaService) {}

  async getActiveMethods() {
    return this.prisma.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllMethods() {
    return this.prisma.paymentMethod.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMethod(data: { name: string; details: string }) {
    return this.prisma.paymentMethod.create({
      data: {
        name: data.name,
        details: data.details,
        isActive: true,
      },
    });
  }

  async updateMethod(id: string, data: any) {
    return this.prisma.paymentMethod.update({
      where: { id },
      data,
    });
  }

  async deleteMethod(id: string) {
    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
