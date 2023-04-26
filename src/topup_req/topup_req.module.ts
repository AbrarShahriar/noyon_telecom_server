import { Module } from '@nestjs/common';
import { TopupReqController } from './topup_req.controller';
import { TopupReqService } from './topup_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopupReq } from './entity/topup_req.entity';
import { UserHistoryModule } from 'src/user_history/user_history.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopupReq]),
    UserHistoryModule,
    UserModule,
  ],
  controllers: [TopupReqController],
  providers: [TopupReqService],
  exports: [TopupReqService],
})
export class TopupReqModule {}
