import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const googleOauthConfig = registerAs('google-oauth-config', () => ({
  webUrl: get('WEB_URL').required(true).asString(),
  clientID: get('GOOGLE_CLIENT_ID').required(true).asString(),
  clientSecret: get('GOOGLE_CLIENT_SECRET').required(true).asString(),
  callbackURL: get('GOOGLE_CALLBACK_URL').required(true).asString(),
}));
