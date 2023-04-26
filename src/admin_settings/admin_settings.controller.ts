import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminSettingsService } from './admin_settings.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAdminSettingsDto } from './admin_settings.dto';
import { Public } from '../shared/security/PublicEndpoint';
import { AdminGuard } from 'src/shared/guards/admin.guard';

@ApiTags('Admin Settings')
@Controller('admin-settings')
export class AdminSettingsController {
  @Inject(AdminSettingsService)
  private readonly adminSettingsService: AdminSettingsService;

  @Public()
  @Get('/all')
  getAllSettings() {
    return this.adminSettingsService.getAdminSettings();
  }

  @Patch()
  @UseGuards(AdminGuard)
  updateSetting(@Body() body: UpdateAdminSettingsDto) {
    return this.adminSettingsService.updateSetting(body);
  }
}
