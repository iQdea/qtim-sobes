import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated && req.isAuthenticated();
  }
}
