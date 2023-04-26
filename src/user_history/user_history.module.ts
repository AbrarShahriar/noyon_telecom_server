import { Module } from '@nestjs/common';
import { UserHistoryController } from './user_history.controller';
import { UserHistoryService } from './user_history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistory } from './entity/user_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHistory])],
  controllers: [UserHistoryController],
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
