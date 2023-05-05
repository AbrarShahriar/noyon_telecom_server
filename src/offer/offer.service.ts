import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDTO } from './offer.dto';
import { OfferCategory, OfferType, SIMCARD } from './offer.enums';
import {
  HttpResponse,
  createResponse,
} from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class OfferService {
  @InjectRepository(Offer)
  private readonly OfferRepo: Repository<Offer>;

  async getOfferDetails(offerId: number) {
    return await this.OfferRepo.findOne({
      where: {
        id: offerId,
      },
      select: {
        title: true,
        expiration: true,
        category: true,
        adminPrice: true,
        discountPrice: true,
        regularPrice: true,
      },
    });
  }

  async getVipOffers() {
    return await this.OfferRepo.find({
      where: {
        isPremium: true,
      },
    });
  }

  async getOffersByType(type: OfferType) {
    return await this.OfferRepo.find({
      where: { type },
    });
  }

  async getOffersByCategory(category: OfferCategory) {
    return await this.OfferRepo.find({
      where: { category },
    });
  }

  async getOffersBasedOnFilter(
    simcard: SIMCARD,
    category: OfferCategory,
    expiry: string,
    vip: boolean,
  ) {
    let query = {
      simcard: simcard || null,
      category: category || null,
      expiration: expiry || null,
    };

    return await this.OfferRepo.find({
      where: {
        isPremium: vip,
        ...query,
      },
    });
  }

  async createOffer(body: CreateOfferDTO) {
    const offer = this.OfferRepo.create(body);

    try {
      await this.OfferRepo.save(offer);
      return createResponse({
        message: 'Offer Created',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteOffer(id: number): Promise<HttpResponse> {
    try {
      await this.OfferRepo.delete(id);
      return createResponse({
        message: 'Offer Deleted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
