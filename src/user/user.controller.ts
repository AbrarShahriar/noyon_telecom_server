import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

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

  @Get('/all')
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Post('/register')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
