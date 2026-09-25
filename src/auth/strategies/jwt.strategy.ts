import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(
  private prisma: PrismaService,
) {
  super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_SECRET || 'royal_cash_secret_key_123',
    });
  }

async validate(payload: any) {

  const user = await this.prisma.user.findUnique({
    where:{
      id: payload.id,
    },
  });


  if(!user){
    return null;
  }


  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };

}
}
