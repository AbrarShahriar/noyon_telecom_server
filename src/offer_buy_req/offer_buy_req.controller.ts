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
import { OfferBuyReqService } from './offer_buy_req.service';
import {
  CreateOfferBuyReqDto,
  RejectReqDto,
  UpdateOfferBuyReqApprovedDto,
} from './offer_buy_req.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/security/PublicEndpoint';
import { AdminGuard } from 'src/shared/guards/admin.guard';

@ApiTags('offer buy req')
@Controller('offer-buy-req')
export class OfferBuyReqController {
  @Inject(OfferBuyReqService)
  private readonly offerBuyReqService: OfferBuyReqService;

  @Get()
  getAllOfferBuyReqs() {
    return this.offerBuyReqService.getAllOfferBuyReqs();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post('/reject')
  rejectReq(@Body() body: RejectReqDto) {
    return this.offerBuyReqService.rejectReq(body);
  }

  @Post()
  insertOfferBuyReq(@Body() body: CreateOfferBuyReqDto) {
    return this.offerBuyReqService.insertOfferBuyReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch('/')
  updateOfferBuyStatus(@Body() body: UpdateOfferBuyReqApprovedDto) {
    return this.offerBuyReqService.updateOfferBuyStatus(body);
  }
}
