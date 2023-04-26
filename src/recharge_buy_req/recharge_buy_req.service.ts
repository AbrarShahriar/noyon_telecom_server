import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RechargeBuyReq } from './entity/recharge_buy_req.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateRechargeBuyReqDto,
  RejectReqDto,
  UpdateRechargeBuyReqApprovedDto,
} from './recharge_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
import { UserService } from 'src/user/user.service';
import { Balance_Actions } from 'src/user/user.enums';

@Injectable()
export class RechargeBuyReqService {
  @InjectRepository(RechargeBuyReq)
  private readonly rechargeBuyReqRepo: Repository<RechargeBuyReq>;

  constructor(
    private readonly userHistoryService: UserHistoryService,
    private readonly userService: UserService,
  ) {}

  async rejectReq(body: RejectReqDto) {
    const rechargeBuyReq = await this.rechargeBuyReqRepo.findOne({
      where: { id: body.rechargeBuyReqId },
    });

    try {
      await this.userService.updateUserBalance({
        phone: rechargeBuyReq.phone,
        amount: rechargeBuyReq.amount,
        balanceAction: Balance_Actions.INCREMENT,
      });

      await this.userHistoryService.deleteHistory(rechargeBuyReq.id);
      await this.rechargeBuyReqRepo.delete(body.rechargeBuyReqId);

      return createResponse({
        message: 'Rejected',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getApprovedRechargeBuyReqsOfModerator(moderatorId, date?) {
    if (date) {
      return await this.rechargeBuyReqRepo.find({
        where: {
          approved: true,
          moderator: { id: moderatorId },
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          approvedAt: true,
          phone: true,
          approvedBy: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.rechargeBuyReqRepo.find({
      where: {
        approved: true,
        moderator: { id: moderatorId },
      },
      select: {
        approvedAt: true,
        phone: true,
        approvedBy: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }
  async getApprovedRechargeBuyReqs(date?) {
    if (date) {
      return await this.rechargeBuyReqRepo.find({
        where: {
          approved: true,
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          approvedAt: true,
          phone: true,
          approvedBy: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.rechargeBuyReqRepo.find({
      where: {
        approved: true,
      },
      select: {
        approvedAt: true,
        phone: true,
        approvedBy: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }

  async getAllRechargeBuyReqs() {
    return await this.rechargeBuyReqRepo.find({
      where: { approved: false },
      select: {
        id: true,
        phone: true,
        amount: true,
      },
    });
  }

  async insertRechargeBuyReq(body: CreateRechargeBuyReqDto) {
    const rechargeBuyReq = this.rechargeBuyReqRepo.create();
    rechargeBuyReq.phone = body.phone;
    rechargeBuyReq.amount = body.amount;

    try {
      let newReq = await this.rechargeBuyReqRepo.save(rechargeBuyReq);
      await this.userHistoryService.insertUserHistory({
        amount: body.amount,
        historyType: UserHistoryType.Recharge,
        phone: body.phone,
        reqId: newReq.id,
      });
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
          approved: body.approved,
          moderator: { id: body.approvedBy as any },
        });
      } else if (body.approvedBy) {
        await this.rechargeBuyReqRepo.update(body.rechargeBuyReqId, {
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

  async getRechargeReqCount() {
    return await this.rechargeBuyReqRepo.count({
      where: { approved: false },
    });
  }
}
