import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserHistoryService } from './user_history.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserHistoryDto } from './user_history.dto';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';

@ApiTags('user history')
@Controller('user-history')
export class UserHistoryController {
  @Inject(UserHistoryService)
  private readonly userHistoryService: UserHistoryService;

  @Get('/total/:phone')
  getTotalHistory(@Param('phone') phone: string) {
    return this.userHistoryService.getTotalHistory(phone);
  }

  @Get('/query')
  getMonthHistory(@Req() req: Request, @Query('date') date: string) {
    return this.userHistoryService.getMonthlyHistory(
      date,
      (req.user as User).phone,
    );
  }

  @Post()
  insertUserHistory(@Body() body: CreateUserHistoryDto) {
    return this.userHistoryService.insertUserHistory(body);
  }
}
