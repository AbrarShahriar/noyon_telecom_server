/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const bypassUrls = ['/auth/login', '/user/register'];

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    for (let i = 0; i < bypassUrls.length; i++) {
      if (req.url === bypassUrls[i]) return true;
    }

    return super.canActivate(context);
  }
}
