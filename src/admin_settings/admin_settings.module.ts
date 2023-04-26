import { Module } from '@nestjs/common';
import { AdminSettingsController } from './admin_settings.controller';
import { AdminSettingsService } from './admin_settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSetting } from './entity/admin_settings.entity';
import { UserHistoryModule } from 'src/user_history/user_history.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminSetting])],
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService],
})
export class AdminSettingsModule {}
