import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {jwtConstants} from '../../../common/jwt.constants';
import { PrismaService } from '../../../prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // payload is what you signed inside AuthService (sub, email, role)
  async validate(payload: any) {
    // Optionally validate that user still exists / is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        // any other fields you want in request.user
      },
    });
    if (!user) {
      return null; // fail auth
    }

    // attach user to request (req.user), used by Guards/Controllers
    return user;
  }
}
