import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferBuyReq } from './entity/offer_buy_req.entity';
import { Between, Repository } from 'typeorm';
import {
  CreateOfferBuyReqDto,
  OfferRejectReqDto,
  UpdateOfferBuyReqApprovedDto,
} from './offer_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { OfferService } from 'src/offer/offer.service';
import { UserHistoryType } from '../user_history/user_history.enum';
import { UserService } from 'src/user/user.service';
import { Balance_Actions } from 'src/user/user.enums';

@Injectable()
export class OfferBuyReqService {
  @InjectRepository(OfferBuyReq)
  private readonly offerBuyReqRepo: Repository<OfferBuyReq>;

  constructor(
    private readonly offerService: OfferService,
    private readonly userHistoryService: UserHistoryService,
    private readonly userService: UserService,
  ) {}

  async getApprovedOfferBuyReqs(date?) {
    if (date) {
      return await this.offerBuyReqRepo.find({
        where: {
          approved: true,
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          id: false,
          phone: false,
          createdAt: false,
          approved: false,
          approvedAt: false,
          approvedBy: false,
          offer: { discountPrice: true, category: true },
          moderator: { username: true },
        },
        relations: { offer: true, moderator: true },
      });
    }
    return await this.offerBuyReqRepo.find({
      where: { approved: true },
      select: {
        id: false,
        phone: false,
        createdAt: false,
        approved: false,
        approvedAt: false,
        approvedBy: false,
        offer: { discountPrice: true, category: true },
        moderator: { username: true },
      },
      relations: { offer: true, moderator: true },
    });
  }

  async getApprovedOfferBuyReqsOfModerator(moderatorId: number, date?) {
    if (date) {
      return await this.offerBuyReqRepo.find({
        where: {
          approved: true,
          moderator: { id: moderatorId },
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          id: false,
          phone: false,
          createdAt: false,
          approved: false,
          approvedAt: false,
          approvedBy: false,
          offer: { discountPrice: true, category: true },
          moderator: { username: true },
        },
        relations: { offer: true, moderator: true },
      });
    }
    return await this.offerBuyReqRepo.find({
      where: { approved: true, moderator: { id: moderatorId } },
      select: {
        id: false,
        phone: false,
        createdAt: false,
        approved: false,
        approvedAt: false,
        approvedBy: false,
        offer: { discountPrice: true, category: true },
        moderator: { username: true },
      },
      relations: { offer: true, moderator: true },
    });
  }

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
      order: { createdAt: 'DESC' },
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

  async rejectReq(body: OfferRejectReqDto) {
    const offerBuyReq = await this.offerBuyReqRepo.findOne({
      where: { id: body.offerBuyReqId },
      select: { id: true, offer: { discountPrice: true }, phone: true },
      relations: { offer: true },
    });

    await this.userService.updateUserBalance({
      phone: offerBuyReq.phone,
      amount: offerBuyReq.offer.discountPrice,
      balanceAction: Balance_Actions.INCREMENT,
    });
    try {
      await this.userHistoryService.deleteHistory(offerBuyReq.id);
      await this.offerBuyReqRepo.delete(body.offerBuyReqId);

      return createResponse({
        message: 'Rejected',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async insertOfferBuyReq(body: CreateOfferBuyReqDto) {
    const offerBuyReq = this.offerBuyReqRepo.create();
    offerBuyReq.phone = body.phone;
    offerBuyReq.offer = { id: body.offerId } as any;

    try {
      let newReq = await this.offerBuyReqRepo.save(offerBuyReq);

      const offer = await this.offerService.getOfferDetails(body.offerId);

      await this.userHistoryService.insertUserHistory({
        amount: offer.discountPrice,
        historyType: offer.category as any,
        desc: offer.title || null,
        phone: body.phone,
        saved: offer.regularPrice - offer.discountPrice,
        reqId: newReq.id,
      });

      await this.userService.updateUserBalance({
        phone: body.phone,
        amount: offer.discountPrice,
        balanceAction: Balance_Actions.DECREMENT,
      });

      return createResponse({
        message: 'Inserted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOfferBuyStatus(body: UpdateOfferBuyReqApprovedDto) {
    try {
      if (body.moderatorId) {
        await this.offerBuyReqRepo.update(body.offerBuyReqId, {
          approved: body.approved,
          moderator: body.moderatorId as any,
        });
      } else if (body.approvedBy) {
        await this.offerBuyReqRepo.update(body.offerBuyReqId, {
          approved: body.approved,
          approvedBy: 'admin',
        });
      } else {
        return null;
      }
      return createResponse({
        message: 'Updated',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOfferReqCount() {
    return await this.offerBuyReqRepo.count({
      where: { approved: false },
    });
  }
}
