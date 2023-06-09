import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOfferDTO, UpdateOfferDto } from './offer.dto';
import { OfferService } from './offer.service';
import { OfferCategory, OfferType, SIMCARD } from './offer.enums';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/security/PublicEndpoint';
import { Request } from 'express';
import { AdminGuard } from 'src/shared/guards/admin.guard';

@ApiTags('offer')
@Controller('offer')
export class OfferController {
  @Inject(OfferService)
  private readonly offerService: OfferService;

  @Public()
  @Get('/single/:offerId')
  getOfferDetails(@Param('offerId') offerId: number, @Req() req: Request) {
    return this.offerService.getOfferDetails(offerId);
  }

  @Public()
  @Get('/all/vip')
  getVipOffers() {
    return this.offerService.getVipOffers();
  }

  @Public()
  @Get('/all/non-vip')
  getNonVipOffers() {
    return this.offerService.getNonVipOffers();
  }

  @Public()
  @Get('/all/type/:type')
  getOffersByType(@Param('type') type: OfferType) {
    return this.offerService.getOffersByType(type);
  }

  @Public()
  @Get('/all/category/:category')
  getOffersByCategory(@Param('category') category: OfferCategory) {
    return this.offerService.getOffersByCategory(category);
  }

  @Public()
  @Get('/all/query')
  getOffersBasedOnFilter(
    @Query('sim') simcard: SIMCARD,
    @Query('category') category: OfferCategory,
    @Query('expiry') expiry: string,
  ) {
    return this.offerService.getOffersBasedOnFilter(
      simcard,
      category,
      expiry,
      false,
    );
  }

  @Public()
  @Get('/all/vip/query')
  getVipOffersBasedOnFilter(
    @Query('sim') simcard: SIMCARD,
    @Query('category') category: OfferCategory,
    @Query('expiry') expiry: string,
  ) {
    return this.offerService.getOffersBasedOnFilter(
      simcard,
      category,
      expiry,
      true,
    );
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post()
  createOffer(@Body() body: CreateOfferDTO) {
    return this.offerService.createOffer(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch('/update')
  updateOffer(@Body() body: UpdateOfferDto) {
    return this.offerService.updateOffer(body);
  }
}
