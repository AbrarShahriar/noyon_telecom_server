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
import { PaymentMethod, ReqStatus } from 'src/shared/enums/enums';
import { Balance_Actions } from 'src/user/user.enums';

@Injectable()
export class MembershipBuyReqService {
  @InjectRepository(MembershipBuyReq)
  private readonly membershipBuyReqRepo: Repository<MembershipBuyReq>;

  constructor(private readonly userService: UserService) {}

  async checkIfReqAlreadyMade(userPhone: string) {
    return await this.membershipBuyReqRepo.findOne({
      where: [
        { userPhone, reqStatus: ReqStatus.PENDING },
        { userPhone, reqStatus: ReqStatus.APPROVED },
      ],
    });
  }

  async getApprovedMembershipBuyReq() {
    return await this.membershipBuyReqRepo.find({
      where: { reqStatus: ReqStatus.APPROVED },
      select: { amount: true },
    });
  }

  async getApprovedAndRejectedMembershipBuyReqs(date?: any) {
    if (date) {
      return await this.membershipBuyReqRepo.find({
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
          actionBy: true,
          amount: true,
          reqStatus: true,
        },
      });
    }
    return await this.membershipBuyReqRepo.find({
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
        actionBy: true,
        amount: true,
        reqStatus: true,
      },
    });
  }

  async getAllMembershipBuyReq() {
    return await this.membershipBuyReqRepo.find({
      where: { reqStatus: ReqStatus.PENDING },
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
      select: { id: true, amount: true, paymentMethod: true, userPhone: true },
    });

    try {
      await this.membershipBuyReqRepo.update(membershipReq.id, {
        reqStatus: ReqStatus.REJECTED,
        actionBy: 'admin',
      });

      await this.userService.updateUserBalance({
        phone: membershipReq.userPhone,
        amount: membershipReq.amount,
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

  async insertMembershipBuyReq(body: CreateMembershipBuyReqDto) {
    const reqAlreadyMade = await this.checkIfReqAlreadyMade(body.userPhone);

    if (reqAlreadyMade) {
      return createResponse({
        message: 'Request Already Made!',
        payload: undefined,
        error: 'Conflict',
      });
    }

    const membershipBuyReq = this.membershipBuyReqRepo.create(body);

    if (membershipBuyReq.paymentMethod == PaymentMethod.ACCOUNT_BALANCE) {
      await this.userService.updateUserBalance({
        phone: body.userPhone,
        amount: body.amount,
        balanceAction: Balance_Actions.DECREMENT,
      });
    }

    try {
      await this.membershipBuyReqRepo.save(membershipBuyReq);

      return createResponse({
        message: 'Request Made!',
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
      await this.membershipBuyReqRepo.update(body.membershipBuyReqId, {
        reqStatus: ReqStatus.APPROVED,
        actionBy: 'admin',
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
      where: { reqStatus: ReqStatus.PENDING },
    });
  }

  async getUserHistory(phone: string, date?) {
    if (date) {
      return await this.membershipBuyReqRepo.find({
        where: {
          userPhone: phone,
          actionAt: Between(
            new Date(date.year, date.month, date.day),
            new Date(date.year, date.month + 1, date.day),
          ),
        },
      });
    }
    return await this.membershipBuyReqRepo.find({
      where: { userPhone: phone },
    });
  }
}
