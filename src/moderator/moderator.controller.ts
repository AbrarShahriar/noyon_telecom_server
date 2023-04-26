import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModeratorService } from './moderator.service';
import { CreateModeratorDto, LoginModeratorDto } from './moderator.dto';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Public } from 'src/shared/security/PublicEndpoint';

@ApiTags('moderator')
@Controller('moderator')
export class ModeratorController {
  @Inject(ModeratorService)
  private readonly moderatorService: ModeratorService;

  @Public()
  @Post('/login')
  loginModerator(@Body() body: LoginModeratorDto) {
    return this.moderatorService.loginModerator(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/all')
  async getAllModerator() {
    return this.moderatorService.getAllModerator();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/total-in-out/:moderatorId')
  async getModeratorInAndOut(@Param('moderatorId') moderatorId: number) {
    return this.moderatorService.getModeratorInAndOut(moderatorId);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/history')
  getAllTransactioNHistory(
    @Query('moderatorId') moderatorId: number,
    @Query('date') date: string,
  ) {
    return this.moderatorService.getTotalTransactionHistory(moderatorId, date);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post()
  createModerator(@Body() body: CreateModeratorDto) {
    return this.moderatorService.createModerator(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Delete('/:moderatorId')
  deleteUser(@Param('moderatorId') moderatorId: number) {
    return this.moderatorService.deleteModerator(moderatorId);
  }
}
