import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopupReq } from './entity/topup_req.entity';
import { Repository } from 'typeorm';
import { CreateTopupReqDto, TopupReqApprovedDto } from './topup_req.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class TopupReqService {
  @InjectRepository(TopupReq)
  private readonly topupReqRepo: Repository<TopupReq>;

  async getAllTopupReqs() {
    return await this.topupReqRepo.find({
      where: {
        approved: false,
      },
    });
  }

  async insertTopupReq(body: CreateTopupReqDto) {
    const newTopupReq = this.topupReqRepo.create();

    newTopupReq.amount = body.amount;
    newTopupReq.userPhone = body.userPhone;
    newTopupReq.paymentMethod = body.paymentMethod;
    newTopupReq.paymentPhone = body.paymentPhone;

    try {
      await this.topupReqRepo.save(newTopupReq);
      return createResponse({
        message: 'created',
        payload: newTopupReq,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTopupReqStatus(topupReqId: number, body: TopupReqApprovedDto) {
    try {
      await this.topupReqRepo.update(topupReqId, {
        approved: true,
        moderator: { id: body.approvedBy as any },
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
}
