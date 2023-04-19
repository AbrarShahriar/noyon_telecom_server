import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { OfferModule } from './offer/offer.module';
import { OfferBuyReqModule } from './offer_buy_req/offer_buy_req.module';
import { TopupReqModule } from './topup_req/topup_req.module';
import { RechargeModule } from './recharge/recharge.module';
import { RechargeBuyReqModule } from './recharge_buy_req/recharge_buy_req.module';
import { MembershipBuyReqModule } from './membership_buy_req/membership_buy_req.module';
import { ModeratorModule } from './moderator/moderator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UserModule,
    OfferModule,
    OfferBuyReqModule,
    TopupReqModule,
    RechargeModule,
    RechargeBuyReqModule,
    MembershipBuyReqModule,
    ModeratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
