import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferBuyReq } from './entity/offer_buy_req.entity';
import { Repository } from 'typeorm';
import {
  CreateOfferBuyReqDto,
  UpdateOfferBuyReqApprovedDto,
} from './offer_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class OfferBuyReqService {
  @InjectRepository(OfferBuyReq)
  private readonly offerBuyReqRepo: Repository<OfferBuyReq>;

  async getAllOfferBuyReqs() {
    const reqs = await this.offerBuyReqRepo.find({
      where: { approved: false },
      select: {
        id: true,
        phone: true,
      },
      relations: {
        offer: true,
      },
    });

    let formattedReqs = [];

    reqs.forEach((req) => {
      formattedReqs.push({
        id: req.id,
        phone: req.phone,
        title: req.offer.title,
        price: req.offer.discountPrice,
      });
    });

    return formattedReqs;
  }

  async insertOfferBuyReq(body: CreateOfferBuyReqDto) {
    const offerBuyReq = this.offerBuyReqRepo.create();
    offerBuyReq.phone = body.phone;
    offerBuyReq.offer = { id: body.offerId } as any;

    try {
      await this.offerBuyReqRepo.save(offerBuyReq);
      return createResponse({
        message: 'Inserted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOfferBuyStatus(
    offerBuyReqId: number,
    body: UpdateOfferBuyReqApprovedDto,
  ) {
    try {
      await this.offerBuyReqRepo.update(offerBuyReqId, {
        approved: body.approved,
        moderator: { id: body.approvedBy as any },
      });
      return createResponse({
        message: 'Updated',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
