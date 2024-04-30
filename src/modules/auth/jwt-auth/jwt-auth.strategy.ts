import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtAuthConfig } from './jwt-auth.config';
import { Repository } from 'typeorm';
import { User } from '../../users/user/entities/user.entity';

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: jwtAuthConfig().secret,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { uuid: payload.sub }
    });

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      uuid: payload.sub,
    };
  }
}
