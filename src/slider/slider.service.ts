import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SliderService {
  constructor(private prisma: PrismaService) {}

  async getSlides() {
    return this.prisma.slider.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createSlide(data: { imageUrl: string; title?: string; sortOrder?: number }) {
    return this.prisma.slider.create({
      data: {
        imageUrl: data.imageUrl,
        title: data.title,
        sortOrder: data.sortOrder || 0,
        isActive: true,
      },
    });
  }

  async updateSlide(id: string, data: any) {
    return this.prisma.slider.update({
      where: { id },
      data,
    });
  }

  async deleteSlide(id: string) {
    return this.prisma.slider.delete({
      where: { id },
    });
  }
}
