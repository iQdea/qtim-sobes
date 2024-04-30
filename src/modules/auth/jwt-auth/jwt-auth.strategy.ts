import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly configService: ConfigService<AppConfig, true>
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
      secretOrKey: configService.get('jwt.secret', { infer: true }),
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
