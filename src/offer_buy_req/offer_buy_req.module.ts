import { Module } from '@nestjs/common';
import { OfferBuyReqController } from './offer_buy_req.controller';
import { OfferBuyReqService } from './offer_buy_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferBuyReq } from './entity/offer_buy_req.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferBuyReq])],
  controllers: [OfferBuyReqController],
  providers: [OfferBuyReqService],
})
export class OfferBuyReqModule {}
