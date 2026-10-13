import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getActiveGames() {
    return this.prisma.game.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getAllGames() {
    return this.prisma.game.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async createGame(data: any) {
    return this.prisma.game.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        bonus: data.bonus || '',
        category: data.category || 'most_played',
        isActive: data.isActive !== false,
        sortOrder: Number(data.sortOrder) || 0,
      },
    });
  }

  async updateGame(id: string, data: any) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.update({ where: { id }, data });
  }

  async deleteGame(id: string) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.delete({ where: { id } });
  }
}
