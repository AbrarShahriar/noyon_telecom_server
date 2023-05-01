import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserHistoryModule } from 'src/user_history/user_history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // UserHistoryModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
