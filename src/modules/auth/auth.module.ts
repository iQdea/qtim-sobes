import { Module } from '@nestjs/common';
import { JwtGuard } from './jwt/jwt.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [JwtGuard, AuthService],
  exports: [JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
