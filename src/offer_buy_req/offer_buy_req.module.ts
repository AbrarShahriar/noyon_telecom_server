import { Module } from '@nestjs/common';
import { OfferBuyReqController } from './offer_buy_req.controller';
import { OfferBuyReqService } from './offer_buy_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferBuyReq } from './entity/offer_buy_req.entity';
import { OfferModule } from 'src/offer/offer.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([OfferBuyReq]), OfferModule, UserModule],
  controllers: [OfferBuyReqController],
  providers: [OfferBuyReqService],
  exports: [OfferBuyReqService],
})
export class OfferBuyReqModule {}
