import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OfferBuyReq])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
