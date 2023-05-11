import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawReq } from './entity/withdraw.entity';
import { Between, Repository } from 'typeorm';
import { ReqStatus } from 'src/shared/enums/enums';
import { CreateWithdrawReqDto, UpdateWithdrawReqDto } from './withdraw_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class WithdrawReqService {
  @InjectRepository(WithdrawReq)
  private readonly withdrawReqRepo: Repository<WithdrawReq>;

  async getAllHistoryOfModerator(moderatorId: number) {
    return await this.withdrawReqRepo.find({
      loadEagerRelations: false,
      relations: { moderator: true },
      where: { moderator: { id: moderatorId } },
      select: {
        moderator: {
          username: true,
          password: false,
          approvedRechargeReqs: false,
          approvedOfferReqs: false,
          withdraws: false,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllHistory() {
    return await this.withdrawReqRepo.find({
      loadEagerRelations: false,
      relations: { moderator: true },
      select: {
        moderator: {
          username: true,
          password: false,
          approvedRechargeReqs: false,
          approvedOfferReqs: false,
          withdraws: false,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPendingReqs() {
    let formattedData = [];

    const data = await this.withdrawReqRepo.find({
      relations: { moderator: true },
      select: {
        moderator: { username: true },
        amount: true,
        id: true,
        paymentMethod: true,
        createdAt: true,
        paymentPhone: true,
      },
      where: { reqStatus: ReqStatus.PENDING },
    });

    data.forEach((req) => {
      formattedData.push({
        id: req.id,
        amount: req.amount,
        paymentPhone: req.paymentPhone,
        paymentMethod: req.paymentMethod,
        actionAt: req.createdAt,
        moderator: req.moderator.username,
      });
    });

    return formattedData;
  }

  async insertReq(body: CreateWithdrawReqDto) {
    const newReq = this.withdrawReqRepo.create();
    newReq.amount = body.amount;
    newReq.paymentMethod = body.paymentMethod;
    newReq.paymentPhone = body.paymentPhone;
    newReq.moderator = body.moderatorId as any;

    try {
      await this.withdrawReqRepo.save(newReq);
      return createResponse({
        message: 'Created',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateReq(body: UpdateWithdrawReqDto) {
    console.log(body);

    try {
      await this.withdrawReqRepo.update(body.reqId, {
        reqStatus: body.reqStatus,
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

  async getWithdrawReqCount() {
    return await this.withdrawReqRepo.count({
      where: { reqStatus: ReqStatus.PENDING },
    });
  }

  async getModeratorOutValue(moderatorId: number): Promise<number> {
    let sum = 0;

    const reqs = await this.withdrawReqRepo.find({
      where: [
        {
          moderator: { id: moderatorId },
          reqStatus: ReqStatus.APPROVED,
        },
        {
          moderator: { id: moderatorId },
          reqStatus: ReqStatus.PENDING,
        },
      ],
      select: { amount: true },
    });
    reqs.forEach((req) => (sum += req.amount));
    return sum;
  }

  async getApprovedWithdrawReqs() {
    return await this.withdrawReqRepo.find({
      where: { reqStatus: ReqStatus.APPROVED },
      select: { amount: true },
    });
  }

  async getApprovedAndRejectedWithdrawReqs(date?) {
    if (date) {
      return await this.withdrawReqRepo.find({
        where: [
          {
            createdAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.APPROVED,
          },
          {
            createdAt: Between(
              new Date(date.year, date.month, date.day),
              new Date(date.year, date.month, date.day + 1),
            ),
            reqStatus: ReqStatus.REJECTED,
          },
        ],
        select: {
          createdAt: true,
          reqStatus: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.withdrawReqRepo.find({
      where: [
        {
          reqStatus: ReqStatus.APPROVED,
        },
        {
          reqStatus: ReqStatus.REJECTED,
        },
      ],
      select: {
        createdAt: true,
        reqStatus: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }
}
