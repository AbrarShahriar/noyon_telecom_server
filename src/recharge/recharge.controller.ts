import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import { CreateRechargeDto } from './recharge.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/security/PublicEndpoint';

@ApiTags('recharge')
@Controller('recharge')
export class RechargeController {
  @Inject(RechargeService)
  private readonly rechargeService: RechargeService;

  @Public()
  @Get()
  getAllRechargeOffers() {
    return this.rechargeService.getAllRechargeOffers();
  }

  @Post()
  createRechage(@Body() body: CreateRechargeDto) {
    return this.rechargeService.createRechargeOffer(body);
  }
}
