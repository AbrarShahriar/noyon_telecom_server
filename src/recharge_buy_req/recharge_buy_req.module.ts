import { Module } from '@nestjs/common';
import { RechargeBuyReqController } from './recharge_buy_req.controller';
import { RechargeBuyReqService } from './recharge_buy_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeBuyReq } from './entity/recharge_buy_req.entity';
import { UserHistoryModule } from 'src/user_history/user_history.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RechargeBuyReq]),
    UserHistoryModule,
    UserModule,
  ],
  controllers: [RechargeBuyReqController],
  providers: [RechargeBuyReqService],
  exports: [RechargeBuyReqService],
})
export class RechargeBuyReqModule {}
