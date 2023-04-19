import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OfferBuyReqService } from './offer_buy_req.service';
import {
  CreateOfferBuyReqDto,
  UpdateOfferBuyReqApprovedDto,
} from './offer_buy_req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('offer buy req')
@Controller('offer-buy-req')
export class OfferBuyReqController {
  @Inject(OfferBuyReqService)
  private readonly offerBuyReqService: OfferBuyReqService;

  @Get()
  getAllOfferBuyReqs() {
    return this.offerBuyReqService.getAllOfferBuyReqs();
  }

  @Post()
  insertOfferBuyReq(@Body() body: CreateOfferBuyReqDto) {
    return this.offerBuyReqService.insertOfferBuyReq(body);
  }

  @Patch('/:offerBuyReqId')
  updateOfferBuyStatus(
    @Param('offerBuyReqId') offerBuyReqId: number,
    @Body() body: UpdateOfferBuyReqApprovedDto,
  ) {
    return this.offerBuyReqService.updateOfferBuyStatus(offerBuyReqId, body);
  }
}
