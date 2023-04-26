import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopupReq } from './entity/topup_req.entity';
import { Between, Repository } from 'typeorm';
import {
  CreateTopupReqDto,
  RejectReqDto,
  TopupReqApprovedDto,
} from './topup_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
import { UserService } from 'src/user/user.service';
import { Balance_Actions } from 'src/user/user.enums';

@Injectable()
export class TopupReqService {
  @InjectRepository(TopupReq)
  private readonly topupReqRepo: Repository<TopupReq>;

  constructor(
    private readonly userHistoryService: UserHistoryService,
    private readonly userService: UserService,
  ) {}

  async getApprovedTopupReqs(date?) {
    if (date) {
      return await this.topupReqRepo.find({
        where: {
          approved: true,
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          approvedAt: true,
          approvedBy: true,
          userPhone: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.topupReqRepo.find({
      where: {
        approved: true,
      },
      select: {
        approvedAt: true,
        approvedBy: true,
        userPhone: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }

  async getAllTopupReqs() {
    return await this.topupReqRepo.find({
      where: {
        approved: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async rejectReq(body: RejectReqDto) {
    const topupReq = await this.topupReqRepo.findOne({
      where: { id: body.topupReqId },
    });

    try {
      await this.userHistoryService.deleteHistory(topupReq.id);
      await this.topupReqRepo.delete(topupReq.id);

      return createResponse({
        message: 'Rejected',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async insertTopupReq(body: CreateTopupReqDto) {
    const newTopupReq = this.topupReqRepo.create();

    newTopupReq.amount = body.amount;
    newTopupReq.userPhone = body.userPhone;
    newTopupReq.paymentMethod = body.paymentMethod;
    newTopupReq.paymentPhone = body.paymentPhone;
    newTopupReq.transactionId = body.transactionId;

    let newReq = await this.topupReqRepo.save(newTopupReq);
    await this.userHistoryService.insertUserHistory({
      amount: body.amount,
      historyType: UserHistoryType.Topup,
      phone: body.userPhone,
      transactionId: body.transactionId,
      reqId: newReq.id,
    });

    return createResponse({
      message: 'created',
      payload: newTopupReq,
      error: '',
    });
  }

  async updateTopupReqStatus(body: TopupReqApprovedDto) {
    let req = await this.topupReqRepo.findOne({ where: { id: body.id } });
    try {
      await this.topupReqRepo.save({
        id: req.id,
        approved: true,
        approvedBy: body.approvedBy,
      });
      await this.userService.updateUserBalance({
        phone: body.userPhone,
        amount: req.amount,
        balanceAction: Balance_Actions.INCREMENT,
      });
      return createResponse({
        message: 'updated',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTopupReqCount() {
    return await this.topupReqRepo.count({
      where: { approved: false },
    });
  }
}
