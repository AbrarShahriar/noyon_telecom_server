import { Module } from '@nestjs/common';
import { TopupReqController } from './topup_req.controller';
import { TopupReqService } from './topup_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopupReq } from './entity/topup_req.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopupReq])],
  controllers: [TopupReqController],
  providers: [TopupReqService],
})
export class TopupReqModule {}
