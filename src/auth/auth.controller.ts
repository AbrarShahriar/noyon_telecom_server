/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { Public } from 'src/shared/security/PublicEndpoint';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Public()
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload = {
      ...req.user,
      pin: undefined,
      updatedAt: undefined,
      balance: undefined,
      createdAt: undefined,
      subscription: undefined,
    };

    let token = this.jwtService.sign(payload);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      httpOnly: true,
    });

    return createResponse({
      message: 'User Logged In',
      payload,
      error: undefined,
    });
  }

  @Get('/isAuthenticated')
  async getProtected(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userRepo.findOne({
      where: {
        id: (req.user as User).id,
      },
    });
    return {
      isAuthenticated: true,
      user: { ...user, pin: undefined, updatedAt: undefined },
    };
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    req.logout(null, (err) => {
      res.clearCookie('access_token');
      if (err) {
        console.log(err);
      }
    });
    return {
      message: 'Logged Out',
    };
  }
}
