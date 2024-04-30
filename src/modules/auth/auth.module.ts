import { Module } from '@nestjs/common';
import { JwtGuard } from './jwt/jwt.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';

@Module({
  providers: [JwtGuard, AuthService],
  exports: [JwtGuard],
  controllers: [AuthController, GoogleOauthController],
})
export class AuthModule {}
