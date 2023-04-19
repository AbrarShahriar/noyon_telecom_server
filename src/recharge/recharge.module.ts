import { Module } from '@nestjs/common';
import { RechargeController } from './recharge.controller';
import { RechargeService } from './recharge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recharge } from './entity/recharge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recharge])],
  controllers: [RechargeController],
  providers: [RechargeService],
})
export class RechargeModule {}
