import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

@Injectable()
export class UserGuard extends JwtGuard implements CanActivate {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    return !!result;
  }
}
