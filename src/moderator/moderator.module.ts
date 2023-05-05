import { Module } from '@nestjs/common';
import { ModeratorController } from './moderator.controller';
import { ModeratorService } from './moderator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moderator } from './entity/moderator.entity';
import { MembershipBuyReqModule } from 'src/membership_buy_req/membership_buy_req.module';
import { OfferBuyReqModule } from 'src/offer_buy_req/offer_buy_req.module';
import { RechargeBuyReqModule } from 'src/recharge_buy_req/recharge_buy_req.module';
import { TopupReqModule } from 'src/topup_req/topup_req.module';
import { WithdrawReqModule } from 'src/withdraw_req/withdraw_req.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Moderator]),
    MembershipBuyReqModule,
    OfferBuyReqModule,
    RechargeBuyReqModule,
    TopupReqModule,
    WithdrawReqModule,
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
})
export class ModeratorModule {}
