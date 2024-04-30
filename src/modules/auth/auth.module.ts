import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth/google-oauth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { UserModule } from '../users/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/app.config';
import { UserService } from '../users/user/user.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig, true>) => ({
        global: true,
        secret: configService.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', { infer: true }),
        },
      }),
    }),
  ],
  providers: [JwtAuthGuard, AuthService, GoogleOauthStrategy, UserService],
  exports: [JwtAuthGuard],
  controllers: [AuthController, GoogleOauthController],
})
export class AuthModule {}
