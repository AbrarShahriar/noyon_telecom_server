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
import { ReqStatus } from 'src/shared/enums/enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OfferBuyReqService {
  @InjectRepository(OfferBuyReq)
  private readonly offerBuyReqRepo: Repository<OfferBuyReq>;

  constructor(
    private readonly offerService: OfferService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async getApprovedOfferBuyReq() {
    return await this.offerBuyReqRepo.find({
      relations: { offer: true },
      where: { reqStatus: ReqStatus.APPROVED },
      select: { offer: { adminPrice: true, discountPrice: true } },
    });
  }

  async getApprovedAndRejectedOfferBuyReqs(date?) {
    if (date) {
      return await this.offerBuyReqRepo.find({
        where: [
          {
            actionAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.APPROVED,
          },
          {
            actionAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.REJECTED,
          },
        ],
        select: {
          phone: true,
          actionBy: true,
          reqStatus: true,
          actionAt: true,
          offer: { discountPrice: true, category: true },
          moderator: { username: true },
        },
        relations: { offer: true, moderator: true },
      });
    }
    return await this.offerBuyReqRepo.find({
      where: [
        { reqStatus: ReqStatus.APPROVED },
        { reqStatus: ReqStatus.REJECTED },
      ],
      select: {
        phone: true,
        actionBy: true,
        reqStatus: true,
        actionAt: true,
        offer: { discountPrice: true, category: true },
        moderator: { username: true },
      },
      relations: { offer: true, moderator: true },
    });
  }

  async getApprovedOfferBuyReqsOfModerator(moderatorId: number) {
    return await this.offerBuyReqRepo.find({
      relations: { offer: true },
      select: { offer: { adminPrice: true, discountPrice: true } },
      where: { reqStatus: ReqStatus.APPROVED, moderator: { id: moderatorId } },
    });
  }

  async getApprovedAndRejectedOfferBuyReqsOfModerator(
    moderatorId: number,
    date?,
  ) {
    if (date) {
      return await this.offerBuyReqRepo.find({
        where: [
          {
            moderator: { id: moderatorId },
            actionAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.APPROVED,
          },
          {
            moderator: { id: moderatorId },
            actionAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.REJECTED,
          },
        ],
        select: {
          id: false,
          phone: false,
          createdAt: false,
          actionAt: false,
          actionBy: false,
          reqStatus: true,
          offer: { adminPrice: true, category: true },
          moderator: { username: true },
        },
        relations: { offer: true, moderator: true },
      });
    }
    return await this.offerBuyReqRepo.find({
      where: [
        { reqStatus: ReqStatus.APPROVED, moderator: { id: moderatorId } },
        { reqStatus: ReqStatus.REJECTED, moderator: { id: moderatorId } },
      ],
      select: {
        id: false,
        phone: false,
        createdAt: false,
        actionAt: false,
        actionBy: false,
        reqStatus: true,
        offer: { adminPrice: true, category: true },
        moderator: { username: true },
      },
      relations: { offer: true, moderator: true },
    });
  }

  async getAllOfferBuyReqs() {
    const reqs = await this.offerBuyReqRepo.find({
      relations: {
        offer: true,
      },
      where: { reqStatus: ReqStatus.PENDING },
      select: {
        id: true,
        phone: true,
        sendTo: true,
        actionAt: true,
        offer: {
          adminPrice: true,
          title: true,
          discountPrice: true,
          regularPrice: true,
          isPremium: true,
          simcard: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    let formattedReqs = [];

    reqs.forEach((req) => {
      formattedReqs.push({
        id: req.id,
        phone: req.phone,
        title: req.offer.title,
        regularPrice: req.offer.regularPrice,
        adminPrice: req.offer.adminPrice,
        discountPrice: req.offer.discountPrice,
        sendTo: req.sendTo,
        simcard: req.offer.simcard,
        isPremium: req.offer.isPremium,
        actionAt: req.actionAt,
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

    try {
      if (body.moderatorId) {
        await this.offerBuyReqRepo.update(body.offerBuyReqId, {
          reqStatus: ReqStatus.REJECTED,
          moderator: body.moderatorId as any,
        });
      } else if (body.actionByAdmin) {
        await this.offerBuyReqRepo.update(body.offerBuyReqId, {
          reqStatus: ReqStatus.REJECTED,
          actionBy: 'admin',
        });
      }
      await this.userService.updateUserBalance({
        phone: offerBuyReq.phone,
        amount: offerBuyReq.offer.discountPrice,
        balanceAction: Balance_Actions.INCREMENT,
      });

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
    offerBuyReq.sendTo = body.sendTo;
    offerBuyReq.offer = { id: body.offerId } as any;

    try {
      let newReq = await this.offerBuyReqRepo.save(offerBuyReq);

      const offer = await this.offerService.getOfferDetails(body.offerId);

      await this.userService.updateUserBalance({
        phone: body.phone,
        amount: offer.discountPrice,
        balanceAction: Balance_Actions.DECREMENT,
      });

      const apiKey = this.configService.get<string>('ONESIGNAL_API_KEY');
      const appId = this.configService.get<string>('ONESIGNAL_APP_ID');

      fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: appId,
          filters: [
            { field: 'tag', key: 'role', relation: '=', value: 'admin' },
            { operator: 'OR' },
            { field: 'tag', key: 'role', relation: '=', value: 'moderator' },
          ],
          headings: { en: 'IMPORTANT!' },
          contents: {
            en: 'New Offer Buy Request!!',
          },
          name: 'OFFER',
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));

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
          reqStatus: ReqStatus.APPROVED,
          moderator: body.moderatorId as any,
        });
      } else if (body.actionByAdmin) {
        await this.offerBuyReqRepo.update(body.offerBuyReqId, {
          reqStatus: ReqStatus.APPROVED,
          actionBy: 'admin',
        });
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
      where: { reqStatus: ReqStatus.PENDING },
    });
  }

  async getUserHistory(phone: string, date?) {
    if (date) {
      return await this.offerBuyReqRepo.find({
        where: {
          phone,
          actionAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month + 1, date.day),
          ),
        },
        relations: { offer: true },
      });
    }
    return await this.offerBuyReqRepo.find({
      where: { phone },
      relations: { offer: true },
    });
  }
}
