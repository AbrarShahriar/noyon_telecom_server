import { Module } from '@nestjs/common';
import { WithdrawReqController } from './withdraw_req.controller';
import { WithdrawReqService } from './withdraw_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawReq } from './entity/withdraw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawReq])],
  controllers: [WithdrawReqController],
  providers: [WithdrawReqService],
  exports: [WithdrawReqService],
})
export class WithdrawReqModule {}
