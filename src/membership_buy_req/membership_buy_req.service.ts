import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipBuyReq } from './entity/membership_buy_req.entity';
import { Repository } from 'typeorm';
import {
  CreateMembershipBuyReqDto,
  UpdateMembershipBuyReqApprovedDto,
} from './membership_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MembershipBuyReqService {
  @InjectRepository(MembershipBuyReq)
  private readonly membershipBuyReqRepo: Repository<MembershipBuyReq>;

  private readonly userService: UserService;

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
      },
    });
  }

  async insertMembershipBuyReq(body: CreateMembershipBuyReqDto) {
    const membershipBuyReq = this.membershipBuyReqRepo.create();
    membershipBuyReq.userPhone = body.userPhone;
    membershipBuyReq.amount = body.amount;
    membershipBuyReq.paymentMethod = body.paymentMethod;
    membershipBuyReq.paymentPhone = body.paymentPhone;
    membershipBuyReq.transactionId = body.transactionId;

    try {
      await this.membershipBuyReqRepo.save(membershipBuyReq);
      return createResponse({
        message: 'Inserted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateMembershipBuyStatus(
    membershipBuyReqId: number,
    body: UpdateMembershipBuyReqApprovedDto,
  ) {
    try {
      await this.membershipBuyReqRepo.update(membershipBuyReqId, {
        approved: body.approved,
        moderator: { id: body.moderatorId as any },
      });

      await this.userService.updateUserMembership(body.userPhone);

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
