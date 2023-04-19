import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RechargeBuyReq } from './entity/recharge_buy_req.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateRechargeBuyReqDto,
  UpdateRechargeBuyReqApprovedDto,
} from './recharge_buy_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class RechargeBuyReqService {
  @InjectRepository(RechargeBuyReq)
  private readonly rechargeBuyReqRepo: Repository<RechargeBuyReq>;

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
      await this.rechargeBuyReqRepo.save(rechargeBuyReq);
      return createResponse({
        message: 'Inserted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateRechargeBuyStatus(
    rechargeBuyReqId: number,
    body: UpdateRechargeBuyReqApprovedDto,
  ) {
    try {
      await this.rechargeBuyReqRepo.update(rechargeBuyReqId, {
        approved: body.approved,
        moderator: { id: body.approvedBy as any },
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
}
