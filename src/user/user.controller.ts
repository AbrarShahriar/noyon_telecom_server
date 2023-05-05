import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserBalanceDto,
  VerifyPinDto,
} from './user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/security/PublicEndpoint';
import { Request } from 'express';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { User } from './entity/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/single/:userPhone')
  async getUserByPhone(@Param('userPhone') userPhone: string) {
    return new GetUserDto(await this.userService.getUserByPhone(userPhone));
  }

  @Get('/info')
  getUserInfo(@Req() req: Request) {
    return this.userService.getUserFromReq(req);
  }

  @Post('/verify-pin')
  verifyPin(@Body() body: VerifyPinDto, @Req() req: Request) {
    return this.userService.verifyPin(
      body.pin,
      (req.user as User).phone as string,
    );
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/all')
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Public()
  @Post('/register')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch('/update/balance')
  updateUserBalance(@Body() body: UpdateUserBalanceDto) {
    return this.userService.updateUserBalance(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
