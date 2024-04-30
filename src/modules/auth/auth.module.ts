import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleOauthStrategy } from './google-oauth/google-oauth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { jwtAuthConfig } from './jwt-auth/jwt-auth.config';
import { UserModule } from '../users/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: jwtAuthConfig().secret,
        signOptions: {
          expiresIn: jwtAuthConfig().expiresIn,
        },
      }),
    }),
  ],
  providers: [JwtAuthGuard, AuthService, GoogleOauthStrategy],
  exports: [JwtAuthGuard],
  controllers: [AuthController, GoogleOauthController],
})
export class AuthModule {}
