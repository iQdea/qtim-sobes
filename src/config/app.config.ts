import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as Joi from 'joi';

export interface OauthProvider {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string[];
}

export interface AppConfig {
  env: string;
  port: number;
  database: string;
  webUrl: string;
  oauth: Record<string, OauthProvider>
  cors: CorsOptions,
  cookie: {
    maxAge: number,
    sameSite: boolean,
    secure: boolean,
  },
  jwt: {
    secret: string;
    expiresIn: string;
  },
  cache: {
    type: "database" | "redis" | "ioredis" | "ioredis/cluster",
    alwaysEnabled: boolean,
    duration: number;
  },
  migrations: {
    isEnabled: boolean,
  }
}

export function getConfigValidationSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    PORT: Joi.number().optional().allow(''),
    DATABASE_URL: Joi.string().required(),
    WEB_URL: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().optional().default('300s')
  });
}

export default (): AppConfig => ({
  env: process.env.NODE_ENV,
  port: Number.parseInt(process.env.PORT || '', 10) || 3200,
  database: process.env.DATABASE_URL,
  cors: {
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  },
  webUrl: process.env.WEB_URL,
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    }
  },
  cookie: {
    maxAge: 2592000000,
    sameSite: true,
    secure: false
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME
  },
  cache: {
    type: 'ioredis',
    alwaysEnabled: false,
    duration: 5 * 60 * 1000
  },
  migrations: {
    isEnabled: process.env.MIGRATIONS === 'true',
  }
});
