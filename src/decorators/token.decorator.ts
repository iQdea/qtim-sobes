import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

export const AccessToken = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.cookies['access_token'] || ExtractJwt.fromAuthHeaderAsBearerToken()(request);
});
