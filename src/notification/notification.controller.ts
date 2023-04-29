import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Public } from 'src/shared/security/PublicEndpoint';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { CreateNotiDto } from './notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  @Inject(NotificationService)
  private readonly notificationService: NotificationService;

  @Public()
  @Get()
  getAllNoti() {
    return this.notificationService.getAllNoti();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post()
  createNoti(@Body() body: CreateNotiDto) {
    return this.notificationService.createNoti(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Delete('/:notiId')
  deleteNoti(@Param('notiId') notiId: number) {
    return this.notificationService.deleteNoti(notiId);
  }
}
