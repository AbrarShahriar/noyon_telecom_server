/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload = {
      ...req.user,
      pin: undefined,
    };

    let token = this.jwtService.sign(payload);
    res.cookie('access_token', token, { maxAge: 1000 * 60 * 15 });

    return { msg: 'User logged in' };
  }

  @Get('/isAuthenticated')
  getProtected() {
    return { isAuthenticated: true };
  }
}
