import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistoryModule } from 'src/user_history/user_history.module';
import { MembershipBuyReq } from 'src/membership_buy_req/entity/membership_buy_req.entity';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { RechargeBuyReq } from 'src/recharge_buy_req/entity/recharge_buy_req.entity';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import { MembershipBuyReqModule } from 'src/membership_buy_req/membership_buy_req.module';
import { OfferBuyReqModule } from 'src/offer_buy_req/offer_buy_req.module';
import { RechargeBuyReqModule } from 'src/recharge_buy_req/recharge_buy_req.module';
import { TopupReqModule } from 'src/topup_req/topup_req.module';

@Module({
  imports: [
    UserHistoryModule,
    MembershipBuyReqModule,
    OfferBuyReqModule,
    RechargeBuyReqModule,
    TopupReqModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
