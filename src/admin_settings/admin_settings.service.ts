import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminSetting } from './entity/admin_settings.entity';
import { Repository } from 'typeorm';
import { UpdateAdminSettingsDto } from './admin_settings.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';

@Injectable()
export class AdminSettingsService {
  @InjectRepository(AdminSetting)
  private readonly adminSettingsRepo: Repository<AdminSetting>;

  async getAdminSettings() {
    let settings = await this.adminSettingsRepo.find();

    let formattedSetting: any = {};

    settings.forEach((setting) => {
      formattedSetting[setting.label] = setting.value;
    });

    return formattedSetting;
  }

  async updateSetting(body: UpdateAdminSettingsDto) {
    try {
      await this.adminSettingsRepo.update(
        { label: body.label },
        { value: body.value },
      );
      return createResponse({
        message: 'Settings Updated!',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
