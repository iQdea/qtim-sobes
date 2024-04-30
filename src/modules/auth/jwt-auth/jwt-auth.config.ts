import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const jwtAuthConfig = registerAs('jwt-auth-config', () => ({
  secret: get('JWT_SECRET').required(true).asString(),
  expiresIn: get('JWT_EXPIRATION_TIME').default('300s').asString(),
}));
