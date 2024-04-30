import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const googleOauthConfig = registerAs('google-oauth-config', () => ({
  webUrl: get('WEB_URL')
    .required(true)
    .asString(),
}));
