import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipBuyReq } from './entity/membership_buy_req.entity';
import { Between, Repository } from 'typeorm';
import {
  CreateMembershipBuyReqDto,
  MembershipRejectReqDto,
  UpdateMembershipBuyReqApprovedDto,
} from './membership_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserService } from 'src/user/user.service';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
import { PaymentMethod } from 'src/shared/enums/enums';
import { Balance_Actions } from 'src/user/user.enums';

@Injectable()
export class MembershipBuyReqService {
  @InjectRepository(MembershipBuyReq)
  private readonly membershipBuyReqRepo: Repository<MembershipBuyReq>;

  constructor(
    private readonly userService: UserService,
    private readonly userHistoryService: UserHistoryService,
  ) {}

  async getApprovedMembershipBuyReqs(date?: any) {
    if (date) {
      return await this.membershipBuyReqRepo.find({
        where: {
          approved: true,
          approvedAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month, date.day + 1),
          ),
        },
        select: {
          approvedAt: true,
          userPhone: true,
          approvedBy: true,
          moderator: { username: true },
          amount: true,
        },
        relations: { moderator: true },
      });
    }
    return await this.membershipBuyReqRepo.find({
      where: {
        approved: true,
      },
      select: {
        approvedAt: true,
        userPhone: true,
        approvedBy: true,
        moderator: { username: true },
        amount: true,
      },
      relations: { moderator: true },
    });
  }

  async getAllMembershipBuyReq() {
    return await this.membershipBuyReqRepo.find({
      where: { approved: false },
      select: {
        id: true,
        userPhone: true,
        amount: true,
        createdAt: true,
        paymentMethod: true,
        paymentPhone: true,
        transactionId: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async rejectReq(body: MembershipRejectReqDto) {
    const membershipReq = await this.membershipBuyReqRepo.findOne({
      where: { id: body.membershipBuyReqId },
      select: { id: true, amount: true, paymentMethod: true },
    });

    try {
      if (membershipReq.paymentMethod == PaymentMethod.ACCOUNT_BALANCE) {
        await this.userService.updateUserBalance({
          phone: membershipReq.userPhone,
          amount: membershipReq.amount,
          balanceAction: Balance_Actions.INCREMENT,
        });
      }

      await this.userHistoryService.deleteHistory(membershipReq.id);
      await this.membershipBuyReqRepo.delete(body.membershipBuyReqId);

      return createResponse({
        message: 'Rejected',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async insertMembershipBuyReq(body: CreateMembershipBuyReqDto) {
    const membershipBuyReq = this.membershipBuyReqRepo.create();
    membershipBuyReq.userPhone = body.userPhone;
    membershipBuyReq.amount = body.amount;
    membershipBuyReq.paymentMethod = body.paymentMethod;
    membershipBuyReq.paymentPhone = body.paymentPhone;
    membershipBuyReq.transactionId = body.transactionId;

    if (membershipBuyReq.paymentMethod == PaymentMethod.ACCOUNT_BALANCE) {
      await this.userService.updateUserBalance({
        phone: body.userPhone,
        amount: body.amount,
        balanceAction: Balance_Actions.DECREMENT,
      });
    }

    try {
      let newReq = await this.membershipBuyReqRepo.save(membershipBuyReq);
      await this.userHistoryService.insertUserHistory({
        amount: body.amount,
        phone: body.userPhone,
        historyType: UserHistoryType.Membership,
        transactionId: body.transactionId || null,
        reqId: newReq.id,
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

  async updateMembershipBuyStatus(body: UpdateMembershipBuyReqApprovedDto) {
    let req = await this.membershipBuyReqRepo.findOne({
      where: { id: body.membershipBuyReqId },
    });
    try {
      await this.membershipBuyReqRepo.save({
        id: body.membershipBuyReqId,
        approved: body.approved,
        approvedBy: body.approvedBy,
      });

      await this.userService.updateUserMembership(req.userPhone);

      if (req.paymentMethod == PaymentMethod.ACCOUNT_BALANCE) {
        await this.userService.updateUserBalance({
          amount: req.amount,
          phone: req.userPhone,
          balanceAction: Balance_Actions.DECREMENT,
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

  async getMembershipReqCount() {
    return await this.membershipBuyReqRepo.count({
      where: { approved: false },
    });
  }
}
