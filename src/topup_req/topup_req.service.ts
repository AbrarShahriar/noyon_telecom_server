import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopupReq } from './entity/topup_req.entity';
import { Between, Repository } from 'typeorm';
import {
  CreateTopupReqDto,
  TopupRejectReqDto,
  TopupReqApprovedDto,
} from './topup_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
import { UserService } from 'src/user/user.service';
import { Balance_Actions } from 'src/user/user.enums';
import { ReqStatus } from 'src/shared/enums/enums';

@Injectable()
export class TopupReqService {
  @InjectRepository(TopupReq)
  private readonly topupReqRepo: Repository<TopupReq>;

  constructor(
    // private readonly userHistoryService: UserHistoryService,
    private readonly userService: UserService,
  ) {}

  async getApproveTopupBuyReq() {
    return await this.topupReqRepo.find({
      where: { reqStatus: ReqStatus.APPROVED },
      select: { amount: true },
    });
  }

  async getApprovedAndRejectedTopupReqs(date?) {
    if (date) {
      return await this.topupReqRepo.find({
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
          actionAt: true,
          userPhone: true,
          amount: true,
          reqStatus: true,
        },
      });
    }
    return await this.topupReqRepo.find({
      where: [
        {
          reqStatus: ReqStatus.APPROVED,
        },
        {
          reqStatus: ReqStatus.REJECTED,
        },
      ],
      select: {
        actionAt: true,
        userPhone: true,
        amount: true,
        reqStatus: true,
      },
    });
  }

  async getAllTopupReqs() {
    return await this.topupReqRepo.find({
      where: {
        reqStatus: ReqStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async insertTopupReq(body: CreateTopupReqDto) {
    const newTopupReq = this.topupReqRepo.create(body);

    try {
      await this.topupReqRepo.save(newTopupReq);

      return createResponse({
        message: 'Inserter Topup Req',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async rejectReq(body: TopupRejectReqDto) {
    const topupReq = await this.topupReqRepo.findOne({
      where: { id: body.topupReqId },
    });

    try {
      await this.topupReqRepo.update(topupReq.id, {
        reqStatus: ReqStatus.REJECTED,
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

  async updateTopupReqStatus(body: TopupReqApprovedDto) {
    let req = await this.topupReqRepo.findOne({ where: { id: body.id } });
    try {
      await this.topupReqRepo.update(req.id, { reqStatus: ReqStatus.APPROVED });

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
      where: { reqStatus: ReqStatus.PENDING },
    });
  }

  async getUserHistory(phone: string, date?) {
    if (date) {
      return await this.topupReqRepo.find({
        where: {
          userPhone: phone,
          actionAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
      });
    }
    return await this.topupReqRepo.find({
      where: { userPhone: phone },
    });
  }
}
