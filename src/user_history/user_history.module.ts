import { Module } from '@nestjs/common';
import { UserHistoryController } from './user_history.controller';
import { UserHistoryService } from './user_history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistory } from './entity/user_history.entity';
import { TopupReqModule } from 'src/topup_req/topup_req.module';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import { MembershipBuyReqModule } from 'src/membership_buy_req/membership_buy_req.module';
import { OfferBuyReqModule } from 'src/offer_buy_req/offer_buy_req.module';
import { RechargeBuyReqModule } from 'src/recharge_buy_req/recharge_buy_req.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHistory]),
    MembershipBuyReqModule,
    TopupReqModule,
    OfferBuyReqModule,
    RechargeBuyReqModule,
  ],
  controllers: [UserHistoryController],
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
