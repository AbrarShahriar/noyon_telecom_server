import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOfferDTO } from './offer.dto';
import { OfferService } from './offer.service';
import { OfferCategory, OfferType, SIMCARD } from './offer.enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('offer')
@Controller('offer')
export class OfferController {
  @Inject(OfferService)
  private readonly offerService: OfferService;

  @Get('/single/:offerId')
  getOfferDetails(@Param('offerId') offerId: number) {
    return this.offerService.getOfferDetails(offerId);
  }

  @Get('/all/vip')
  getVipOffers() {
    return this.offerService.getVipOffers();
  }

  @Get('/all/type/:type')
  getOffersByType(@Param('type') type: OfferType) {
    return this.offerService.getOffersByType(type);
  }

  @Get('/all/category/:category')
  getOffersByCategory(@Param('category') category: OfferCategory) {
    return this.offerService.getOffersByCategory(category);
  }

  @Get('/all/query')
  getOffersBasedOnFilter(
    @Query('sim') simcard: SIMCARD,
    @Query('category') category: OfferCategory,
    @Query('expiry') expiry: string,
  ) {
    return this.offerService.getOffersBasedOnFilter(simcard, category, expiry);
  }

  @Post()
  createOffer(@Body() body: CreateOfferDTO) {
    return this.offerService.createOffer(body);
  }

  @Delete('/delete/:id')
  deleteOffer(@Param('id') id: number) {
    return this.offerService.deleteOffer(id);
  }
}
