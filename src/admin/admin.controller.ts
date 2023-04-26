import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ReqType } from './admin.enum';
import { Public } from 'src/shared/security/PublicEndpoint';
import { AdminEndpoint } from 'src/shared/security/AdminEndpoint';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { LoginAdminDto } from './admin.dto';
import { ConfigService } from '@nestjs/config';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@ApiTags('Admin Panel')
@Controller('admin')
export class AdminController {
  @Inject(AdminService)
  private readonly adminService: AdminService;

  constructor(private readonly configService: ConfigService) {}

  @Public()
  @Post('/login')
  adminLogin(@Body() body: LoginAdminDto) {
    let username = this.configService.get('ADMIN_USERNAME');
    let password = this.configService.get('ADMIN_PASSWORD');
    if (body.username == username && body.password == password) {
      return { adminKey: this.configService.get('ADMIN_KEY') };
    }
    return createResponse({
      message: 'Something Went Wrong',
      payload: undefined,
      error: '',
    });
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/count')
  getRequestCount() {
    return this.adminService.getRequestCount();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/history/query')
  getTodayTransactioNHistory(@Query('date') date: string) {
    return this.adminService.getTodayTransactionHistory(date);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/history/all')
  getAllTransactioNHistory() {
    return this.adminService.getTotalTransactionHistory();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/total-in-out')
  getTotalInOut() {
    return this.adminService.getTotalInOut();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/req/:type')
  getRequestsBasesOnType(@Param('type') type: ReqType) {
    return this.adminService.getReqsBasedOnType(type);
  }
}
