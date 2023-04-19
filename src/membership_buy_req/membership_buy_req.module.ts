import { Module } from '@nestjs/common';
import { MembershipBuyReqController } from './membership_buy_req.controller';
import { MembershipBuyReqService } from './membership_buy_req.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipBuyReq } from './entity/membership_buy_req.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipBuyReq]), UserModule],
  controllers: [MembershipBuyReqController],
  providers: [MembershipBuyReqService],
})
export class MembershipBuyReqModule {}
