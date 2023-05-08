import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHistory } from './entity/user_history.entity';
import { Between, Repository } from 'typeorm';
import { CreateUserHistoryDto } from './user_history.dto';
import { ReqStatus } from 'src/shared/enums/enums';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { TopupReqService } from 'src/topup_req/topup_req.service';
import { MembershipBuyReqService } from 'src/membership_buy_req/membership_buy_req.service';
import { RechargeBuyReqService } from 'src/recharge_buy_req/recharge_buy_req.service';
import { OfferBuyReqService } from 'src/offer_buy_req/offer_buy_req.service';
import { IUserHistory } from './user_history';
import { UserHistoryType } from './user_history.enum';

@Injectable()
export class UserHistoryService {
  @InjectRepository(UserHistory)
  private readonly userHistoryRepo: Repository<UserHistory>;

  constructor(
    private readonly membershipBuyReqService: MembershipBuyReqService,
    private readonly offerBuyReqService: OfferBuyReqService,
    private readonly rechargeReqService: RechargeBuyReqService,
    private readonly topupReqService: TopupReqService,
  ) {}

  async deleteHistory(reqId) {
    await this.userHistoryRepo.delete({ reqId });
  }

  async getMonthlyHistory(date: string, phone: string) {
    let formattedDate = {
      day: 1,
      month: parseInt(date.split('.')[0]),
      year: parseInt(date.split('.')[1]),
    };

    const topupHistory = await this.topupReqService.getUserHistory(
      phone,
      formattedDate,
    );
    const membershipHisory = await this.membershipBuyReqService.getUserHistory(
      phone,
      formattedDate,
    );
    const offerBuyHistory = await this.offerBuyReqService.getUserHistory(
      phone,
      formattedDate,
    );
    const rechargeBuyHistory = await this.rechargeReqService.getUserHistory(
      phone,
      formattedDate,
    );

    let formattedData: IUserHistory[] = [];

    topupHistory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Topup,
        amount: Number(el.amount),
        saved: 0,
        historyStatus: el.reqStatus,
        transactionId: el.transactionId,
        historyDate: el.createdAt,
      }),
    );
    membershipHisory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Membership,
        amount: el.amount,
        saved: 0,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    offerBuyHistory.forEach((el) =>
      formattedData.push({
        historyType: el.offer.category as any,
        amount: el.offer.discountPrice,
        saved: el.offer.regularPrice - el.offer.discountPrice,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    rechargeBuyHistory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Recharge,
        amount: el.amount,
        saved: 0,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    return formattedData;
  }

  async getTotalHistory(phone: string) {
    const topupHistory = await this.topupReqService.getUserHistory(phone);
    const membershipHisory = await this.membershipBuyReqService.getUserHistory(
      phone,
    );
    const offerBuyHistory = await this.offerBuyReqService.getUserHistory(phone);
    const rechargeBuyHistory = await this.rechargeReqService.getUserHistory(
      phone,
    );

    let formattedData: IUserHistory[] = [];

    topupHistory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Topup,
        amount: Number(el.amount),
        saved: 0,
        historyStatus: el.reqStatus,
        transactionId: el.transactionId,
        historyDate: el.createdAt,
      }),
    );
    membershipHisory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Membership,
        amount: el.amount,
        saved: 0,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    offerBuyHistory.forEach((el) =>
      formattedData.push({
        historyType: el.offer.category as any,
        amount: el.offer.discountPrice,
        saved: el.offer.regularPrice - el.offer.discountPrice,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    rechargeBuyHistory.forEach((el) =>
      formattedData.push({
        historyType: UserHistoryType.Recharge,
        amount: el.amount,
        saved: 0,
        historyStatus: el.reqStatus,
        historyDate: el.createdAt,
      }),
    );
    return formattedData;
  }

  async insertUserHistory(body: CreateUserHistoryDto) {
    const newHistory = this.userHistoryRepo.create();

    newHistory.historyType = body.historyType;
    newHistory.amount = body.amount;
    newHistory.phone = body.phone;
    newHistory.saved = body.saved;
    newHistory.reqId = body.reqId;

    if (body.desc) {
      newHistory.desc = body.desc;
    }

    if (body.transactionId) {
      newHistory.transactionId = body.transactionId;
    }

    return await this.userHistoryRepo.save(newHistory);
  }

  async updateHistoryReqStatus(reqId: number, reqStatus: ReqStatus) {
    try {
      await this.userHistoryRepo.update({ reqId: reqId }, { reqStatus });
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
