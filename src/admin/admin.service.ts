import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipBuyReq } from 'src/membership_buy_req/entity/membership_buy_req.entity';
import { MembershipBuyReqService } from 'src/membership_buy_req/membership_buy_req.service';
import { OfferBuyReqService } from 'src/offer_buy_req/offer_buy_req.service';
import { RechargeBuyReqService } from 'src/recharge_buy_req/recharge_buy_req.service';
import { TopupReqService } from 'src/topup_req/topup_req.service';
import { ReqType } from './admin.enum';
import { GetReqsDto } from './admin.dto';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { RechargeBuyReq } from 'src/recharge_buy_req/entity/recharge_buy_req.entity';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import e, { query } from 'express';
import { UserHistoryService } from 'src/user_history/user_history.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly membershipBuyReqService: MembershipBuyReqService,
    private readonly offerBuyReqService: OfferBuyReqService,
    private readonly rechargeReqService: RechargeBuyReqService,
    private readonly topupReqService: TopupReqService,
    private readonly userHistoryService: UserHistoryService,
  ) {}

  protected parseReqDataBasedOnType(
    data: OfferBuyReq[] | MembershipBuyReq[] | RechargeBuyReq[] | TopupReq[],
  ): GetReqsDto[] {
    let formattedData = [];

    data.forEach((el) => {
      let elToPush: any = {
        id: el.id,
        phone: el.phone || el.userPhone,
        amount: el.amount || el.price,
      };

      let paymentInfo = el.paymentPhone || null;
      if (paymentInfo) {
        elToPush.paymentPhone = el.paymentPhone;
        elToPush.paymentMethod = el.paymentMethod;
        elToPush.transactionId = el.transactionId;
      }
      if (el.title) {
        elToPush.title = el.title;
      }

      formattedData.push(elToPush);
    });

    return formattedData;
  }

  async getTotalTransactionHistory() {
    const membershipReqs =
      await this.membershipBuyReqService.getApprovedMembershipBuyReqs();
    const topupReqs = await this.topupReqService.getApprovedTopupReqs();
    const offerBuyReqs =
      await this.offerBuyReqService.getApprovedOfferBuyReqs();
    const rechargeBuyReqs =
      await this.rechargeReqService.getApprovedRechargeBuyReqs();

    const formattedData: any = [];

    membershipReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'membership',
        userPhone: req.userPhone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    topupReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'topup',
        userPhone: req.userPhone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    offerBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: req.offer.category,
        userPhone: req.phone,
        amount: req.offer.discountPrice,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    rechargeBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'membership',
        userPhone: req.phone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    return formattedData;
  }

  async getTodayTransactionHistory(date: string) {
    let d = date.split('.');
    let queryDate = {
      day: parseInt(d[0]),
      month: parseInt(d[1]),
      year: parseInt(d[2]),
    };

    const membershipReqs =
      await this.membershipBuyReqService.getApprovedMembershipBuyReqs(
        queryDate,
      );
    const topupReqs = await this.topupReqService.getApprovedTopupReqs(
      queryDate,
    );
    const offerBuyReqs = await this.offerBuyReqService.getApprovedOfferBuyReqs(
      queryDate,
    );
    const rechargeBuyReqs =
      await this.rechargeReqService.getApprovedRechargeBuyReqs(queryDate);

    const formattedData: any = [];

    membershipReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'membership',
        userPhone: req.userPhone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    topupReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'topup',
        userPhone: req.userPhone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    offerBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: req.offer.category,
        userPhone: req.phone,
        amount: req.offer.discountPrice,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    rechargeBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'membership',
        userPhone: req.phone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    return formattedData;
  }

  async getTotalInOut() {
    const approvedMembershipReqs =
      await this.membershipBuyReqService.getApprovedMembershipBuyReqs();
    const approvedTopupReqs = await this.topupReqService.getApprovedTopupReqs();
    const approvedOfferBuyReqs =
      await this.offerBuyReqService.getApprovedOfferBuyReqs();
    const approvedRechargeBuyReqs =
      await this.rechargeReqService.getApprovedRechargeBuyReqs();

    let inVal = 0;
    let outVal = 0;

    approvedMembershipReqs.forEach((req) => {
      inVal += req.amount;
    });
    approvedTopupReqs.forEach((req) => {
      inVal += req.amount;
    });

    approvedOfferBuyReqs.forEach((req) => {
      outVal += req.offer.discountPrice;
    });
    approvedRechargeBuyReqs.forEach((req) => {
      outVal += req.amount;
    });

    return {
      inVal,
      outVal,
    };
  }

  async getRequestCount() {
    let membershipReqCount =
      await this.membershipBuyReqService.getMembershipReqCount();
    let offerReqCount = await this.offerBuyReqService.getOfferReqCount();
    let rechargeReqCount = await this.rechargeReqService.getRechargeReqCount();
    let topupReqCount = await this.topupReqService.getTopupReqCount();

    return {
      membershipReqCount,
      offerReqCount,
      rechargeReqCount,
      topupReqCount,
    };
  }

  async getReqsBasedOnType(type: ReqType): Promise<GetReqsDto[]> {
    switch (type) {
      case ReqType.Offer:
        return this.parseReqDataBasedOnType(
          await this.offerBuyReqService.getAllOfferBuyReqs(),
        );

      case ReqType.Membership:
        return this.parseReqDataBasedOnType(
          await this.membershipBuyReqService.getAllMembershipBuyReq(),
        );

      case ReqType.Recharge:
        return this.parseReqDataBasedOnType(
          await this.rechargeReqService.getAllRechargeBuyReqs(),
        );

      case ReqType.Topup:
        return this.parseReqDataBasedOnType(
          await this.topupReqService.getAllTopupReqs(),
        );
    }
  }
}
