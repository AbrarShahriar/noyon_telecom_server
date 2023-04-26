import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RechargeBuyReqService } from './recharge_buy_req.service';
import {
  CreateRechargeBuyReqDto,
  RejectReqDto,
  UpdateRechargeBuyReqApprovedDto,
} from './recharge_buy_req.dto';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Public } from 'src/shared/security/PublicEndpoint';

@ApiTags('recharge buy req')
@Controller('recharge-buy-req')
export class RechargeBuyReqController {
  @Inject(RechargeBuyReqService)
  private readonly rechargeBuyReqService: RechargeBuyReqService;

  @Get()
  getAllRechargeBuyReqs() {
    return this.rechargeBuyReqService.getAllRechargeBuyReqs();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post('/reject')
  rejectReq(@Body() body: RejectReqDto) {
    return this.rechargeBuyReqService.rejectReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post()
  insertOfferBuyReq(@Body() body: CreateRechargeBuyReqDto) {
    return this.rechargeBuyReqService.insertRechargeBuyReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch('/')
  updateOfferBuyStatus(@Body() body: UpdateRechargeBuyReqApprovedDto) {
    return this.rechargeBuyReqService.updateRechargeBuyStatus(body);
  }
}
