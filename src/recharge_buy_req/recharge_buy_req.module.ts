import { Module } from '@nestjs/common';
import { RechargeBuyReqController } from './recharge_buy_req.controller';
import { RechargeBuyReqService } from './recharge_buy_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeBuyReq } from './entity/recharge_buy_req.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RechargeBuyReq])],
  controllers: [RechargeBuyReqController],
  providers: [RechargeBuyReqService],
})
export class RechargeBuyReqModule {}
