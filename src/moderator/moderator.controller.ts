import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModeratorService } from './moderator.service';
import { CreateModeratorDto } from './moderator.dto';

@ApiTags('moderator')
@Controller('moderator')
export class ModeratorController {
  @Inject(ModeratorService)
  private readonly moderatorService: ModeratorService;

  @Get('/all')
  async getAllModerator() {
    return this.moderatorService.getAllModerator();
  }

  @Post()
  createModerator(@Body() body: CreateModeratorDto) {
    return this.moderatorService.createModerator(body);
  }

  @Delete('/:moderatorId')
  deleteUser(@Param('moderatorId') moderatorId: number) {
    return this.moderatorService.deleteModerator(moderatorId);
  }
}
