import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  constructor(private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
