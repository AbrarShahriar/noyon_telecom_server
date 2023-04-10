import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/types/HttpResponse';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/single/:userPhone')
  async getUserByPhone(
    @Param('userPhone') userPhone: string,
  ): Promise<GetUserDto | null> {
    return new GetUserDto(await this.userService.getUserByPhone(userPhone));
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<HttpResponse> {
    return this.userService.createUser(body);
  }
}
