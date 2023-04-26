/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const adminKey = this.configService.get<string>('ADMIN_KEY');
    const moderatorKey = this.configService.get<string>('MODERATOR_KEY');

    if (request.headers.authorization && request.headers.authorization.split) {
      if (request.headers.authorization.split(' ')[1] === adminKey) {
        return true;
      }
    }

    if (request.headers.authorization && request.headers.authorization.split) {
      if (request.headers.authorization.split(' ')[1] === moderatorKey) {
        return true;
      }
    }

    return super.canActivate(context);
  }
}
