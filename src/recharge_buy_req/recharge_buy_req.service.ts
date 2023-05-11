import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RechargeBuyReq } from './entity/recharge_buy_req.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateRechargeBuyReqDto,
  RechargeRejectReqDto,
  UpdateRechargeBuyReqApprovedDto,
} from './recharge_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
import { UserService } from 'src/user/user.service';
import { Balance_Actions } from 'src/user/user.enums';
import { ReqStatus } from 'src/shared/enums/enums';

@Injectable()
export class RechargeBuyReqService {
  @InjectRepository(RechargeBuyReq)
  private readonly rechargeBuyReqRepo: Repository<RechargeBuyReq>;

  constructor(
    // private readonly userHistoryService: UserHistoryService,
    private readonly userService: UserService,
  ) {}

  async insertRechargeBuyReq(body: CreateRechargeBuyReqDto) {
    const rechargeBuyReq = this.rechargeBuyReqRepo.create(body);

    try {
      let newReq = await this.rechargeBuyReqRepo.save(rechargeBuyReq);

      await this.userService.updateUserBalance({
        phone: body.phone,
        amount: body.amount,
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

  async updateRechargeBuyStatus(body: UpdateRechargeBuyReqApprovedDto) {
    try {
      if (body.moderatorId) {
        await this.rechargeBuyReqRepo.update(body.rechargeBuyReqId, {
          reqStatus: ReqStatus.APPROVED,
          moderator: { id: body.moderatorId as any },
        });
      } else if (body.actionByAdmin) {
        await this.rechargeBuyReqRepo.update(body.rechargeBuyReqId, {
          reqStatus: ReqStatus.APPROVED,
          actionBy: 'admin',
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

  async rejectReq(body: RechargeRejectReqDto) {
    const rechargeBuyReq = await this.rechargeBuyReqRepo.findOne({
      where: { id: body.rechargeBuyReqId },
    });

    try {
      if (body.moderatorId) {
        await this.rechargeBuyReqRepo.update(body.rechargeBuyReqId, {
          reqStatus: ReqStatus.REJECTED,
          moderator: { id: body.moderatorId as any },
        });
      } else if (body.actionByAdmin) {
        await this.rechargeBuyReqRepo.update(body.rechargeBuyReqId, {
          reqStatus: ReqStatus.REJECTED,
          actionBy: 'admin',
        });
      } else {
        return null;
      }
      await this.userService.updateUserBalance({
        phone: rechargeBuyReq.phone,
        amount: rechargeBuyReq.amount,
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

  async getApprovedRechargeBuyReqsOfModerator(moderatorId: number) {
    return await this.rechargeBuyReqRepo.find({
      select: { amount: true },
      where: { reqStatus: ReqStatus.APPROVED, moderator: { id: moderatorId } },
    });
  }

  async getApprovedAndRejectedRechargeBuyReqsOfModerator(moderatorId, date?) {
    if (date) {
      return await this.rechargeBuyReqRepo.find({
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
          actionAt: true,
          phone: true,
          reqStatus: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.rechargeBuyReqRepo.find({
      where: [
        {
          moderator: { id: moderatorId },
          reqStatus: ReqStatus.APPROVED,
        },
        {
          moderator: { id: moderatorId },
          reqStatus: ReqStatus.REJECTED,
        },
      ],
      select: {
        actionAt: true,
        phone: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }

  async getApprovedRechargepBuyReq() {
    return await this.rechargeBuyReqRepo.find({
      where: { reqStatus: ReqStatus.APPROVED },
      select: { amount: true },
    });
  }

  async getApprovedAndRejectedRechargeBuyReqs(date?) {
    if (date) {
      return await this.rechargeBuyReqRepo.find({
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
          phone: true,
          actionBy: true,
          reqStatus: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.rechargeBuyReqRepo.find({
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
        phone: true,
        actionBy: true,
        reqStatus: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }

  async getAllRechargeBuyReqs() {
    return await this.rechargeBuyReqRepo.find({
      where: { reqStatus: ReqStatus.PENDING },
      select: {
        id: true,
        phone: true,
        sendTo: true,
        actionAt: true,

        amount: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getTotalAmountOfRechargeBuyReqs() {
    let sum = 0;

    const rechargeReqs = await this.rechargeBuyReqRepo.find({
      where: {
        reqStatus: ReqStatus.APPROVED,
      },

      select: { amount: true },
    });

    rechargeReqs.forEach((req) => (sum += req.amount));

    return sum;
  }

  async getRechargeReqCount() {
    return await this.rechargeBuyReqRepo.count({
      where: { reqStatus: ReqStatus.PENDING },
    });
  }

  async getUserHistory(phone: string, date?) {
    if (date) {
      return await this.rechargeBuyReqRepo.find({
        where: {
          phone,
          actionAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month + 1, date.day),
          ),
        },
      });
    }
    return await this.rechargeBuyReqRepo.find({
      where: { phone },
    });
  }
}
