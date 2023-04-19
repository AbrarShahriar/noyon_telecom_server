import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RechargeBuyReqService } from './recharge_buy_req.service';
import {
  CreateRechargeBuyReqDto,
  UpdateRechargeBuyReqApprovedDto,
} from './recharge_buy_req.dto';

@ApiTags('recharge buy req')
@Controller('recharge-buy-req')
export class RechargeBuyReqController {
  @Inject(RechargeBuyReqService)
  private readonly rechargeBuyReqService: RechargeBuyReqService;

  @Get()
  getAllOfferBuyReqs() {
    return this.rechargeBuyReqService.getAllRechargeBuyReqs();
  }

  @Post()
  insertOfferBuyReq(@Body() body: CreateRechargeBuyReqDto) {
    return this.rechargeBuyReqService.insertRechargeBuyReq(body);
  }

  @Patch('/:rechargeBuyReqId')
  updateOfferBuyStatus(
    @Param('rechargeBuyReqId') rechargeBuyReqId: number,
    @Body() body: UpdateRechargeBuyReqApprovedDto,
  ) {
    return this.rechargeBuyReqService.updateRechargeBuyStatus(
      rechargeBuyReqId,
      body,
    );
  }
}
