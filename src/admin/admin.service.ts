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
      };

      if (el.amount) {
        elToPush.amount = el.amount;
      }

      if (el.regularPrice) {
        elToPush.regularPrice = el.regularPrice;
        elToPush.discountPrice = el.discountPrice;
        elToPush.adminPrice = el.adminPrice;
      }

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
      await this.membershipBuyReqService.getApprovedAndRejectedMembershipBuyReqs();
    const topupReqs =
      await this.topupReqService.getApprovedAndRejectedTopupReqs();
    const offerBuyReqs =
      await this.offerBuyReqService.getApprovedAndRejectedOfferBuyReqs();
    const rechargeBuyReqs =
      await this.rechargeReqService.getApprovedAndRejectedRechargeBuyReqs();

    const formattedData: any = [];

    membershipReqs.forEach((req) => {
      formattedData.push({
        type: 'membership',
        userPhone: req.userPhone,
        amount: req.amount,
        actionBy: 'admin',
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    topupReqs.forEach((req) => {
      formattedData.push({
        type: 'topup',
        userPhone: req.userPhone,
        amount: req.amount,
        actionBy: 'admin',
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    offerBuyReqs.forEach((req) => {
      let actionBy = '';
      if (req.actionBy) {
        actionBy = req.actionBy;
      } else if (req.moderator) {
        actionBy = req.moderator.username;
      }

      formattedData.push({
        type: req.offer.category,
        userPhone: req.phone,
        amount: req.offer.discountPrice,
        actionBy: actionBy,
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    rechargeBuyReqs.forEach((req) => {
      let actionBy = '';
      if (req.actionBy) {
        actionBy = req.actionBy;
      } else if (req.moderator) {
        actionBy = req.moderator.username;
      }

      formattedData.push({
        type: 'recharge',
        userPhone: req.phone,
        amount: req.amount,
        actionBy: actionBy,
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
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
      await this.membershipBuyReqService.getApprovedAndRejectedMembershipBuyReqs(
        queryDate,
      );
    const topupReqs =
      await this.topupReqService.getApprovedAndRejectedTopupReqs(queryDate);
    const offerBuyReqs =
      await this.offerBuyReqService.getApprovedAndRejectedOfferBuyReqs(
        queryDate,
      );
    const rechargeBuyReqs =
      await this.rechargeReqService.getApprovedAndRejectedRechargeBuyReqs(
        queryDate,
      );

    const formattedData: any = [];

    membershipReqs.forEach((req) => {
      formattedData.push({
        type: 'membership',
        userPhone: req.userPhone,
        amount: req.amount,
        actionBy: 'admin',
        approvedAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    topupReqs.forEach((req) => {
      formattedData.push({
        type: 'topup',
        userPhone: req.userPhone,
        amount: req.amount,
        actionBy: 'admin',
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    offerBuyReqs.forEach((req) => {
      let actionBy = '';
      if (req.actionBy) {
        actionBy = req.actionBy;
      } else if (req.moderator) {
        actionBy = req.moderator.username;
      }

      formattedData.push({
        type: req.offer.category,
        userPhone: req.phone,
        amount: req.offer.discountPrice,
        actionBy: actionBy,
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    rechargeBuyReqs.forEach((req) => {
      let actionBy = '';
      if (req.actionBy) {
        actionBy = req.actionBy;
      } else if (req.moderator) {
        actionBy = req.moderator.username;
      }

      formattedData.push({
        type: 'recharge',
        userPhone: req.phone,
        amount: req.amount,
        actionBy: actionBy,
        actionAt: req.actionAt,
        reqStatus: req.reqStatus,
      });
    });

    return formattedData;
  }

  async getTotalInOut() {
    const approvedMembershipReqs =
      await this.membershipBuyReqService.getApprovedMembershipBuyReq();
    const approvedTopupReqs =
      await this.topupReqService.getApproveTopupBuyReq();
    const approvedOfferBuyReqs =
      await this.offerBuyReqService.getApprovedOfferBuyReq();
    const approvedRechargeBuyReqs =
      await this.rechargeReqService.getApprovedAndRejectedRechargeBuyReqs();

    let inVal = 0;
    let outVal = 0;

    approvedMembershipReqs.forEach((req) => {
      inVal += req.amount;
    });
    approvedTopupReqs.forEach((req) => {
      inVal += req.amount;
    });

    approvedOfferBuyReqs.forEach((req) => {
      outVal += req.offer.adminPrice;
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
